import type { AuditFields } from "@/src/contracts/core";
import { deleteValue, getAllValues, getValue } from "@/src/storage/idb";
import { checksumOf } from "@/src/storage/hash";
import { MultiTabCoordinator } from "@/src/storage/multi-tab";
import { getDemoSession } from "./demo-session";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import type { EntityType } from "./entity-types";

const coordination = typeof window !== "undefined" ? new MultiTabCoordinator() : undefined;
if (coordination) coordination.start();

export async function saveEntity<T extends AuditFields>(entityType: EntityType, entity: T): Promise<T> {
  const demoSession = await getDemoSession();
  let persistedEntity = entity;
  if (demoSession) {
    const existing = await getValue<StoredEnvelope<T>>(STORES.records, entity.id);
    const belongsToNormalSnapshot = demoSession.snapshotRecords.some((record) => Boolean(record && typeof record === "object" && "id" in record && record.id === entity.id));
    if ((belongsToNormalSnapshot && existing?.payload.dataOrigin !== "synthetic-demo") || (existing && existing.payload.dataOrigin !== "synthetic-demo")) {
      throw new Error("Dados normais estão isolados durante a demonstração e não podem ser alterados neste modo.");
    }
    persistedEntity = { ...entity, dataOrigin: "synthetic-demo" } as T;
  }

  const checksum = await checksumOf(persistedEntity);
  const envelope: StoredEnvelope<T> = { id: persistedEntity.id, entityType, payload: persistedEntity, createdAt: persistedEntity.createdAt, updatedAt: persistedEntity.updatedAt, recordVersion: persistedEntity.recordVersion, checksum };
  const { putValue } = await import("@/src/storage/idb");
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<T>>(STORES.records, persistedEntity.id);
  if (!readBack || readBack.checksum !== checksum || (await checksumOf(readBack.payload)) !== checksum) throw new Error("A gravação não passou pela verificação de integridade.");
  coordination?.changed(persistedEntity.id);
  return persistedEntity;
}

export async function findEntity<T>(id: string): Promise<T | undefined> {
  return (await getValue<StoredEnvelope<T>>(STORES.records, id))?.payload;
}

export async function listEntities<T>(entityType: EntityType): Promise<T[]> {
  const envelopes = await getAllValues<StoredEnvelope<T>>(STORES.records);
  return envelopes.filter((entry) => entry.entityType === entityType).map((entry) => entry.payload);
}

export async function removeEntity(id: string): Promise<void> {
  await deleteValue(STORES.records, id);
  coordination?.changed(id);
}
