export const MAPA_DB_NAME = "mapa-local";
export const MAPA_DB_VERSION = 1;

export const STORES = {
  meta: "meta",
  records: "records",
  drafts: "drafts",
  events: "events",
  security: "security",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

export interface StoredEnvelope<T = unknown> {
  id: string;
  entityType: string;
  payload: T;
  createdAt: string;
  updatedAt: string;
  recordVersion: number;
  checksum?: string;
}

export interface MetaRecord {
  id: string;
  value: unknown;
  updatedAt: string;
}

export interface DraftRecord {
  id: string;
  scope: string;
  payload: unknown;
  updatedAt: string;
  expiresAt?: string;
}

export interface EventRecord {
  id: string;
  type: string;
  entityId?: string;
  occurredAt: string;
  payload?: unknown;
}

export interface SecurityRecord {
  id: string;
  value: unknown;
  updatedAt: string;
}
