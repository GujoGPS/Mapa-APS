# Mapa APS: pacote de contexto 4

Este pacote contem arquivos integrais do projeto.

Cada arquivo comeca com:

# FILE: caminho/original

e termina com:

# END FILE: caminho/original

Nao interprete a ausencia de um arquivo neste pacote como ausencia no projeto. Outros arquivos podem estar nos demais pacotes.

---

# FILE: src/clinical/assessments/types.ts

``typescript
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
  waistCriterion?: "male-local-rule" | "female-local-rule" | "not-selected" | undefined;
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
  | (InstrumentAnswerBase & { answerType: "blood-pressure"; value: { systolic?: number; diastolic?: number }; unit: "mmHg" })
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

export type CareFactDerivationType =
  | "reported"
  | "measured"
  | "calculated"
  | "manually-classified"
  | "applicability-derived"
  | "missing-information"
  | "care-follow-up"
  | "proposed-domain-change"
  | "source-limitation";

export type CareFactCategory =
  | "demographic"
  | "social-context"
  | "reported-condition"
  | "screening"
  | "measurement"
  | "calculated-result"
  | "manual-classification"
  | "physical-exam"
  | "foot-assessment"
  | "service-or-referral"
  | "care-follow-up"
  | "missing-data"
  | "source-limitation"
  | "family-context"
  | "proposed-change";

export type CareFactSubjectScope = "individual" | "family-context" | "family-shared";
export type CareFactReviewStatus = "auto-derived" | "needs-review" | "reviewed" | "confirmed" | "rejected" | "superseded";
export type CareFactClinicalVisibility = "visible" | "summary-only" | "private-note" | "hidden";
export type CareFactPersonVisibility = "visible" | "visible-after-review" | "summary-only" | "hidden";
export type CareFactFamilyVisibility = "operational-status-only" | "shared-context" | "hidden";
export type CareFactCertainty = "reported" | "measured" | "calculated" | "manual" | "uncertain" | "missing" | "limited";

export interface CareFact {
  factId: string;
  factType: CareFactDerivationType;
  factVersion: string;
  applicationId: string;
  instrumentId: string;
  instrumentVersion: string;
  familyId: string;
  personId: string;
  sourceQuestionIds: string[];
  subjectScope: CareFactSubjectScope;
  category: CareFactCategory;
  topic: string;
  value: unknown;
  unit?: string;
  occurredAt?: string;
  recordedAt: string;
  derivationType: CareFactDerivationType;
  ruleId?: string;
  ruleVersion?: string;
  provenance: ProvenanceMetadata;
  certaintyState: CareFactCertainty;
  reviewStatus: CareFactReviewStatus;
  clinicalVisibility: CareFactClinicalVisibility;
  personVisibility: CareFactPersonVisibility;
  familyVisibility: CareFactFamilyVisibility;
  actionable: boolean;
  invalidatedAt?: string;
  invalidationReason?: string;
  rectifiesApplicationId?: string;
  relatedPersonIds?: string[];
  applicabilityState?: ApplicabilityState;
  status?: ServiceRelationshipState;
}

export interface CareFactDerivationError {
  code: "invalid-application" | "unsupported-instrument" | "invalid-source";
  message: string;
}

export interface CareFactDerivationResult {
  facts: CareFact[];
  errors: CareFactDerivationError[];
}

export type LongitudinalChangeType =
  | "added"
  | "removed"
  | "changed"
  | "unchanged"
  | "became-applicable"
  | "became-not-applicable"
  | "newly-missing"
  | "resolved-missing";

export interface LongitudinalFactChange {
  topic: string;
  changeType: LongitudinalChangeType;
  previous?: CareFact;
  current?: CareFact;
}

``

# END FILE: src/clinical/assessments/types.ts

---

# FILE: src/clinical/assessments/validation.ts

``typescript
import type {
  ApplicabilityOverride,
  InstrumentAnswer,
  InstrumentApplication,
  InstrumentDefinition,
  EcomapLink,
  EcomapLinkProposal,
  QuestionDefinition,
} from "./types";

export interface AssessmentValidation {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  missing?: string[];
}

export function validateInstrumentDefinition(definition: InstrumentDefinition): AssessmentValidation {
  const errors: string[] = [];
  const sectionIds = new Set<string>();
  const questionIds = new Set<string>();
  const optionIds = new Set<string>();
  const knownQuestionIds = new Set(definition.questions.map((question) => question.id));

  for (const section of definition.sections) {
    if (sectionIds.has(section.id)) errors.push(`Seção duplicada: ${section.id}`);
    sectionIds.add(section.id);
    for (const question of section.questions) {
      if (question.sectionId !== section.id) errors.push(`${question.id}: sectionId inconsistente`);
      if (questionIds.has(question.id)) errors.push(`Pergunta duplicada: ${question.id}`);
      questionIds.add(question.id);
      if (!question.provenance.origin) errors.push(`${question.id}: proveniência ausente`);
      if (!question.visibility) errors.push(`${question.id}: visibilidade ausente`);
      for (const option of question.options) {
        if (optionIds.has(`${question.id}:${option.id}`)) errors.push(`Opção duplicada: ${question.id}:${option.id}`);
        optionIds.add(`${question.id}:${option.id}`);
      }
      if (question.applicability) {
        for (const dependency of question.applicability.dependencies) {
          if (!knownQuestionIds.has(dependency)) errors.push(`${question.id}: dependência inexistente ${dependency}`);
        }
      }
      if (question.derivation) {
        for (const input of question.derivation.inputs) {
          if (!knownQuestionIds.has(input)) errors.push(`${question.id}: entrada derivada inexistente ${input}`);
        }
      }
    }
  }
  if (questionIds.size !== definition.questions.length) errors.push("A lista plana de perguntas não corresponde às seções.");
  if (!definition.id || !definition.version || !definition.origin) errors.push("Metadados essenciais do instrumento ausentes.");
  return { valid: errors.length === 0, errors };
}

export function validateInstrumentApplication(application: InstrumentApplication): AssessmentValidation {
  const errors: string[] = [];
  if (!application.applicationId) errors.push("applicationId obrigatório");
  if (!application.familyId) errors.push("familyId obrigatório");
  if (!application.personId) errors.push("personId obrigatório");
  if (application.familyId === application.personId) errors.push("familyId e personId devem representar entidades distintas");
  if (!application.instrumentId || !application.instrumentVersion) errors.push("Instrumento e versão obrigatórios");
  if (!application.assessmentDate) errors.push("assessmentDate obrigatório");
  if (!application.answers || !application.applicabilityOverrides || !application.provenance || !application.visibility) errors.push("Contrato da aplicação incompleto");
  if (!Number.isInteger(application.schemaVersion) || application.schemaVersion < 1) errors.push("schemaVersion inválido");
  if (!Number.isInteger(application.revisionNumber) || application.revisionNumber < 1) errors.push("revisionNumber inválido");
  return { valid: errors.length === 0, errors };
}

function isDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function hasOption(question: QuestionDefinition, value: string): boolean {
  return question.options.some((option) => option.id === value || option.value === value);
}

function answerValueValid(question: QuestionDefinition, answer: InstrumentAnswer): string | undefined {
  if (answer.answerType !== question.answerType) return "tipo da resposta incompatível";
  if (question.answerType === "calculated-information") return "informação derivada não pode ser resposta manual";
  if (["short-text", "long-text", "date", "clinical-code", "service"].includes(question.answerType)) {
    if (typeof answer.value !== "string") return "valor textual esperado";
    if (question.answerType === "date" && !isDate(answer.value)) return "data inválida";
  }
  if (["number", "measurement", "laboratory-result"].includes(question.answerType)) {
    if (typeof answer.value !== "number" || !Number.isFinite(answer.value)) return "número finito esperado";
    if (question.validation?.greaterThan !== undefined && answer.value <= question.validation.greaterThan) return "valor deve ser maior que o limite";
    if (question.validation?.greaterThanOrEqual !== undefined && answer.value < question.validation.greaterThanOrEqual) return "valor abaixo do limite";
  }
  if (["single-choice", "yes-no", "yes-no-never-did-does-not-remember", "manual-classification", "laterality-group"].includes(question.answerType)) {
    if (typeof answer.value !== "string" || !hasOption(question, answer.value)) return "opção inválida";
  }
  if (question.answerType === "multiple-choice") {
    if (!Array.isArray(answer.value) || answer.value.some((value) => typeof value !== "string" || !hasOption(question, value))) return "opções inválidas";
  }
  if (question.answerType === "blood-pressure") {
    const value = answer.value as { systolic?: unknown; diastolic?: unknown };
    if (!value || typeof value !== "object") return "pressão arterial inválida";
    const values = [value.systolic, value.diastolic].filter((part) => part !== undefined);
    if (values.some((part) => typeof part !== "number" || !Number.isFinite(part) || part <= 0)) return "pressão arterial inválida";
    if (!("unit" in answer) || answer.unit !== "mmHg") return "unidade de pressão inválida";
  }
  return undefined;
}

function selectedValues(application: InstrumentApplication, questionId: string): string[] {
  const answer = application.answers[questionId];
  return answer?.answerType === "multiple-choice" ? answer.value : answer?.answerType === "single-choice" ? [answer.value] : [];
}

export function validateApplicationAnswers(
  application: InstrumentApplication,
  definition: InstrumentDefinition,
  mode: "draft" | "complete" = "draft",
): AssessmentValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];
  const questions = new Map(definition.questions.map((question) => [question.id, question]));
  for (const [questionId, answer] of Object.entries(application.answers)) {
    const question = questions.get(questionId);
    if (!question) {
      errors.push(`${questionId}: pergunta inexistente na versão do instrumento`);
      continue;
    }
    const valueError = answerValueValid(question, answer);
    if (valueError) errors.push(`${questionId}: ${valueError}`);
    if (answer.questionId !== questionId) errors.push(`${questionId}: questionId inconsistente`);
    if (answer.applicabilityState === "manually-overridden" && !application.applicabilityOverrides[questionId]) {
      errors.push(`${questionId}: override de aplicabilidade ausente`);
    }
  }
  for (const question of definition.questions) {
    const answer = application.answers[question.id];
    const override = application.applicabilityOverrides[question.id];
    const selected = selectedValues(application, question.id);
    const applicable = !question.applicability
      || override?.state === "applicable"
      || (question.applicability.condition.includes("contains") && selectedValues(application, question.applicability.dependencies[0] ?? "").length > 0);
    if (question.applicability && override && !override.justification) errors.push(`${question.id}: justificativa do override ausente`);
    if (question.id === "health.other-chronic-condition-description" && selectedValues(application, "health.diagnosed-chronic-conditions").includes("other") && !answer?.value) {
      errors.push(`${question.id}: descrição obrigatória para Outra`);
    }
    if (mode === "complete" && question.required && applicable && !answer && !override) missing.push(question.id);
    if (question.applicability && !applicable && answer?.applicabilityState !== "not-applicable" && !override) warnings.push(`${question.id}: aplicabilidade ainda não resolvida`);
    if (mode === "complete" && question.applicability && !applicable && answer) {
      if (answer.applicabilityState === "not-applicable" || override?.state === "not-applicable") continue;
    }
    if (mode === "complete" && question.answerType === "blood-pressure" && answer && answer.applicabilityState !== "not-applicable") {
      const value = answer.value as { systolic?: number; diastolic?: number };
      if (value.systolic === undefined || value.diastolic === undefined) missing.push(`${question.id}: aferição incompleta`);
    }
    if (selected.includes("other") && question.id === "summary.services" && !application.answers["summary.other-service-description"]) warnings.push("summary.other-service-description: descrição de Outro serviço pendente");
  }
  return { valid: errors.length === 0 && (mode === "draft" || missing.length === 0), errors, warnings, missing };
}

export function validateApplicabilityOverride(override: ApplicabilityOverride, definition: InstrumentDefinition): AssessmentValidation {
  const errors: string[] = [];
  if (!definition.questions.some((question) => question.id === override.questionId)) errors.push("Pergunta do override inexistente.");
  if (!override.justification.trim()) errors.push("Override exige justificativa.");
  return { valid: errors.length === 0, errors };
}

export function validateEcomapLink(link: EcomapLink, familyPersonIds: readonly string[]): AssessmentValidation {
  const errors: string[] = [];
  const members = new Set(familyPersonIds);
  if (link.scope === "family" && link.relatedPersonIds.length > 0) errors.push("Vínculo familiar não deve restringir integrantes.");
  if (link.scope === "selected-members" && link.relatedPersonIds.length === 0) errors.push("Vínculo restrito exige integrantes.");
  if (link.relatedPersonIds.some((personId) => !members.has(personId))) errors.push("Todos os integrantes relacionados devem pertencer à família.");
  if (link.status === "active" && link.source === "digital-adaptation") errors.push("Sugestão digital não pode ser vínculo ativo sem revisão.");
  return { valid: errors.length === 0, errors };
}

export function validateEcomapProposal(proposal: EcomapLinkProposal, familyPersonIds: readonly string[]): AssessmentValidation {
  const errors: string[] = [];
  if (!proposal.subjectPersonId || !familyPersonIds.includes(proposal.subjectPersonId)) errors.push("A proposta deve identificar uma pessoa da família.");
  if (proposal.relatedPersonIds.some((personId) => !familyPersonIds.includes(personId))) errors.push("Todos os integrantes propostos devem pertencer à família.");
  if (!proposal.applicationId || !proposal.familyId) errors.push("A proposta deve preservar a origem individual.");
  if (proposal.decision !== "pending-review" && !proposal.shareableText) errors.push("Decisão confirmada ou modificada exige texto compartilhável.");
  return { valid: errors.length === 0, errors };
}

export function canCompareApplications(left: InstrumentApplication, right: InstrumentApplication): boolean {
  return left.personId === right.personId && left.familyId === right.familyId && left.instrumentId === right.instrumentId;
}

export function conservativeVisibility(question: QuestionDefinition): boolean {
  return question.visibility.familyVisibility !== "shareable-with-family"
    || question.sensitivity === "clinical"
    || question.sensitivity === "sensitive-personal"
    || question.sensitivity === "identifier";
}

``

# END FILE: src/clinical/assessments/validation.ts

---

# FILE: src/clinical/content.ts

``typescript
import type { ClinicalClaim, ClinicalCondition, ExamKnowledge, MedicationKnowledge } from "./types";
const review="2026-09-27",due="2027-03-27";
const claim=(id:string,text:string,sourceIds:string[],tags:string[],sharedText?:string,level:"essential"|"expanded"|"audited"|"review-needed"="essential"):ClinicalClaim=>({id,text,...(sharedText?{sharedText}:{}),sourceIds,population:"Adultos na APS; individualizar para populações especiais.",level,reviewedAt:review,reviewDueAt:due,tags});
export const conditions:ClinicalCondition[]=[
 {id:"has",name:"Hipertensão arterial sistêmica",shortName:"Hipertensão",synonyms:["HAS","pressão alta"],summary:"Condição crônica multifatorial caracterizada por níveis elevados e sustentados de pressão arterial, frequentemente assintomática e associada a risco cardiovascular e lesão de órgãos-alvo.",sharedSummary:"Pressão alta costuma não causar sintomas, mas precisa ser acompanhada para reduzir riscos ao coração, cérebro, rins e vasos.",publicationLevel:"expanded",scope:"Rastreamento, confirmação diagnóstica, avaliação de risco e acompanhamento de adultos na APS.",sourceIds:["ms-pcdt-has-2025","ms-linhas-cuidado-2026"],sections:{quick:[claim("has-q1","A confirmação não deve depender de uma medida isolada; técnica, repetição e contexto importam.",["ms-pcdt-has-2025"],["diagnóstico"],"Uma medida isolada não define sozinha o diagnóstico.")],diagnosis:[claim("has-d1","Em adultos, a pressão deve ser medida com técnica adequada e repetida conforme o resultado e o risco cardiovascular.",["ms-pcdt-has-2025"],["pressão","rastreamento"])],assessment:[claim("has-a1","A avaliação inclui risco cardiovascular, possíveis lesões de órgãos-alvo, comorbidades, medicamentos e fatores sociais.",["ms-pcdt-has-2025"],["risco","APS"])],monitoring:[claim("has-m1","O acompanhamento deve relacionar medidas seriadas, tolerabilidade, uso real dos medicamentos e metas individualizadas.",["ms-pcdt-has-2025"],["longitudinal"])],nonDrug:[claim("has-n1","Alimentação adequada, redução de sódio e ultraprocessados, atividade física, controle do peso, manejo do álcool, tabagismo, estresse e sono integram a prevenção e o cuidado.",["ms-pcdt-has-2025"],["estilo-de-vida"])],medication:[claim("has-rx1","A escolha farmacológica depende do risco, comorbidades, tolerabilidade, função renal e protocolo aplicável; o Mapa não publica dose sem auditoria por indicação e apresentação.",["ms-pcdt-has-2025","anvisa-bulario-2026"],["farmacologia"],undefined,"audited")],referral:[claim("has-ref1","Sinais de lesão aguda, sintomas importantes, valores persistentemente muito elevados ou suspeita de causa secundária exigem avaliação profissional e fluxo apropriado.",["ms-pcdt-has-2025"],["encaminhamento"]) ]}},
 {id:"dm2",name:"Diabete melito tipo 2",shortName:"Diabetes tipo 2",synonyms:["DM2","diabetes"],summary:"Doença metabólica crônica marcada por resistência à insulina e deficiência progressiva de secreção, com hiperglicemia persistente e risco de complicações micro e macrovasculares.",sharedSummary:"No diabetes tipo 2, o açúcar no sangue permanece elevado e o acompanhamento busca proteger vasos, rins, olhos, nervos e coração.",publicationLevel:"expanded",scope:"Adultos com risco, diagnóstico ou acompanhamento de DM2 na APS.",sourceIds:["ms-pcdt-dm2-2026","ms-linhas-cuidado-2026"],sections:{quick:[claim("dm-q1","O cuidado combina controle glicêmico, risco cardiovascular, função renal, prevenção de complicações e apoio ao autocuidado.",["ms-pcdt-dm2-2026"],["visão-rápida"])],diagnosis:[claim("dm-d1","O diagnóstico utiliza critérios laboratoriais e contexto clínico; um resultado pode exigir confirmação conforme sintomas e situação.",["ms-pcdt-dm2-2026"],["diagnóstico"])],assessment:[claim("dm-a1","A avaliação inicial deve incluir risco cardiovascular, função renal, pés, olhos, medicamentos, alimentação, atividade física e barreiras de acesso.",["ms-pcdt-dm2-2026"],["avaliação"])],monitoring:[claim("dm-m1","Hemoglobina glicada, glicemias, função renal e rastreamento de complicações são acompanhados com periodicidade individualizada.",["ms-pcdt-dm2-2026"],["monitoramento"])],nonDrug:[claim("dm-n1","Mudanças sustentáveis em alimentação, movimento, sono, cessação do tabagismo e apoio ao automanejo integram o tratamento.",["ms-pcdt-dm2-2026"],["estilo-de-vida"])],medication:[claim("dm-rx1","A terapia deve considerar controle glicêmico, doença cardiovascular, doença renal, risco de hipoglicemia, peso, acesso e preferências; doses permanecem bloqueadas até auditoria regulatória específica.",["ms-pcdt-dm2-2026","anvisa-bulario-2026","ms-rename-2024"],["farmacologia"],undefined,"audited")],referral:[claim("dm-ref1","Descompensação importante, suspeita de emergência metabólica, complicações avançadas ou necessidade além da APS exigem fluxo de avaliação apropriado.",["ms-pcdt-dm2-2026"],["encaminhamento"]) ]}},
 {id:"drc",name:"Doença renal crônica",shortName:"Doença renal crônica",synonyms:["DRC","doença crônica dos rins"],summary:"Anormalidade estrutural ou funcional renal com implicações para a saúde, persistente por pelo menos três meses.",sharedSummary:"A doença renal crônica significa que alterações nos rins persistem ao longo do tempo. Muitas vezes não causa sintomas no início.",publicationLevel:"expanded",scope:"Identificação, estadiamento, progressão e coordenação do cuidado de adultos na APS.",sourceIds:["ms-pcdt-drc-2024"],sections:{quick:[claim("drc-q1","A persistência temporal e a combinação entre TFG, marcadores de dano renal e contexto são centrais; um resultado isolado não basta.",["ms-pcdt-drc-2024"],["diagnóstico"],"Um exame isolado não define sozinho doença renal crônica.")],diagnosis:[claim("drc-d1","TFG abaixo de 60 mL/min/1,73 m² por mais de três meses ou marcador persistente de dano renal pode sustentar o diagnóstico conforme o protocolo.",["ms-pcdt-drc-2024"],["TFG","albuminúria"])],assessment:[claim("drc-a1","Avaliar diabetes, hipertensão, obesidade, doença cardiovascular, tabagismo, nefrotóxicos, história familiar e causas renais específicas.",["ms-pcdt-drc-2024"],["risco"])],monitoring:[claim("drc-m1","TFG, albuminúria, urina, pressão, eletrólitos e efeitos de medicamentos são acompanhados conforme estágio e contexto.",["ms-pcdt-drc-2024"],["monitoramento"])],nonDrug:[claim("drc-n1","O cuidado inclui redução de fatores de progressão, alimentação individualizada, atividade física possível, cessação do tabagismo e prevenção de nefrotoxicidade.",["ms-pcdt-drc-2024"],["progressão"])],medication:[claim("drc-rx1","Medicamentos renoprotetores e ajustes dependem de indicação, TFG, albuminúria, potássio, comorbidades e protocolo; dose não é inferida pelo Mapa.",["ms-pcdt-drc-2024","anvisa-bulario-2026"],["farmacologia"],undefined,"audited")],referral:[claim("drc-ref1","Progressão rápida, estágio avançado, complicações, diagnóstico incerto ou critérios do protocolo requerem coordenação com atenção especializada.",["ms-pcdt-drc-2024"],["encaminhamento"]) ]}},
 {id:"dyslipidemia",name:"Dislipidemia",shortName:"Dislipidemia",synonyms:["colesterol alto","triglicerídeos altos"],summary:"Alterações nos lipídios sanguíneos relacionadas ao risco aterosclerótico e, em hipertrigliceridemia importante, ao risco de pancreatite.",sharedSummary:"Alterações no colesterol e nos triglicerídeos precisam ser interpretadas junto com o risco cardiovascular da pessoa.",publicationLevel:"review-needed",scope:"Avaliação laboratorial, risco cardiovascular e prevenção de eventos. A atualização de 2026 permanece preliminar nesta versão.",sourceIds:["ms-pcdt-dislipidemia-2019","ms-dislipidemia-cp94-2026"],sections:{quick:[claim("lip-q1","A interpretação depende do perfil lipídico e do risco cardiovascular global, não apenas de um valor isolado.",["ms-pcdt-dislipidemia-2019"],["risco"])],diagnosis:[claim("lip-d1","O diagnóstico é laboratorial e a história clínica e familiar participa da estratificação de risco.",["ms-pcdt-dislipidemia-2019"],["diagnóstico"])],assessment:[claim("lip-a1","Pesquisar doença cardiovascular, diabetes, hipertensão, obesidade, tabagismo, história familiar e causas secundárias relevantes.",["ms-pcdt-dislipidemia-2019"],["avaliação"])],monitoring:[claim("lip-m1","Perfil lipídico, resposta, tolerabilidade e risco são revistos longitudinalmente.",["ms-pcdt-dislipidemia-2019"],["monitoramento"])],nonDrug:[claim("lip-n1","Alimentação adequada, atividade física, cessação do tabagismo e manejo do peso integram a prevenção cardiovascular.",["ms-pcdt-dislipidemia-2019"],["estilo-de-vida"])],medication:[claim("lip-rx1","Terapia farmacológica depende da categoria de risco, alteração lipídica, tolerabilidade e protocolo vigente. A consulta pública de 2026 ainda não substitui automaticamente o PCDT vigente.",["ms-pcdt-dislipidemia-2019","ms-dislipidemia-cp94-2026","anvisa-bulario-2026"],["farmacologia"],undefined,"review-needed")],referral:[claim("lip-ref1","Suspeita de hipercolesterolemia familiar, hipertrigliceridemia importante ou situação fora do escopo da APS exige avaliação segundo fluxo aplicável.",["ms-pcdt-dislipidemia-2019"],["encaminhamento"]) ]}},
 {id:"obesity",name:"Sobrepeso e obesidade em adultos",shortName:"Obesidade",synonyms:["sobrepeso","excesso de peso"],summary:"Condição crônica e multifatorial que exige avaliação clínica, nutricional, funcional e psicossocial, evitando reduzir o cuidado ao peso isolado.",sharedSummary:"O cuidado do peso considera saúde, alimentação, movimento, sono, contexto de vida e objetivos possíveis, sem culpa ou estigma.",publicationLevel:"expanded",scope:"Adultos na linha de cuidado do sobrepeso e obesidade.",sourceIds:["ms-pcdt-obesidade-2024","ms-linhas-cuidado-2026"],sections:{quick:[claim("ob-q1","IMC auxilia a classificação, mas possui limitações e deve ser interpretado com distribuição de gordura, comorbidades e contexto.",["ms-pcdt-obesidade-2024"],["IMC"])],diagnosis:[claim("ob-d1","A avaliação utiliza medidas antropométricas e contexto clínico; IMC não distingue composição corporal e é menos acurado em alguns grupos.",["ms-pcdt-obesidade-2024"],["diagnóstico"])],assessment:[claim("ob-a1","Avaliar comorbidades, medicamentos, alimentação, atividade física, comportamento, saúde mental, funcionalidade, sono, estigma e determinantes sociais.",["ms-pcdt-obesidade-2024"],["avaliação"])],monitoring:[claim("ob-m1","Acompanhamento deve incluir saúde, funcionalidade, parâmetros metabólicos, objetivos pactuados e trajetória, não somente quilogramas.",["ms-pcdt-obesidade-2024"],["monitoramento"])],nonDrug:[claim("ob-n1","Intervenções multifatoriais e de longo prazo combinam alimentação, atividade física e mudança comportamental com adequação cultural, social e econômica.",["ms-pcdt-obesidade-2024"],["estilo-de-vida"])],medication:[claim("ob-rx1","Intervenções farmacológicas ou cirúrgicas exigem indicação, avaliação integral, protocolo e seguimento; não são automatizadas pelo Mapa.",["ms-pcdt-obesidade-2024","anvisa-bulario-2026"],["farmacologia"],undefined,"audited")],referral:[claim("ob-ref1","Complexidade clínica, necessidade multiprofissional ou critérios de atenção especializada devem seguir a linha de cuidado local.",["ms-pcdt-obesidade-2024","ms-linhas-cuidado-2026"],["encaminhamento"]) ]}}
];
export const medicationKnowledge:MedicationKnowledge[]=[
 {id:"metformin",genericName:"Metformina",therapeuticClass:"Biguanida",coveredContexts:["DM2"],mechanismSummary:"Reduz principalmente a produção hepática de glicose e melhora a sensibilidade à insulina.",sharedPurpose:"Ajuda a reduzir a glicose no sangue.",sourceIds:["ms-pcdt-dm2-2026","anvisa-bulario-2026","ms-rename-2024"],publicationLevel:"essential",doseStatus:"not-published",safetyNotice:"Confirmar apresentação, função renal, tolerabilidade, contraindicações e protocolo antes de orientar uso.",monitor:["função renal","tolerabilidade gastrointestinal","uso real"]},
 {id:"acei-arb",genericName:"IECA / BRA",therapeuticClass:"Moduladores do sistema renina-angiotensina",coveredContexts:["HAS","DRC","DM2"],mechanismSummary:"Reduzem efeitos do sistema renina-angiotensina e podem atuar no controle pressórico e em contextos de proteção cardiorrenal.",sharedPurpose:"Podem ser usados para controlar a pressão e proteger coração ou rins em situações específicas.",sourceIds:["ms-pcdt-has-2025","ms-pcdt-drc-2024","anvisa-bulario-2026"],publicationLevel:"essential",doseStatus:"not-published",safetyNotice:"Não tratar a classe como uma única prescrição. Verificar princípio ativo, gestação, função renal, potássio e associações.",monitor:["pressão arterial","creatinina","potássio"]},
 {id:"sglt2",genericName:"Inibidores de SGLT2",therapeuticClass:"Antidiabéticos com efeitos cardiorrenais",coveredContexts:["DM2","DRC"],mechanismSummary:"Reduzem a reabsorção renal de glicose e possuem indicações específicas metabólicas e cardiorrenais.",sharedPurpose:"Em algumas pessoas, ajudam no controle do diabetes e na proteção dos rins ou coração.",sourceIds:["ms-pcdt-dm2-2026","ms-pcdt-drc-2024","anvisa-bulario-2026"],publicationLevel:"essential",doseStatus:"not-published",safetyNotice:"Indicação e segurança dependem de produto, TFG, estado volêmico, infecções, risco metabólico e circunstâncias de interrupção temporária.",monitor:["função renal","estado volêmico","eventos adversos","intercorrências"]},
 {id:"statin",genericName:"Estatinas",therapeuticClass:"Inibidores da HMG-CoA redutase",coveredContexts:["Dislipidemia","prevenção cardiovascular"],mechanismSummary:"Reduzem síntese hepática de colesterol e o risco cardiovascular em populações indicadas.",sharedPurpose:"Ajudam a reduzir o colesterol e o risco de eventos cardiovasculares quando indicadas.",sourceIds:["ms-pcdt-dislipidemia-2019","anvisa-bulario-2026","ms-rename-2024"],publicationLevel:"review-needed",doseStatus:"not-published",safetyNotice:"A atualização nacional de 2026 está em consulta preliminar; verificar protocolo vigente, produto, dose, interações e sintomas musculares.",monitor:["perfil lipídico","tolerabilidade","interações"]},
 {id:"antihypertensive-classes",genericName:"Classes anti-hipertensivas cobertas",therapeuticClass:"Diuréticos, bloqueadores de canal de cálcio e moduladores do SRAA",coveredContexts:["HAS"],mechanismSummary:"Classes diferentes reduzem a pressão por mecanismos distintos e são escolhidas conforme risco e comorbidades.",sharedPurpose:"Existem diferentes tipos de medicamentos para pressão; a escolha depende da situação de cada pessoa.",sourceIds:["ms-pcdt-has-2025","anvisa-bulario-2026","ms-rename-2024"],publicationLevel:"essential",doseStatus:"not-published",safetyNotice:"Não extrapolar dose ou indicação da classe. Confirmar princípio ativo, apresentação, via, função renal, eletrólitos e eventos adversos.",monitor:["pressão arterial","sintomas","função renal e eletrólitos conforme classe"]}
];
export const examKnowledge:ExamKnowledge[]=[
 {id:"blood-pressure",name:"Pressão arterial",purpose:"Rastreamento, confirmação, controle e avaliação de risco na hipertensão.",interpretationGuardrails:["Técnica e manguito adequados importam.","Uma medida isolada não confirma diagnóstico.","Sintomas e possível lesão aguda mudam a urgência."],sourceIds:["ms-pcdt-has-2025"],publicationLevel:"expanded"},
 {id:"hba1c",name:"Hemoglobina glicada",purpose:"Apoiar avaliação do controle glicêmico ao longo do tempo.",interpretationGuardrails:["Meta é individualizada.","Condições hematológicas e outros fatores podem interferir.","Resultado não substitui avaliação clínica."],sourceIds:["ms-pcdt-dm2-2026"],publicationLevel:"essential"},
 {id:"egfr",name:"Taxa de filtração glomerular estimada",purpose:"Avaliar função renal e acompanhar trajetória.",interpretationGuardrails:["DRC exige persistência ou marcador de dano.","Revisar unidade e método.","Mudança aguda exige contexto."],sourceIds:["ms-pcdt-drc-2024"],publicationLevel:"expanded"},
 {id:"uacr",name:"Relação albumina/creatinina urinária",purpose:"Identificar e quantificar albuminúria no contexto renal e metabólico.",interpretationGuardrails:["Pode exigir confirmação.","Intercorrências podem interferir.","Relacionar com TFG e contexto."],sourceIds:["ms-pcdt-drc-2024","ms-pcdt-dm2-2026"],publicationLevel:"essential"},
 {id:"lipid-profile",name:"Perfil lipídico",purpose:"Diagnóstico de dislipidemia e estratificação de risco cardiovascular.",interpretationGuardrails:["Interpretar com risco global.","Triglicerídeos podem alterar cálculos.","PCDT de 2019 permanece vigente enquanto atualização de 2026 é preliminar."],sourceIds:["ms-pcdt-dislipidemia-2019","ms-dislipidemia-cp94-2026"],publicationLevel:"review-needed"},
 {id:"bmi-waist",name:"IMC e perímetro da cintura",purpose:"Apoiar classificação antropométrica e risco cardiometabólico.",interpretationGuardrails:["IMC não mede diretamente composição corporal.","Acurácia varia entre grupos.","Evitar reduzir cuidado a peso isolado."],sourceIds:["ms-pcdt-obesidade-2024"],publicationLevel:"expanded"}
];

``

# END FILE: src/clinical/content.ts

---

# FILE: src/clinical/pharmacology/catalog.ts

``typescript
import type { PharmacologyEntry } from "./types";

/**
 * CATÁLOGO FARMACOLÓGICO AUTORAL
 *
 * Arquivo compilado com todas as classes e fármacos discutidos:
 * Biguanidas, Inibidores de SGLT2, Moduladores do SRAA (IECAs e BRAs),
 * Inibidores da HMG-CoA Redutase (Estatinas), Diuréticos, Bloqueadores dos Canais de Cálcio
 * e Analgésicos / Anti-inflamatórios Não Esteroidais.
 */
export const pharmacologyCatalog: PharmacologyEntry[] = [
  // ==========================================
  // 1. BIGUANIDAS
  // ==========================================
  {
    id: "metformina",
    genericName: "Cloridrato de Metformina",
    brandNames: ["Glifage", "Glifage XR", "Dimefor", "Glucophage"],
    therapeuticClass: "Antidiabético Oral / Biguanida",
    mechanism:
      "Ativação da AMPK (AMP-activated protein kinase) hepática, inibição da gliconeogênese mitocondrial dependente de glicerol-3-fosfato desidrogenase e aumento da sensibilidade periférica à insulina.",
    presentations: [
      "Comprimidos de liberação imediata (IR): 500 mg, 850 mg, 1000 mg",
      "Comprimidos de liberação prolongada (XR): 500 mg, 750 mg, 1000 mg",
    ],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Diabetes Mellitus Tipo 2 (Liberação Imediata - IR)",
        route: "Via Oral",
        presentation: "Comprimidos IR (500 mg, 850 mg, 1000 mg)",
        initial: "500 mg a cada 12h ou 850 mg 1x/dia, administrados junto às refeições",
        titration: "Incrementos de 500 mg a cada 1 a 2 semanas conforme tolerabilidade gastrointestinal e glicemia de jejum",
        usual: "1500 mg a 2000 mg/dia divididos em 2 ou 3 tomadas",
        interval: "A cada 8 horas ou 12 horas",
        target: "2000 mg/dia fracionados",
        maximum: "2550 mg/dia (3 tomadas de 850 mg)",
        duration: "Contínua / Longo prazo",
        renalAdjustment:
          "TFG 45-59 mL/min: dose máxima de 2000 mg/dia. TFG 30-44 mL/min: não iniciar; se em uso, reduzir dose em 50% (máx 1000 mg/dia). TFG < 30 mL/min: contraindicado.",
        hepaticAdjustment: "Evitar o uso em insuficiência hepática avançada pelo risco de comprometimento do clearance de lactato.",
        notes: "Administração junto às refeições reduz sintomas dispépticos e diarreia osmótica.",
      },
      {
        population: "Adultos",
        indication: "Diabetes Mellitus Tipo 2 (Liberação Prolongada - XR)",
        route: "Via Oral",
        presentation: "Comprimidos XR (500 mg, 750 mg, 1000 mg)",
        initial: "500 mg a 1000 mg, 1x/dia, durante o jantar",
        titration: "Aumentar em 500 mg semanalmente conforme glicemia e tolerância",
        usual: "1500 mg a 2000 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "2000 mg, 1x/dia no jantar",
        maximum: "2000 mg/dia",
        duration: "Contínua / Longo prazo",
        renalAdjustment: "Mesmos pontos de corte da forma IR; teto de 1000 mg/dia se TFG entre 30-44 mL/min.",
        hepaticAdjustment: "Contraindicado em hepatopatia descompensada.",
        notes: "Comprimidos de liberação prolongada não devem ser partidos ou mastigados.",
      },
    ],
    contraindications: [
      "TFG < 30 mL/min/1,73m²",
      "Acidose metabólica aguda ou crônica (incluindo cetoacidose diabética)",
      "Quadros de hipóxia tecidual aguda (choque séptico, cardiogênico, IAM recente, insuficiência respiratória grave)",
      "Insuficiência hepática grave",
    ],
    warnings: [
      "Risco de acidose láctica associada à metformina (MALA), rara porém com alta mortalidade",
      "Deficiência de vitamina B12 associada ao uso crônico por má absorção ileal",
      "Suspender 48h antes de exames com contraste iodado intravascular se TFG < 60 mL/min ou instabilidade clínica",
    ],
    interactions: [
      "Contrastes iodados (risco de nefropatia induzida por contraste e acúmulo da droga)",
      "Álcool (potencializa o acúmulo de lactato por inibição da gliconeogênese hepática)",
      "Cimetidina e outros inibidores de transportadores OCT2/MATE (aumentam os níveis séricos de metformina)",
    ],
    monitoring: [
      "Taxa de Filtração Glomerular e creatinina sérica basal e a cada 3-6 meses em grupos de risco",
      "Hemoglobina Glicada (HbA1c) a cada 3 meses até a meta, depois semestral",
      "Dosagem sérica de Vitamina B12 anualmente em tratamentos prolongados (> 3-5 anos)",
    ],
    sources: [
      { title: "Standards of Care in Diabetes", organization: "American Diabetes Association (ADA)" },
      { title: "Diretrizes da Sociedade Brasileira de Diabetes", organization: "SBD" },
    ],
    reviewStatus: "reviewed",
    notes: "Fármaco de primeira linha no DM2, sem ganho ponderal e com risco intrínseco quase nulo de hipoglicemia em monoterapia.",
  },

  // ==========================================
  // 2. INIBIDORES DE SGLT2 (ANTIDIABÉTICOS CARDIORRENAIS)
  // ==========================================
  {
    id: "dapagliflozina",
    genericName: "Dapagliflozina",
    brandNames: ["Forxiga"],
    therapeuticClass: "Inibidor do Cotransportador Sódio-Glicose 2 (iSGLT2)",
    mechanism:
      "Inibição seletiva do transportador SGLT2 no túbulo contorcido proximal renal, promovendo glicosúria, natriurese osmótica, restauração do feedback tubuloglomerular e vasoconstrição da arteríola aferente.",
    presentations: ["Comprimidos revestidos de 5 mg e 10 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Insuficiência Cardíaca (ICFEr/ICFEl/ICFEp) e Doença Renal Crônica (DRC)",
        route: "Via Oral",
        presentation: "Comprimido 10 mg",
        initial: "10 mg, 1x/dia, pela manhã",
        titration: "Dose fixa; não necessita de escalonamento",
        usual: "10 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "10 mg, 1x/dia",
        maximum: "10 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Pode ser iniciada se TFG ≥ 20 ou 25 mL/min/1,73m² e mantida até início de diálise/transplante.",
        hepaticAdjustment: "Não requer ajuste em insuficiência leve a moderada. Avaliar risco-benefício em Child-Pugh C.",
        notes: "O benefício cardiorrenal independe da presença de Diabetes Mellitus.",
      },
      {
        population: "Adultos",
        indication: "Diabetes Mellitus Tipo 2",
        route: "Via Oral",
        presentation: "Comprimidos 5 mg e 10 mg",
        initial: "5 mg a 10 mg, 1x/dia",
        titration: "Pode titular de 5 mg para 10 mg após 2-4 semanas se objetivo glicêmico exigir",
        usual: "10 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "10 mg, 1x/dia",
        maximum: "10 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Perde eficácia redutora de glicose com TFG < 45 mL/min, mas os benefícios cardiovasculares persistem.",
        hepaticAdjustment: "Sem ajuste para insuficiência leve/moderada.",
        notes: "Reduz pressão arterial sistólica em 2 a 4 mmHg e peso corporal em 2 a 3 kg.",
      },
    ],
    contraindications: ["Hipersensibilidade à droga", "Pacientes em hemodiálise ou diálise peritoneal"],
    warnings: [
      "Risco de cetoacidose diabética euglicêmica (suspender temporariamente antes de cirurgias de grande porte)",
      "Infecções micóticas genitais recorrentes (candidíase vulvovaginal e balanite)",
      "Queda funcional inicial reversível da TFG de até 20-30% nas primeiras semanas de tratamento",
      "Fasciíte necrosante do períneo (Gangrena de Fournier), rara porém grave",
    ],
    interactions: [
      "Diuréticos de alça e tiazídicos (risco potencializado de depleção volêmica e hipotensão ortostática)",
      "Insulina e sulfonilureias (aumento do risco de hipoglicemia; considerar redução profilática da dose destes)",
    ],
    monitoring: [
      "Função renal e eletrólitos basais e após 2 a 4 semanas do início",
      "Sinais flogísticos em região perineal e genital",
      "Sintomas de depleção de volume (tontura, hipotensão postural)",
    ],
    sources: [
      { title: "DAPA-HF / DAPA-CKD Trials", organization: "New England Journal of Medicine (NEJM)" },
      { title: "Diretrizes de Insuficiência Cardíaca", organization: "Sociedade Brasileira de Cardiologia (SBC)" },
    ],
    reviewStatus: "reviewed",
    notes: "Um dos 4 pilares farmacológicos com redução comprovada de mortalidade na ICFEr.",
  },
  {
    id: "empagliflozina",
    genericName: "Empagliflozina",
    brandNames: ["Jardiance"],
    therapeuticClass: "Inibidor do Cotransportador Sódio-Glicose 2 (iSGLT2)",
    mechanism:
      "Inibição potente e competitiva do transportador SGLT2 na borda em escova do túbulo proximal, com excreção urinária de glicose e sódio, aliviando hiperfiltração glomerular e sobrecarga cardíaca.",
    presentations: ["Comprimidos revestidos de 10 mg e 25 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Insuficiência Cardíaca (ICFEr / ICFEp) e Doença Renal Crônica",
        route: "Via Oral",
        presentation: "Comprimido 10 mg",
        initial: "10 mg, 1x/dia, pela manhã",
        titration: "Sem necessidade de escalonamento",
        usual: "10 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "10 mg, 1x/dia",
        maximum: "10 mg/dia para indicações cardiorrenais",
        duration: "Contínua",
        renalAdjustment: "Pode ser iniciada em pacientes com TFG ≥ 20 mL/min/1,73m².",
        hepaticAdjustment: "Sem ajuste específico necessário.",
        notes: "A dose de 25 mg não demonstrou benefício incremental de mortalidade sobre a de 10 mg em ensaios de IC.",
      },
      {
        population: "Adultos",
        indication: "Diabetes Mellitus Tipo 2",
        route: "Via Oral",
        presentation: "Comprimidos 10 mg e 25 mg",
        initial: "10 mg, 1x/dia",
        titration: "Pode ser elevada para 25 mg após 4 semanas para intensificação do controle glicêmico",
        usual: "10 mg a 25 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "25 mg, 1x/dia se tolerada e indicada para HbA1c",
        maximum: "25 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Glicosúria dependente de TFG; suspender como hipoglicemiante se TFG persistentemente < 30.",
        hepaticAdjustment: "Não recomendado em insuficiência hepática fulminante.",
        notes: "Demonstrou pioneiramente redução significativa de mortalidade cardiovascular no estudo EMPA-REG OUTCOME.",
      },
    ],
    contraindications: ["Hipersensibilidade ao fármaco", "Doença renal em estágio terminal / Diálise"],
    warnings: [
      "Cetoacidose euglicêmica",
      "Infecções do trato genitourinário e sepse urinária",
      "Hipotensão sintomática em pacientes hipovolêmicos ou idosos frágeis",
    ],
    interactions: [
      "Diuréticos (efeito sinérgico de desidratação e depleção volêmica)",
      "Hipoglicemiantes secretagogos de insulina (risco aumentado de hipoglicemia)",
    ],
    monitoring: [
      "Glicemia, HbA1c, PA e peso corporal",
      "Creatinina sérica e TFG no início e durante o seguimento",
    ],
    sources: [
      { title: "EMPEROR-Reduced and EMPEROR-Preserved Trials", organization: "NEJM" },
      { title: "KDIGO Clinical Practice Guideline for Diabetes Management in CKD", organization: "KDIGO" },
    ],
    reviewStatus: "reviewed",
    notes: "Primeiro iSGLT2 a demonstrar benefício conclusivo de sobrevida em insuficiência cardíaca com fração de ejeção preservada (ICFEp).",
  },

  // ==========================================
  // 3. MODULADORES DO SRAA: IECAs
  // ==========================================
  {
    id: "enalapril",
    genericName: "Maleato de Enalapril",
    brandNames: ["Renitec", "Vasopril", "Eupressin"],
    therapeuticClass: "Anti-hipertensivo / Inibidor da Enzima Conversora de Angiotensina (IECA)",
    mechanism:
      "Pró-fármaco hidrolisado a enalaprilat; inibe competitivamente a ECA, suprimindo a formação de angiotensina II, reduzindo a secreção de aldosterona e retardando a degradação da bradicinina.",
    presentations: ["Comprimidos de 5 mg, 10 mg e 20 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial Sistêmica",
        route: "Via Oral",
        presentation: "Comprimidos 5 mg, 10 mg, 20 mg",
        initial: "5 mg a 10 mg, 1x/dia (ou 2,5 mg em idosos/hipovolêmicos)",
        titration: "Dobrar ou ajustar a dose a cada 1 a 2 semanas conforme alvos de PA",
        usual: "10 mg a 20 mg/dia, tomados em 1 ou fracionados em 2 vezes",
        interval: "A cada 12 horas ou 24 horas",
        target: "20 mg a 40 mg/dia",
        maximum: "40 mg/dia",
        duration: "Contínua",
        renalAdjustment: "TFG 30-80: 5 mg inicial (máx 40 mg). TFG < 30: 2,5 mg inicial (máx 20 mg). Hemodiálise: 2,5 mg nos dias de diálise.",
        hepaticAdjustment: "Conversão metabólica a enalaprilat pode estar lentificada; sem necessidade de ajuste posológico primário.",
        notes: "O fracionamento em 12/12h previne escape pressórico no final do período de dose.",
      },
      {
        population: "Adultos",
        indication: "Insuficiência Cardíaca com Fração de Ejeção Reduzida (ICFEr)",
        route: "Via Oral",
        presentation: "Comprimidos 2,5 mg (partido), 5 mg, 10 mg",
        initial: "2,5 mg, a cada 12 horas",
        titration: "Dobrar a dose a cada 2 a 4 semanas conforme PA, função renal e calemia",
        usual: "10 mg, a cada 12 horas",
        interval: "A cada 12 horas",
        target: "10 mg a 20 mg, a cada 12 horas (dose de ensaio clínico CONSENSUS/SOLVD)",
        maximum: "40 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Iniciar com 1,25 mg 12/12h se TFG < 30 mL/min.",
        hepaticAdjustment: "Sem restrição específica.",
        notes: "Titular rigorosamente até a dose alvo dos estudos para redução de morbimortalidade.",
      },
    ],
    contraindications: [
      "Histórico de angioedema prévio associado a IECA",
      "Angioedema hereditário ou idiopático",
      "Uso concomitante com Sacubitril/Valsartana (exige washout obrigatório de 36 horas)",
      "Estenose bilateral da artéria renal ou em rim único",
      "Gestação (teratogênico em todos os trimestres)",
    ],
    warnings: [
      "Tosse seca persistente mediada por bradicinina e substância P em 5 a 20% dos pacientes",
      "Hipercalemia, particularmente quando associado a suplementos de potássio ou poupadores de K+",
      "Hipotensão severa de primeira dose em pacientes previamente depletados de sódio/volume",
    ],
    interactions: [
      "Espironolactona e suplementos de potássio (risco severo de hipercalemia)",
      "AINEs (antagonizam o efeito vasodilatador e aumentam risco de injúria renal aguda)",
      "Lítio (reduz a depuração renal do lítio, elevando risco de intoxicação)",
    ],
    monitoring: [
      "Creatinina sérica e potássio antes do início e 1-2 semanas após cada incremento de dose",
      "Pressão arterial postural",
    ],
    sources: [
      { title: "SOLVD and CONSENSUS Trials", organization: "NEJM" },
      { title: "Diretrizes Brasileiras de Hipertensão Arterial", organization: "SBC / SBH" },
    ],
    reviewStatus: "reviewed",
    notes: "Elevação da creatinina de até 30% em relação ao basal após início é reflexo hemodinâmico esperado e aceitável.",
  },
  {
    id: "captopril",
    genericName: "Captopril",
    brandNames: ["Capoten"],
    therapeuticClass: "Anti-hipertensivo / Inibidor da ECA",
    mechanism: "Inibição competitiva da enzima conversora de angiotensina I em angiotensina II. Possui grupo sulfidrila e início de ação rápido com meia-vida curta.",
    presentations: ["Comprimidos de 12,5 mg, 25 mg e 50 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial Sistêmica",
        route: "Via Oral",
        presentation: "Comprimidos 25 mg e 50 mg",
        initial: "12,5 mg a 25 mg, 2 a 3 vezes ao dia (1h antes das refeições)",
        titration: "Aumentar em intervalos de 1 a 2 semanas conforme resposta pressórica",
        usual: "25 mg a 50 mg, a cada 8 ou 12 horas",
        interval: "A cada 8 horas ou 12 horas",
        target: "50 mg, a cada 8 horas",
        maximum: "150 mg/dia (excepcionalmente 450 mg/dia em hipertensão refratária grave)",
        duration: "Contínua",
        renalAdjustment: "Reduzir dose ou ampliar intervalo se TFG < 50 mL/min.",
        hepaticAdjustment: "Sem restrição direta, metabolização hepática parcial.",
        notes: "Alimentos reduzem a biodisponibilidade em 30 a 40%; administrar 1 hora antes das refeições.",
      },
    ],
    contraindications: ["Mesmas contraindicações de classe dos IECAs (angioedema, estenose bilateral de artéria renal, gestação)."],
    warnings: ["Maior risco de disgeusia (perda do paladar) e rash cutâneo devido ao radical sulfidrila."],
    interactions: ["AINEs, sais de potássio, imunossupressores (risco de neutropenia)."],
    monitoring: ["PA, hemograma periódico em pacientes com colagenoses/insuficiência renal, função renal e eletrólitos."],
    sources: [{ title: "Goodman & Gilman: As Bases Farmacológicas da Terapêutica", organization: "McGraw-Hill" }],
    reviewStatus: "reviewed",
    notes: "Uso predominantemente histórico ou hospitalar em descompensações agudas devido à posologia incômoda de três tomadas diárias.",
  },
  {
    id: "ramipril",
    genericName: "Ramipril",
    brandNames: ["Triatec", "Altace"],
    therapeuticClass: "Anti-hipertensivo / Inibidor da ECA",
    mechanism: "Pró-fármaco lipofílico convertido em ramiprilat, inibidor potente e de longa duração da ECA tecidual e plasmática.",
    presentations: ["Cápsulas/Comprimidos de 2,5 mg, 5 mg e 10 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Prevenção Cardiovascular Secundária / Alto Risco (Ensaio HOPE)",
        route: "Via Oral",
        presentation: "Comprimidos 2,5 mg, 5 mg, 10 mg",
        initial: "2,5 mg, 1x/dia, por 1 semana",
        titration: "Aumentar para 5 mg 1x/dia por 3 semanas, seguido de escalonamento para dose alvo",
        usual: "10 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "10 mg, 1x/dia",
        maximum: "10 mg/dia",
        duration: "Contínua",
        renalAdjustment: "TFG < 30 mL/min: dose máxima de 5 mg/dia.",
        hepaticAdjustment: "Iniciar com dose de 1,25 mg em insuficiência hepática.",
        notes: "Fármaco padrão de referência para redução de IAM, AVC e morte cardiovascular em pacientes de alto risco.",
      },
    ],
    contraindications: ["Contraindicações universais de IECA."],
    warnings: ["Hipotensão, hipercalemia, tosse crônica."],
    interactions: ["Diuréticos espoliadores/poupadores de potássio, lítio, aliscireno."],
    monitoring: ["PA, ureia, creatinina, potássio sérico."],
    sources: [{ title: "HOPE Study Investigators", organization: "NEJM" }],
    reviewStatus: "reviewed",
    notes: "Excelente penetração tecidual e estabilidade de bloqueio do SRAA por 24 horas.",
  },

  // ==========================================
  // 4. MODULADORES DO SRAA: BRAS (ARA-II)
  // ==========================================
  {
    id: "losartana",
    genericName: "Losartana Potássica",
    brandNames: ["Cozaar", "Aradois", "Corus", "Losatec"],
    therapeuticClass: "Anti-hipertensivo / Bloqueador do Receptor de Angiotensina II (BRA)",
    mechanism:
      "Antagonismo competitivo e seletivo dos receptores AT1 da angiotensina II, bloqueando vasoconstrição e secreção de aldosterona sem inibir a degradação de bradicinina.",
    presentations: ["Comprimidos revestidos de 25 mg, 50 mg e 100 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial e Nefroproteção no DM2",
        route: "Via Oral",
        presentation: "Comprimidos 50 mg e 100 mg",
        initial: "50 mg, 1x/dia (25 mg se idoso ou depleção de volume)",
        titration: "Aumentar para 100 mg em tomada única ou fracionado a cada 12h após 3-4 semanas se necessário",
        usual: "50 mg a 100 mg, 1x/dia",
        interval: "A cada 24 horas (ou 12/12h)",
        target: "100 mg/dia",
        maximum: "100 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Sem necessidade de redução inicial de dose em DRC sem depleção de volume.",
        hepaticAdjustment: "Iniciar com 25 mg 1x/dia em histórico de cirrose ou disfunção hepática.",
        notes: "Possui discreto efeito uricosúrico intrínseco pela inibição do transportador URAT1 renal.",
      },
      {
        population: "Adultos",
        indication: "Insuficiência Cardíaca com Fração de Ejeção Reduzida (ICFEr)",
        route: "Via Oral",
        presentation: "Comprimidos 50 mg e 100 mg",
        initial: "25 mg a 50 mg, 1x/dia",
        titration: "Dobrar a dose a cada 2 a 4 semanas visando o teto com validação de sobrevida",
        usual: "100 mg a 150 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "150 mg, 1x/dia (Dose alvo do estudo HEAAL)",
        maximum: "150 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Monitorar calemia e creatinina.",
        hepaticAdjustment: "Ajuste na disfunção hepática.",
        notes: "Doses de 50 mg não são consideradas protetoras plenas para mortalidade em ICFEr.",
      },
    ],
    contraindications: [
      "Hipersensibilidade à substância",
      "Uso combinado com Aliscireno em diabéticos ou pacientes com disfunção renal moderada/grave",
      "Gestação e lactação",
      "Estenose bilateral grave de artéria renal",
    ],
    warnings: [
      "Hipercalemia, principalmente em pacientes nefropatas ou sob terapia com espironolactona",
      "Hipotensão sintomática em indivíduos com hipovolemia prévia",
      "Incidência de tosse seca é drasticamente inferior à dos IECAs (< 1%)",
    ],
    interactions: [
      "Inibidores da CYP2C9 e CYP3A4 podem reduzir a formação do metabólito ativo EXP-3174",
      "AINEs (redução do efeito anti-hipertensivo e nefrotoxicidade somada)",
      "Poupadores de potássio e trimetoprima-sulfametoxazol (potencializam hipercalemia)",
    ],
    monitoring: ["Creatinina sérica, TFG e potássio sérico basal e 15 dias após ajuste.", "PA ambulatorial."],
    sources: [
      { title: "RENAAL Trial", organization: "NEJM" },
      { title: "HEAAL Study", organization: "The Lancet" },
    ],
    reviewStatus: "reviewed",
    notes: "Alternativa padrão mandatória aos IECAs quando há tosse seca intolerável ou história de angioedema bradicinina-dependente.",
  },
  {
    id: "valsartana",
    genericName: "Valsartana",
    brandNames: ["Diovan", "Tareg"],
    therapeuticClass: "Anti-hipertensivo / BRA",
    mechanism: "Bloqueio potente e altamente seletivo dos receptores AT1 sem afinidade residual significativa para receptores AT2.",
    presentations: ["Comprimidos revestidos de 80 mg, 160 mg e 320 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Insuficiência Cardíaca (ICFEr)",
        route: "Via Oral",
        presentation: "Comprimidos 80 mg e 160 mg",
        initial: "40 mg, a cada 12 horas",
        titration: "Dobrar a cada 2 a 4 semanas até alcançar a tolerância hemodinâmica máxima",
        usual: "80 mg a 160 mg, a cada 12 horas",
        interval: "A cada 12 horas",
        target: "160 mg, a cada 12 horas (320 mg/dia total)",
        maximum: "320 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Sem necessidade de redução na DRC sem estenose de artéria renal.",
        hepaticAdjustment: "Não exceder 80 mg/dia em disfunção hepática leve a moderada.",
        notes: "Dose do estudo Val-HeFT para melhora de sobrevida e remodelamento ventricular.",
      },
    ],
    contraindications: ["Gestação, associação com aliscireno em DM2, cirrose biliar."],
    warnings: ["Risco de hipotensão severa na primeira dose se associada a altas doses de furosemida."],
    interactions: ["Lítio, suplementos de potássio, diuréticos poupadores de K+."],
    monitoring: ["Pressão arterial, potássio sérico, ureia e creatinina."],
    sources: [{ title: "Val-HeFT Trial", organization: "NEJM" }],
    reviewStatus: "reviewed",
    notes: "Componente essencial da combinação com sacubitril (ARNI) para tratamento de ponta na ICFEr.",
  },
  {
    id: "candesartana",
    genericName: "Candesartana Cilexetila",
    brandNames: ["Blopress", "Atacand"],
    therapeuticClass: "Anti-hipertensivo / BRA",
    mechanism: "Pró-fármaco hidrolisado durante a absorção gastrointestinal a candesartana, que exibe dissociação lenta e ligação insuperável aos receptores AT1.",
    presentations: ["Comprimidos de 8 mg, 16 mg e 32 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "ICFEr (Programa CHARM) e Hipertensão",
        route: "Via Oral",
        presentation: "Comprimidos 8 mg, 16 mg, 32 mg",
        initial: "4 mg a 8 mg, 1x/dia",
        titration: "Dobrar em intervalos de 2 semanas conforme tolerado",
        usual: "16 mg a 32 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "32 mg, 1x/dia",
        maximum: "32 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Sem ajuste específico, titular sob vigilância de TFG e K+.",
        hepaticAdjustment: "Considerar dose inicial de 4 mg em doença hepática moderada.",
        notes: "Maior afinidade tecidual e ligação mais duradoura ao receptor AT1 entre os BRAs.",
      },
    ],
    contraindications: ["Gravidez, hipersensibilidade, colestase grave."],
    warnings: ["Hipotensão sintomática, hipercalemia."],
    interactions: ["Medicamentos que elevam o potássio sérico, AINEs."],
    monitoring: ["Calemia, função renal seriada e controle pressórico."],
    sources: [{ title: "CHARM Program", organization: "The Lancet" }],
    reviewStatus: "reviewed",
    notes: "Demonstrou expressiva eficácia na redução de morte cardiovascular e hospitalizações por IC.",
  },

  // ==========================================
  // 5. INIBIDORES DA HMG-CoA REDUTASE (ESTATINAS)
  // ==========================================
  {
    id: "atorvastatina",
    genericName: "Atorvastatina Cálcica",
    brandNames: ["Lipitor", "Citalor", "Amplictil"],
    therapeuticClass: "Hipolipemiante / Inibidor da HMG-CoA Redutase",
    mechanism:
      "Inibição competitiva da hidroximetilglutaril-coenzima A (HMG-CoA) redutase. O esgotamento do colesterol intracelular estimula SREBP-2 e up-regulation de receptores de LDL na membrana do hepatócito, reduzindo LDL-C sérico e triglicerídeos.",
    presentations: ["Comprimidos revestidos de 10 mg, 20 mg, 40 mg e 80 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Dislipidemia / Prevenção Cardiovascular Primária e Secundária",
        route: "Via Oral",
        presentation: "Comprimidos 10 mg, 20 mg, 40 mg, 80 mg",
        initial:
          "Moderada intensidade: 10 mg a 20 mg, 1x/dia. Alta intensidade (SCA, alto risco cardiovascular): 40 mg a 80 mg, 1x/dia.",
        titration: "Ajustar dose após 4 a 12 semanas conforme perfil lipídico e metas individualizadas",
        usual: "20 mg a 80 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "Redução de ≥ 50% no LDL-C basal (esquema de alta intensidade)",
        maximum: "80 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Não requer ajuste na insuficiência renal crônica (clearance predominantemente biliar/fecal).",
        hepaticAdjustment: "Contraindicada em doença hepática ativa ou elevações persistentes e inexplicadas de transaminases.",
        notes: "Meia-vida de eliminação de 14h com metabólitos ativos que mantêm inibição por 20 a 30h. Pode ser ingerida a qualquer hora do dia.",
      },
    ],
    contraindications: [
      "Doença hepática ativa ou elevações inexplicadas das transaminases (> 3x LSN)",
      "Gravidez e amamentação (categoria X)",
      "Uso concomitante com inibidores potentes do CYP3A4 em altas doses",
    ],
    warnings: [
      "Miopatia tóxica e risco de rabdomiólise (atenção a mialgias inexplicadas, fraqueza proximal e urina escura)",
      "Discreto aumento dose-dependente na incidência de novo diagnóstico de DM2",
      "Elevação transitória de transaminases hepáticas",
    ],
    interactions: [
      "Inibidores da CYP3A4 (claritromicina, cetoconazol, ritonavir, suco de toranja/grapefruit) elevam toxicidade",
      "Genfibrozila (aumento severo de risco de rabdomiólise; preferir fenofibrato se associação for imperativa)",
      "Ciclosporina (aumenta expressivamente a área sob a curva da atorvastatina)",
    ],
    monitoring: [
      "Painel lipídico (CT, LDL-C, HDL-C, TG) após 4-12 semanas de início ou titulação",
      "ALT/AST basais antes do início do tratamento",
      "Creatinoquinase (CK) apenas se sintomas de mialgia, fadiga muscular ou fraqueza muscular referida",
    ],
    sources: [
      { title: "ACC/AHA Guideline on the Management of Blood Cholesterol", organization: "Circulation" },
      { title: "Atualização da Diretriz Brasileira de Dislipidemias", organization: "SBC" },
    ],
    reviewStatus: "reviewed",
    notes: "Estatina de alta intensidade amplamente validada pós-Síndrome Coronariana Aguda (estudo PROVE-IT TIMI 22).",
  },
  {
    id: "rosuvastatina",
    genericName: "Rosuvastatina Cálcica",
    brandNames: ["Crestor", "Vivacor", "Rosucol"],
    therapeuticClass: "Hipolipemiante / Inibidor da HMG-CoA Redutase",
    mechanism: "Inibição seletiva e competitiva da HMG-CoA redutase. Apresenta caráter hidrofílico, com baixa captação em tecidos extra-hepáticos.",
    presentations: ["Comprimidos revestidos de 5 mg, 10 mg, 20 mg e 40 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Dislipidemia de Alto Risco / Prevenção Aterotrombótica",
        route: "Via Oral",
        presentation: "Comprimidos 5 mg, 10 mg, 20 mg, 40 mg",
        initial: "Moderada intensidade: 5 mg a 10 mg, 1x/dia. Alta intensidade: 20 mg a 40 mg, 1x/dia.",
        titration: "Avaliar resposta em 4 a 8 semanas antes de titular",
        usual: "10 mg a 20 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "Redução de ≥ 50% de LDL-C (com 20 mg a 40 mg/dia)",
        maximum: "40 mg/dia (iniciar com 5 mg em descendentes asiáticos)",
        duration: "Contínua",
        renalAdjustment: "TFG < 30 mL/min: iniciar com 5 mg/dia; dose máxima restrita a 10 mg/dia.",
        hepaticAdjustment: "Contraindicada em hepatopatia ativa.",
        notes: "Metabolismo independente do CYP3A4 (metabolizada fracamente pelo CYP2C9), menor propensão a interações.",
      },
    ],
    contraindications: ["Hepatopatia ativa, gravidez, miopatia prévia, insuficiência renal severa (para dose de 40 mg)."],
    warnings: ["Proteinúria tubular transitória em doses muito altas (40 mg), rabdomiólise."],
    interactions: ["Antiácidos à base de alumínio/magnésio diminuem absorção, ciclosporina eleva níveis séricos."],
    monitoring: ["Perfil lipídico de seguimento, enzimas hepáticas, TFG."],
    sources: [{ title: "JUPITER Trial", organization: "NEJM" }],
    reviewStatus: "reviewed",
    notes: "Apresenta a maior potência miligrama a miligrama na redução de LDL-C da classe das estatinas.",
  },
  {
    id: "sinvastatina",
    genericName: "Sinvastatina",
    brandNames: ["Zocor", "Sinvasmax", "Vaslip"],
    therapeuticClass: "Hipolipemiante / Inibidor da HMG-CoA Redutase",
    mechanism: "Pró-fármaco lactônico lipofílico inativo, hidrolisado in vivo para a forma beta-hidroxiácida inibidora da HMG-CoA redutase.",
    presentations: ["Comprimidos revestidos de 10 mg, 20 mg e 40 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Dislipidemia e Prevenção Cardiovascular Primária/Secundária",
        route: "Via Oral",
        presentation: "Comprimidos 10 mg, 20 mg, 40 mg",
        initial: "20 mg a 40 mg, 1x/dia, administrados OBRIGATORIAMENTE à noite",
        titration: "Ajustar em intervalos não inferiores a 4 semanas",
        usual: "20 mg a 40 mg à noite",
        interval: "A cada 24 horas (noturno)",
        target: "Redução de 30% a 45% do LDL-C (intensidade moderada)",
        maximum: "40 mg/dia (a dose de 80 mg/dia é formalmente desaconselhada pelo FDA/Anvisa)",
        duration: "Contínua",
        renalAdjustment: "TFG < 30 mL/min: iniciar com 10 mg/dia e titular cautelosamente.",
        hepaticAdjustment: "Contraindicada na hepatopatia aguda.",
        notes: "Meia-vida ultracurta (2 a 3h); pico de síntese do colesterol ocorre de madrugada, exigindo administração noturna.",
      },
    ],
    contraindications: ["Gravidez, amamentação, uso concomitante com antifúngicos azólicos, macrolídeos e genfibrozila."],
    warnings: ["Risco elevado de rabdomiólise se utilizada em doses elevadas (80 mg) ou associada a inibidores de CYP3A4."],
    interactions: ["Amiodarona, anlodipino e verapamil elevam os níveis séricos (limitar dose de sinvastatina a 20 mg se em uso conjunto)."],
    monitoring: ["Lipidograma basal e pós-tratamento, transaminases."],
    sources: [{ title: "Scandinavian Simvastatin Survival Study (4S)", organization: "The Lancet" }],
    reviewStatus: "reviewed",
    notes: "Fármaco histórico da classe, amplamente disponível na atenção primária básica.",
  },

  // ==========================================
  // 6. DIURÉTICOS (TIAZÍDICOS, DE ALÇA E ARM)
  // ==========================================
  {
    id: "hidroclorotiazida",
    genericName: "Hidroclorotiazida",
    brandNames: ["Clorana", "Drenol"],
    therapeuticClass: "Diurético Tiazídico / Anti-hipertensivo",
    mechanism: "Inibição do cotransportador de sódio e cloro (NCC / Na+/Cl-) no túbulo contorcido distal, promovendo natriurese moderada e vasodilatação a longo prazo.",
    presentations: ["Comprimidos de 25 mg e 50 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial Sistêmica",
        route: "Via Oral",
        presentation: "Comprimidos 25 mg",
        initial: "12,5 mg a 25 mg, 1x/dia, pela manhã",
        titration: "Manter dose entre 12,5 mg e 25 mg. Doses superiores não aumentam controle pressórico",
        usual: "12,5 mg a 25 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "25 mg/dia",
        maximum: "50 mg/dia (não recomendada em monoterapia)",
        duration: "Contínua",
        renalAdjustment: "Perde eficácia natriurética relevante quando a TFG cai abaixo de 30 mL/min.",
        hepaticAdjustment: "Monitorar risco de encefalopatia por distúrbios hidroeletrolíticos.",
        notes: "Curva dose-resposta plana para PA acima de 25 mg, mas ascendente para espoliação de potássio.",
      },
    ],
    contraindications: ["Anúria, hipersensibilidade a derivados de sulfonamidas, hipocalemia grave refratária."],
    warnings: ["Hipocalemia, hiponatremia, hipomagnesemia, hiperuricemia (pode precipitar crises de gota) e hiperglicemia."],
    interactions: ["Lítio (aumenta toxicidade do lítio por redução de excreção), AINEs (reduzem efeito diurético)."],
    monitoring: ["Sódio, potássio, ácido úrico e glicemia de jejum após 2 a 4 semanas de início."],
    sources: [{ title: "ALLHAT Officers and Coordinators", organization: "JAMA" }],
    reviewStatus: "reviewed",
    notes: "Frequentemente combinada a doses fixas com IECAs ou BRAs para sinergismo farmacodinâmico e neutralização da retenção de K+.",
  },
  {
    id: "clortalidona",
    genericName: "Clortalidona",
    brandNames: ["Higroton"],
    therapeuticClass: "Diurético Tiazida-Like / Anti-hipertensivo",
    mechanism: "Inibição do cotransportador Na+/Cl- distal com meia-vida biológica de 40 a 60 horas e inibição prolongada da anidrase carbônica eritrocitária.",
    presentations: ["Comprimidos de 12,5 mg, 25 mg e 50 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial Sistêmica",
        route: "Via Oral",
        presentation: "Comprimidos 12,5 mg e 25 mg",
        initial: "12,5 mg, 1x/dia, pela manhã",
        titration: "Pode ser aumentada para 25 mg/dia após 4 semanas",
        usual: "12,5 mg a 25 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "12,5 mg a 25 mg/dia",
        maximum: "50 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Eficácia atenuada com TFG < 30 mL/min.",
        hepaticAdjustment: "Cautela com encefalopatia hepática.",
        notes: "Mais potente por miligrama e com proteção cardiovascular mais documentada em ensaios que a HCTZ.",
      },
    ],
    contraindications: ["Insuficiência renal anúrica, gota articular aguda descompensada."],
    warnings: ["Maior propensão a hipocalemia sintomática e hiponatremia em comparação à hidroclorotiazida."],
    interactions: ["Digitálicos (aumento da arritmogênese se houver hipocalemia associada)."],
    monitoring: ["Eletrólitos séricos (sódio e potássio) seriados."],
    sources: [{ title: "SHEP and ALLHAT Studies", organization: "JAMA" }],
    reviewStatus: "reviewed",
    notes: "Tiazídico preferencial nas diretrizes norte-americanas (ACC/AHA) pela estabilidade de controle ao longo das 24h.",
  },
  {
    id: "indapamida",
    genericName: "Indapamida",
    brandNames: ["Natrilix", "Natrilix SR"],
    therapeuticClass: "Diurético Tiazida-Like / Vasodilatador",
    mechanism: "Inibição da reabsorção tubular de sódio no néfron distal somada a um efeito vasodilatador vascular direto por modulação do influxo de cálcio.",
    presentations: ["Comprimidos de liberação imediata: 2,5 mg", "Comprimidos de liberação prolongada (SR): 1,5 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial (Especialmente no Idoso)",
        route: "Via Oral",
        presentation: "Comprimido SR 1,5 mg",
        initial: "1,5 mg (SR), 1x/dia, pela manhã",
        titration: "Dose fixa; formulação SR dispensa titulação",
        usual: "1,5 mg/dia",
        interval: "A cada 24 horas",
        target: "1,5 mg/dia",
        maximum: "2,5 mg/dia (IR) ou 1,5 mg/dia (SR)",
        duration: "Contínua",
        renalAdjustment: "Pouco efetiva se TFG < 30 mL/min.",
        hepaticAdjustment: "Sem necessidade de titulação em graus leves.",
        notes: "Perfil neutro sobre lipídios plasmáticos e resistência à insulina.",
      },
    ],
    contraindications: ["Hipersensibilidade a sulfamidas, encefalopatia hepática grave."],
    warnings: ["Hipocalemia discreta, menor incidência de alterações metabólicas."],
    interactions: ["Lítio, antiarrítmicos predisponentes a Torsades de Pointes."],
    monitoring: ["Pressão arterial, potássio sérico."],
    sources: [{ title: "HYVET Trial", organization: "NEJM" }],
    reviewStatus: "reviewed",
    notes: "Fármaco que demonstrou redução consistente de AVC e mortalidade em hipertensos muito idosos (> 80 anos).",
  },
  {
    id: "furosemida",
    genericName: "Furosemida",
    brandNames: ["Lasix"],
    therapeuticClass: "Diurético de Alça",
    mechanism: "Inibição potente do cotransportador Na+/K+/2Cl- na porção ascendente espessa da alça de Henle, bloqueando a capacidade de concentração medular.",
    presentations: ["Comprimidos de 40 mg", "Ampolas de 20 mg/2 mL"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Congestão e Sobrecarga Volêmica na Insuficiência Cardíaca e DRC",
        route: "Via Oral / Via Intravenosa",
        presentation: "Comprimidos 40 mg / Ampolas 20 mg/2 mL",
        initial: "Ambulatorial: 20 mg a 40 mg, 1x/dia pela manhã. Agudo (IV): 20 mg a 40 mg em bolus lento.",
        titration: "Dobrar a dose oral ou IV a cada 2 a 4 horas no ambiente agudo até obter taxa diurética alvo",
        usual: "40 mg a 80 mg/dia fracionados em 1 ou 2 tomadas",
        interval: "A cada 12 horas ou 24 horas",
        target: "Manutenção do estado euvolêmico com a menor dose diária possível",
        maximum: "Até 240 mg a 600 mg/dia em síndromes nefróticas graves ou DRC terminal sob estrita vigilância",
        duration: "Conforme persistência da sobrecarga volêmica",
        renalAdjustment: "Doses significativamente mais altas são necessárias em pacientes com baixa TFG para alcançar a alça intraluminal.",
        hepaticAdjustment: "Titular cautelosamente em cirróticos pelo risco de síndrome hepatorrenal.",
        notes: "Biodisponibilidade oral média de ~50% (40 mg VO equivalem a cerca de 20 mg IV).",
      },
    ],
    contraindications: ["Anúria irresponsiva a teste de dose, coma hepático, hipovolemia ou desidratação severa."],
    warnings: [
      "Ototoxicidade (especialmente em infusões IV rápidas ou combinada a aminoglicosídeos)",
      "Depleção hidroeletrolítica maciça: hipocalemia, hipomagnesemia, hiponatremia, alcalose metabólica hipoclorêmica",
    ],
    interactions: ["Aminoglicosídeos (ototoxicidade sinérgica), anti-inflamatórios (reduzem resposta natriurética)."],
    monitoring: ["Peso diário, balanço hídrico, função renal, sódio, potássio, magnésio e cloro séricos."],
    sources: [{ title: "DOSE Trial", organization: "NEJM" }],
    reviewStatus: "reviewed",
    notes: "O objetivo na insuficiência cardíaca é o alívio sintomático de congestão pulmonar e periférica; não reduz mortalidade por si só.",
  },
  {
    id: "espironolactona",
    genericName: "Espironolactona",
    brandNames: ["Aldactone"],
    therapeuticClass: "Antagonista do Receptor de Mineralocorticoide (ARM) / Poupador de Potássio",
    mechanism: "Antagonismo competitivo específico da aldosterona nos receptores mineralocorticoides dos túbulos coletores renais, promovendo espoliação de sódio e retenção de potássio e prótons.",
    presentations: ["Comprimidos de 25 mg, 50 mg e 100 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Insuficiência Cardíaca com Fração de Ejeção Reduzida (ICFEr)",
        route: "Via Oral",
        presentation: "Comprimidos 25 mg",
        initial: "12,5 mg a 25 mg, 1x/dia",
        titration: "Aumentar para 50 mg 1x/dia após 4 a 8 semanas se potássio sérico < 5,0 mEq/L e função renal estável",
        usual: "25 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "50 mg, 1x/dia",
        maximum: "50 mg/dia para ICFEr",
        duration: "Contínua",
        renalAdjustment: "Não iniciar se TFG < 30 mL/min/1,73m² ou creatinina > 2,5 mg/dL (homens) / > 2,0 mg/dL (mulheres).",
        hepaticAdjustment: "Sem restrição direta; amplamente usada na ascite cirrótica.",
        notes: "Reduz morbimortalidade e remodelamento fibrótico cardíaco comprovado no estudo RALES.",
      },
      {
        population: "Adultos",
        indication: "Hipertensão Resistente (4º fármaco)",
        route: "Via Oral",
        presentation: "Comprimidos 25 mg e 50 mg",
        initial: "25 mg, 1x/dia",
        titration: "Pode ser aumentada para 50 mg/dia após 4 semanas",
        usual: "25 mg a 50 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "25 mg a 50 mg/dia",
        maximum: "50 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Monitorar calemia rigorosamente se TFG entre 30 e 50 mL/min.",
        hepaticAdjustment: "Seguro se eletrólitos preservados.",
        notes: "Estudo PATHWAY-2 demonstrou superioridade clara como quarto fármaco na HAS resistente.",
      },
    ],
    contraindications: ["Hipercalemia inicial (> 5,0 mEq/L), insuficiência renal aguda ou TFG < 30 mL/min, Doença de Addison."],
    warnings: [
      "Hipercalemia severa com risco de arritmias ventriculares",
      "Ginecomastia dolorosa, mastodinia e disfunção erétil decorrentes do bloqueio de receptores androgênicos",
    ],
    interactions: ["IECAs, BRAs, suplementos de potássio, sulfametoxazol-trimetoprima (elevação crítica do potássio)."],
    monitoring: ["Potássio sérico e creatinina em 1 semana, 1 mês, 3 meses e depois a cada 6 meses."],
    sources: [{ title: "RALES Trial", organization: "NEJM" }, { title: "PATHWAY-2 Study", organization: "The Lancet" }],
    reviewStatus: "reviewed",
    notes: "Um dos 4 pilares da ICFEr; em caso de ginecomastia severa, sua substituta direta é a eplerenona.",
  },

  // ==========================================
  // 7. BLOQUEADORES DOS CANAIS DE CÁLCIO (BCC)
  // ==========================================
  {
    id: "anlodipino",
    genericName: "Besilato de Anlodipino",
    brandNames: ["Norvasc", "Cordarex", "Pressat"],
    therapeuticClass: "Anti-hipertensivo / Bloqueador dos Canais de Cálcio Dihidropiridínico",
    mechanism: "Bloqueio seletivo do influxo transmembrana de íons cálcio via canais tipo L na musculatura lisa vascular periférica e coronariana, gerando vasodilatação arteriolar.",
    presentations: ["Comprimidos de 5 mg e 10 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial e Angina Estável",
        route: "Via Oral",
        presentation: "Comprimidos 5 mg e 10 mg",
        initial: "5 mg, 1x/dia (2,5 mg em idosos frágeis ou insuficiência hepática)",
        titration: "Aumentar para 10 mg/dia após 1 a 2 semanas se meta pressórica não for atingida",
        usual: "5 mg a 10 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "5 mg a 10 mg/dia",
        maximum: "10 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Não requer nenhum ajuste em falência renal ou diálise.",
        hepaticAdjustment: "Metabolismo exclusivamente hepático; titular lentamente com dose inicial de 2,5 mg.",
        notes: "Excelente meia-vida biológica (35 a 50 horas), garantindo controle pressórico estável.",
      },
    ],
    contraindications: ["Hipotensão severa, choque cardiogênico, estenose aórtica crítica sintomática."],
    warnings: [
      "Edema maleolar e pré-tibial dose-dependente (transudação por vasodilatação pré-capilar, sem sobrecarga de volume)",
      "Cefaleia e rubor facial nas primeiras semanas",
    ],
    interactions: [
      "Sinvastatina (limitar dose de sinvastatina a 20 mg/dia pela inibição competitiva da CYP3A4)",
      "Inibidores fortes de CYP3A4 (cetoconazol, claritromicina) elevam os níveis séricos do anlodipino",
    ],
    monitoring: ["Inspeção de membros inferiores para edema, aferição rotineira de PA e frequência cardíaca."],
    sources: [{ title: "ALLHAT Study", organization: "JAMA" }],
    reviewStatus: "reviewed",
    notes: "A associação com IECA ou BRA reduz expressivamente a incidência de edema de membros inferiores.",
  },
  {
    id: "nifedipino",
    genericName: "Nifedipino",
    brandNames: ["Adalat OROS", "Adalat Retard"],
    therapeuticClass: "Bloqueador dos Canais de Cálcio Dihidropiridínico",
    mechanism: "Inibição potente do influxo de cálcio nos canais voltagem-dependentes vasculares arteriais.",
    presentations: ["Comprimidos de liberação prolongada / OROS: 20 mg, 30 mg e 60 mg", "Retard: 10 mg, 20 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Hipertensão Arterial e Fenômeno de Raynaud",
        route: "Via Oral",
        presentation: "Comprimidos OROS 30 mg e 60 mg",
        initial: "30 mg, 1x/dia (formulações OROS/GITS)",
        titration: "Ajustar em intervalos de 7 a 14 dias para 60 mg/dia",
        usual: "30 mg a 60 mg, 1x/dia",
        interval: "A cada 24 horas",
        target: "60 mg/dia",
        maximum: "90 mg a 120 mg/dia dependendo da formulação",
        duration: "Contínua",
        renalAdjustment: "Sem necessidade de redução posológica.",
        hepaticAdjustment: "Reduzir dose em hepatopatia.",
        notes: "O sistema OROS promove liberação osmótica constante ao longo de 24 horas.",
      },
    ],
    contraindications: [
      "Uso de formulações de liberação imediata (cápsula curta sublingual) em emergências hipertensivas (risco de morte/isquemia)",
      "Choque cardiovascular",
    ],
    warnings: ["Taquicardia reflexa com formulações de liberação não controlada, edema periférico."],
    interactions: ["Sulfato de magnésio parenteral (risco de hipotensão profunda e bloqueio neuromuscular)."],
    monitoring: ["Pressão arterial, presença de edema periférico."],
    sources: [{ title: "ACTION Trial", organization: "The Lancet" }],
    reviewStatus: "reviewed",
    notes: "Formulações de liberação rápida estão proscritas para controle de picos pressóricos.",
  },
  {
    id: "diltiazem",
    genericName: "Cloridrato de Diltiazem",
    brandNames: ["Cardizem", "Balcor"],
    therapeuticClass: "Bloqueador dos Canais de Cálcio Não-Dihidropiridínico (Benzotiazepina)",
    mechanism: "Bloqueio misto de canais de cálcio vasculares e cardíacos, reduzindo condução no nó atrioventricular, inotropismo e resistência vascular periférica.",
    presentations: ["Comprimidos de 30 mg e 60 mg", "Cápsulas de liberação prolongada de 90 mg, 120 mg, 180 mg, 240 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Controle de Frequência Cardíaca na Fibrilação Atrial e Angina",
        route: "Via Oral",
        presentation: "Comprimidos 60 mg / Liberação prolongada 180 mg",
        initial: "30 mg a 60 mg a cada 8h (IR) ou 120 mg a 180 mg 1x/dia (retard)",
        titration: "Ajustar a cada 1-2 dias conforme FC de repouso e PA",
        usual: "180 mg a 360 mg/dia",
        interval: "A cada 8 horas (IR) ou a cada 24 horas (retard)",
        target: "FC de repouso < 80-100 bpm",
        maximum: "360 mg a 480 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Sem ajuste direto necessário.",
        hepaticAdjustment: "Titular com cuidado por extenso metabolismo hepático de primeira passagem.",
        notes: "Contraindicado em pacientes com ICFEr pelo efeito inotrópico negativo.",
      },
    ],
    contraindications: ["Disfunção ventricular esquerda moderada a grave (ICFEr), BAV de 2º ou 3º grau, síndrome do nó sinusal."],
    warnings: ["Bradicardia sinusal, bloqueios atrioventriculares, descompensação de insuficiência cardíaca."],
    interactions: ["Betabloqueadores (sinergismo cardiodepressor severo), estatinas metabolizadas por CYP3A4."],
    monitoring: ["Eletrocardiograma (intervalo PR), frequência cardíaca e PA."],
    sources: [{ title: "AHA/ACC AF Guidelines", organization: "Circulation" }],
    reviewStatus: "reviewed",
    notes: "Opção para controle de FC em FA quando os betabloqueadores são contraindicados por broncoespasmo grave.",
  },
  {
    id: "verapamil",
    genericName: "Cloridrato de Verapamil",
    brandNames: ["Dilacoron"],
    therapeuticClass: "Bloqueador dos Canais de Cálcio Não-Dihidropiridínico (Fenilalquilamina)",
    mechanism: "Bloqueador potente com máxima cardiosseletividade sobre o nó sinusal, nó AV e miocárdio contrátil com menor efeito vasodilatador vascular periférico que dihidropiridinas.",
    presentations: ["Comprimidos de 80 mg e 120 mg", "Comprimidos retard de 120 mg e 240 mg"],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Taquiarritmias Supraventriculares e Angina",
        route: "Via Oral",
        presentation: "Comprimidos 80 mg / 120 mg / Retard 240 mg",
        initial: "80 mg a cada 8h ou 120 mg a 240 mg 1x/dia (retard)",
        titration: "Ajustar dose em intervalos semanais",
        usual: "240 mg a 360 mg/dia divididos",
        interval: "A cada 8 horas (IR) ou 24 horas (retard)",
        target: "Controle sintomático e manutenção do ritmo/frequência",
        maximum: "480 mg/dia",
        duration: "Contínua",
        renalAdjustment: "Sem necessidade de redução posológica primária.",
        hepaticAdjustment: "Reduzir dose para 20 a 30% da dose normal em cirrose descompensada.",
        notes: "Causa constipação intestinal grave em idosos por inibição motora do cólon.",
      },
    ],
    contraindications: ["Insuficiência cardíaca com fração de ejeção reduzida, choque cardiogênico, BAV avançado, WPW com FA."],
    warnings: ["Inotrópico negativo potente, bradipneia, constipação crônica pertinaz."],
    interactions: ["Digoxina (eleva em até 50-70% os níveis de digoxina), betabloqueadores (risco de assistolia)."],
    monitoring: ["ECG contínuo se uso IV, intervalo PR e PA."],
    sources: [{ title: "Goodman & Gilman", organization: "McGraw-Hill" }],
    reviewStatus: "reviewed",
    notes: "Fármaco potente para profilaxia de taquicardia paroxística supraventricular (TPSV).",
  },

  // ==========================================
  // 8. ANALGÉSICOS, ANTIPIRÉTICOS E AINES
  // ==========================================
  {
    id: "dipirona",
    genericName: "Dipirona Monoidratada (Metamizol)",
    brandNames: ["Novalgina", "Anador", "Lisador"],
    therapeuticClass: "Analgésico e Antipirético Não-Opioide",
    mechanism:
      "Ação analgésica central e periférica. Inibição de isoformas de COX-1/COX-2 e COX-3 atípicas no SNC, ativação de vias canabinoides endógenas (CB1) e do sistema inibitório descendente opioide e serotoninérgico.",
    presentations: [
      "Comprimidos de 500 mg e 1000 mg",
      "Gotas / Solução oral: 500 mg/mL (1 mL = 20 gotas)",
      "Solução oral concentrada: 50 mg/mL",
      "Ampolas injetáveis: 1000 mg/2 mL",
    ],
    doseProfiles: [
      {
        population: "Adultos e Adolescentes (> 15 anos ou > 53 kg)",
        indication: "Dor Aguda e Febre",
        route: "Via Oral / Via Intravenosa / Via Intramuscular",
        presentation: "Comprimidos 500 mg / 1000 mg; Solução 500 mg/mL; Ampolas 1 g/2 mL",
        initial: "500 mg a 1000 mg por tomada",
        titration: "Administrar conforme demanda respeitando os intervalos",
        usual: "500 mg a 1000 mg a cada 6 ou 8 horas",
        interval: "A cada 6 horas ou 8 horas",
        target: "Alívio álgico satisfatório (EVA < 3/10)",
        maximum: "4000 mg/dia (em ambiente hospitalar monitorado admite-se até 5000 mg/dia)",
        duration: "Curto prazo / Período da dor aguda ou febre",
        renalAdjustment: "Evitar doses máximas repetidas na insuficiência renal grave pelo acúmulo de metabólitos ativos (4-MAA).",
        hepaticAdjustment: "Reduzir dose em hepatopatias crônicas graves.",
        notes: "A administração intravenosa deve ser SEMPRE em infusão lenta (3 a 5 min ou diluída) para evitar colapso hemodinâmico hipotensivo.",
      },
      {
        population: "Pediátrico",
        indication: "Febre e Dor Infantil",
        route: "Via Oral",
        presentation: "Gotas 500 mg/mL (1 gota = 25 mg)",
        initial: "10 mg a 15 mg/kg por dose",
        titration: "Repetir a cada 6 a 8 horas se persistência",
        usual: "1 gota para cada 2 kg de peso (dose de 12,5 mg/kg) até 4x/dia",
        interval: "A cada 6 horas ou 8 horas",
        target: "Afebril e controle álgico",
        maximum: "60 mg/kg/dia ou teto de 2000 mg a 4000 mg/dia",
        duration: "Período agudo",
        renalAdjustment: "Sem restrição para cursos agudos breves.",
        hepaticAdjustment: "Evitar cursos prolongados.",
        notes: "Não utilizar em lactentes menores de 3 meses ou pesando menos de 5 kg.",
      },
    ],
    contraindications: [
      "Hipersensibilidade a pirazolonas",
      "Deficiência congênita de Glicose-6-Fosfato Desidrogenase (risco de hemólise aguda)",
      "Supressão de medula óssea ou histórico prévio de agranulocitose associada a metamizol",
      "Porfiria hepática aguda intermitente",
    ],
    warnings: [
      "Hipotensão arterial aguda dose-dependente mediada por relaxamento da musculatura lisa vascular em infusões IV rápidas",
      "Risco idiossincrático raríssimo de agranulocitose grave e anemia aplásica",
      "Reações cutâneas graves (Síndrome de Stevens-Johnson / NET)",
    ],
    interactions: [
      "Ciclosporina (reduz os níveis séricos de ciclosporina; monitorar níveis)",
      "Metotrexato (pode elevar a hematotoxicidade do metotrexato)",
      "Ácido acetilsalicílico (pode atenuar o efeito antiplaquetário do AAS se tomado simultaneamente)",
    ],
    monitoring: [
      "Sinais vitais (PA) durante administração parenteral",
      "Hemograma em tratamentos prolongados (> 7 dias) ou se surgirem febre/odinofagia inexplicadas",
    ],
    sources: [
      { title: "Bula Padrão do Medicamento / Formulário Terapêutico Nacional", organization: "Anvisa" },
      { title: "European Medicines Agency (EMA) Metamizole Safety Review", organization: "EMA" },
    ],
    reviewStatus: "reviewed",
    notes: "Primeira escolha de analgésico/antipirético no cenário hospitalar e emergencial brasileiro por sua alta eficácia e segurança gástrica/renal relativa frente aos AINEs.",
  },
  {
    id: "paracetamol",
    genericName: "Paracetamol (Acetaminofeno)",
    brandNames: ["Tylenol", "Parador"],
    therapeuticClass: "Analgésico e Antipirético",
    mechanism: "Inibição central da síntese de prostaglandinas e ativação de vias serotoninérgicas inibitórias descendentes na medula espinhal, sem atividade anti-inflamatória periférica significativa.",
    presentations: [
      "Comprimidos de 500 mg e 750 mg",
      "Suspensão / Gotas pediátricas: 200 mg/mL (1 mL = ~15 a 20 gotas)",
      "Solução oral: 100 mg/mL",
    ],
    doseProfiles: [
      {
        population: "Adultos e Adolescentes (> 12 anos)",
        indication: "Dor Leve a Moderada e Febre",
        route: "Via Oral",
        presentation: "Comprimidos 500 mg e 750 mg",
        initial: "500 mg a 1000 mg por tomada",
        titration: "Repetir a cada 4 a 6 horas conforme dor ou febre",
        usual: "500 mg a 750 mg a cada 6 horas",
        interval: "A cada 4 horas ou 6 horas (respeitar intervalo mínimo de 4h)",
        target: "Alívio álgico",
        maximum: "4000 mg/dia em adultos hígidos; limitar a 2000 mg a 3000 mg/dia em hepatopatas, idosos ou alcoolistas crônicos",
        duration: "Curto prazo",
        renalAdjustment: "Ampliar intervalo para cada 6h ou 8h se TFG < 30 mL/min.",
        hepaticAdjustment: "Contraindicado em hepatite aguda ou insuficiência hepática descompensada grave.",
        notes: "O esgotamento das reservas de glutationa hepática expõe os hepatócitos ao acúmulo citotóxico de NAPQI.",
      },
      {
        population: "Pediátrico",
        indication: "Antipirese e Analgesia Infantil",
        route: "Via Oral",
        presentation: "Gotas 200 mg/mL (1 gota = ~10 a 14 mg dependendo do bico dosador) ou Suspensão 100 mg/mL",
        initial: "10 mg a 15 mg/kg por tomada",
        titration: "A cada 4 a 6 horas se febre persistente",
        usual: "10 mg a 15 mg/kg/dose",
        interval: "A cada 4 a 6 horas (máximo 5 tomadas em 24h)",
        target: "Controle da temperatura",
        maximum: "75 mg/kg/dia",
        duration: "Curto prazo",
        renalAdjustment: "Sem restrição para doses agudas.",
        hepaticAdjustment: "Não exceder doses ponderais.",
        notes: "Intoxicação aguda reversível com N-acetilcisteína (NAC) precoce.",
      },
    ],
    contraindications: ["Hipersensibilidade grave, insuficiência hepática grave ou cirrose Child-Pugh C."],
    warnings: [
      "Hepatotoxicidade dose-dependente severa com risco de necrose centrolobular massiva",
      "Atenção para intoxicação cumulativa inadvertida por associação com antigripais compostos de venda livre",
    ],
    interactions: [
      "Álcool etílico (indução do CYP2E1 que amplia a conversão para o metabólito tóxico NAPQI)",
      "Varfarina (doses regulares > 2 g/dia por vários dias aumentam o INR)",
    ],
    monitoring: ["Transaminases e TAP/INR em suspeita de superdosagem; avaliação clínica de icterícia."],
    sources: [{ title: "FDA Drug Safety Communication: Acetaminophen", organization: "FDA" }],
    reviewStatus: "reviewed",
    notes: "Analgésico mais seguro durante todos os trimestres da gestação e na lactação.",
  },
  {
    id: "ibuprofeno",
    genericName: "Ibuprofeno",
    brandNames: ["Advil", "Alivium", "Motrin"],
    therapeuticClass: "Anti-inflamatório Não Esteroidal (AINE) / Derivado do Ácido Propiônico",
    mechanism: "Inibição não seletiva reversível das enzimas ciclo-oxigenase 1 e 2 (COX-1 e COX-2), bloqueando a síntese de prostanoides e prostaglandinas inflamatórias.",
    presentations: [
      "Comprimidos de 200 mg, 400 mg e 600 mg",
      "Gotas / Suspensão oral: 50 mg/mL e 100 mg/mL",
    ],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Dor Inflamatória, Cefaleia e Dismenorreia",
        route: "Via Oral",
        presentation: "Comprimidos 400 mg e 600 mg",
        initial: "200 mg a 400 mg a cada 4 a 6h (analgesia) ou 600 mg a cada 8h (anti-inflamatório)",
        titration: "Ajustar conforme intensidade dos sintomas",
        usual: "400 mg a cada 6 horas ou 600 mg a cada 8 horas",
        interval: "A cada 6 horas ou 8 horas",
        target: "Resolução dos sinais flogísticos e dor",
        maximum: "2400 mg/dia",
        duration: "Restringir ao menor tempo possível (idealmente < 5 a 7 dias)",
        renalAdjustment: "Evitar o uso se TFG < 30 mL/min/1,73m².",
        hepaticAdjustment: "Evitar em doença hepática terminal.",
        notes: "Administrar preferencialmente após as refeições para mitigar irritação gástrica direta.",
      },
      {
        population: "Pediátrico (> 6 meses)",
        indication: "Febre e Processos Inflamatórios Infantis",
        route: "Via Oral",
        presentation: "Gotas 50 mg/mL ou 100 mg/mL",
        initial: "5 mg a 10 mg/kg/dose",
        titration: "A cada 6 a 8 horas",
        usual: "5 mg a 10 mg/kg/dose",
        interval: "A cada 6 horas ou 8 horas",
        target: "Defervescência e conforto",
        maximum: "40 mg/kg/dia",
        duration: "3 a 5 dias",
        renalAdjustment: "Evitar se desidratação infantil aguda.",
        hepaticAdjustment: "Sem restrição direta em uso breve.",
        notes: "Não indicado em menores de 6 meses de vida.",
      },
    ],
    contraindications: [
      "Úlcera péptica ativa ou histórico de sangramento/perfuração gastrointestinal por AINEs",
      "Insuficiência cardíaca grave descompensada",
      "Disfunção renal severa (TFG < 30)",
      "Terceiro trimestre de gestação (fechamento prematuro do canal arterial)",
    ],
    warnings: [
      "Gastrolesividade: erosões, úlceras e sangramento digestivo alto por inibição de COX-1 gástrica protetora",
      "Injúria Renal Aguda hemodinâmica por bloqueio da síntese de PGE2 e PGI2 (vasoconstrição da arteríola aferente)",
      "Aumento do risco de eventos trombóticos cardiovasculares em doses altas (> 1200 mg a 2400 mg/dia)",
    ],
    interactions: [
      "AAS (ibuprofeno bloqueia o acesso do AAS ao sítio catalítico da COX-1 plaquetária se administrado antes)",
      "Anti-hipertensivos / IECAs e diuréticos (antagonismo do efeito hipotensor e risco crítico de nefrotoxicidade)",
      "Anticoagulantes orais (aumento pronunciado do risco hemorrágico digestivo)",
    ],
    monitoring: ["Hemoglobina/hematócrito, função renal e PA em tratamentos com mais de 7 dias."],
    sources: [{ title: "Goodman & Gilman", organization: "McGraw-Hill" }],
    reviewStatus: "reviewed",
    notes: "Menor potencial trombótico cardiovascular relativo entre os AINEs tradicionais quando restrito a doses < 1200 mg/dia.",
  },
  {
    id: "cetoprofeno",
    genericName: "Cetoprofeno",
    brandNames: ["Profenid", "Artril", "Profenid Entérico"],
    therapeuticClass: "Anti-inflamatório Não Esteroidal (AINE)",
    mechanism: "Inibição de COX-1 e COX-2 e estabilização de membranas lisossomais com inibição colateral de vias da lipoxigenase e migração leucocitária.",
    presentations: [
      "Cápsulas de 50 mg",
      "Comprimidos revestidos de 100 mg",
      "Comprimidos de liberação prolongada de 200 mg",
      "Ampolas injetáveis IV/IM de 100 mg/2 mL",
    ],
    doseProfiles: [
      {
        population: "Adultos",
        indication: "Dor Inflamatória Musculoesquelética Aguda, Crises de Gota e Pós-Operatório",
        route: "Via Oral / Via Intravenosa / Via Intramuscular",
        presentation: "Comprimidos 100 mg; Cápsulas 50 mg; Liberação Prolongada 200 mg; Ampolas 100 mg",
        initial: "100 mg a cada 12h ou 50 mg a cada 6-8h VO; 100 mg IV a cada 12h diluído em 100 mL de SF0,9%",
        titration: "Sem titulação; usar a menor dose eficaz",
        usual: "150 mg a 200 mg/dia",
        interval: "A cada 12 horas ou 24 horas (formulações de 200 mg LP)",
        target: "Remissão do processo álgico e inflamatório",
        maximum: "300 mg/dia",
        duration: "Restringir a no máximo 3 a 5 dias para uso injetável e 7 dias para via oral",
        renalAdjustment: "Contraindicado em insuficiência renal grave; reduzir dose em 50% em idosos ou DRC estágio 3.",
        hepaticAdjustment: "Reduzir dose em disfunção hepática.",
        notes: "Infusão intravenosa deve correr em período de 20 a 30 minutos.",
      },
    ],
    contraindications: [
      "Tríade da aspirina (asma, pólipos nasais e hipersensibilidade a AINEs)",
      "Hemorragia digestiva ativa",
      "Insuficiência cardíaca classe III/IV",
      "Pós-operatório imediato de cirurgia de revascularização miocárdica (CRM)",
      "Gestação após 20 semanas",
    ],
    warnings: [
      "Potente toxicidade sobre a mucosa gástrica e duodenal",
      "Retenção hidrossalina com descompensação de PA e IC",
      "Inibição plaquetária reversível",
    ],
    interactions: [
      "Metotrexato em altas doses (grave risco de toxicidade medular por redução de clearance)",
      "Lítio (elevação importante da concentração plasmática do lítio)",
      "Inibidores da recaptação de serotonina (ISRS) elevam o risco de sangramentos gastrointestinais",
    ],
    monitoring: ["Creatinina, ureia, hemograma, dor epigástrica e melena."],
    sources: [{ title: "Formulário Terapêutico Nacional", organization: "Ministério da Saúde" }],
    reviewStatus: "reviewed",
    notes: "AINE de expressiva potência anti-inflamatória e analgésica rápida, rotineiramente combinado a inibidores de bomba de prótons (IBP) como gastroproteção em pacientes de risco.",
  },
];
``

# END FILE: src/clinical/pharmacology/catalog.ts

---

# FILE: src/clinical/pharmacology/example.ts

``typescript
import type { PharmacologyEntry } from "./types";

/** Molde estrutural. Este objeto NÃO é importado pelo aplicativo. */
export const EXAMPLE_PHARMACOLOGY_ENTRY: PharmacologyEntry = {
  id: "medicamento-exemplo",
  genericName: "NOME_GENERICO_A_PREENCHER",
  brandNames: ["NOME_COMERCIAL_OPCIONAL"],
  therapeuticClass: "CLASSE_A_PREENCHER",
  mechanism: "MECANISMO_A_PREENCHER",
  presentations: ["APRESENTACAO_E_CONCENTRACAO_A_PREENCHER"],
  doseProfiles: [
    {
      population: "POPULACAO_A_PREENCHER",
      indication: "INDICACAO_A_PREENCHER",
      route: "VIA_A_PREENCHER",
      presentation: "APRESENTACAO_A_PREENCHER",
      initial: "DOSE_INICIAL_A_PREENCHER",
      titration: "TITULACAO_A_PREENCHER",
      usual: "DOSE_USUAL_A_PREENCHER",
      interval: "INTERVALO_A_PREENCHER",
      target: "DOSE_ALVO_A_PREENCHER",
      maximum: "DOSE_MAXIMA_A_PREENCHER",
      duration: "DURACAO_A_PREENCHER",
      renalAdjustment: "AJUSTE_RENAL_A_PREENCHER",
      hepaticAdjustment: "AJUSTE_HEPATICO_A_PREENCHER",
      notes: "OBSERVACOES_A_PREENCHER",
    },
  ],
  contraindications: ["CONTRAINDICACAO_A_PREENCHER"],
  warnings: ["ALERTA_A_PREENCHER"],
  interactions: ["INTERACAO_A_PREENCHER"],
  monitoring: ["MONITORAMENTO_A_PREENCHER"],
  sources: [{ title: "FONTE_A_PREENCHER", organization: "ORGANIZACAO_A_PREENCHER" }],
  reviewStatus: "draft",
  notes: "ANOTACAO_PESSOAL_A_PREENCHER",
};

``

# END FILE: src/clinical/pharmacology/example.ts

---

# FILE: src/clinical/pharmacology/README.md

``markdown
# Caderno farmacológico autoral

## Onde preencher

Edite exclusivamente:

`src/clinical/pharmacology/catalog.ts`

O catálogo atual já contém fichas. Ele é um array TypeScript tipado, importado pela biblioteca clínica e filtrado por `publishablePharmacologyEntries` antes de ser exibido.

## Como preencher

1. Abra `src/clinical/pharmacology/example.ts`.
2. Copie o objeto `EXAMPLE_PHARMACOLOGY_ENTRY`.
3. Cole o objeto dentro do array de `catalog.ts`.
4. Troque todos os campos terminados em `_A_PREENCHER`.
5. Comece com `reviewStatus: "draft"`.
6. Execute `npm run verify` e `npm run build`.

O arquivo `example.ts` não é importado no aplicativo e serve somente como molde. A validação mantém fichas com placeholders fora da interface e também exclui as arquivadas.

``

# END FILE: src/clinical/pharmacology/README.md

---

# FILE: src/clinical/pharmacology/types.ts

``typescript
export type PharmacologyReviewStatus = "draft" | "checked-source" | "checked-preceptor" | "reviewed" | "archived";
export interface PharmacologySource { title:string; organization:string; year?:number; url?:string; accessedAt?:string; }
export interface DoseProfile { population:string; indication:string; route:string; presentation:string; initial?:string; titration?:string; usual?:string; interval?:string; target?:string; maximum?:string; duration?:string; renalAdjustment?:string; hepaticAdjustment?:string; notes?:string; }
export interface PharmacologyEntry { id:string; genericName:string; brandNames?:string[]; therapeuticClass:string; mechanism?:string; presentations:string[]; doseProfiles:DoseProfile[]; contraindications:string[]; warnings:string[]; interactions:string[]; monitoring:string[]; sources:PharmacologySource[]; reviewStatus:PharmacologyReviewStatus; reviewedAt?:string; reviewedBy?:string; notes?:string; }

``

# END FILE: src/clinical/pharmacology/types.ts

---

# FILE: src/clinical/pharmacology/validation.ts

``typescript
import type { PharmacologyEntry } from "./types";
const PLACEHOLDER=/_A_PREENCHER|MEDICAMENTO_EXEMPLO|NOME_GENERICO_A_PREENCHER/;
export function validatePharmacologyEntry(entry:PharmacologyEntry):string[]{const errors:string[]=[];if(!entry.id.trim())errors.push("id ausente");if(!entry.genericName.trim())errors.push("nome genérico ausente");if(!entry.therapeuticClass.trim())errors.push("classe ausente");if(PLACEHOLDER.test(JSON.stringify(entry)))errors.push("existem placeholders não preenchidos");if(entry.reviewStatus!=="draft"&&!entry.sources.length)errors.push("ficha revisada sem fonte");return errors}
export function publishablePharmacologyEntries(entries:PharmacologyEntry[]){return entries.filter(e=>e.reviewStatus!=="archived"&&validatePharmacologyEntry(e).length===0)}

``

# END FILE: src/clinical/pharmacology/validation.ts

---

# FILE: src/clinical/review.ts

``typescript
import {conditions,medicationKnowledge} from "./content";
import {clinicalSources} from "./sources";
export type ReviewDecision="pending-independent-review"|"approved"|"approve-with-revision"|"rejected"|"blocked-preliminary-source";
export interface ClaimReviewRow{claimId:string;conditionId:string;conditionName:string;section:string;text:string;sharedText:string;population:string;level:string;sourceIds:string[];sourceStatus:string;decision:ReviewDecision;reviewer:string;reviewedAt:string;notes:string;}
export interface MedicationReviewRow{knowledgeId:string;genericName:string;therapeuticClass:string;coveredContexts:string;sourceIds:string[];sourceStatus:string;publicationLevel:string;doseStatus:string;productAuditRequired:boolean;decision:ReviewDecision;reviewer:string;notes:string;}
export function claimReviewRows():ClaimReviewRow[]{const status=new Map(clinicalSources.map(s=>[s.id,s.status]));return conditions.flatMap(c=>Object.entries(c.sections).flatMap(([section,claims])=>claims.map(claim=>{const sourceStatus=claim.sourceIds.map(id=>`${id}:${status.get(id)??"missing"}`).join("; ");const preliminary=claim.sourceIds.some(id=>status.get(id)==="preliminary");return{claimId:claim.id,conditionId:c.id,conditionName:c.name,section,text:claim.text,sharedText:claim.sharedText??"",population:claim.population,level:claim.level,sourceIds:claim.sourceIds,sourceStatus,decision:preliminary?"blocked-preliminary-source":"pending-independent-review",reviewer:"",reviewedAt:"",notes:""}})))}
export function medicationReviewRows():MedicationReviewRow[]{const status=new Map(clinicalSources.map(s=>[s.id,s.status]));return medicationKnowledge.map(m=>({knowledgeId:m.id,genericName:m.genericName,therapeuticClass:m.therapeuticClass,coveredContexts:m.coveredContexts.join("; "),sourceIds:m.sourceIds,sourceStatus:m.sourceIds.map(id=>`${id}:${status.get(id)??"missing"}`).join("; "),publicationLevel:m.publicationLevel,doseStatus:m.doseStatus,productAuditRequired:true,decision:"pending-independent-review",reviewer:"",notes:"Doses permanecem bloqueadas; classe não equivale a produto auditado."}))}
export function clinicalReviewReadiness(){const claims=claimReviewRows(),medications=medicationReviewRows();return{claims:claims.length,claimApproved:claims.filter(x=>x.decision==="approved").length,claimBlocked:claims.filter(x=>x.decision==="blocked-preliminary-source").length,medications:medications.length,dosePublished:medications.filter(x=>x.doseStatus==="source-verified").length,ready:claims.every(x=>x.decision==="approved")&&medications.every(x=>x.decision==="approved"&&x.doseStatus==="source-verified")}}

``

# END FILE: src/clinical/review.ts

---

# FILE: src/clinical/sources.ts

``typescript
import type { ClinicalSource } from "./types";
export const clinicalSources:ClinicalSource[]=[
 {id:"ms-pcdt-has-2025",title:"PCDT da Hipertensão Arterial Sistêmica",organization:"Ministério da Saúde / Conitec",kind:"pcdt",publishedAt:"2025-07-23",url:"https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-resumido-da-hipertensao-arterial-sistemica/@@display-file/file",status:"current"},
 {id:"ms-pcdt-dm2-2026",title:"PCDT do Diabete Melito Tipo 2",organization:"Ministério da Saúde / Conitec",kind:"pcdt",publishedAt:"2026-02-21",updatedAt:"2026-06-23",url:"https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-diabete-melito-tipo-2/@@display-file/file",status:"current"},
 {id:"ms-pcdt-drc-2024",title:"PCDT de Estratégias para Atenuar a Progressão da Doença Renal Crônica",organization:"Ministério da Saúde / Conitec",kind:"pcdt",publishedAt:"2024-09-16",updatedAt:"2025-02-10",url:"https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-de-estrategias-para-atenuar-a-progressao-da-doenca-renal-cronica",status:"current"},
 {id:"ms-pcdt-dislipidemia-2019",title:"PCDT da Dislipidemia: prevenção de eventos cardiovasculares e pancreatite",organization:"Ministério da Saúde / Conitec",kind:"pcdt",publishedAt:"2019-07-30",url:"https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_dislipidemia.pdf/@@display-file/file",status:"current",notes:"Existe consulta pública preliminar de atualização em setembro de 2026; não foi tratada como norma vigente."},
 {id:"ms-dislipidemia-cp94-2026",title:"Relatório preliminar do PCDT da Dislipidemia e Prevenção - CP 94",organization:"Ministério da Saúde / Conitec",kind:"guideline",publishedAt:"2026-09-15",url:"https://www.gov.br/conitec/pt-br/midias/consultas/relatorios/2026/relatorio-preliminar-pcdt-da-dislipidemia-e-prevencao-cp-94.pdf",status:"preliminary"},
 {id:"ms-pcdt-obesidade-2024",title:"PCDT de Sobrepeso e Obesidade em Adultos",organization:"Ministério da Saúde / Conitec",kind:"pcdt",publishedAt:"2020-11-11",updatedAt:"2024-07-08",url:"https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sobrepeso-e-obesidade-em-adultos/view",status:"current"},
 {id:"ms-linhas-cuidado-2026",title:"Plataforma Linhas de Cuidado",organization:"Ministério da Saúde",kind:"line-of-care",publishedAt:"2022-12-07",updatedAt:"2026-03-04",url:"https://www.gov.br/saude/pt-br/composicao/saps/ecv/linhas-de-cuidado/plataforma-linhas-de-cuidado",status:"current"},
 {id:"anvisa-bulario-2026",title:"Bulário Eletrônico",organization:"Anvisa",kind:"regulatory",publishedAt:"2020-10-05",updatedAt:"2026-05-17",url:"https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico",status:"current"},
 {id:"ms-rename-2024",title:"Relação Nacional de Medicamentos Essenciais 2024",organization:"Ministério da Saúde",kind:"rename",publishedAt:"2024-01-01",updatedAt:"2025-04-12",url:"https://www.gov.br/saude/pt-br/composicao/sectics/rename",status:"current"}
];
export const sourceById=(id:string)=>clinicalSources.find((source)=>source.id===id);

``

# END FILE: src/clinical/sources.ts

---

# FILE: src/clinical/types.ts

``typescript
export type PublicationLevel = "essential" | "expanded" | "audited" | "review-needed";
export type ClinicalSourceKind = "pcdt" | "guideline" | "line-of-care" | "regulatory" | "rename" | "official-reference";
export interface ClinicalSource { id:string; title:string; organization:string; kind:ClinicalSourceKind; publishedAt:string; updatedAt?:string; url:string; status:"current"|"preliminary"|"superseded"|"historical"; notes?:string; }
export interface ClinicalClaim { id:string; text:string; sharedText?:string; sourceIds:string[]; population:string; level:PublicationLevel; reviewedAt:string; reviewDueAt:string; tags:string[]; }
export interface ClinicalCondition { id:string; name:string; shortName:string; synonyms:string[]; summary:string; sharedSummary:string; publicationLevel:PublicationLevel; scope:string; sections:{ quick:ClinicalClaim[]; diagnosis:ClinicalClaim[]; assessment:ClinicalClaim[]; monitoring:ClinicalClaim[]; nonDrug:ClinicalClaim[]; medication:ClinicalClaim[]; referral:ClinicalClaim[]; }; sourceIds:string[]; }
export interface MedicationKnowledge { id:string; genericName:string; therapeuticClass:string; coveredContexts:string[]; mechanismSummary:string; sharedPurpose:string; sourceIds:string[]; publicationLevel:PublicationLevel; doseStatus:"not-published"|"source-verified"; safetyNotice:string; monitor:string[]; availabilityNote?:string; }
export interface ExamKnowledge { id:string; name:string; purpose:string; interpretationGuardrails:string[]; sourceIds:string[]; publicationLevel:PublicationLevel; }

``

# END FILE: src/clinical/types.ts

---

# FILE: src/clinical/validation.ts

``typescript
import { clinicalSources } from "./sources";
import { conditions,examKnowledge,medicationKnowledge } from "./content";
export interface ClinicalValidation {valid:boolean;errors:string[];warnings:string[];}
export function validateClinicalLibrary():ClinicalValidation{
 const errors:string[]=[];const warnings:string[]=[];const sourceIds=new Set(clinicalSources.map((s)=>s.id));
 const check=(owner:string,ids:string[])=>ids.forEach((id)=>{if(!sourceIds.has(id))errors.push(`${owner}: fonte inexistente ${id}`)});
 conditions.forEach((condition)=>{check(condition.id,condition.sourceIds);Object.values(condition.sections).flat().forEach((claim)=>{check(claim.id,claim.sourceIds);if(!claim.text.trim())errors.push(`${claim.id}: texto vazio`);if(new Date(claim.reviewDueAt)<new Date("2026-09-27"))warnings.push(`${claim.id}: revisão vencida`);});});
 medicationKnowledge.forEach((item)=>{check(item.id,item.sourceIds);if(item.doseStatus==="not-published")warnings.push(`${item.genericName}: dose bloqueada até auditoria por produto e indicação.`);});
 examKnowledge.forEach((item)=>check(item.id,item.sourceIds));
 const preliminary=new Set(clinicalSources.filter((s)=>s.status==="preliminary").map((s)=>s.id));
 conditions.forEach((condition)=>{if(condition.sourceIds.some((id)=>preliminary.has(id))&&condition.publicationLevel!=="review-needed")errors.push(`${condition.id}: fonte preliminar exige review-needed`);});
 return {valid:errors.length===0,errors,warnings};
}

``

# END FILE: src/clinical/validation.ts

---

# FILE: src/contracts/care.ts

``typescript
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

``

# END FILE: src/contracts/care.ts

---

# FILE: src/contracts/clinical.ts

``typescript
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

``

# END FILE: src/contracts/clinical.ts

---

# FILE: src/contracts/core.ts

``typescript
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
  readonly dataOrigin?: "synthetic-demo";
}

export interface ProvenancedRecord {
  provenance: Provenance;
  confirmation: ConfirmationStatus;
  sensitivity: Sensitivity;
  sharingState: SharingState;
}

``

# END FILE: src/contracts/core.ts

---

# FILE: src/contracts/demo.ts

``typescript
export const DEMO_SESSION_META_ID = "active-demo-session";
export const DEMO_SESSION_SCHEMA_VERSION = 2;
export const DEMO_SAMPLE_SEMESTER_ID = "sem_demo_2026_2";
export const DEMO_SAMPLE_FAMILY_IDS = ["family_demo_horizonte", "family_demo_travessia"] as const;
export const DEMO_SAMPLE_LEGACY_IDS = [
  DEMO_SAMPLE_SEMESTER_ID,
  ...DEMO_SAMPLE_FAMILY_IDS,
  ...DEMO_SAMPLE_FAMILY_IDS.map((id) => `link_${id}`),
] as const;

export type DataOrigin = "synthetic-demo";

export interface DemoSessionSnapshot {
  state: "active";
  schemaVersion: typeof DEMO_SESSION_SCHEMA_VERSION;
  startedAt: string;
  snapshotRecords: unknown[];
  snapshotDrafts: unknown[];
  snapshotEvents: unknown[];
}

export interface DemoSessionMetaRecord {
  id: typeof DEMO_SESSION_META_ID;
  value: DemoSessionSnapshot;
  updatedAt: string;
}

export function isLegacyDemoEntityId(id: string): boolean {
  return (DEMO_SAMPLE_LEGACY_IDS as readonly string[]).includes(id);
}

export function isSyntheticDemoFamily(value: { id: string; dataOrigin?: DataOrigin }): boolean {
  return value.dataOrigin === "synthetic-demo" || (DEMO_SAMPLE_FAMILY_IDS as readonly string[]).includes(value.id);
}

``

# END FILE: src/contracts/demo.ts

---

# FILE: src/contracts/family.ts

``typescript
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

``

# END FILE: src/contracts/family.ts

---

# FILE: src/contracts/journey.ts

``typescript
import type {AuditFields,EntityId,ISODateTime,ProvenancedRecord} from "./core";
export interface Reflection extends AuditFields,ProvenancedRecord {semesterId:EntityId;familyId?:EntityId;encounterId?:EntityId;title:string;text:string;learning:string[];nextQuestions:string[];}
export interface CompetencyEvidence extends AuditFields,ProvenancedRecord {semesterId:EntityId;familyId?:EntityId;personId?:EntityId;encounterId?:EntityId;competency:string;description:string;evidenceDate:ISODateTime;state:"draft"|"reviewed"|"validated";}
export interface SupervisorFeedback extends AuditFields,ProvenancedRecord {semesterId:EntityId;familyId?:EntityId;personId?:EntityId;encounterId?:EntityId;topic?:string;text:string;receivedAt:ISODateTime;action?:string;state:"received"|"reviewed"|"incorporated"|"closed";}
export type PendingClosure="completed"|"not-completed"|"continuity-recommended"|"continuity-confirmed"|"not-recoverable"|"no-longer-relevant"|"merged";
export interface SemesterSnapshotData {semester:unknown;families:unknown[];familyLinks:unknown[];people:unknown[];memberships:unknown[];encounters:unknown[];pending:unknown[];conditions:unknown[];medications:unknown[];examResults:unknown[];screenings:unknown[];carePlans:unknown[];relationships:unknown[];resources:unknown[];externalLinks:unknown[];reflections:unknown[];competencies:unknown[];feedbacks:unknown[];}
export interface SemesterSnapshot extends AuditFields {semesterId:EntityId;closedAt:ISODateTime;schemaVersion:number;contentChecksum:string;data:SemesterSnapshotData;reportText:string;}
export interface Addendum extends AuditFields,ProvenancedRecord {snapshotId:EntityId;semesterId:EntityId;title:string;text:string;reason:string;authoredAt:ISODateTime;}

``

# END FILE: src/contracts/journey.ts

---

# FILE: src/contracts/longitudinal.ts

``typescript
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

``

# END FILE: src/contracts/longitudinal.ts

---

# FILE: src/contracts/relations.ts

``typescript
import type { AuditFields, EntityId, ISODateTime, ProvenancedRecord } from "./core";
export type RelationshipQuality="strong"|"adequate"|"weak"|"conflict"|"ruptured"|"divergent"|"unknown";
export type RelationshipDirection="mutual"|"from-source"|"to-source"|"none";
export interface InterpersonalRelationship extends AuditFields,ProvenancedRecord { familyId:EntityId; sourcePersonId:EntityId; targetPersonId:EntityId; formalType:string; quality:RelationshipQuality; direction:RelationshipDirection; careDirection?:RelationshipDirection; frequency?:"daily"|"weekly"|"monthly"|"occasional"|"none"|"unknown"; perspectivePersonId?:EntityId; perspectiveLabel:string; validFrom?:ISODateTime; validTo?:ISODateTime; notes?:string; }
export type ResourceType="health"|"education"|"work"|"community"|"religion"|"extended-family"|"social-assistance"|"leisure"|"justice"|"other";
export interface ExternalResource extends AuditFields { familyId:EntityId; name:string; type:ResourceType; state:"potential"|"active"|"inactive"|"closed"; description?:string; }
export interface ExternalLink extends AuditFields,ProvenancedRecord { familyId:EntityId; resourceId:EntityId; personId?:EntityId; quality:RelationshipQuality; direction:RelationshipDirection; intensity:"low"|"moderate"|"high"|"unknown"; perspectivePersonId?:EntityId; perspectiveLabel:string; validFrom?:ISODateTime; validTo?:ISODateTime; notes?:string; }
export type DiagramKind="genogram"|"ecomap";
export interface DiagramLayout extends AuditFields { familyId:EntityId; kind:DiagramKind; perspectivePersonId?:EntityId; periodLabel:string; positions:Record<string,{x:number;y:number}>; layer:"structural"|"household"|"clinical"|"functional"|"consolidated"; }

``

# END FILE: src/contracts/relations.ts

---

# FILE: src/contracts/sharing.ts

``typescript
import type { EntityId } from "./core";

export type ShareDestination = "person-summary" | "family-summary" | "supervision" | "transcription" | "journey" | "ai-export";
export interface ShareDecision {
  entityId: EntityId;
  destination: ShareDestination;
  allowed: boolean;
  requiresReview: boolean;
  reasons: string[];
}

export interface SharedCard {
  id: EntityId;
  sourceType: "condition" | "medication" | "exam" | "screening" | "plan";
  title: string;
  body: string;
  stateLabel: string;
  selected: boolean;
  blocked: boolean;
  blockReason?: string;
}

export interface HandoffDraft {
  duration: "30s" | "2min" | "full";
  identification: string;
  facts: string[];
  interpretations: string[];
  actions: string[];
  questions: string[];
}

``

# END FILE: src/contracts/sharing.ts

---

# FILE: src/data/synthetic/README.md

``markdown
# Dados sintéticos

Este diretório contém exclusivamente dados de demonstração derivados da simulação formal do projeto.

## Proibições

- não substituir por dados reais;
- não colar prontuários;
- não incluir nomes, documentos, endereços ou contatos;
- não usar deploy de preview para acompanhamento real.

Os scripts de verificação exigem a marca `"synthetic": true` nos arquivos JSON de demonstração.

``

# END FILE: src/data/synthetic/README.md

---

# FILE: src/data/synthetic/semester-2026-2.json

``json
{
  "synthetic": true,
  "semester": {
    "id": "sem_demo_2026_2",
    "code": "SEM-2026-2",
    "label": "UBS, segundo semestre de 2026",
    "state": "active",
    "expectedFamilyCount": 2
  },
  "families": [
    {
      "id": "family_demo_horizonte",
      "code": "F-001",
      "nickname": "Horizonte",
      "state": "active",
      "focus": "complexidade clínica e farmacológica"
    },
    {
      "id": "family_demo_travessia",
      "code": "F-002",
      "nickname": "Travessia",
      "state": "active",
      "focus": "complexidade relacional e preventiva"
    }
  ],
  "notes": [
    "Todos os dados deste arquivo são sintéticos.",
    "A quantidade esperada de duas famílias não é limite técnico.",
    "Nenhum nome, documento, endereço ou dado clínico real é permitido."
  ]
}

``

# END FILE: src/data/synthetic/semester-2026-2.json

---

# FILE: src/data/synthetic/wave-d-semester.json

``json
{
  "synthetic": true,
  "scenarioVersion": 1,
  "semester": {
    "id": "sem_demo_2026_2",
    "code": "SEM-2026-2",
    "label": "Piloto sintético integral",
    "expectedFamilyCount": 2,
    "state": "active"
  },
  "families": [
    {
      "id": "family_demo_horizonte",
      "code": "F-001",
      "nickname": "Horizonte",
      "focus": "complexidade clínica e farmacológica",
      "people": [
        {
          "id": "p_h_1",
          "code": "P-H1",
          "ageBand": "older-adult",
          "role": "pessoa acompanhada"
        },
        {
          "id": "p_h_2",
          "code": "P-H2",
          "ageBand": "adult",
          "role": "cuidadora familiar"
        }
      ],
      "encounters": [
        {
          "id": "e_h_1",
          "at": "2026-08-12T14:00:00-03:00",
          "title": "Primeiro encontro",
          "nextStep": "Conferir embalagens e unidades dos exames"
        },
        {
          "id": "e_h_2",
          "at": "2026-09-09T14:00:00-03:00",
          "title": "Revisão longitudinal",
          "nextStep": "Discutir divergência de uso na preceptoria"
        }
      ],
      "conditions": [
        {
          "label": "pressão alta",
          "confirmation": "reported"
        },
        {
          "label": "diabetes",
          "confirmation": "reported"
        },
        {
          "label": "possível alteração renal",
          "confirmation": "uncertain"
        }
      ],
      "medications": [
        {
          "label": "comprimido branco para pressão",
          "identification": "partial",
          "dosePublished": false
        },
        {
          "label": "metformina relatada",
          "identification": "generic-name",
          "dosePublished": false
        }
      ],
      "exams": [
        {
          "name": "creatinina",
          "value": "1,4",
          "unit": "",
          "interpretationState": "insufficient-data"
        },
        {
          "name": "HbA1c",
          "value": "8,1",
          "unit": "%",
          "interpretationState": "recorded-not-diagnosed"
        }
      ],
      "pending": [
        {
          "id": "pend_h_1",
          "title": "Confirmar medicamento anti-hipertensivo",
          "destination": "continuity-recommended"
        },
        {
          "id": "pend_h_2",
          "title": "Recuperar unidade da creatinina",
          "destination": "not-recoverable"
        }
      ],
      "reflections": [
        {
          "title": "Incerteza não é ausência",
          "learning": [
            "Preservar termo relatado",
            "Não inferir unidade",
            "Separar prescrição de uso"
          ]
        }
      ],
      "feedbacks": [
        {
          "topic": "preceptoria",
          "text": "Levar embalagens e cronologia, sem reconstruir dose por memória",
          "action": "Criar lista de conferência"
        }
      ]
    },
    {
      "id": "family_demo_travessia",
      "code": "F-002",
      "nickname": "Travessia",
      "focus": "complexidade relacional e preventiva",
      "people": [
        {
          "id": "p_t_1",
          "code": "P-T1",
          "ageBand": "adolescent",
          "role": "pessoa acompanhada"
        },
        {
          "id": "p_t_2",
          "code": "P-T2",
          "ageBand": "adult",
          "role": "responsável A"
        },
        {
          "id": "p_t_3",
          "code": "P-T3",
          "ageBand": "adult",
          "role": "responsável B"
        }
      ],
      "households": [
        {
          "id": "h_t_1",
          "label": "domicílio A"
        },
        {
          "id": "h_t_2",
          "label": "domicílio B"
        }
      ],
      "encounters": [
        {
          "id": "e_t_1",
          "at": "2026-08-19T14:00:00-03:00",
          "title": "Mapeamento de domicílios",
          "nextStep": "Revisar perspectivas separadamente"
        },
        {
          "id": "e_t_2",
          "at": "2026-09-16T14:00:00-03:00",
          "title": "Rastreamento retomado",
          "nextStep": "Registrar decisão e recurso comunitário"
        }
      ],
      "relationships": [
        {
          "source": "p_t_1",
          "target": "p_t_2",
          "perspective": "adolescente",
          "quality": "variable"
        },
        {
          "source": "p_t_1",
          "target": "p_t_3",
          "perspective": "responsável A",
          "quality": "uncertain"
        }
      ],
      "screenings": [
        {
          "topic": "bem-estar",
          "state": "postponed",
          "laterState": "accepted"
        }
      ],
      "thirdPartyNotes": [
        {
          "text": "Relato sintético sobre terceiro",
          "sharingState": "blocked"
        }
      ],
      "resources": [
        {
          "label": "grupo comunitário sintético",
          "state": "potential"
        }
      ],
      "pending": [
        {
          "id": "pend_t_1",
          "title": "Confirmar participação no recurso",
          "destination": "continuity-recommended"
        }
      ],
      "reflections": [
        {
          "title": "Perspectivas não são erro",
          "learning": [
            "Registrar autoria",
            "Não fundir versões",
            "Proteger terceiro"
          ]
        }
      ],
      "feedbacks": [
        {
          "topic": "preceptoria",
          "text": "Manter o adolescente como sujeito e não como vínculo entre adultos",
          "action": "Revisar resumo compartilhável"
        }
      ]
    }
  ],
  "incidentDrills": [
    {
      "id": "inc_1",
      "kind": "tampered-backup",
      "expected": "reject"
    },
    {
      "id": "inc_2",
      "kind": "wrong-passphrase",
      "expected": "reject"
    },
    {
      "id": "inc_3",
      "kind": "open-pending-before-close",
      "expected": "block"
    }
  ],
  "closure": {
    "pendingPolicy": "explicit-destination",
    "snapshotImmutable": true,
    "addendum": {
      "title": "Correção sintética de data",
      "reason": "Teste de adendo",
      "changesOriginal": false
    }
  }
}

``

# END FILE: src/data/synthetic/wave-d-semester.json

---

# FILE: src/domain/care-selectors.ts

``typescript
import type { CarePlan, ConditionRecord, ExamResultRecord, PersonMedicationRecord, ScreeningEpisode } from "@/src/contracts/longitudinal";
import type { HandoffDraft, SharedCard } from "@/src/contracts/sharing";
import type { Encounter } from "@/src/contracts/care";
import type { Person } from "@/src/contracts/family";
import { sharingDecision } from "./sharing-policy";

type CareEntity = ConditionRecord|PersonMedicationRecord|ExamResultRecord|ScreeningEpisode|CarePlan;

export function createSharedCards(entities:CareEntity[]):SharedCard[] {
 return entities.map((entity)=>{
  const decision=sharingDecision(entity,"person-summary");
  let sourceType:SharedCard["sourceType"]; let title:string; let body:string; let stateLabel:string;
  if ("originalLabel" in entity) { sourceType="condition"; title=entity.originalLabel; body=entity.sharedSummary??"Esta informação ainda precisa ser explicada antes de compartilhar."; stateLabel=entity.clinicalState; }
  else if ("reportedName" in entity) { sourceType="medication"; title=entity.reportedName; body=entity.sharedSummary??`Uso informado: ${entity.actualUseText??"a confirmar"}.`; stateLabel=entity.state; }
  else if ("examName" in entity) { sourceType="exam"; title=entity.examName; body=entity.sharedSummary??`Resultado registrado: ${entity.valueText}${entity.unit?` ${entity.unit}`:""}.`; stateLabel=entity.interpretationState; }
  else if ("objective" in entity) { sourceType="plan"; title=entity.title; body=entity.sharedSummary??entity.objective; stateLabel=entity.state; }
  else { sourceType="screening"; title=entity.title; body=entity.sharedSummary??"Este item está sendo acompanhado."; stateLabel=entity.state; }
  return { id:entity.id, sourceType, title, body, stateLabel, selected:decision.allowed&&!decision.requiresReview, blocked:!decision.allowed, ...(decision.reasons[0]?{blockReason:decision.reasons.join(" ")}: {}) };
 });
}

export function buildHandoff(person:Person, entities:CareEntity[], encounters:Encounter[], duration:HandoffDraft["duration"]):HandoffDraft {
 const facts=entities.slice(0,duration==="30s"?3:duration==="2min"?8:999).map((entity)=>{
  if("originalLabel" in entity) return `${entity.originalLabel} (${entity.kind}, ${entity.clinicalState})`;
  if("reportedName" in entity) return `${entity.reportedName}: ${entity.state}`;
  if("examName" in entity) return `${entity.examName}: ${entity.valueText}${entity.unit?` ${entity.unit}`:" unidade não informada"}`;
  if("objective" in entity) return `Plano: ${entity.title} (${entity.state})`;
  return `Rastreamento: ${entity.title} (${entity.state})`;
 });
 const recent=encounters.filter((item)=>item.personIds.includes(person.id)).slice(0,duration==="30s"?1:duration==="2min"?3:999);
 return { duration, identification:`${person.displayName??person.code}, ${person.lifeStage??"faixa etária não informada"}.`, facts, interpretations:[], actions:recent.map((item)=>item.nextStep).filter((value):value is string=>Boolean(value)), questions:[] };
}

export function transcriptionText(person:Person, entities:CareEntity[], encounters:Encounter[]):string {
 const draft=buildHandoff(person,entities,encounters,"full");
 return [`IDENTIFICAÇÃO`,draft.identification,"","DADOS REGISTRADOS",...draft.facts.map((item)=>`- ${item}`),"","ENCONTROS RECENTES",...encounters.filter((item)=>item.personIds.includes(person.id)).slice(0,5).map((item)=>`- ${item.occurredAt}: ${item.title}${item.nextStep?` | Próximo: ${item.nextStep}`:""}`)].join("\n");
}

``

# END FILE: src/domain/care-selectors.ts

---

