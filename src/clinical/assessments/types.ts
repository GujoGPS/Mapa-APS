export type InstrumentOrigin =
  | "printed-local-form"
  | "digital-adaptation"
  | "mathematical-derivation"
  | "pending-clinical-source"
  | "pending-preceptor-validation";

export type EditorialStatus = "draft-local" | "pending-preceptor-validation" | "active-local";
export type SectionStatus = "available" | "source-missing" | "title-only-in-source";
export type AssessmentStatus = "not-started" | "draft" | "in-review" | "completed" | "rectified" | "archived";
export type AssessmentKind = "initial" | "reassessment" | "rectification";
export type AnswerType =
  | "short-text"
  | "long-text"
  | "date"
  | "number"
  | "single-choice"
  | "multiple-choice"
  | "yes-no"
  | "yes-no-never-did-does-not-remember"
  | "measurement"
  | "blood-pressure"
  | "laboratory-result"
  | "laterality-group"
  | "clinical-code"
  | "service"
  | "calculated-information"
  | "manual-classification"
  | "future-entity-link";

export type Visibility = "academic-private" | "shareable-with-person" | "shareable-with-family" | "administrative" | "non-exportable";
export type Sensitivity = "ordinary" | "personal" | "sensitive-personal" | "clinical" | "identifier";
export type AssessmentScope = "individual" | "family-context" | "family-shared";
export type ProjectionStrategy = "clinical-academic" | "person-friendly" | "operational-family-status" | "not-projectable";
export type RuleSourceType = "manual" | "automatic";
export type ApplicationDataOrigin = "normal" | "synthetic-demo";
export type AnswerSource = "person" | "family" | "document" | "observation" | "system";
export type AnswerStatus = "unanswered" | "answered" | "review-required" | "invalid";
export type ApplicabilityState = "applicable" | "not-applicable" | "not-assessed" | "incomplete" | "manually-overridden";
export type ManualProjectionReviewStatus = "pending-review" | "reviewed" | "blocked";

export interface ProvenanceMetadata {
  origin: InstrumentOrigin;
  sourceNote: string;
}

export interface VisibilityMetadata {
  scope: AssessmentScope;
  clinicalVisibility: Visibility;
  personVisibility: Visibility;
  familyVisibility: Visibility;
  reviewRequired: boolean;
  projectionStrategy: ProjectionStrategy;
}

export interface ValidationMetadata {
  rule: string;
  unit?: string;
  finite?: boolean;
  greaterThan?: number;
  greaterThanOrEqual?: number;
  allowIncomplete?: boolean;
}

export interface ApplicabilityRule {
  condition: string;
  dependencies: string[];
  whenNotApplicable: "not-applicable" | "hide" | "manual-review";
  manualReviewAllowed: boolean;
}

export interface DerivedRule {
  id: string;
  version: string;
  inputs: string[];
  resultType: AnswerType;
  sourceType: RuleSourceType;
  origin: InstrumentOrigin;
  automaticCalculation: boolean;
  requiresClinicalReview: boolean;
  algorithm?: string;
}

export interface OptionDefinition {
  id: string;
  label: string;
  value: string;
  order: number;
  academicLabel?: string;
  personFriendlyLabel?: string;
  domainEffect?: "proposal-only" | "proposed-network-or-referral-change";
  metadata?: Record<string, string | boolean>;
}

export interface QuestionDefinition {
  id: string;
  sectionId: string;
  printedLabel: string;
  academicLabel: string;
  personFriendlyLabel: string;
  description?: string;
  answerType: AnswerType;
  required: boolean;
  options: OptionDefinition[];
  unit?: string;
  applicability?: ApplicabilityRule;
  visibility: VisibilityMetadata;
  sensitivity: Sensitivity;
  validation?: ValidationMetadata;
  derivation?: DerivedRule;
  provenance: ProvenanceMetadata;
  notes?: string;
}

export interface SectionDefinition {
  id: string;
  printedBlockNumber: number;
  title: string;
  description?: string;
  order: number;
  status: SectionStatus;
  questions: QuestionDefinition[];
  provenance: ProvenanceMetadata;
  missingReason?: string;
  implementable: boolean;
  declarativeCapabilities?: string[];
}

export interface InstrumentAmbiguity {
  id: string;
  location: string;
  description: string;
  effect: string;
  status: "open" | "provisional-decision";
  decisionNeeded: string;
  conservativeImplementationPossible: boolean;
}

export interface InstrumentDefinition {
  id: string;
  version: string;
  title: string;
  subtitle: string;
  purpose: string;
  origin: string;
  sourcePage: number;
  referenceYear: number;
  editorialStatus: EditorialStatus;
  availableSections: number[];
  missingSections: number[];
  sections: SectionDefinition[];
  questions: QuestionDefinition[];
  ambiguities: InstrumentAmbiguity[];
  limitations: string[];
  futureServiceStates?: ServiceRelationshipState[];
}

export type ServiceRelationshipState =
  | "current-network"
  | "suggested"
  | "discussed"
  | "accepted"
  | "referred"
  | "scheduled"
  | "accessed"
  | "in-follow-up"
  | "completed"
  | "declined"
  | "unavailable"
  | "not-applicable";

export interface InstrumentApplication {
  applicationId: string;
  familyId: string;
  personId: string;
  instrumentId: string;
  instrumentVersion: string;
  assessmentDate: string;
  status: AssessmentStatus;
  kind: AssessmentKind;
  createdAt: string;
  updatedAt: string;
  answers: Record<string, InstrumentAnswer>;
  applicabilityOverrides: Record<string, ApplicabilityOverride>;
  provenance: ProvenanceMetadata;
  visibility: VisibilityMetadata;
  dataOrigin: ApplicationDataOrigin;
  schemaVersion: number;
  revisionNumber: number;
  completedAt?: string;
  rectifiedAt?: string;
  rectifiesApplicationId?: string;
  privateNotes?: string;
}

export interface ApplicabilityOverride {
  questionId: string;
  state: "applicable" | "not-applicable" | "not-assessed" | "incomplete";
  justification: string;
  source: AnswerSource;
  updatedAt: string;
}

interface InstrumentAnswerBase {
  questionId: string;
  answeredAt: string;
  updatedAt: string;
  source: AnswerSource;
  status: AnswerStatus;
  applicabilityState: ApplicabilityState;
  notes?: string;
  visibilityOverride?: Visibility;
}

export type InstrumentAnswer =
  | (InstrumentAnswerBase & { answerType: "short-text" | "long-text" | "date" | "clinical-code" | "service"; value: string })
  | (InstrumentAnswerBase & { answerType: "number" | "measurement" | "laboratory-result"; value: number; unit?: string })
  | (InstrumentAnswerBase & { answerType: "single-choice" | "yes-no" | "yes-no-never-did-does-not-remember" | "manual-classification" | "laterality-group"; value: string })
  | (InstrumentAnswerBase & { answerType: "multiple-choice"; value: string[] })
  | (InstrumentAnswerBase & { answerType: "blood-pressure"; value: { systolic: number; diastolic: number }; unit: "mmHg" })
  | (InstrumentAnswerBase & { answerType: "calculated-information"; value: never })
  | (InstrumentAnswerBase & { answerType: "future-entity-link"; value: { entityId: string; entityType: string } });

export interface DerivedAssessmentResult {
  id: string;
  applicationId: string;
  subjectPersonId: string;
  familyId: string;
  questionId: string;
  value: unknown;
  unit?: string;
  rule: DerivedRule;
  provenance: ProvenanceMetadata;
  reviewRequired: boolean;
}

export interface ManualClassification {
  questionId: string;
  value: string;
  sourceType: "manual";
  requiresClinicalReview: true;
  note?: string;
}

export interface FamilyDataReference {
  referenceId: string;
  familyId: string;
  field: string;
  sourceType: "canonical-family-domain";
}

export interface FamilyUpdateProposal {
  proposalId: string;
  familyId: string;
  subjectPersonId: string;
  applicationId: string;
  targetField: string;
  proposedValue: unknown;
  justificationPrivate: string;
  shareableText?: string;
  decision: "pending-review" | "confirmed" | "modified" | "rejected";
  reviewRequired: true;
}

export type EcomapScope = "family" | "selected-members";
export type EcomapLinkStatus = "suggested" | "active" | "inactive" | "rejected";

export interface EcomapLink {
  networkRelationshipId: string;
  familyId: string;
  scope: EcomapScope;
  relatedPersonIds: string[];
  serviceOrNetworkId: string;
  status: EcomapLinkStatus;
  source: InstrumentOrigin;
  originApplicationId?: string;
  originEncounterId?: string;
  visibility: VisibilityMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface EcomapLinkProposal {
  proposalId: string;
  familyId: string;
  subjectPersonId: string;
  applicationId: string;
  serviceOrNetworkId: string;
  proposedScope: EcomapScope;
  relatedPersonIds: string[];
  proposedStatus: EcomapLinkStatus;
  justificationPrivate: string;
  shareableText?: string;
  visibility: VisibilityMetadata;
  decision: "pending-review" | "confirmed" | "modified" | "rejected";
}

export interface AssessmentProjectionPolicy {
  subjectPersonId: string;
  familyId: string;
  scope: AssessmentScope;
  clinicalVisibility: Visibility;
  personVisibility: Visibility;
  familyVisibility: Visibility;
  reviewRequired: boolean;
  projectionStrategy: ProjectionStrategy;
}

export interface ClinicalAssessmentProjection extends AssessmentProjectionPolicy {
  applicationId: string;
  kind: "clinical-academic";
}

export interface PersonAssessmentProjection extends AssessmentProjectionPolicy {
  applicationId: string;
  kind: "person-friendly";
}

export interface FamilyAssessmentStatusProjection {
  familyId: string;
  personId: string;
  applicationId: string;
  status: AssessmentStatus;
  assessmentDate?: string;
  pendingCount: number;
  hasDomainProposals: boolean;
}

export interface ClinicalProjectionPolicy {
  applicationId: string;
  familyId: string;
  personId: string;
  instrumentId: string;
  instrumentVersion: string;
  generatedAt: string;
  visibility: VisibilityMetadata;
  reviewStatus: ManualProjectionReviewStatus;
}

export interface ProposedDomainChange {
  proposalId: string;
  applicationId: string;
  familyId: string;
  subjectPersonId: string;
  targetDomain: "family-data" | "genogram" | "ecomap" | "care-plan" | "clinical-condition" | "referral";
  targetEntityId?: string;
  proposalType: string;
  scope: AssessmentScope;
  relatedPersonIds: string[];
  proposedValue: unknown;
  privateRationale: string;
  shareableExplanation?: string;
  status: "proposed" | "under-review" | "accepted" | "modified" | "rejected" | "applied" | "superseded";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  provenance: ProvenanceMetadata;
  dataOrigin: ApplicationDataOrigin;
}
