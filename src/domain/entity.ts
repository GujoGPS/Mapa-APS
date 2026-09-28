import type { AuditFields, EntityId, ISODateTime } from "@/src/contracts/core";

export function newId(prefix: string): EntityId {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function nowIso(): ISODateTime { return new Date().toISOString(); }

export function auditFields(id: EntityId, at = nowIso()): AuditFields {
  return { id, createdAt: at, updatedAt: at, recordVersion: 1 };
}

export function updatedAudit<T extends AuditFields>(record: T): Pick<AuditFields, "id" | "createdAt" | "updatedAt" | "recordVersion"> {
  return { id: record.id, createdAt: record.createdAt, updatedAt: nowIso(), recordVersion: record.recordVersion + 1 };
}
