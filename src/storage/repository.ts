import { getValue, putValue } from "./idb";
import { checksumOf } from "./hash";
import { STORES, type StoredEnvelope } from "./schema";

export interface SaveReceipt {
  id: string;
  checksum: string;
  savedAt: string;
  verified: boolean;
}

export async function saveRecordVerified<T>(input: Omit<StoredEnvelope<T>, "checksum">): Promise<SaveReceipt> {
  const checksum = await checksumOf(input.payload);
  const value: StoredEnvelope<T> = { ...input, checksum };
  await putValue(STORES.records, value);

  const readBack = await getValue<StoredEnvelope<T>>(STORES.records, input.id);
  const verified = Boolean(readBack && readBack.checksum === checksum && (await checksumOf(readBack.payload)) === checksum);
  if (!verified) throw new Error("O registro foi gravado, mas a verificação de integridade falhou.");

  return { id: input.id, checksum, savedAt: input.updatedAt, verified };
}

export function createEnvelope<T>(id: string, entityType: string, payload: T, previousVersion = 0): Omit<StoredEnvelope<T>, "checksum"> {
  const now = new Date().toISOString();
  return { id, entityType, payload, createdAt: now, updatedAt: now, recordVersion: previousVersion + 1 };
}
