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
