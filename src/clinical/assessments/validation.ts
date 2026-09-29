import type { InstrumentApplication, InstrumentDefinition, EcomapLink, EcomapLinkProposal, QuestionDefinition } from "./types";

export interface AssessmentValidation {
  valid: boolean;
  errors: string[];
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
