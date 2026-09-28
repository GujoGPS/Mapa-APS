import type { AuditFields, EntityId, ISODateTime, ProvenancedRecord } from "./core";

export type EncounterKind =
  | "first-contact"
  | "consultation"
  | "home-visit"
  | "brief-contact"
  | "family-meeting"
  | "supervision"
  | "review"
  | "collective-activity";

export interface Encounter extends AuditFields, ProvenancedRecord {
  kind: EncounterKind;
  occurredAt: ISODateTime;
  familyId?: EntityId;
  personIds: EntityId[];
  title: string;
  freeText: string;
  topics: string[];
  nextStep?: string;
  semesterId?: EntityId;
  state: "draft" | "saved" | "review-needed" | "closed";
}

export type PendingKind =
  | "complete-record"
  | "confirm-with-person"
  | "verify-document"
  | "discuss-supervisor"
  | "observe-longitudinally"
  | "study"
  | "team-action"
  | "no-current-resolution";

export type PendingDestination =
  | "open"
  | "completed"
  | "not-completed"
  | "continuity-recommended"
  | "continuity-confirmed"
  | "not-recoverable"
  | "no-longer-relevant"
  | "merged";

export interface PendingItem extends AuditFields, ProvenancedRecord {
  title: string;
  details?: string;
  kind: PendingKind;
  priority: "routine" | "attention" | "priority";
  familyId?: EntityId;
  personId?: EntityId;
  encounterId?: EntityId;
  semesterId?: EntityId;
  dueAt?: ISODateTime;
  destination: PendingDestination;
}

export interface TimelineItem {
  id: EntityId;
  at: ISODateTime;
  type: "encounter" | "pending" | "family-created" | "person-created" | "membership";
  title: string;
  subtitle?: string;
  familyId?: EntityId;
  personIds: EntityId[];
}
