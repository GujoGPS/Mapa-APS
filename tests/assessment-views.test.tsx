import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const stored = vi.hoisted(() => ({ facts: [] as unknown[] }));

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async () => undefined),
  getAllValues: vi.fn(async () => [...stored.facts]),
  putValue: vi.fn(async () => undefined),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));

import { AssessmentViews } from "@/app/assessment-views";
import { adultDcntEsfDefinition, deriveCareFacts, type CareFact, type InstrumentAnswer, type InstrumentApplication } from "@/src/clinical/assessments";

const timestamp = "2026-01-01T00:00:00.000Z";

function application(applicationId: string, assessmentDate: string, answers: Record<string, InstrumentAnswer>, overrides: Partial<InstrumentApplication> = {}): InstrumentApplication {
  return {
    applicationId, familyId: "family-1", personId: "person-1",
    instrumentId: adultDcntEsfDefinition.id, instrumentVersion: adultDcntEsfDefinition.version,
    assessmentDate, status: "completed", kind: "initial", createdAt: timestamp, updatedAt: timestamp,
    answers, applicabilityOverrides: {},
    provenance: { origin: "printed-local-form", sourceNote: "Ficha impressa." },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal", schemaVersion: 1, revisionNumber: 1, ...overrides,
  };
}

function measured(value: number): InstrumentAnswer {
  return { questionId: "physical.weight", answerType: "measurement", value, unit: "kg", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: timestamp, updatedAt: timestamp };
}

function storeFacts(facts: CareFact[]): void {
  stored.facts = facts.map((fact) => ({ id: fact.factId, entityType: "care-fact", payload: fact, createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 }));
}

describe("projeções das avaliações", () => {
  it("mostra fatos clínicos e esconde notas internas e limitações da visão da pessoa", async () => {
    const app = application("app-1", "2026-01-01", { "physical.weight": measured(80) });
    storeFacts(deriveCareFacts(app).facts);

    render(<AssessmentViews personId="person-1" personLabel="Pessoa Um" applications={[app]} />);

    expect(await screen.findByText(/physical\.weight: 80 kg/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Visão da pessoa" }));
    await waitFor(() => expect(screen.queryByText(/TACS\/ACS permanece ambíguo/i)).toBeNull());
  });

  it("compara duas aplicações da mesma pessoa e aponta o que mudou", async () => {
    const older = application("app-1", "2026-01-01", { "physical.weight": measured(80) });
    const newer = application("app-2", "2026-07-01", { "physical.weight": measured(76) }, { kind: "reassessment", revisionNumber: 2 });
    storeFacts([...deriveCareFacts(older).facts, ...deriveCareFacts(newer).facts]);

    render(<AssessmentViews personId="person-1" personLabel="Pessoa Um" applications={[older, newer]} />);

    fireEvent.click(screen.getByRole("tab", { name: "Comparar aplicações" }));
    expect(await screen.findByText("physical.weight")).toBeTruthy();
    expect(screen.getAllByText("alterado").length).toBeGreaterThan(0);
  });

  it("explica que uma única aplicação não permite comparação", async () => {
    const app = application("app-1", "2026-01-01", { "physical.weight": measured(80) });
    storeFacts(deriveCareFacts(app).facts);
    render(<AssessmentViews personId="person-1" personLabel="Pessoa Um" applications={[app]} />);

    fireEvent.click(screen.getByRole("tab", { name: "Comparar aplicações" }));
    expect(await screen.findByText(/ao menos duas aplicações/i)).toBeTruthy();
  });
});
