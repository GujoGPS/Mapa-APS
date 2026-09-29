import { describe, expect, it } from "vitest";
import {
  adultDcntEsfDefinition,
  canCompareApplications,
  conservativeVisibility,
  validateEcomapLink,
  validateEcomapProposal,
  validateInstrumentApplication,
  validateInstrumentDefinition,
} from "@/src/clinical/assessments";
import type { EcomapLink, InstrumentApplication } from "@/src/clinical/assessments";

const byId = (id: string) => adultDcntEsfDefinition.questions.find((question) => question.id === id);

describe("definição versionada da avaliação adulta DCNT ESF", () => {
  it("preserva metadados, seções disponíveis e lacunas da fonte", () => {
    expect(adultDcntEsfDefinition.id).toBe("adult-dcnt-esf");
    expect(adultDcntEsfDefinition.version).toBe("local-esf-2026-page-28-v1");
    expect(adultDcntEsfDefinition.origin).toContain("Instrumento local");
    expect(adultDcntEsfDefinition.sourcePage).toBe(28);
    expect(adultDcntEsfDefinition.availableSections).toEqual([1, 2, 6, 7, 8]);
    expect(adultDcntEsfDefinition.missingSections).toEqual([3, 4, 5]);
    expect(adultDcntEsfDefinition.sections.filter((section) => section.status === "source-missing")).toHaveLength(3);
    expect(adultDcntEsfDefinition.sections.find((section) => section.printedBlockNumber === 8)?.status).toBe("title-only-in-source");
  });

  it("mantém a completude dos campos e opções da página", () => {
    expect(adultDcntEsfDefinition.sections).toHaveLength(10);
    expect(adultDcntEsfDefinition.questions).toHaveLength(45);
    expect(adultDcntEsfDefinition.questions.reduce((total, question) => total + question.options.length, 0)).toBe(114);
    expect(adultDcntEsfDefinition.questions.map((question) => question.id)).toEqual(expect.arrayContaining([
      "header.person-name", "header.cpf", "header.birth-date", "header.health-unit", "header.community-health-worker", "header.assessment-date",
      "sociodemographic.age", "sociodemographic.self-declared-race", "sociodemographic.marital-status", "sociodemographic.education",
      "sociodemographic.current-occupation", "sociodemographic.family-income-per-capita",
      "health.diagnosed-chronic-conditions", "health.other-chronic-condition-description", "health.chronic-disease-follow-up-exams", "health.hypertension-blood-pressure-follow-up",
      "screening.cervical-preventive", "screening.mammography", "screening.bone-densitometry", "screening.colorectal-cancer",
      "physical.weight", "physical.height", "physical.bmi", "physical.waist-circumference", "physical.waist-classification",
      "laboratory.hba1c.value", "laboratory.hba1c.date", "blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-1.date",
      "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic", "blood-pressure.visit-2.date", "blood-pressure.mean",
      "blood-pressure.control", "cardiovascular-risk", "foot.skin-and-deformity-findings", "foot.neuropathy-screening",
      "foot.right.dorsalis-pedis-pulse", "foot.right.posterior-tibial-pulse", "foot.left.dorsalis-pedis-pulse", "foot.left.posterior-tibial-pulse",
      "summary.services", "summary.other-service-description", "summary.ciap-2",
    ]));
    expect(byId("sociodemographic.self-declared-race")?.options).toHaveLength(5);
    expect(byId("sociodemographic.marital-status")?.options).toHaveLength(5);
    expect(byId("sociodemographic.education")?.options).toHaveLength(7);
    expect(byId("sociodemographic.current-occupation")?.options).toHaveLength(8);
    expect(byId("sociodemographic.family-income-per-capita")?.options).toHaveLength(7);
    expect(byId("health.diagnosed-chronic-conditions")?.options).toHaveLength(12);
    expect(byId("foot.skin-and-deformity-findings")?.options).toHaveLength(10);
    expect(byId("summary.services")?.options).toHaveLength(7);
    expect(byId("summary.services")?.options.every((option) => option.domainEffect === "proposed-network-or-referral-change")).toBe(true);
    expect(byId("health.diagnosed-chronic-conditions")?.options.find((option) => option.id === "other")?.domainEffect).toBe("proposal-only");
  });

  it("valida IDs, dependências, proveniência e visibilidade sem perguntas inventadas", () => {
    const result = validateInstrumentDefinition(adultDcntEsfDefinition);
    expect(result).toEqual({ valid: true, errors: [] });
    const sectionsWithoutQuestions = adultDcntEsfDefinition.sections.filter((section) => !section.implementable);
    expect(sectionsWithoutQuestions.every((section) => section.questions.length === 0)).toBe(true);
    expect(adultDcntEsfDefinition.questions.every((question) => question.provenance.origin && question.visibility)).toBe(true);
    expect(adultDcntEsfDefinition.questions.every((question) => question.visibility.scope !== "individual" || conservativeVisibility(question))).toBe(true);
    expect(adultDcntEsfDefinition.ambiguities).toHaveLength(10);
    expect(adultDcntEsfDefinition.ambiguities.map((ambiguity) => ambiguity.id)).toEqual(expect.arrayContaining([
      "occupation-selection-mode", "cervical-overlap", "mammography-overlap-gap", "bone-densitometry-overlap",
      "colorectal-method", "tacs-acs", "blood-pressure-control-threshold", "cardiovascular-risk-algorithm",
      "block-8-title-only", "missing-blocks",
    ]));
    expect(adultDcntEsfDefinition.sections.find((section) => section.printedBlockNumber === 8)?.declarativeCapabilities).toHaveLength(12);
    expect(adultDcntEsfDefinition.futureServiceStates).toHaveLength(12);
  });

  it("modela condicionais locais sem transformar ausência em resposta negativa", () => {
    expect(byId("health.other-chronic-condition-description")?.applicability?.dependencies).toEqual(["health.diagnosed-chronic-conditions"]);
    expect(byId("health.chronic-disease-follow-up-exams")?.applicability?.whenNotApplicable).toBe("not-applicable");
    expect(byId("health.hypertension-blood-pressure-follow-up")?.applicability?.condition).toContain("hypertension");
    expect(byId("screening.mammography")?.applicability?.manualReviewAllowed).toBe(true);
  });

  it("exige contexto familiar e sujeito clínico em cada aplicação", () => {
    const application = {
      applicationId: "application-1",
      familyId: "family-1",
      personId: "person-1",
      instrumentId: adultDcntEsfDefinition.id,
      instrumentVersion: adultDcntEsfDefinition.version,
      assessmentDate: "2026-09-28",
      status: "draft",
      kind: "initial",
      createdAt: "2026-09-28T00:00:00.000Z",
      updatedAt: "2026-09-28T00:00:00.000Z",
      responses: {},
    } satisfies InstrumentApplication;
    expect(validateInstrumentApplication(application).valid).toBe(true);
    expect(validateInstrumentApplication({ ...application, personId: "" }).valid).toBe(false);
    expect(validateInstrumentApplication({ ...application, familyId: "" }).valid).toBe(false);
    expect(validateInstrumentApplication({ ...application, familyId: "person-1" }).valid).toBe(false);
  });

  it("mantém aplicações e projeções individuais, sem detalhe clínico familiar", () => {
    const clinical = {
      subjectPersonId: "person-1", familyId: "family-1", scope: "individual",
      clinicalVisibility: "academic-private", personVisibility: "shareable-with-person",
      familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic",
      applicationId: "application-1", kind: "clinical-academic",
    } as const;
    const person = { ...clinical, kind: "person-friendly" } as const;
    expect(clinical.subjectPersonId).toBe(person.subjectPersonId);
    expect(clinical.familyVisibility).not.toBe("shareable-with-family");
    expect(person.subjectPersonId).toBe("person-1");
    expect(byId("health.diagnosed-chronic-conditions")?.visibility.familyVisibility).toBe("non-exportable");
    const first = {
      applicationId: "application-1", familyId: "family-1", personId: "person-1", instrumentId: "adult-dcnt-esf", instrumentVersion: "v1",
      assessmentDate: "2026-01-01", status: "completed", kind: "initial", createdAt: "2026-01-01", updatedAt: "2026-01-01", responses: {},
    } as InstrumentApplication;
    expect(canCompareApplications(first, { ...first, applicationId: "application-2", assessmentDate: "2026-06-01" })).toBe(true);
    expect(canCompareApplications(first, { ...first, applicationId: "application-3", personId: "person-2" })).toBe(false);
  });

  it("diferencia ecomapa familiar, membros selecionados, proposta e vínculo ativo", () => {
    const familyLink = {
      networkRelationshipId: "network-1", familyId: "family-1", scope: "family", relatedPersonIds: [],
      serviceOrNetworkId: "ubs", status: "active", source: "printed-local-form",
      visibility: byId("header.health-unit")!.visibility, createdAt: "2026-09-28T00:00:00.000Z", updatedAt: "2026-09-28T00:00:00.000Z",
    } satisfies EcomapLink;
    expect(validateEcomapLink(familyLink, ["person-1", "person-2"]).valid).toBe(true);
    expect(validateEcomapLink({ ...familyLink, scope: "selected-members", relatedPersonIds: [] }, ["person-1"]).valid).toBe(false);
    expect(validateEcomapLink({ ...familyLink, scope: "selected-members", relatedPersonIds: ["person-3"] }, ["person-1"]).valid).toBe(false);
    expect(validateEcomapProposal({
      proposalId: "proposal-1", familyId: "family-1", subjectPersonId: "person-1", applicationId: "application-1",
      serviceOrNetworkId: "caps", proposedScope: "selected-members", relatedPersonIds: ["person-1"],
      proposedStatus: "suggested", justificationPrivate: "Revisão humana necessária.", visibility: byId("health.diagnosed-chronic-conditions")!.visibility,
      decision: "pending-review",
    }, ["person-1"]).valid).toBe(true);
  });
});
