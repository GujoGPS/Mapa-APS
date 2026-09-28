import type { AuditFields, EntityId, ISODateTime, ProvenancedRecord } from "./core";

export interface Person extends AuditFields {
  code: string;
  displayName?: string;
  lifeStage?: "child" | "adolescent" | "adult" | "older-adult" | "unknown";
  vitalStatus: "alive" | "deceased" | "unknown";
}

export interface Family extends AuditFields {
  code: string;
  nickname?: string;
  state: "draft" | "active" | "temporarily-inactive" | "closed" | "archived";
  focus?: string;
  openedAt?: ISODateTime;
}

export interface FamilyMembership extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  familyId: EntityId;
  roleLabel: string;
  careRole?: "none" | "support" | "primary-caregiver" | "care-recipient";
  validFrom?: ISODateTime;
  validTo?: ISODateTime;
  perspectivePersonId?: EntityId;
}

export interface Household extends AuditFields {
  familyId?: EntityId;
  code: string;
  description: string;
}

export interface ResidencePeriod extends AuditFields {
  personId: EntityId;
  householdId: EntityId;
  validFrom?: ISODateTime;
  validTo?: ISODateTime;
  pattern: "primary" | "alternate" | "temporary" | "unknown";
}

export interface Semester extends AuditFields {
  code: string;
  label: string;
  state: "planned" | "active" | "review" | "ready-to-close" | "closed" | "archived";
  expectedFamilyCount: number;
  startsAt?: ISODateTime;
  endsAt?: ISODateTime;
}

export interface SemesterFamilyLink extends AuditFields {
  semesterId: EntityId;
  familyId: EntityId;
  state: "planned" | "active" | "declined" | "replaced" | "completed";
  replacementFamilyId?: EntityId;
  startedAt?: ISODateTime;
  endedAt?: ISODateTime;
  reason?: string;
}
