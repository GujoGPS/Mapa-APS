import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type DraftPatch = { answers?: Record<string, { value: string }>; applicabilityOverrides?: Record<string, unknown> };
const { updateDraftApplication } = vi.hoisted(() => ({
  updateDraftApplication: vi.fn<(applicationId: string, patch: DraftPatch) => Promise<InstrumentApplication>>(),
}));

vi.mock("@/src/clinical/assessments/application", async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return { ...original, updateDraftApplication };
});

import { FamilyAssessmentsPanel } from "@/app/family-assessments";
import { adultDcntEsfDefinition } from "@/src/clinical/assessments";
import type { InstrumentApplication } from "@/src/clinical/assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "family-1", code: "F-1", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const person: Person = { id: "person-1", code: "P-1", displayName: "Ana Souza", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const memberships: FamilyMembership[] = [
  { id: "m-1", familyId: family.id, personId: person.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];

function draft(): InstrumentApplication {
  return {
    applicationId: "app-1",
    familyId: family.id,
    personId: person.id,
    instrumentId: "adult-dcnt-esf",
    instrumentVersion: adultDcntEsfDefinition.version,
    assessmentDate: "2026-01-01",
    status: "draft",
    kind: "initial",
    createdAt: timestamp,
    updatedAt: timestamp,
    answers: {},
    applicabilityOverrides: {},
    provenance: { origin: "digital-adaptation", sourceNote: "teste" },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal",
    schemaVersion: 1,
    revisionNumber: 1,
  } as unknown as InstrumentApplication;
}

function persisted(patch: DraftPatch): InstrumentApplication {
  const base = draft();
  return { ...base, ...patch, updatedAt: "2026-01-01T00:05:00.000Z" } as InstrumentApplication;
}

function montar() {
  return render(<FamilyAssessmentsPanel family={family} people={[person]} memberships={memberships} applications={[draft()]} demoActive={false} onSaved={async () => undefined} />);
}

async function abrirRascunho() {
  montar();
  const botao = await screen.findByRole("button", { name: /Ana Souza/ });
  fireEvent.click(botao);
  fireEvent.click(await screen.findByRole("button", { name: "Continuar" }));
  await screen.findByRole("tab", { name: /Cabeçalho/ });
}

beforeEach(() => {
  updateDraftApplication.mockReset();
  updateDraftApplication.mockImplementation(async (_applicationId, patch) => persisted(patch));
});

afterEach(() => vi.useRealTimers());

describe("autosave do rascunho de avaliação", () => {
  it("salva sozinho apos a digitacao parar, sem clique em Salvar rascunho", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await abrirRascunho();

    fireEvent.change(screen.getAllByRole("textbox")[0]!, { target: { value: "Ana Souza Paula" } });

    expect(updateDraftApplication).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2500);
    await waitFor(() => expect(updateDraftApplication).toHaveBeenCalledTimes(1));

    const [applicationId, patch] = updateDraftApplication.mock.calls[0]!;
    expect(applicationId).toBe("app-1");
    const respostas = patch.answers ?? {};
    expect(Object.values(respostas).some((r) => r.value === "Ana Souza Paula")).toBe(true);
  });

  it("nao salva a cada tecla: varias digitacoes viram uma unica gravacao", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await abrirRascunho();
    const campo = screen.getAllByRole("textbox")[0]!;

    fireEvent.change(campo, { target: { value: "A" } });
    await vi.advanceTimersByTimeAsync(400);
    fireEvent.change(campo, { target: { value: "An" } });
    await vi.advanceTimersByTimeAsync(400);
    fireEvent.change(campo, { target: { value: "Ana" } });
    expect(updateDraftApplication).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2500);
    await waitFor(() => expect(updateDraftApplication).toHaveBeenCalledTimes(1));
    const respostas = updateDraftApplication.mock.calls[0]![1].answers ?? {};
    expect(Object.values(respostas).some((r) => r.value === "Ana")).toBe(true);
  });

  it("mantem o status do rascunho e nao dispara validacao de conclusao", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await abrirRascunho();
    fireEvent.change(screen.getAllByRole("textbox")[0]!, { target: { value: "Ana" } });
    await vi.advanceTimersByTimeAsync(2500);
    await waitFor(() => expect(updateDraftApplication).toHaveBeenCalledTimes(1));

    const patch = updateDraftApplication.mock.calls[0]![1] as Record<string, unknown>;
    expect(Object.keys(patch).sort()).toEqual(["answers", "applicabilityOverrides"]);
    expect(patch.status).toBeUndefined();
    expect(updateDraftApplication).toHaveBeenCalledTimes(1);
  });

  it("mostra o estado de salvamento junto das abas dos blocos", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await abrirRascunho();

    fireEvent.change(screen.getAllByRole("textbox")[0]!, { target: { value: "Ana" } });
    await vi.advanceTimersByTimeAsync(2500);
    await waitFor(() => expect(updateDraftApplication).toHaveBeenCalledTimes(1));

    const proximo = screen.getByRole("status", { name: "Salvamento automático" });
    expect(proximo.textContent).toMatch(/salvo/i);
  });

  it("nao monta o indicador de salvamento automatico fora do editor", async () => {
    await abrirRascunho();
    expect(screen.getByRole("status", { name: "Salvamento automático" })).toBeTruthy();
  });

  it("nao salva automaticamente aplicacao concluida", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    updateDraftApplication.mockReset();
    await abrirRascunho();
    expect(updateDraftApplication).not.toHaveBeenCalled();
  });
});
