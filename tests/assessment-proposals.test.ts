import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ records: new Map<string, unknown>() }));

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (_store: string, id: string) => state.records.get(id)),
  getAllValues: vi.fn(async () => [...state.records.values()]),
  putValue: vi.fn(async (_store: string, value: { id: string }) => { state.records.set(value.id, value); }),
  replaceAllStores: vi.fn(async (stores: Record<string, { id: string }[]>) => {
    state.records.clear();
    for (const value of stores.records ?? []) state.records.set(value.id, value);
  }),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => undefined) }));

import { adultDcntEsfDefinition, deriveCareFacts, type CareFact, type InstrumentAnswer, type InstrumentApplication } from "@/src/clinical/assessments";
import { persistApplicationFacts } from "@/src/clinical/assessments/fact-repository";
import {
  decideProposal,
  ecomapLinkFromProposal,
  listEcomapLinksForFamily,
  listProposalsForFamily,
  persistEcomapLink,
  persistProposal,
  proposalsForApplication,
} from "@/src/clinical/assessments/proposals";

const date = "2026-04-01T00:00:00.000Z";

function application(answers: Record<string, InstrumentAnswer>, overrides: Partial<InstrumentApplication> = {}): InstrumentApplication {
  return {
    applicationId: "assessment-1",
    familyId: "family-1",
    personId: "person-1",
    instrumentId: adultDcntEsfDefinition.id,
    instrumentVersion: adultDcntEsfDefinition.version,
    assessmentDate: "2026-04-01",
    status: "completed",
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

function servicesAnswer(value: string[]): InstrumentAnswer {
  return { questionId: "summary.services", answerType: "multiple-choice", value, source: "person", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date };
}

describe("revisao de mudancas propostas para ecomapa e genograma", () => {
  beforeEach(() => state.records.clear());

  it("transforma servico marcado em proposta pendente, nunca em vinculo ativo", () => {
    const app = application({ "summary.services": servicesAnswer(["physiotherapy-or-rehabilitation"]) });
    const { facts } = deriveCareFacts(app);
    const proposals = proposalsForApplication(facts, app);
    expect(proposals).toHaveLength(1);
    expect(proposals[0]).toMatchObject({
      familyId: "family-1",
      subjectPersonId: "person-1",
      serviceOrNetworkId: "physiotherapy-or-rehabilitation",
      proposedStatus: "suggested",
      decision: "pending-review",
    });
    expect(proposals[0]?.proposedScope).toBe("selected-members");
    expect(ecomapLinkFromProposal(proposals[0]!, app)).toBeUndefined();
  });

  it("nao propoe nada para fatos que nao sao mudancas de dominio", () => {
    const app = application({ "physical.weight": { questionId: "physical.weight", answerType: "measurement", value: 80, unit: "kg", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date } });
    const { facts } = deriveCareFacts(app);
    expect(proposalsForApplication(facts, app)).toEqual([]);
  });

  it("exige texto compartilhavel para confirmar ou modificar", () => {
    const app = application({ "summary.services": servicesAnswer(["psychology-or-mental-health"]) });
    const { facts } = deriveCareFacts(app);
    const proposal = proposalsForApplication(facts, app)[0]!;
    expect(() => decideProposal(proposal, "confirmed")).toThrow(/compartilh/i);
    const decided = decideProposal(proposal, "confirmed", { shareableText: "Encaminhamento para psicologia, a combinar com a pessoa.", justificationPrivate: "Relato em avaliação." });
    expect(decided.decision).toBe("confirmed");
    expect(decided.shareableText).toContain("psicologia");
  });

  it("gera vinculo ativo somente apos confirmacao humana e preserva a origem", () => {
    const app = application({ "summary.services": servicesAnswer(["nutrition-or-food-care"]) });
    const { facts } = deriveCareFacts(app);
    const proposal = decideProposal(proposalsForApplication(facts, app)[0]!, "confirmed", { shareableText: "Orientação nutricional combinada." });
    const link = ecomapLinkFromProposal(proposal, app)!;
    expect(link).toMatchObject({
      familyId: "family-1",
      serviceOrNetworkId: "nutrition-or-food-care",
      status: "active",
      source: "printed-local-form",
      originApplicationId: "assessment-1",
    });
    expect(link.relatedPersonIds).toEqual(["person-1"]);
  });

  it("rejeicao nao cria vinculo e fica registrada na proposta", () => {
    const app = application({ "summary.services": servicesAnswer(["caps-psychosocial-care"]) });
    const { facts } = deriveCareFacts(app);
    const rejected = decideProposal(proposalsForApplication(facts, app)[0]!, "rejected");
    expect(rejected.decision).toBe("rejected");
    const link = ecomapLinkFromProposal(rejected, app)!;
    expect(link.status).toBe("rejected");
  });

  it("persiste propostas e vinculos da familia e os recupera", async () => {
    const app = application({ "summary.services": servicesAnswer(["social-assistance-cras-creas"]) });
    const { facts } = deriveCareFacts(app);
    const proposal = decideProposal(proposalsForApplication(facts, app)[0]!, "confirmed", { shareableText: "Apoio social a acionar." });
    await persistProposal(proposal);
    await persistEcomapLink(ecomapLinkFromProposal(proposal, app)!);
    await expect(listProposalsForFamily("family-1")).resolves.toHaveLength(1);
    const links = await listEcomapLinksForFamily("family-1");
    expect(links).toHaveLength(1);
    expect(links[0]?.originApplicationId).toBe("assessment-1");
    await expect(listProposalsForFamily("family-2")).resolves.toEqual([]);
  });

  it("fatos derivados da aplicação continuam acessiveis para a revisão das propostas", async () => {
    const app = application({ "summary.services": servicesAnswer(["focal-medical-specialist"]) });
    const facts: CareFact[] = await persistApplicationFacts(app);
    expect(proposalsForApplication(facts, app)).toHaveLength(1);
  });
});
