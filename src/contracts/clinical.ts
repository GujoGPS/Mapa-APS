import type { AuditFields, EntityId, ISODateTime, ProvenancedRecord } from "./core";

export interface ReportedTerm extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  originalText: string;
  normalizedConceptId?: EntityId;
  normalizationState: "unmapped" | "candidate" | "confirmed" | "rejected";
}

export interface ExamResult extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  examDefinitionId: EntityId;
  collectedAt?: ISODateTime;
  valueText: string;
  numericValue?: number;
  unit?: string;
  labReferenceText?: string;
  documentAvailable: boolean;
}

export interface PersonMedication extends AuditFields, ProvenancedRecord {
  personId: EntityId;
  reportedName: string;
  medicationReferenceId?: EntityId;
  presentationText?: string;
  doseText?: string;
  frequencyText?: string;
  state:
    | "reported"
    | "partially-identified"
    | "confirmed"
    | "regular-use"
    | "divergent-use"
    | "irregular-use"
    | "suspended"
    | "replaced"
    | "discontinued"
    | "historical";
}
