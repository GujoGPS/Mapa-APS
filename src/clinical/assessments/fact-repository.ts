import { checksumOf } from "@/src/storage/hash";
import { getAllValues, getValue, putValue } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { adultDcntEsfDefinition } from "./instruments/adult-dcnt-esf/definition";
import { deriveCareFacts, factsForApplication } from "./facts";
import type { CareFact, CareFactReviewStatus, InstrumentApplication, InstrumentDefinition } from "./types";

export const CARE_FACT_ENTITY_TYPE = ENTITY_TYPES.careFact;

function envelopeId(fact: CareFact): string {
  return fact.factId;
}

async function writeFact(fact: CareFact): Promise<CareFact> {
  const envelope: StoredEnvelope<CareFact> = {
    id: envelopeId(fact),
    entityType: CARE_FACT_ENTITY_TYPE,
    payload: fact,
    createdAt: fact.recordedAt,
    updatedAt: fact.recordedAt,
    recordVersion: 1,
    checksum: await checksumOf(fact),
  };
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<CareFact>>(STORES.records, envelope.id);
  if (!readBack || readBack.checksum !== envelope.checksum) throw new Error("O fato clínico não passou pela verificação de integridade.");
  return fact;
}

async function readAllFacts(): Promise<CareFact[]> {
  const records = await getAllValues(STORES.records);
  return records
    .filter((record): record is StoredEnvelope<CareFact> => (record as { entityType?: string }).entityType === CARE_FACT_ENTITY_TYPE)
    .map((record) => record.payload);
}

async function readFact(factId: string): Promise<CareFact | undefined> {
  const record = await getValue<StoredEnvelope<CareFact>>(STORES.records, factId);
  if (record?.entityType !== CARE_FACT_ENTITY_TYPE) return undefined;
  return record.payload;
}

/** Fatos são derivados da aplicação e carregam a mesma origem, para que o isolamento da demonstração os alcance. */
export async function persistApplicationFacts(application: InstrumentApplication, definition: InstrumentDefinition = adultDcntEsfDefinition): Promise<CareFact[]> {
  const derivation = deriveCareFacts(application, definition);
  if (derivation.errors.length) throw new Error(derivation.errors.map((error) => error.message).join(" "));
  const facts = derivation.facts.map((item) => ({ ...item, dataOrigin: application.dataOrigin }));
  for (const fact of facts) await writeFact(fact);
  return facts;
}

export async function listFactsForApplication(applicationId: string): Promise<CareFact[]> {
  return factsForApplication(await readAllFacts(), applicationId).sort((left, right) => left.factId.localeCompare(right.factId));
}

export async function listFactsForPerson(personId: string): Promise<CareFact[]> {
  return (await readAllFacts()).filter((fact) => fact.personId === personId).sort((left, right) => left.factId.localeCompare(right.factId));
}

export async function listFactsForFamily(familyId: string): Promise<CareFact[]> {
  return (await readAllFacts()).filter((fact) => fact.familyId === familyId).sort((left, right) => left.factId.localeCompare(right.factId));
}

export async function reviewFact(factId: string, reviewStatus: CareFactReviewStatus): Promise<CareFact> {
  const fact = await readFact(factId);
  if (!fact) throw new Error("Fato clínico inexistente.");
  if (fact.reviewStatus === "superseded") throw new Error("Fato superado não pode ser revisado; consulte a revisão que o substituiu.");
  return writeFact({ ...fact, reviewStatus });
}

/** Invalida os fatos da aplicação original quando a retificação assume o lugar dela. */
export async function supersedeFactsOfApplication(applicationId: string, supersededByApplicationId: string, invalidatedAt = new Date().toISOString()): Promise<number> {
  const facts = await readAllFacts();
  const target = facts.filter((fact) => fact.applicationId === applicationId);
  for (const fact of target) {
    await writeFact({ ...fact, reviewStatus: "superseded", invalidatedAt, invalidationReason: `Substituído pela retificação ${supersededByApplicationId}.` });
  }
  return target.length;
}
