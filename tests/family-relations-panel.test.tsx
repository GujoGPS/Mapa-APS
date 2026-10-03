import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async () => undefined),
  getAllValues: vi.fn(async () => []),
  putValue: vi.fn(async () => undefined),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => undefined) }));
vi.mock("@/src/domain/diagram-layout-store", () => ({
  loadPositions: vi.fn(async () => undefined),
  savePositions: vi.fn(async () => undefined),
  clearPositions: vi.fn(async () => 0),
}));

import { FamilyRelations } from "@/app/family-relations";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { ExternalLink, ExternalResource, InterpersonalRelationship } from "@/src/contracts/relations";

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "f1", code: "F-001", nickname: "Horizonte", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const people: Person[] = [
  { id: "p1", code: "P-1", displayName: "Ana", lifeStage: "adult", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
  { id: "p2", code: "P-2", displayName: "Bruno", lifeStage: "child", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const memberships: FamilyMembership[] = [
  { id: "m1", familyId: "f1", personId: "p1", roleLabel: "m\u00e3e", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
  { id: "m2", familyId: "f1", personId: "p2", roleLabel: "filha", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const relationships: InterpersonalRelationship[] = [
  { id: "r1", familyId: "f1", sourcePersonId: "p1", targetPersonId: "p2", formalType: "m\u00e3e e filha", quality: "strong", direction: "mutual", perspectiveLabel: "consolidada", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const resources: ExternalResource[] = [{ id: "res1", familyId: "f1", name: "UBS", type: "health", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 }];
const links: ExternalLink[] = [
  { id: "l1", familyId: "f1", resourceId: "res1", personId: "p1", quality: "adequate", direction: "to-source", intensity: "high", perspectiveLabel: "consolidada", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];

function renderPanel() {
  return render(<FamilyRelations family={family} people={people} memberships={memberships} relationships={relationships} resources={resources} links={links} onSaved={async () => undefined} />);
}

/** Os nomes aparecem tambem no seletor de perspectiva; as consultas de no ficam presas ao diagrama. */
async function waitForDiagram() {
  const container = await screen.findByTestId("family-diagram-flow");
  await waitFor(() => expect(within(container).getByText("Ana")).toBeTruthy());
  return within(container);
}

/** fireEvent precisa do elemento, nao do objeto de consultas. */
async function diagramElement() {
  const queries = await waitForDiagram();
  return queries.getByText("Ana").closest("[data-testid='family-diagram-flow']") as HTMLElement;
}

describe("painel de relacoes com camada React Flow", () => {
  it("desenha o genograma com os rotulos esperados", async () => {
    renderPanel();
    const diagram = await waitForDiagram();
    expect(diagram.getByText("Bruno")).toBeTruthy();
  });

  it("troca para ecomapa e diferencia familia, pessoa e recurso", async () => {
    renderPanel();
    await waitForDiagram();
    fireEvent.click(screen.getByRole("button", { name: "Ecomapa" }));
    await waitFor(() => expect(screen.getByText("UBS")).toBeTruthy());
    const diagram = within(screen.getByTestId("family-diagram-flow"));
    expect(diagram.getByText("Horizonte")).toBeTruthy();
    expect(diagram.getAllByTestId("flow-node-resource")).toHaveLength(1);
    expect(diagram.getAllByTestId("flow-node-family")).toHaveLength(1);
  });

  it("mantem a aba de narrativa com a saida do motor de dominio", async () => {
    renderPanel();
    await waitForDiagram();
    fireEvent.click(screen.getByRole("button", { name: "Narrativa" }));
    const narratives = await screen.findAllByText(/Mapa familiar\./);
    expect(narratives.length).toBeGreaterThan(0);
    expect(narratives[0]!.textContent).toContain("Perspectiva");
    expect(narratives[0]!.textContent).toContain("m\u00e3e e filha");
  });

  it("mantem a aba de prompt e a deteccao de identificadores", async () => {
    renderPanel();
    await waitForDiagram();
    fireEvent.click(screen.getByRole("button", { name: "Prompt IA" }));
    expect(await screen.findByText(/Nenhum identificador direto \u00f3bvio detectado/)).toBeTruthy();
    expect(screen.getByText(/N\u00e3o inventar pessoas/)).toBeTruthy();
  });

  it("preserva a descricao textual acessivel do diagrama", async () => {
    renderPanel();
    await waitForDiagram();
    expect(screen.getByText(/Descri\u00e7\u00e3o textual acess\u00edvel/)).toBeTruthy();
  });

  it("mantem os seletores de perspectiva e camada do genograma", async () => {
    renderPanel();
    await waitForDiagram();
    expect(screen.getByLabelText(/Perspectiva/)).toBeTruthy();
    expect(screen.getByLabelText(/Camada/)).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("button", { name: "Exportar SVG" })).toBeTruthy());
  });
});

describe("interacoes do diagrama", () => {
  it("mostra a legenda das qualidades de vinculo quando ha vinculos", async () => {
    renderPanel();
    await waitForDiagram();
    expect(screen.getByText("Qualidade do vinculo")).toBeTruthy();
    for (const label of ["forte", "conflituoso", "rompido", "divergente"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("esconde a legenda quando o grafo nao tem vinculos", async () => {
    render(<FamilyRelations family={family} people={people} memberships={memberships} relationships={[]} resources={resources} links={[]} onSaved={async () => undefined} />);
    await waitFor(() => expect(screen.getByTestId("family-diagram-flow")).toBeTruthy());
    await waitFor(() => expect(within(screen.getByTestId("family-diagram-flow")).getByText("Ana")).toBeTruthy());
    expect(screen.queryByText("Qualidade do vinculo")).toBeNull();
  });

  it("esconde o botao de voltar ao original enquanto nao ha layout salvo", async () => {
    renderPanel();
    await diagramElement();
    expect(screen.queryByRole("button", { name: "Voltar ao desenho original" })).toBeNull();
  });

  it("oferece criar vinculo familiar junto ao diagrama", async () => {
    renderPanel();
    await diagramElement();
    const button = screen.getByRole("button", { name: /Vínculo familiar/ });
    expect(button.hasAttribute("disabled")).toBe(false);
    fireEvent.click(button);
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(screen.getByText(/Abordagem familiar/)).toBeTruthy();
  });

  it("avisa a quem seleciona pessoa ao clicar num no", async () => {
    const onSelectPerson = vi.fn();
    render(<FamilyRelations family={family} people={people} memberships={memberships} relationships={relationships} resources={resources} links={links} onSaved={async () => undefined} onSelectPerson={onSelectPerson} />);
    const diagram = await diagramElement();
    fireEvent.click(within(diagram).getByText("Ana"));
    expect(onSelectPerson).toHaveBeenCalledWith("p1");
  });
});
