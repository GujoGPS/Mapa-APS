import { checksumOf } from "@/src/storage/hash";
import { MAPA_DB_VERSION, STORES, type StoreName, type StoredEnvelope } from "@/src/storage/schema";
import type { BackupPayload } from "@/src/backup/types";
import type { InstrumentApplication } from "./types";

const APPLICATION_TYPE = "instrument-application";

export function migrateApplicationPayload(payload: Partial<InstrumentApplication> & { responses?: Record<string, unknown> }): InstrumentApplication {
  const answers = payload.answers ?? {};
  const { responses: _responses, ...rest } = payload;
  return {
    ...rest,
    answers,
    applicabilityOverrides: payload.applicabilityOverrides ?? {},
    provenance: payload.provenance ?? { origin: "digital-adaptation", sourceNote: "Migrado de aplicação local anterior." },
    visibility: payload.visibility ?? {
      scope: "individual",
      clinicalVisibility: "academic-private",
      personVisibility: "shareable-with-person",
      familyVisibility: "non-exportable",
      reviewRequired: true,
      projectionStrategy: "clinical-academic",
    },
    dataOrigin: payload.dataOrigin ?? "normal",
    schemaVersion: payload.schemaVersion ?? 1,
    revisionNumber: payload.revisionNumber ?? 1,
  } as InstrumentApplication;
}

export async function migrateBackup(backup: BackupPayload): Promise<BackupPayload> {
  const stores = structuredClone(backup.stores) as Record<StoreName, unknown[]>;
  stores[STORES.records] = await Promise.all(stores[STORES.records].map(async (value) => {
    const record = value as StoredEnvelope<Partial<InstrumentApplication> & { responses?: Record<string, unknown> }>;
    if (record.entityType !== APPLICATION_TYPE) return value;
    const payload = migrateApplicationPayload(record.payload);
    return { ...record, payload, recordVersion: payload.revisionNumber, checksum: await checksumOf(payload) };
  }));
  const storeChecksums = {} as Record<StoreName, string>;
  for (const store of Object.values(STORES) as StoreName[]) {
    stores[store] = stores[store] ?? [];
    storeChecksums[store] = await checksumOf(stores[store]);
  }
  const base = {
    ...backup,
    schemaVersion: MAPA_DB_VERSION,
    stores,
    storeChecksums,
  };
  delete (base as Partial<BackupPayload>).payloadChecksum;
  return { ...base, payloadChecksum: await checksumOf(base) };
}
