import { adultDcntEsfDefinition } from "./instruments/adult-dcnt-esf/definition";
import {
  type CareFact,
  type CareFactCategory,
  type CareFactDerivationResult,
  type CareFactDerivationType,
  type InstrumentAnswer,
  type InstrumentApplication,
  type InstrumentDefinition,
    type LongitudinalFactChange,
      type LongitudinalChangeType,
      type QuestionDefinition,
      type ServiceRelationshipState,
} from "./types";
import { calculateBloodPressureMean, calculateBmi, classifyBmi, classifyWaistCircumference, deriveAdultAgeBand } from "./calculations";
import { questionApplicable } from "./applicability";
import { validateApplicationAnswers } from "./validation";

export const CARE_FACT_VERSION = "1";
const sourceLimitationDefinitions = [
  ["source-missing-block-3", "Bloco 3 não disponível."],
  ["source-missing-block-4", "Bloco 4 não disponível."],
  ["source-missing-block-5", "Bloco 5 não disponível."],
  ["family-diagrams-and-clinical-observations", "Bloco 8 disponível somente pelo título."],
  ["cardiovascular-risk-algorithm", "Algoritmo de risco cardiovascular ausente."],
  ["blood-pressure-control-threshold", "Limiar automático de controle de PA ausente."],
  ["cervical-overlap", "Sobreposição das categorias do rastreamento cervical preservada."],
  ["mammography-overlap-gap", "Sobreposição ou lacuna das categorias de mamografia preservada."],
  ["bone-densitometry-overlap", "Sobreposição semântica da densitometria preservada."],
  ["colorectal-method", "Método colorretal não distinguido na ficha."],
  ["tacs-acs", "TACS/ACS permanece ambíguo na fonte."],
  ["occupation-selection-mode", "Cardinalidade da ocupação aguarda validação."],
] as const;

const individualDefaults = {
  subjectScope: "individual" as const,
  clinicalVisibility: "visible" as const,
  personVisibility: "visible-after-review" as const,
  familyVisibility: "operational-status-only" as const,
};

function stableId(applicationId: string, key: string): string {
  return `${applicationId}:fact:${key}`;
}

function answer(application: InstrumentApplication, questionId: string): InstrumentAnswer | undefined {
  const value = application.answers[questionId];
  return value && value.status === "answered" && value.applicabilityState !== "not-applicable" ? value : undefined;
}

function rawAnswer(application: InstrumentApplication, questionId: string): InstrumentAnswer | undefined {
  return application.answers[questionId];
}

function valueOf(application: InstrumentApplication, questionId: string): unknown {
  return answer(application, questionId)?.value;
}

function selected(application: InstrumentApplication, questionId: string): string[] {
  const value = valueOf(application, questionId);
  return Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
}

function fact(
  application: InstrumentApplication,
  key: string,
  input: Omit<CareFact, "factId" | "factVersion" | "applicationId" | "instrumentId" | "instrumentVersion" | "familyId" | "personId" | "recordedAt">,
): CareFact {
  return {
    factId: stableId(application.applicationId, key),
    factVersion: CARE_FACT_VERSION,
    applicationId: application.applicationId,
    instrumentId: application.instrumentId,
    instrumentVersion: application.instrumentVersion,
    familyId: application.familyId,
    personId: application.personId,
    recordedAt: application.updatedAt,
    ...(application.rectifiesApplicationId ? { rectifiesApplicationId: application.rectifiesApplicationId } : {}),
    ...input,
  };
}

function reported(
  application: InstrumentApplication,
  key: string,
  questionId: string,
  topic: string,
  value: unknown,
  category: CareFactCategory,
  options: Partial<CareFact> = {},
): CareFact {
  return fact(application, key, {
    factType: "reported",
    derivationType: "reported",
    sourceQuestionIds: [questionId],
    category,
    topic,
    value,
    certaintyState: "reported",
    reviewStatus: "needs-review",
    ...individualDefaults,
    actionable: false,
    provenance: { origin: "digital-adaptation", sourceNote: `Resposta informada na aplicação ${application.applicationId}.` },
    ...options,
  });
}

function measured(
  application: InstrumentApplication,
  key: string,
  questionIds: string[],
  topic: string,
  value: unknown,
  unit: string,
  category: CareFactCategory = "measurement",
  occurredAt = application.assessmentDate,
): CareFact {
  return fact(application, key, {
    factType: "measured",
    derivationType: "measured",
    sourceQuestionIds: questionIds,
    category,
    topic,
    value,
    unit,
    occurredAt,
    certaintyState: "measured",
    reviewStatus: "needs-review",
    ...individualDefaults,
    actionable: false,
    provenance: { origin: "printed-local-form", sourceNote: "Medida registrada na aplicação individual." },
  });
}

function calculated(
  application: InstrumentApplication,
  key: string,
  questionIds: string[],
  topic: string,
  value: unknown,
  ruleId: string,
  unit?: string,
  actionable = false,
  reviewStatus: CareFact["reviewStatus"] = "auto-derived",
): CareFact {
  return fact(application, key, {
    factType: "calculated",
    derivationType: "calculated",
    sourceQuestionIds: questionIds,
    category: "calculated-result",
    topic,
    value,
    ...(unit ? { unit } : {}),
    ruleId,
    ruleVersion: "1",
    certaintyState: "calculated",
    reviewStatus,
    ...individualDefaults,
    actionable,
    provenance: { origin: "mathematical-derivation", sourceNote: "Derivação determinística sem interpretação clínica adicional." },
  });
}

function missing(
  application: InstrumentApplication,
  questionId: string,
  topic: string,
  reason: string,
  applicabilityState: CareFact["applicabilityState"] = "incomplete",
): CareFact {
  return fact(application, `missing:${questionId}`, {
    factType: "missing-information",
    derivationType: "missing-information",
    sourceQuestionIds: [questionId],
    category: "missing-data",
    topic,
    value: { questionId, reason },
    certaintyState: "missing",
    reviewStatus: "needs-review",
    ...individualDefaults,
    actionable: true,
    applicabilityState,
    provenance: { origin: "digital-adaptation", sourceNote: reason },
  });
}

function addAnswerFacts(application: InstrumentApplication, facts: CareFact[]): void {
  const addReported = (questionId: string, topic: string, category: CareFactCategory, options?: Partial<CareFact>) => {
    const value = valueOf(application, questionId);
    if (value !== undefined) facts.push(reported(application, questionId, questionId, topic, value, category, options));
  };
  addReported("sociodemographic.self-declared-race", "self-declared-race", "demographic");
  addReported("sociodemographic.marital-status", "marital-status", "demographic");
  addReported("sociodemographic.education", "education", "demographic");
  addReported("sociodemographic.current-occupation", "occupation", "social-context");
  const income = valueOf(application, "sociodemographic.family-income-per-capita");
  if (income !== undefined) {
    facts.push(fact(application, "family-income", {
      factType: "reported", derivationType: "reported", sourceQuestionIds: ["sociodemographic.family-income-per-capita"],
      subjectScope: "family-context", category: "family-context", topic: "family-income-per-capita", value: income,
      certaintyState: "reported", reviewStatus: "needs-review", clinicalVisibility: "visible",
      personVisibility: "visible-after-review", familyVisibility: "operational-status-only", actionable: true,
      provenance: { origin: "digital-adaptation", sourceNote: "Contexto familiar informado em aplicação individual; não é promovido automaticamente." },
    }));
  }
  const conditions = selected(application, "health.diagnosed-chronic-conditions");
  const otherDescription = valueOf(application, "health.other-chronic-condition-description");
  for (const condition of conditions) {
    if (condition === "other" && typeof otherDescription !== "string") continue;
    facts.push(reported(application, `condition:${condition}`, "health.diagnosed-chronic-conditions", "reported-condition", condition === "other" ? { option: condition, description: otherDescription } : condition, "reported-condition", { actionable: true }));
  }
  const chronicFollowUp = valueOf(application, "health.chronic-disease-follow-up-exams");
  if (chronicFollowUp !== undefined) {
    addReported("health.chronic-disease-follow-up-exams", "chronic-disease-follow-up", "screening", { actionable: chronicFollowUp === "no" });
    if (chronicFollowUp === "no") facts.push(fact(application, "care-follow-up:chronic-exams", {
      factType: "care-follow-up", derivationType: "care-follow-up", sourceQuestionIds: ["health.chronic-disease-follow-up-exams"],
      category: "care-follow-up", topic: "chronic-disease-exams-not-reported",
      value: "not-reported-as-completed", certaintyState: "reported", reviewStatus: "needs-review",
      ...individualDefaults, actionable: true, provenance: { origin: "digital-adaptation", sourceNote: "Gerado a partir da resposta negativa da ficha." },
    }));
  }
  const bpFollowUp = valueOf(application, "health.hypertension-blood-pressure-follow-up");
  if (bpFollowUp !== undefined) {
    addReported("health.hypertension-blood-pressure-follow-up", "hypertension-blood-pressure-follow-up", "screening", { actionable: bpFollowUp === "no" });
    if (bpFollowUp === "no") facts.push(fact(application, "care-follow-up:blood-pressure", {
      factType: "care-follow-up", derivationType: "care-follow-up", sourceQuestionIds: ["health.hypertension-blood-pressure-follow-up"],
      category: "care-follow-up", topic: "blood-pressure-follow-up",
      value: "not-reported-as-recent", certaintyState: "reported", reviewStatus: "needs-review",
      ...individualDefaults, actionable: true, provenance: { origin: "digital-adaptation", sourceNote: "Não afirma descontrole da pressão." },
    }));
  }
  for (const questionId of ["screening.cervical-preventive", "screening.mammography", "screening.bone-densitometry", "screening.colorectal-cancer"]) {
    const raw = rawAnswer(application, questionId);
    const value = valueOf(application, questionId);
    if (value === undefined) continue;
    const uncertain = value === "does-not-remember";
    const never = value === "never";
    facts.push(reported(application, `screening:${questionId}`, questionId, questionId, {
      response: value,
      applicabilityState: raw?.applicabilityState ?? "applicable",
      override: application.applicabilityOverrides[questionId],
    }, "screening", {
      actionable: uncertain || never,
      certaintyState: uncertain ? "uncertain" : "reported",
      ...(uncertain ? { provenance: { origin: "digital-adaptation", sourceNote: "Não recorda não foi convertido em não realizado." } } : {}),
    }));
    if (never) facts.push(fact(application, `care-follow-up:${questionId}`, {
      factType: "care-follow-up", derivationType: "care-follow-up", sourceQuestionIds: [questionId],
      category: "care-follow-up", topic: `${questionId}:follow-up`,
      value: "never-reported", certaintyState: "reported", reviewStatus: "needs-review",
      ...individualDefaults, actionable: true, provenance: { origin: "digital-adaptation", sourceNote: "Categoria da própria ficha; não é ordem clínica." },
    }));
  }
  for (const id of ["physical.weight", "physical.height"]) {
    const value = valueOf(application, id);
    if (typeof value === "number") facts.push(measured(application, id, [id], id, value, id.endsWith("weight") ? "kg" : "m"));
  }
  const hba1c = valueOf(application, "laboratory.hba1c.value");
  if (typeof hba1c === "number") facts.push(measured(application, "hba1c", ["laboratory.hba1c.value", "laboratory.hba1c.date"].filter((id) => Boolean(rawAnswer(application, id))), "hba1c", hba1c, "%", "measurement", typeof valueOf(application, "laboratory.hba1c.date") === "string" ? valueOf(application, "laboratory.hba1c.date") as string : application.assessmentDate));
  for (const visit of [1, 2] as const) {
    const systolic = valueOf(application, `blood-pressure.visit-${visit}.systolic`);
    const diastolic = valueOf(application, `blood-pressure.visit-${visit}.diastolic`);
    if (typeof systolic === "object" && systolic && "systolic" in systolic && typeof (systolic as { systolic?: unknown }).systolic === "number"
      && typeof diastolic === "object" && diastolic && "diastolic" in diastolic && typeof (diastolic as { diastolic?: unknown }).diastolic === "number") {
      facts.push(measured(application, `blood-pressure:${visit}`, [`blood-pressure.visit-${visit}.systolic`, `blood-pressure.visit-${visit}.diastolic`, `blood-pressure.visit-${visit}.date`].filter((id) => Boolean(rawAnswer(application, id))), `blood-pressure.visit-${visit}`, { systolic: (systolic as { systolic: number }).systolic, diastolic: (diastolic as { diastolic: number }).diastolic }, "mmHg", "measurement", typeof valueOf(application, `blood-pressure.visit-${visit}.date`) === "string" ? valueOf(application, `blood-pressure.visit-${visit}.date`) as string : application.assessmentDate));
    }
  }
  const control = valueOf(application, "blood-pressure.control");
  if (control !== undefined) facts.push(reported(application, "manual:blood-pressure-control", "blood-pressure.control", "blood-pressure-control", control, "manual-classification", { factType: "manually-classified", derivationType: "manually-classified", certaintyState: "manual", actionable: true }));
  const risk = valueOf(application, "cardiovascular-risk");
  if (risk !== undefined) facts.push(reported(application, "manual:cardiovascular-risk", "cardiovascular-risk", "cardiovascular-risk", risk, "manual-classification", { factType: "manually-classified", derivationType: "manually-classified", certaintyState: "manual", actionable: true }));
  for (const id of ["foot.skin-and-deformity-findings", "foot.neuropathy-screening", "foot.right.dorsalis-pedis-pulse", "foot.right.posterior-tibial-pulse", "foot.left.dorsalis-pedis-pulse", "foot.left.posterior-tibial-pulse"]) {
    const value = valueOf(application, id);
    if (value === undefined) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) facts.push(reported(application, `foot:${id}:${item}`, id, id, { finding: item, ...(id.includes(".right.") ? { laterality: "right" } : {}), ...(id.includes(".left.") ? { laterality: "left" } : {}) }, "foot-assessment", { actionable: item === "active-ulceration" || item === "one-or-more-insensitive-areas" || item === "not-palpable" }));
  }
  const services = selected(application, "summary.services");
  for (const service of services) {
    const serviceValue = service === "other-service" ? valueOf(application, "summary.other-service-description") : service;
    if (service === "other-service" && typeof serviceValue !== "string") continue;
    facts.push(fact(application, `service:${service}`, {
      factType: "proposed-domain-change", derivationType: "proposed-domain-change", sourceQuestionIds: ["summary.services", ...(service === "other-service" ? ["summary.other-service-description"] : [])],
      category: "service-or-referral", topic: "service-proposal",
      value: { service: serviceValue, proposedScope: "selected-members", relatedPersonIds: [application.personId] },
      certaintyState: "reported", reviewStatus: "needs-review", ...individualDefaults, actionable: true,
      provenance: { origin: "digital-adaptation", sourceNote: "Proposta individual; não cria vínculo ativo nem atualiza ecomapa." },
      relatedPersonIds: [application.personId],
      status: "suggested" satisfies ServiceRelationshipState,
    }));
  }
  const ciap = valueOf(application, "summary.ciap-2");
  if (ciap !== undefined) facts.push(reported(application, "manual:ciap-2", "summary.ciap-2", "ciap-2", ciap, "manual-classification", { factType: "manually-classified", derivationType: "manually-classified", certaintyState: "manual", actionable: false }));
}

/**
 * A ficha so declara obrigatoriedade para perguntas com condicao de aplicabilidade ou marcadas
 * como required na definicao. Sem condicao na fonte, ausencia de resposta vira informacao
 * faltante apenas quando o avaliador marcou a pergunta como nao avaliada.
 */
function applicabilityRequiresAnswer(application: InstrumentApplication, question: QuestionDefinition): boolean {
  if (question.required) return questionApplicable(application, question);
  if (!question.applicability) return false;
  return questionApplicable(application, question);
}

export function deriveCareFacts(application: InstrumentApplication, definition: InstrumentDefinition = adultDcntEsfDefinition): CareFactDerivationResult {
  const errors: CareFactDerivationResult["errors"] = [];
  if (application.instrumentId !== definition.id || application.instrumentVersion !== definition.version) {
    errors.push({ code: "unsupported-instrument", message: `Definição incompatível com ${application.instrumentId}@${application.instrumentVersion}.` });
    return { facts: [], errors };
  }
  const structural = validateApplicationAnswers(application, definition, "draft");
  if (!structural.valid) {
    errors.push(...structural.errors.map((message) => ({ code: "invalid-application" as const, message })));
    return { facts: [], errors };
  }
  const facts: CareFact[] = [];
  addAnswerFacts(application, facts);
  const birthDate = valueOf(application, "header.birth-date");
  if (typeof birthDate === "string") {
    const age = deriveAdultAgeBand(birthDate, application.assessmentDate);
    facts.push(calculated(application, "age", ["header.birth-date", "header.assessment-date"], "age-at-assessment", age.ageYears, "derive-adult-age-band-v1", "years"));
    if (age.band) facts.push(calculated(application, "age-band", ["header.birth-date", "header.assessment-date"], "age-band", age.band, "derive-adult-age-band-v1"));
  }
  const weight = valueOf(application, "physical.weight");
  const height = valueOf(application, "physical.height");
  if (typeof weight === "number" && typeof height === "number") {
    const bmi = calculateBmi(weight, height);
    facts.push(calculated(application, "bmi", ["physical.weight", "physical.height"], "bmi", { value: bmi, classification: classifyBmi(bmi) }, "calculate-bmi-v1", "kg/m²"));
  }
  const waist = valueOf(application, "physical.waist-circumference");
  if (typeof waist === "number") {
    facts.push(measured(application, "waist", ["physical.waist-circumference"], "waist-circumference", waist, "cm"));
    if (application.waistCriterion && application.waistCriterion !== "not-selected") {
      facts.push(calculated(application, "waist-classification", ["physical.waist-circumference"], "waist-classification", { classification: classifyWaistCircumference(waist, application.waistCriterion), criterion: application.waistCriterion }, "classify-waist-local-rule-v1", "cm", false, "needs-review"));
    } else {
      facts.push(fact(application, "limitation:waist-criterion", {
        factType: "source-limitation", derivationType: "source-limitation", sourceQuestionIds: ["physical.waist-circumference"],
        subjectScope: "individual", category: "source-limitation", topic: "waist-classification-criterion",
        value: "criterion-not-selected", certaintyState: "limited", reviewStatus: "needs-review",
        clinicalVisibility: "visible", personVisibility: "hidden", familyVisibility: "hidden", actionable: false,
        provenance: { origin: "digital-adaptation", sourceNote: "Não inferir critério local." },
      }));
    }
  }
  const readings = facts.filter((item) => item.topic.startsWith("blood-pressure.") && item.factType === "measured").map((item) => item.value as { systolic: number; diastolic: number });
  if (readings.length === 2) facts.push(calculated(application, "blood-pressure-mean", ["blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic"], "blood-pressure-mean", calculateBloodPressureMean(readings as [{ systolic: number; diastolic: number }, { systolic: number; diastolic: number }]), "calculate-blood-pressure-mean-v1", "mmHg"));
  for (const [id, label] of sourceLimitationDefinitions) {
    facts.push(fact(application, `source-limitation:${id}`, {
      factType: "source-limitation", derivationType: "source-limitation", sourceQuestionIds: [],
      subjectScope: "individual", category: "source-limitation", topic: id, value: label,
      certaintyState: "limited", reviewStatus: "needs-review", clinicalVisibility: "visible", personVisibility: "hidden", familyVisibility: "hidden", actionable: false,
      provenance: { origin: "pending-clinical-source", sourceNote: label },
    }));
  }
  if (application.status === "in-review" || application.status === "completed" || application.status === "rectified") {
      for (const question of definition.questions) {
        const raw = rawAnswer(application, question.id);
        if (raw?.status === "unanswered" || raw?.applicabilityState === "incomplete") {
          facts.push(missing(application, question.id, question.id, "Resposta marcada como incompleta."));
        } else if (raw?.applicabilityState === "not-assessed") {
          facts.push(missing(application, question.id, question.id, "Pergunta não foi avaliada.", "not-assessed"));
        } else if (!raw && question.answerType !== "calculated-information" && applicabilityRequiresAnswer(application, question)) {
          facts.push(missing(application, question.id, question.id, "Pergunta com condicao de aplicabilidade da ficha e sem resposta."));
        }
      }
    }
    return { facts: facts.sort((left, right) => left.factId.localeCompare(right.factId)), errors };
  }

  export const deriveAssessmentFacts = deriveCareFacts;

export function factsForApplication(facts: CareFact[], applicationId: string): CareFact[] {
  return facts.filter((item) => item.applicationId === applicationId);
}

export function factsForCurrentRevision(facts: CareFact[], applicationId: string): CareFact[] {
  return factsForApplication(facts, applicationId).filter((item) => item.reviewStatus !== "superseded" && !item.invalidatedAt);
}

export function clinicalVisibleFacts(facts: CareFact[]): CareFact[] {
  return facts.filter((item) => item.clinicalVisibility !== "hidden");
}

export function personVisibleFactsAfterReview(facts: CareFact[]): CareFact[] {
  return facts.filter((item) => item.personVisibility !== "hidden" && (item.personVisibility !== "visible-after-review" || ["reviewed", "confirmed"].includes(item.reviewStatus)));
}

export function operationalFamilyFacts(facts: CareFact[]): CareFact[] {
  const visible = facts.filter((item) => item.familyVisibility !== "hidden");
  return visible.map((item) => ({
    ...item,
    topic: "assessment-operational-status",
    value: { actionable: item.actionable, hasProposal: item.derivationType === "proposed-domain-change" },
    sourceQuestionIds: [],
    clinicalVisibility: "summary-only",
    personVisibility: "hidden",
  }));
}

export function actionableFacts(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.actionable && !item.invalidatedAt && item.reviewStatus !== "superseded"); }
export function missingInformationFacts(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.factType === "missing-information"); }
export function proposedChanges(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.factType === "proposed-domain-change"); }
export function sourceLimitations(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.factType === "source-limitation"); }

/** Marca como superados os fatos de `applicationIdToSupersede`, preservando o histórico e a revisão que os originou. */
export function supersedeFacts(oldFacts: CareFact[], applicationIdToSupersede: string, invalidatedAt: string, reason = "Substituído por retificação."): CareFact[] {
  return oldFacts.map((item) => item.applicationId !== applicationIdToSupersede ? item : {
    ...item,
    reviewStatus: "superseded",
    invalidatedAt,
    invalidationReason: reason,
  });
}

export const invalidateFactsForRectification = supersedeFacts;

function comparable(factItem: CareFact): string {
  return JSON.stringify({ topic: factItem.topic, value: factItem.value, unit: factItem.unit, applicabilityState: factItem.applicabilityState, status: factItem.status });
}

export function longitudinalChanges(previous: CareFact[], current: CareFact[]): LongitudinalFactChange[] {
  const left = new Map(previous.map((item) => [item.topic, item]));
  const right = new Map(current.map((item) => [item.topic, item]));
  const topics = [...new Set([...left.keys(), ...right.keys()])].sort();
  return topics.map((topic) => {
    const before = left.get(topic);
    const after = right.get(topic);
    let changeType: LongitudinalChangeType = "unchanged";
    if (!before && after) changeType = after.factType === "missing-information" ? "newly-missing" : "added";
    else if (before && !after) changeType = before.factType === "missing-information" ? "resolved-missing" : "removed";
    else if (before && after && comparable(before) !== comparable(after)) changeType = "changed";
    return { topic, changeType, ...(before ? { previous: before } : {}), ...(after ? { current: after } : {}) };
  });
}
