import type { StoreName } from "@/src/storage/schema";

export const BACKUP_FORMAT = "mapa-backup";
export const BACKUP_VERSION = 1;

export interface BackupPayload {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  schemaVersion: number;
  createdAt: string;
  appVersion: string;
  protected: false;
  stores: Record<StoreName, unknown[]>;
  storeChecksums: Record<StoreName, string>;
  payloadChecksum: string;
}

export interface ProtectedBackup {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  protected: true;
  createdAt: string;
  algorithm: "AES-GCM";
  keyDerivation: "PBKDF2-SHA-256";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

export type AnyBackup = BackupPayload | ProtectedBackup;

export interface BackupValidation {
  valid: boolean;
  protected: boolean;
  errors: string[];
  warnings: string[];
  counts?: Partial<Record<StoreName, number>>;
}
