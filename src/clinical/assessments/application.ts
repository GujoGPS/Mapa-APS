import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { getDemoSession } from "@/src/domain/demo-session";
import { listEntities } from "@/src/domain/repository";
import { checksumOf } from "@/src/storage/hash";
import { getAllValues, getValue, putValue } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import { adultDcntEsfDefinition } from "./instruments/adult-dcnt-esf/definition";
import {
  type AnswerSource,
  type AssessmentStatus,
  type DerivedAssessmentResult,
  type InstrumentAnswer,
  type InstrumentApplication,
  type InstrumentDefinition,
  type VisibilityMetadata,
} from "./types";
import { calculateBmi, calculateBloodPressureMean, classifyBmi, classifyWaistCircumference, deriveAdultAgeBand } from "./calculations";
import { persistApplicationFacts, supersedeFactsOfApplication } from "./fact-repository";
import {
  validateApplicationAnswers,
  validateInstrumentApplication,
} from "./validation";

export const APPLICATION_SCHEMA_VERSION = 1;
export const APPLICATION_ENTITY_TYPE = ENTITY_TYPES.instrumentApplication;

const defaultVisibility: VisibilityMetadata = {
  scope: "individual",
  clinicalVisibility: "academic-private",
  personVisibility: "shareable-with-person",
  familyVisibility: "non-exportable",
  reviewRequired: true,
  projectionStrategy: "clinical-academic",
};

function now(): string {
  return new Date().toISOString();
}

function applicationDefinition(application: InstrumentApplication): InstrumentDefinition {
  if (application.instrumentId === adultDcntEsfDefinition.id && application.instrumentVersion === adultDcntEsfDefinition.version) {
    return adultDcntEsfDefinition;
  }
  throw new Error(`Instrumento ou versão não disponível: ${application.instrumentId}@${application.instrumentVersion}`);
}

async function assertPersonInFamily(familyId: string, personId: string): Promise<void> {
  const [families, people, memberships] = await Promise.all([
    listEntities<Family>(ENTITY_TYPES.family),
    listEntities<Person>(ENTITY_TYPES.person),
    listEntities<FamilyMembership>(ENTITY_TYPES.membership),
  ]);
  const family = families.find((candidate) => candidate.id === familyId);
  const person = people.find((candidate) => candidate.id === personId);
  if (!family) throw new Error(`Família inexistente: ${familyId}`);
  if (!person) throw new Error(`Pessoa inexistente: ${personId}`);
  if (!memberships.some((membership) => membership.familyId === familyId && membership.personId === personId)) {
    throw new Error("A pessoa não pertence à família informada.");
  }
}

async function readApplication(applicationId: string): Promise<InstrumentApplication | undefined> {
  const record = await getValue<StoredEnvelope<InstrumentApplication>>(STORES.records, applicationId);
  if (record?.entityType !== APPLICATION_ENTITY_TYPE) return undefined;
  if (record.checksum && record.checksum !== await checksumOf(record.payload)) throw new Error("A aplicação está corrompida.");
  return record.payload;
}

async function persist(application: InstrumentApplication, previous?: InstrumentApplication): Promise<InstrumentApplication> {
  const session = await getDemoSession();
  if (session) {
    if (previous && previous.dataOrigin !== "synthetic-demo") throw new Error("Aplicações normais estão isoladas durante a demonstração.");
    application = { ...application, dataOrigin: "synthetic-demo" };
  }
  const structural = validateInstrumentApplication(application);
  if (!structural.valid) throw new Error(structural.errors.join(" "));
  const envelope: StoredEnvelope<InstrumentApplication> = {
    id: application.applicationId,
    entityType: APPLICATION_ENTITY_TYPE,
    payload: application,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    recordVersion: application.revisionNumber,
    checksum: await checksumOf(application),
  };
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<InstrumentApplication>>(STORES.records, application.applicationId);
  if (!readBack || readBack.checksum !== envelope.checksum || (await checksumOf(readBack.payload)) !== envelope.checksum) {
    throw new Error("A aplicação não passou pela verificação de integridade.");
  }
  return application;
}

export function transitionApplicationStatus(current: AssessmentStatus, next: AssessmentStatus): boolean {
  const transitions: Record<AssessmentStatus, AssessmentStatus[]> = {
    "not-started": ["draft"],
    draft: ["in-review", "archived"],
    "in-review": ["draft", "completed"],
    completed: ["rectified", "archived"],
    rectified: ["archived"],
    archived: [],
  };
  return transitions[current].includes(next);
}

export async function createApplication(input: {
  familyId: string;
  personId: string;
  assessmentDate: string;
  kind?: "initial" | "reassessment";
  instrument?: InstrumentDefinition;
}): Promise<InstrumentApplication> {
  const definition = input.instrument ?? adultDcntEsfDefinition;
  if (definition.id !== adultDcntEsfDefinition.id || definition.version !== adultDcntEsfDefinition.version) {
    throw new Error(`Instrumento ou versão não disponível: ${definition.id}@${definition.version}`);
  }
  await assertPersonInFamily(input.familyId, input.personId);
  const timestamp = now();
  const application: InstrumentApplication = {
    applicationId: `assessment_${crypto.randomUUID()}`,
    instrumentId: definition.id,
    instrumentVersion: definition.version,
    familyId: input.familyId,
    personId: input.personId,
    assessmentDate: input.assessmentDate,
    status: "draft",
    kind: input.kind ?? "initial",
    answers: {},
    applicabilityOverrides: {},
    createdAt: timestamp,
    updatedAt: timestamp,
    revisionNumber: 1,
    provenance: { origin: "digital-adaptation", sourceNote: "Aplicação individual criada a partir da definição versionada do instrumento." },
    visibility: defaultVisibility,
    dataOrigin: (await getDemoSession()) ? "synthetic-demo" : "normal",
    schemaVersion: APPLICATION_SCHEMA_VERSION,
  };
  return persist(application);
}

export async function getApplication(applicationId: string): Promise<InstrumentApplication | undefined> {
  return readApplication(applicationId);
}

export async function listApplicationsByPerson(personId: string, instrumentId?: string): Promise<InstrumentApplication[]> {
  const records = await getAllValues<StoredEnvelope<InstrumentApplication>>(STORES.records);
  return records
    .filter((record) => record.entityType === APPLICATION_ENTITY_TYPE && record.payload.personId === personId && (!instrumentId || record.payload.instrumentId === instrumentId))
    .map((record) => record.payload)
    .sort((left, right) => right.assessmentDate.localeCompare(left.assessmentDate) || right.updatedAt.localeCompare(left.updatedAt));
}

export async function listApplicationsByFamilyMetadata(familyId: string): Promise<import("./types").FamilyAssessmentStatusProjection[]> {
  const records = await getAllValues<StoredEnvelope<InstrumentApplication>>(STORES.records);
  return records
    .filter((record) => record.entityType === APPLICATION_ENTITY_TYPE && record.payload.familyId === familyId)
    .map(({ payload }) => ({
      familyId: payload.familyId,
      personId: payload.personId,
      applicationId: payload.applicationId,
      status: payload.status,
      assessmentDate: payload.assessmentDate,
      pendingCount: 0,
      hasDomainProposals: false,
    }));
}

export async function updateDraftApplication(
  applicationId: string,
  changes: { answers?: Record<string, InstrumentAnswer>; applicabilityOverrides?: InstrumentApplication["applicabilityOverrides"]; privateNotes?: string; waistCriterion?: InstrumentApplication["waistCriterion"] },
): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (current.status !== "draft" && current.status !== "in-review") throw new Error("Aplicação concluída ou arquivada não pode ser sobrescrita.");
  const next = { ...current, ...changes, ...(changes.privateNotes === undefined ? {} : { privateNotes: changes.privateNotes }), ...(changes.waistCriterion === undefined ? {} : { waistCriterion: changes.waistCriterion }), answers: changes.answers ?? current.answers, applicabilityOverrides: changes.applicabilityOverrides ?? current.applicabilityOverrides, updatedAt: now(), revisionNumber: current.revisionNumber + 1 };
  const validation = validateApplicationAnswers(next, applicationDefinition(next), "draft");
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  return persist(next, current);
}

export async function submitForReview(applicationId: string): Promise<InstrumentApplication> {
  return transitionApplication(applicationId, "in-review");
}

export async function returnApplicationToDraft(applicationId: string): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (!transitionApplicationStatus(current.status, "draft")) throw new Error(`Transição inválida: ${current.status} → draft`);
  return persist({ ...current, status: "draft", updatedAt: now(), revisionNumber: current.revisionNumber + 1 }, current);
}

export async function completeApplication(applicationId: string): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (current.status !== "in-review") throw new Error("Somente aplicações em revisão podem ser concluídas.");
  const validation = validateApplicationAnswers(current, applicationDefinition(current), "complete");
  if (!validation.valid) throw new Error([...validation.errors, ...(validation.missing ?? []).map((id) => `${id}: dado ausente`)].join(" "));
  const completedAt = now();
  const completed = await persist({ ...current, status: "completed", completedAt, updatedAt: completedAt, revisionNumber: current.revisionNumber + 1 }, current);
  await persistApplicationFacts(completed);
  return completed;
}

async function transitionApplication(applicationId: string, status: "draft" | "in-review" | "archived"): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (!transitionApplicationStatus(current.status, status)) throw new Error(`Transição inválida: ${current.status} → ${status}`);
  return persist({ ...current, status, updatedAt: now(), revisionNumber: current.revisionNumber + 1 }, current);
}

export async function archiveApplication(applicationId: string): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (!transitionApplicationStatus(current.status, "archived")) throw new Error(`Transição inválida: ${current.status} → archived`);
  return persist({ ...current, status: "archived", updatedAt: now(), revisionNumber: current.revisionNumber + 1 }, current);
}

export async function createRectification(applicationId: string): Promise<InstrumentApplication> {
  const original = await getApplication(applicationId);
  if (!original) throw new Error("Aplicação original inexistente.");
  if (original.status !== "completed" && original.status !== "rectified") throw new Error("Somente aplicações concluídas podem ser retificadas.");
  await assertPersonInFamily(original.familyId, original.personId);
  const timestamp = now();
  const { completedAt: _completedAt, rectifiedAt: _rectifiedAt, ...withoutCompletion } = original;
  const rectification = await persist({
    ...withoutCompletion,
    applicationId: `assessment_${crypto.randomUUID()}`,
    status: "draft",
    kind: "rectification",
    answers: structuredClone(original.answers),
    applicabilityOverrides: structuredClone(original.applicabilityOverrides),
    createdAt: timestamp,
    updatedAt: timestamp,
    rectifiesApplicationId: original.applicationId,
    revisionNumber: original.revisionNumber + 1,
    provenance: { origin: "digital-adaptation", sourceNote: `Retificação da aplicação ${original.applicationId}.` },
  });
  await supersedeFactsOfApplication(original.applicationId, rectification.applicationId);
  return rectification;
}

export async function saveAnswer(
  applicationId: string,
  answer: InstrumentAnswer,
): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  return updateDraftApplication(applicationId, { answers: { ...current.answers, [answer.questionId]: answer } });
}

export function createAnswer<T extends InstrumentAnswer>(answer: T, source: AnswerSource = "person"): T {
  return { ...answer, source, status: answer.status ?? "answered", answeredAt: answer.answeredAt ?? now(), updatedAt: now() } as T;
}

export function deriveApplicationResults(application: InstrumentApplication): DerivedAssessmentResult[] {
  const results: DerivedAssessmentResult[] = [];
  const answerValue = (questionId: string): unknown => application.answers[questionId]?.value;
  const birthDate = answerValue("header.birth-date");
  if (typeof birthDate === "string") {
    const result = deriveAdultAgeBand(birthDate, application.assessmentDate);
    results.push({
      id: `${application.applicationId}:sociodemographic.age`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "sociodemographic.age",
      value: result,
      rule: { id: "derive-adult-age-band-v1", version: "1", inputs: ["header.birth-date", "header.assessment-date"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
      provenance: { origin: "mathematical-derivation", sourceNote: "Derivado dos dados da própria aplicação." },
      reviewRequired: false,
    });
  }
  const weight = answerValue("physical.weight");
  const height = answerValue("physical.height");
  if (typeof weight === "number" && typeof height === "number") {
    results.push({
      id: `${application.applicationId}:physical.bmi`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "physical.bmi",
      value: { bmi: calculateBmi(weight, height), classification: classifyBmi(calculateBmi(weight, height)) },
      unit: "kg/m²",
      rule: { id: "derive-bmi-v1", version: "1", inputs: ["physical.weight", "physical.height"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
      provenance: { origin: "mathematical-derivation", sourceNote: "Derivado dos dados da própria aplicação." },
      reviewRequired: false,
    });
  }
  const readings = ["blood-pressure.visit-1.systolic", "blood-pressure.visit-2.systolic"]
    .map((questionId, index) => {
      const prefix = `blood-pressure.visit-${index + 1}`;
      const systolic = answerValue(`${prefix}.systolic`);
      const diastolic = answerValue(`${prefix}.diastolic`);
      if (systolic && typeof systolic === "object" && "systolic" in systolic) return { systolic: systolic.systolic, diastolic: typeof diastolic === "object" && diastolic && "diastolic" in diastolic ? diastolic.diastolic : undefined };
      return undefined;
    })
    .filter((value): value is { systolic: number; diastolic: number } => Boolean(value && typeof value.systolic === "number" && typeof value.diastolic === "number"));
  if (readings.length === 2) {
    const firstReading = readings[0];
    const secondReading = readings[1];
    if (!firstReading || !secondReading) return results;
    results.push({
      id: `${application.applicationId}:blood-pressure.mean`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "blood-pressure.mean",
      value: calculateBloodPressureMean([firstReading, secondReading]),
      unit: "mmHg",
      rule: { id: "derive-blood-pressure-mean-v1", version: "1", inputs: ["blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
      provenance: { origin: "mathematical-derivation", sourceNote: "Média aritmética das aferições informadas." },
      reviewRequired: false,
    });
  }
  const waist = answerValue("physical.waist-circumference");
  if (typeof waist === "number" && application.waistCriterion && application.waistCriterion !== "not-selected") {
    results.push({
      id: `${application.applicationId}:physical.waist-classification`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "physical.waist-classification",
      value: classifyWaistCircumference(waist, application.waistCriterion),
      unit: "cm",
      rule: { id: "classify-waist-local-rule-v1", version: "1", inputs: ["physical.waist-circumference"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: true, algorithm: application.waistCriterion },
      provenance: { origin: "mathematical-derivation", sourceNote: "Classificação calculada pelo critério local explicitamente selecionado." },
      reviewRequired: true,
    });
  }
  return results;
}
