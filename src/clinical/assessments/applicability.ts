import type { InstrumentApplication, QuestionDefinition } from "./types";

export type AutomaticApplicabilityState = "applicable" | "not-applicable" | "not-assessed";

/**
 * Aplicabilidade e regra do dominio, nao da interface: a condicao vem da ficha impressa e o
 * override humano do avaliador prevalece sobre a leitura automatica.
 */
export function questionApplicable(application: InstrumentApplication, question: QuestionDefinition): boolean {
  if (!question.applicability) return true;
  const override = application.applicabilityOverrides[question.id];
  if (override) return override.state === "applicable";
  if (question.applicability.condition.includes("contains")) {
    const dependency = application.answers[question.applicability.dependencies[0] ?? ""];
    const values = dependency?.answerType === "multiple-choice" ? dependency.value : dependency?.answerType === "single-choice" ? [dependency.value] : [];
    if (question.applicability.condition.includes("other")) return values.includes("other");
    if (question.applicability.condition.includes("hypertension")) return values.includes("hypertension");
    return values.length > 0;
  }

  return false;
}

/** Estado automático ignora overrides deliberados para dizer o que a regra sozinha concluiria. */
export function automaticApplicabilityState(application: InstrumentApplication, question: QuestionDefinition): AutomaticApplicabilityState {
  if (!question.applicability) return "applicable";
  if (question.applicability.condition.includes("contains")) return questionApplicable({ ...application, applicabilityOverrides: {} }, question) ? "applicable" : "not-applicable";
  return "not-assessed";
}
