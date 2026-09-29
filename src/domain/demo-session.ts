import type { DemoSessionMetaRecord, DemoSessionSnapshot } from "@/src/contracts/demo";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";
import { getValue } from "@/src/storage/idb";
import { STORES } from "@/src/storage/schema";

export async function getDemoSession(): Promise<DemoSessionSnapshot | undefined> {
  const record = await getValue<DemoSessionMetaRecord>(STORES.meta, DEMO_SESSION_META_ID);
  if (!record) return undefined;
  if (
    record.value?.state !== "active"
    || record.value.schemaVersion !== 2
    || !Array.isArray(record.value.snapshotRecords)
    || !Array.isArray(record.value.snapshotDrafts)
    || !Array.isArray(record.value.snapshotEvents)
  ) {
    throw new Error("A sessão de demonstração local está inconsistente. Os dados não foram alterados.");
  }
  return record.value;
}
