import { canonicalJson, checksumOf } from "@/src/storage/hash";
import { getAllValues, replaceAllStores } from "@/src/storage/idb";
import { MAPA_DB_VERSION, STORES, type StoreName } from "@/src/storage/schema";
import { protectBackup, unprotectBackup } from "./crypto";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";
import { excludeSyntheticDemoRecords, getDemoSession } from "@/src/domain/demo-mode";
import { validateBackupPure } from "./adversarial";
import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  type AnyBackup,
  type BackupPayload,
  type BackupValidation,
  type ProtectedBackup,
} from "./types";

const storeNames = Object.values(STORES) as StoreName[];

export interface BackupOptions { includeSynthetic?: boolean; }

export async function createBackup(options: BackupOptions = {}): Promise<BackupPayload> {
  const stores = {} as Record<StoreName, unknown[]>;
  const storeChecksums = {} as Record<StoreName, string>;
  for (const store of storeNames) stores[store] = await getAllValues(store);

  if (!options.includeSynthetic) {
    const session = await getDemoSession();
    if (session) {
      stores[STORES.records] = session.snapshotRecords;
      stores[STORES.drafts] = session.snapshotDrafts;
      stores[STORES.events] = session.snapshotEvents;
    }
    stores[STORES.records] = excludeSyntheticDemoRecords(stores[STORES.records]);
    stores[STORES.meta] = stores[STORES.meta].filter((record) => (record as { id?: string }).id !== DEMO_SESSION_META_ID);
  }

  for (const store of storeNames) storeChecksums[store] = await checksumOf(stores[store]);
  const payloadBase: Omit<BackupPayload, "payloadChecksum"> = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    schemaVersion: MAPA_DB_VERSION,
    createdAt: new Date().toISOString(),
    appVersion: "0.1.0-marco.1",
    protected: false as const,
    stores,
    storeChecksums,
  };
  return { ...payloadBase, payloadChecksum: await checksumOf(payloadBase) };
}

export async function serializeBackup(passphrase?: string, options: BackupOptions = {}): Promise<string> {
  const plain = canonicalJson(await createBackup(options));
  return passphrase ? JSON.stringify(await protectBackup(plain, passphrase), null, 2) : JSON.stringify(JSON.parse(plain), null, 2);
}

export async function decodeBackup(text: string, passphrase?: string): Promise<BackupPayload> {
  let parsed = JSON.parse(text) as AnyBackup;
  if (parsed.protected) {
    if (!passphrase) throw new Error("Este backup é protegido e exige senha.");
    parsed = JSON.parse(await unprotectBackup(parsed as ProtectedBackup, passphrase)) as BackupPayload;
  }
  return parsed as BackupPayload;
}

export const validateBackup = validateBackupPure;

export async function restoreBackup(backup: BackupPayload): Promise<BackupValidation> {
  const validation = await validateBackup(backup);
  if (!validation.valid) return validation;
  // A substituição ocorre em uma única transação: ou todos os stores avançam, ou nenhum avança.
  await replaceAllStores(backup.stores);
  return validation;
}
