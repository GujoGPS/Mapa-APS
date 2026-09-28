import type { AuditFields, EntityId, ISODateTime, ProvenancedRecord } from "./core";

export type ConditionKind = "confirmed" | "reported" | "hypothesis" | "risk-factor" | "symptom" | "vulnerability" | "preventive-need";
export interface ConditionRecord extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  originalLabel: string;
  normalizedConceptId?: EntityId;
  kind: ConditionKind;
  clinicalState: "identified" | "investigating" | "confirmed" | "stable" | "controlled" | "uncontrolled" | "resolved" | "discarded" | "historical" | "unknown";
  professionalSummary?: string;
  sharedSummary?: string;
}

export interface PersonMedicationRecord extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  reportedName: string;
  medicationReferenceId?: EntityId;
  presentationText?: string;
  prescribedUseText?: string;
  actualUseText?: string;
  indicationText?: string;
  state: "reported" | "partially-identified" | "confirmed" | "regular-use" | "divergent-use" | "irregular-use" | "suspended" | "replaced" | "discontinued" | "historical";
  professionalSummary?: string;
  sharedSummary?: string;
}

export interface ExamResultRecord extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  examName: string;
  collectedAt?: ISODateTime;
  valueText: string;
  numericValue?: number;
  unit?: string;
  labReferenceText?: string;
  documentAvailable: boolean;
  interpretationState: "not-assessed" | "insufficient-data" | "context-needed" | "reviewed";
  professionalSummary?: string;
  sharedSummary?: string;
}

export type ScreeningState = "not-assessed" | "eligibility-review" | "not-indicated" | "contraindicated" | "uncertain" | "indicated" | "discussed" | "accepted" | "not-accepted-now" | "declined" | "postponed" | "decision-pending" | "requested" | "scheduled" | "performed" | "result-pending" | "result-available" | "interpreted" | "follow-up" | "completed";
export interface ScreeningEpisode extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  title: string;
  state: ScreeningState;
  rationale?: string;
  nextReviewAt?: ISODateTime;
  professionalSummary?: string;
  sharedSummary?: string;
}

export interface CarePlan extends AuditFields, ProvenancedRecord {
  personId?: EntityId;
  familyId?: EntityId;
  title: string;
  objective: string;
  target: "person" | "caregiver" | "dyad" | "family" | "external-resource" | "team";
  responsibility?: string;
  dueAt?: ISODateTime;
  state: "proposed" | "discussed" | "agreed" | "in-progress" | "completed" | "partially-completed" | "postponed" | "declined" | "not-feasible" | "cancelled" | "replaced";
  sharedSummary?: string;
}

export interface PatientSuggestion extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  relatedEntityId?: EntityId;
  text: string;
  state: "received" | "reviewed" | "incorporated" | "not-incorporated" | "clarified";
}
