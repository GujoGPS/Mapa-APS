import { checksumOf } from "@/src/storage/hash";
import { MAPA_DB_VERSION, STORES, type StoreName, type StoredEnvelope } from "@/src/storage/schema";
import type { BackupPayload } from "@/src/backup/types";
import type { CareFact, InstrumentApplication } from "./types";
import { CARE_FACT_VERSION } from "./facts";

/**
 * Remove o `kind` de registros ja gravados sem reescrever o banco.
 *
 * Nao ha gancho de migracao de dados no IndexedDB, e subir a versao do schema para reescrever
 * tudo seria desproporcional a um campo que ninguem le. Como nada mais consulta `kind`, o
 * suficiente e nuncaialize-lo na leitura; a migracao completa continua valendo na restauracao
 * de backup, que reescreve o payload e o checksum.
 */
export function stripLegacyKind<T extends object>(payload: T): T {
  if (!("kind" in payload)) return payload;
  const { kind: _kind, ...rest } = payload as T & { kind?: unknown };
  return rest as T;
}

/** Aplicacao como existia antes da remocao de `kind`. */
type LegacyApplicationPayload = Partial<InstrumentApplication> & { responses?: Record<string, unknown>; kind?: string };

const APPLICATION_TYPE = "instrument-application";
const CARE_FACT_TYPE = "care-fact";

export function migrateApplicationPayload(payload: LegacyApplicationPayload): InstrumentApplication {
  const answers = payload.answers ?? {};
  // kind foi removido do dominio: escolha de "nova"/"longitudinal" nunca teve regra associada.
  const { responses: _responses, kind: _kind, ...rest } = payload;
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

/**
 * Fatos gravados antes da versao 1 nao carregavam dataOrigin; a migracao marca como normal em vez
 * de inferir origem sintetica, para que o isolamento da demonstracao nunca dependa de adivinhacao.
 */
export function migrateCareFactPayload(payload: Partial<CareFact> & Record<string, unknown>): CareFact {
  return {
    ...payload,
    factVersion: payload.factVersion ?? CARE_FACT_VERSION,
    sourceQuestionIds: payload.sourceQuestionIds ?? [],
    relatedPersonIds: payload.relatedPersonIds,
    actionable: payload.actionable ?? false,
    dataOrigin: payload.dataOrigin ?? "normal",
  } as CareFact;
}

export async function migrateBackup(backup: BackupPayload): Promise<BackupPayload> {
  const stores = structuredClone(backup.stores) as Record<StoreName, unknown[]>;
  stores[STORES.records] = await Promise.all(stores[STORES.records].map(async (value) => {
    const record = value as StoredEnvelope<Partial<InstrumentApplication> & { responses?: Record<string, unknown> }>;
    if (record.entityType === CARE_FACT_TYPE) {
      const payload = migrateCareFactPayload(record.payload as Partial<CareFact> & Record<string, unknown>);
      return { ...record, payload, checksum: await checksumOf(payload) };
    }
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
