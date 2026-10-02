import { describe, expect, it } from "vitest";
import {
  adultDcntEsfDefinition,
  deriveCareFacts,
  factsForCurrentRevision,
  personVisibleFactsAfterReview,
  operationalFamilyFacts,
  proposedChanges,
  supersedeFacts,
  longitudinalChanges,
  type CareFact,
  type InstrumentAnswer,
  type InstrumentApplication,
} from "@/src/clinical/assessments";

const date = "2026-03-10T00:00:00.000Z";

const questionType = (questionId: string): InstrumentAnswer["answerType"] =>
  adultDcntEsfDefinition.questions.find((question) => question.id === questionId)?.answerType ?? "short-text";

function answer(questionId: string, value: InstrumentAnswer["value"], extra: Partial<InstrumentAnswer> = {}): InstrumentAnswer {
  return { questionId, answerType: questionType(questionId), value, source: "person", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date, ...extra } as InstrumentAnswer;
}

function application(answers: Record<string, InstrumentAnswer>, overrides: Partial<InstrumentApplication> = {}): InstrumentApplication {
  return {
    applicationId: "assessment-1",
    familyId: "family-1",
    personId: "person-1",
    instrumentId: adultDcntEsfDefinition.id,
    instrumentVersion: adultDcntEsfDefinition.version,
    assessmentDate: "2026-03-10",
    status: "draft",
    kind: "initial",
    createdAt: date,
    updatedAt: date,
    answers,
    applicabilityOverrides: {},
    provenance: { origin: "printed-local-form", sourceNote: "Aplicação impressa local." },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal",
    schemaVersion: 1,
    revisionNumber: 1,
    ...overrides,
  };
}

function topic(fact: CareFact | undefined): CareFact["topic"] {
  if (!fact) throw new Error("fato ausente");
  return fact.topic;
}

describe("fatos clínicos derivados da aplicação ESF", () => {
  it("deriva medidas e cálculos determinísticos a partir das respostas", () => {
    const { facts, errors } = deriveCareFacts(application({
      "header.birth-date": answer("header.birth-date", "1980-05-10"),
      "physical.weight": answer("physical.weight", 80),
      "physical.height": answer("physical.height", 1.6),
      "physical.waist-circumference": answer("physical.waist-circumference", 92),
    }, { waistCriterion: "male-local-rule" }));

    expect(errors).toEqual([]);
    expect(topic(facts.find((item) => item.topic === "age-at-assessment"))).toBe("age-at-assessment");
    const bmi = facts.find((item) => item.topic === "bmi");
    expect(bmi?.value).toMatchObject({ value: expect.closeTo(31.25, 2) });
    expect(bmi?.ruleId).toBe("calculate-bmi-v1");
    expect(bmi?.derivationType).toBe("calculated");
    expect(facts.find((item) => item.topic === "waist-classification")).toMatchObject({ certaintyState: "calculated" });
    expect(facts.every((item) => item.factVersion === "1" && item.personId === "person-1" && item.familyId === "family-1")).toBe(true);
  });

  it("não inventa limiar automático de pressão nem algoritmo de risco ausentes na fonte", () => {
    const { facts } = deriveCareFacts(application({
      "blood-pressure.visit-1.systolic": answer("blood-pressure.visit-1.systolic", { systolic: 135 }, { unit: "mmHg" }),
            "blood-pressure.visit-1.diastolic": answer("blood-pressure.visit-1.diastolic", { diastolic: 85 }, { unit: "mmHg" }),
            "blood-pressure.visit-2.systolic": answer("blood-pressure.visit-2.systolic", { systolic: 140 }, { unit: "mmHg" }),
            "blood-pressure.visit-2.diastolic": answer("blood-pressure.visit-2.diastolic", { diastolic: 90 }, { unit: "mmHg" }),
    }));
    expect(facts.some((item) => item.topic === "blood-pressure-mean")).toBe(true);
    expect(facts.some((item) => item.topic === "blood-pressure-control")).toBe(false);
    expect(facts.some((item) => item.topic === "cardiovascular-risk")).toBe(false);
    expect(facts.filter((item) => item.derivationType === "source-limitation").map((item) => item.topic)).toEqual(
      expect.arrayContaining(["cardiovascular-risk-algorithm", "blood-pressure-control-threshold"]),
    );
  });

  it("não converte “não recorda” nem “nunca” em ausência de dado, mas gera seguimento", () => {
    const { facts } = deriveCareFacts(application({
      "screening.cervical-preventive": answer("screening.cervical-preventive", "does-not-remember"),
      "screening.mammography": answer("screening.mammography", "never"),
    }));
    const cervical = facts.find((item) => item.topic === "screening.cervical-preventive");
    expect(cervical?.certaintyState).toBe("uncertain");
    expect(facts.some((item) => item.topic === "screening.cervical-preventive" && item.derivationType === "missing-information")).toBe(false);
    expect(facts.some((item) => item.topic === "screening.mammography:follow-up" && item.actionable)).toBe(true);
  });

  it("registra serviço como mudança proposta, nunca como vínculo ativo", () => {
    const { facts } = deriveCareFacts(application({
      "summary.services": answer("summary.services", ["physiotherapy-or-rehabilitation"]),
    }));
    const proposal = proposedChanges(facts);
    expect(proposal).toHaveLength(1);
    expect(proposal[0]).toMatchObject({ status: "suggested", actionable: true, factType: "proposed-domain-change" });
    expect(proposal[0]?.value).toMatchObject({ proposedScope: "selected-members", relatedPersonIds: ["person-1"] });
    expect(proposal[0]?.provenance.sourceNote).toMatch(/não cria vínculo ativo/i);
  });

  it("separa a visão da pessoa da visão clínica e reduz a visão familiar a status operacional", () => {
    const { facts } = deriveCareFacts(application({
      "sociodemographic.marital-status": answer("sociodemographic.marital-status", "married-or-stable-union"),
    }, { status: "in-review" }));
    const forPerson = personVisibleFactsAfterReview(facts);
        expect(forPerson.some((item) => item.derivationType === "source-limitation")).toBe(false);
        expect(forPerson.some((item) => item.topic === "marital-status")).toBe(false);

        const reviewed = facts.map((item) => item.topic === "marital-status" ? { ...item, reviewStatus: "reviewed" as const } : item);
        expect(personVisibleFactsAfterReview(reviewed).some((item) => item.topic === "marital-status")).toBe(true);

    const forFamily = operationalFamilyFacts(facts);
    expect(forFamily.every((item) => item.personVisibility === "hidden" && item.sourceQuestionIds.length === 0)).toBe(true);
    expect(new Set(forFamily.map((item) => item.topic))).toEqual(new Set(["assessment-operational-status"]));
  });

  it("registra informação faltante quando a própria ficha torna a pergunta aplicável", () => {
      const { facts } = deriveCareFacts(application({
        "health.diagnosed-chronic-conditions": answer("health.diagnosed-chronic-conditions", ["hypertension"]),
      }, { status: "in-review" }));
      const missing = facts.filter((item) => item.derivationType === "missing-information");
      expect(missing.map((item) => item.topic)).toContain("health.hypertension-blood-pressure-follow-up");
      expect(missing.every((item) => item.certaintyState === "missing" && item.actionable)).toBe(true);
    });

    it("não declara falta de resposta quando a aplicabilidade não é resolvível", () => {
      const { facts } = deriveCareFacts(application({}, { status: "in-review" }));
      expect(facts.filter((item) => item.derivationType === "missing-information")).toEqual([]);
    });

  it("retificação substitui a revisão anterior sem apagar o histórico", () => {
    const first = deriveCareFacts(application({ "physical.weight": answer("physical.weight", 80) }, { status: "completed" })).facts;
    const rectification = deriveCareFacts(application({ "physical.weight": answer("physical.weight", 78) }, {
      applicationId: "assessment-2", status: "completed", revisionNumber: 2, rectifiesApplicationId: "assessment-1",
    })).facts;
    const superseded = supersedeFacts(first, "assessment-1", date);
    expect(factsForCurrentRevision(superseded, "assessment-1")).toEqual([]);
    expect(superseded.find((item) => item.topic === "physical.weight")).toMatchObject({ reviewStatus: "superseded", invalidationReason: expect.stringMatching(/retifica/i) });
    expect(factsForCurrentRevision(rectification, "assessment-2").some((item) => item.topic === "physical.weight")).toBe(true);
  });

  it("descreve mudança longitudinal entre duas aplicações da mesma pessoa", () => {
    const before = deriveCareFacts(application({ "physical.weight": answer("physical.weight", 80), "health.chronic-disease-follow-up-exams": answer("health.chronic-disease-follow-up-exams", "yes") }, { status: "completed" })).facts;
    const after = deriveCareFacts(application({ "physical.weight": answer("physical.weight", 76), "health.chronic-disease-follow-up-exams": answer("health.chronic-disease-follow-up-exams", "no"), "header.birth-date": answer("header.birth-date", "1980-05-10") }, { applicationId: "assessment-9", assessmentDate: "2026-09-10", status: "completed", revisionNumber: 2, kind: "reassessment" })).facts;

    const changes = longitudinalChanges(before, after);
    expect(changes.find((item) => item.topic === "physical.weight")?.changeType).toBe("changed");
    expect(changes.find((item) => item.topic === "chronic-disease-exams-not-reported")?.changeType).toBe("added");
    expect(changes.find((item) => item.topic === "age-at-assessment")?.changeType).toBe("added");
  });

  it("recusa derivação para instrumento incompatível sem gerar fatos", () => {
    const result = deriveCareFacts(application({}, { instrumentVersion: "outra-versao" }));
    expect(result.facts).toEqual([]);
    expect(result.errors[0]?.code).toBe("unsupported-instrument");
  });
});
