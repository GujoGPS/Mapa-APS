import type React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

vi.mock("@/src/clinical/assessments/fact-repository", () => ({
  listFactsForFamily: vi.fn(async () => [] as unknown[]),
}));

import { AiPromptsPanel } from "@/app/ai-prompts-panel";
import { listFactsForFamily } from "@/src/clinical/assessments/fact-repository";
import type { CareFact } from "@/src/clinical/assessments/types";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InterpersonalRelationship } from "@/src/contracts/relations";

const t = "2026-01-01T00:00:00.000Z";
const familia: Family = { id: "f1", code: "F-001", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const ana: Person = { id: "p1", code: "P-001-A", displayName: "Ana Souza", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const bruno: Person = { id: "p2", code: "P-001-B", displayName: "Bruno Lima", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const membros: FamilyMembership[] = [
  { id: "m1", familyId: "f1", personId: "p1", roleLabel: "mãe", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "shared", createdAt: t, updatedAt: t, recordVersion: 1 },
  { id: "m2", familyId: "f1", personId: "p2", roleLabel: "filho", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "shared", createdAt: t, updatedAt: t, recordVersion: 1 },
];
const vinculos: InterpersonalRelationship[] = [];

function fato(extra: Partial<CareFact> = {}): CareFact {
  return {
    factId: "cf-1", factType: "measurement", factVersion: "v1", applicationId: "app-1",
    instrumentId: "adult-dcnt-esf", instrumentVersion: "v1", familyId: "f1", personId: "p1",
    sourceQuestionIds: ["physical.weight"], subjectScope: "individual", category: "measurement",
    topic: "peso", value: 76, unit: "kg", recordedAt: t, derivationType: "measured",
    provenance: { origin: "printed-local-form", sourceNote: "ficha" },
    certaintyState: "confirmed", reviewStatus: "accepted",
    clinicalVisibility: "visible", personVisibility: "shareable-with-person", familyVisibility: "shared-context",
    actionable: false,
    ...extra,
  } as unknown as CareFact;
}

type Props = React.ComponentProps<typeof AiPromptsPanel>;

function props(relacoes: InterpersonalRelationship[] = vinculos): Props {
  return { families: [familia], people: [ana, bruno], memberships: membros, relationships: relacoes };
}

beforeEach(() => {
  vi.mocked(listFactsForFamily).mockReset();
  vi.mocked(listFactsForFamily).mockResolvedValue([fato()] as never);
});

async function escolherFamilia() {
  fireEvent.change(screen.getByLabelText(/Família/), { target: { value: "f1" } });
  await waitFor(() => expect(screen.getByRole("button", { name: /Copiar prompt/ })).toBeTruthy());
}

describe("montagem de prompt para IA externa", () => {
  it("não monta nada antes de escolher a família", () => {
    render(<AiPromptsPanel {...props()} />);
    expect(screen.getByText(/Escolha uma família/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Copiar prompt/ })).toBeNull();
  });

  it("mostra o prompt com os códigos, nunca com os nomes", async () => {
    render(<AiPromptsPanel {...props()} />);
    await escolherFamilia();
    const texto = screen.getByText(/FAMÍLIA: F-001/).textContent ?? "";
    expect(texto).toContain("P-001-A");
    expect(texto).toContain("P-001-B");
    expect(texto).not.toContain("Ana Souza");
    expect(texto).not.toContain("Bruno Lima");
  });

  it("leva o dado clínico derivado dos CareFacts", async () => {
    render(<AiPromptsPanel {...props()} />);
    await escolherFamilia();
    expect(screen.getByText(/peso: 76 kg/)).toBeTruthy();
  });

  it("oferece as quatro categorias de conversa", () => {
    render(<AiPromptsPanel {...props()} />);
    const select = screen.getByLabelText(/Tipo de conversa/) as HTMLSelectElement;
    expect(select.options).toHaveLength(4);
  });

  it("permite escolher uma pessoa em vez da família inteira", async () => {
    render(<AiPromptsPanel {...props()} />);
    fireEvent.change(screen.getByLabelText(/Família/), { target: { value: "f1" } });
    await waitFor(() => expect(screen.getByLabelText(/Pessoa/)).toBeTruthy());
    fireEvent.change(screen.getByLabelText(/Pessoa/), { target: { value: "p1" } });
    await waitFor(() => expect(screen.getByText(/FAMÍLIA: F-001/)).toBeTruthy());
  });

  it("trava a geração quando há dado clínico não exportável", async () => {
    vi.mocked(listFactsForFamily).mockResolvedValue([fato({ familyVisibility: "hidden" })] as never);
    render(<AiPromptsPanel {...props()} />);
    fireEvent.change(screen.getByLabelText(/Família/), { target: { value: "f1" } });
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(screen.getByText(/Prompt travado para este caso/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Copiar prompt/ })).toBeNull();
  });

  it("trava quando o vínculo familiar não é exportável", async () => {
    const privado = [{ relationshipId: "r1", familyId: "f1", sharingState: "private", formalType: "segredo", provenance: "self-reported", confirmation: "reported", sensitivity: "family" }] as unknown as InterpersonalRelationship[];
    render(<AiPromptsPanel {...props(privado)} />);
    fireEvent.change(screen.getByLabelText(/Família/), { target: { value: "f1" } });
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(screen.queryByRole("button", { name: /Copiar prompt/ })).toBeNull();
  });

  it("copia o prompt sanitizado", async () => {
    const escrever = vi.fn<(t: string) => Promise<void>>(async () => undefined);
    Object.defineProperty(globalThis.navigator, "clipboard", { value: { writeText: escrever }, configurable: true });
    render(<AiPromptsPanel {...props()} />);
    await escolherFamilia();
    fireEvent.click(screen.getByRole("button", { name: /Copiar prompt/ }));
    await waitFor(() => expect(escrever).toHaveBeenCalledTimes(1));
    expect(escrever.mock.calls[0]![0]).not.toContain("Ana Souza");
  });
});
