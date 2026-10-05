import type { DemoSessionMetaRecord, DemoSessionSnapshot } from "@/src/contracts/demo";
import { DEMO_SAMPLE_FAMILY_IDS, DEMO_SAMPLE_SEMESTER_ID, DEMO_SESSION_META_ID, DEMO_SESSION_SCHEMA_VERSION, isLegacyDemoEntityId } from "@/src/contracts/demo";
import { getAllValues, replaceAllStores, replaceStore } from "@/src/storage/idb";
import { STORES, type StoreName } from "@/src/storage/schema";
import { nowIso } from "./entity";
import { seedSyntheticSemester } from "./demo-seed";
import { getDemoSession } from "./demo-session";

export { getDemoSession } from "./demo-session";

type EnvelopeLike = { id?: unknown; payload?: unknown };
type PayloadLike = { dataOrigin?: unknown; familyId?: unknown; personId?: unknown; semesterId?: unknown };

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function payloadOf(record: unknown): PayloadLike {
  const envelope = asObject(record) as EnvelopeLike;
  return asObject(envelope.payload) as PayloadLike;
}

export function syntheticDemoRecordIds(records: unknown[]): Set<string> {
  const legacyFamilyIds = new Set<string>(DEMO_SAMPLE_FAMILY_IDS);
  const legacyPersonIds = new Set<string>();
  for (const record of records) {
    const payload = payloadOf(record);
    if (typeof payload.familyId === "string" && legacyFamilyIds.has(payload.familyId) && typeof payload.personId === "string") {
      legacyPersonIds.add(payload.personId);
    }
  }

  return new Set(records.flatMap((record) => {
    const envelope = asObject(record) as EnvelopeLike;
    const id = typeof envelope.id === "string" ? envelope.id : undefined;
    const payload = payloadOf(record);
    const belongsToLegacyFamily = typeof payload.familyId === "string" && legacyFamilyIds.has(payload.familyId);
    const isSynthetic = payload.dataOrigin === "synthetic-demo"
      || Boolean(id && (isLegacyDemoEntityId(id) || legacyPersonIds.has(id)))
      || belongsToLegacyFamily
      || payload.semesterId === DEMO_SAMPLE_SEMESTER_ID
      || (typeof payload.personId === "string" && legacyPersonIds.has(payload.personId));
    return isSynthetic && id ? [id] : [];
  }));
}

export function excludeSyntheticDemoRecords(records: unknown[]): unknown[] {
  const syntheticIds = syntheticDemoRecordIds(records);
  return records.filter((record) => {
    const id = asObject(record).id;
    return typeof id !== "string" || !syntheticIds.has(id);
  });
}

async function readAllStores(): Promise<Record<StoreName, unknown[]>> {
  const names = Object.values(STORES) as StoreName[];
  const entries = await Promise.all(names.map(async (name) => [name, await getAllValues(name)] as const));
  return Object.fromEntries(entries) as Record<StoreName, unknown[]>;
}

export async function enterDemoMode(): Promise<DemoSessionSnapshot> {
  if (await getDemoSession()) throw new Error("O modo demonstração já está ativo.");

  const stores = await readAllStores();
  const normalRecords = excludeSyntheticDemoRecords(stores[STORES.records]);
  const session: DemoSessionSnapshot = {
    state: "active",
    schemaVersion: DEMO_SESSION_SCHEMA_VERSION,
    startedAt: nowIso(),
    snapshotRecords: normalRecords,
    snapshotDrafts: stores[STORES.drafts],
    snapshotEvents: stores[STORES.events],
  };
  const sessionRecord: DemoSessionMetaRecord = { id: DEMO_SESSION_META_ID, value: session, updatedAt: session.startedAt };

  stores[STORES.records] = [];
  stores[STORES.drafts] = [];
  stores[STORES.events] = [];
  stores[STORES.meta] = [
    ...stores[STORES.meta].filter((record) => asObject(record).id !== DEMO_SESSION_META_ID),
    sessionRecord,
  ];
  await replaceAllStores(stores);

  try {
    await seedSyntheticSemester();
    return session;
  } catch (error) {
    await exitDemoMode();
    throw error;
  }
}

export async function removeDemoData(): Promise<number> {
  const records = await getAllValues(STORES.records);
  const syntheticIds = syntheticDemoRecordIds(records);
  await replaceStore(STORES.records, records.filter((record) => {
    const id = asObject(record).id;
    return typeof id !== "string" || !syntheticIds.has(id);
  }));
  return syntheticIds.size;
}

export async function exitDemoMode(): Promise<boolean> {
  const session = await getDemoSession();
  if (!session) return false;

  const stores = await readAllStores();
  stores[STORES.records] = session.snapshotRecords;
  // Schema antigo nao guardou drafts nem eventos: restaura o que existe e limpa o resto,
  // em vez de recusar a saida e deixar o usuario preso na demonstracao.
  stores[STORES.drafts] = session.snapshotDrafts ?? [];
  stores[STORES.events] = session.snapshotEvents ?? [];
  stores[STORES.meta] = stores[STORES.meta].filter((record) => asObject(record).id !== DEMO_SESSION_META_ID);
  await replaceAllStores(stores);
  return true;
}

export async function countSyntheticDemoData(): Promise<number> {
  return syntheticDemoRecordIds(await getAllValues(STORES.records)).size;
}
