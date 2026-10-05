import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DemoModePanel } from "@/app/demo-mode-panel";
import { FamilyAssessmentsPanel } from "@/app/family-assessments";
import { ToastProvider } from "@/app/toast";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InstrumentApplication } from "@/src/clinical/assessments";

const state = vi.hoisted(() => ({ active: false, applications: [] as InstrumentApplication[] }));
vi.mock("@/src/domain/demo-mode", () => ({
  enterDemoMode: vi.fn(async () => { state.active = true; return { version: 2, state: "active" }; }),
  exitDemoMode: vi.fn(async () => { state.active = false; state.applications = []; return true; }),
  removeDemoData: vi.fn(async () => { state.applications = []; return 1; }),
}));
vi.mock("@/src/clinical/assessments", async () => {
  const actual = await vi.importActual<typeof import("@/src/clinical/assessments")>("@/src/clinical/assessments");
  return {
    ...actual,
    createApplication: vi.fn(async ({ familyId, personId, assessmentDate }: { familyId: string; personId: string; assessmentDate: string }) => {
      const application = { applicationId: "demo-application", familyId, personId, assessmentDate, status: "draft", instrumentId: "adult-dcnt-esf", instrumentVersion: "local-esf-2026-page-28-v1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", answers: {}, applicabilityOverrides: {}, provenance: { origin: "digital-adaptation", sourceNote: "teste" }, visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" }, dataOrigin: "synthetic-demo", schemaVersion: 1, revisionNumber: 1 } as InstrumentApplication;
      state.applications = [application];
      return application;
    }),
    updateDraftApplication: vi.fn(async (_id: string, changes: { answers: InstrumentApplication["answers"] }) => {
      state.applications = [{ ...state.applications[0]!, ...changes, updatedAt: "2026-01-02T00:00:00.000Z" } as InstrumentApplication];
      return state.applications[0]!;
    }),
  };
});

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "demo-family", code: "D-1", nickname: "Família demonstrativa", state: "active", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const person: Person = { id: "demo-person", code: "D-P1", displayName: "Pessoa demonstrativa", vitalStatus: "alive", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const secondPerson: Person = { id: "demo-person-2", code: "D-P2", displayName: "Pessoa dois", vitalStatus: "alive", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const membership: FamilyMembership = { id: "demo-membership", familyId: family.id, personId: person.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const secondMembership: FamilyMembership = { ...membership, id: "demo-membership-2", personId: secondPerson.id };

function DemoFlow() {
  const [, refresh] = React.useState(0);
  return <><DemoModePanel session={state.active ? { state: "active", schemaVersion: 2, startedAt: "2026-01-01T00:00:00.000Z", snapshotRecords: [], snapshotDrafts: [], snapshotEvents: [] } : undefined} families={state.active ? [family] : []} onChanged={async () => refresh((value) => value + 1)} /><FamilyAssessmentsPanel family={family} people={[person, secondPerson]} memberships={[membership, secondMembership]} applications={state.applications} demoActive={state.active} onSaved={async () => refresh((value) => value + 1)} /></>;
}

describe("fluxo de avaliações no modo demonstração", () => {
  beforeEach(() => { state.active = false; state.applications = []; });

  it("entra, cria, salva, isola, restaura e remove aplicação sintética", async () => {
    render(<ToastProvider><DemoFlow /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Entrar no modo demonstração" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar entrada" }));
    await waitFor(() => expect(screen.getByText("Demonstração ativa. Os dados normais estão isolados e podem ser restaurados ao sair.")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: /Pessoa demonstrativa/ }));
    fireEvent.click(screen.getByRole("button", { name: "Nova aplicação" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy());
    expect(screen.getByText(/Aplicação demonstrativa/)).toBeTruthy();
    fireEvent.change(screen.getAllByRole("textbox")[0]!, { target: { value: "Resposta sintética" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
    await waitFor(() => expect(screen.getAllByRole("status").some((node) => /salvo/i.test(node.textContent ?? ""))).toBe(true));
    fireEvent.click(screen.getByRole("button", { name: /Pessoa dois/ }));
    expect(screen.getByText(/Nenhuma aplicação ativa para esta pessoa/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Pessoa demonstrativa/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByDisplayValue("Resposta sintética")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Sair e restaurar estado anterior" }));
    await waitFor(() => expect(screen.getByText(/Nenhuma aplicação ativa para esta pessoa/)).toBeTruthy());
    expect(state.applications).toHaveLength(0);
    expect(screen.getByText("Entrar no modo demonstração")).toBeTruthy();
  });
});
