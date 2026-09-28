export type ISODateTime = string;
export type EntityId = string;

export type Provenance =
  | "observed"
  | "self-reported"
  | "family-reported"
  | "third-party-reported"
  | "document"
  | "lab-result"
  | "supervisor-guidance"
  | "clinical-inference"
  | "system-generated";

export type ConfirmationStatus =
  | "unverified"
  | "reported"
  | "partially-confirmed"
  | "document-confirmed"
  | "observed"
  | "divergent"
  | "unknown";

export type Sensitivity =
  | "common"
  | "personal"
  | "health"
  | "family"
  | "high"
  | "third-party";

export type SharingState =
  | "private"
  | "review"
  | "shareable"
  | "shared"
  | "withdrawn"
  | "blocked";

export interface AuditFields {
  readonly id: EntityId;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly recordVersion: number;
}

export interface ProvenancedRecord {
  provenance: Provenance;
  confirmation: ConfirmationStatus;
  sensitivity: Sensitivity;
  sharingState: SharingState;
}
