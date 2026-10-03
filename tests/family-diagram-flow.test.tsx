import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FamilyDiagramFlow, toFlowEdges, toFlowNodes } from "@/app/family-relations-flow";
import { buildEcomap, buildGenogram, relationshipNarrative, type DiagramModel } from "@/src/domain/diagram-engine";
import { flowAriaLabels, translateFlowError } from "@/src/domain/diagram-labels";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { ExternalLink, ExternalResource, InterpersonalRelationship } from "@/src/contracts/relations";

const timestamp = "2026-01-01T00:00:00.000Z";

const family: Family = { id: "f1", code: "F-001", nickname: "Horizonte", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const people: Person[] = [
  { id: "p1", code: "P-1", displayName: "Ana", lifeStage: "adult", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
  { id: "p2", code: "P-2", displayName: "Bruno", lifeStage: "child", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const memberships: FamilyMembership[] = [
  { id: "m1", familyId: "f1", personId: "p1", roleLabel: "mãe", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
  { id: "m2", familyId: "f1", personId: "p2", roleLabel: "filha", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const relationships: InterpersonalRelationship[] = [
  { id: "r1", familyId: "f1", sourcePersonId: "p1", targetPersonId: "p2", formalType: "mãe e filha", quality: "strong", direction: "mutual", perspectiveLabel: "consolidada", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const resources: ExternalResource[] = [
  { id: "res1", familyId: "f1", name: "UBS", type: "health", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];
const links: ExternalLink[] = [
  { id: "l1", familyId: "f1", resourceId: "res1", personId: "p1", quality: "adequate", direction: "to-source", intensity: "high", perspectiveLabel: "consolidada", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];

const genogram = buildGenogram({ family, people, memberships, relationships, layer: "structural" });
const ecomap = buildEcomap({ family, people, resources, links });

describe("camada de renderizacao em React Flow", () => {
  it("traduz o modelo do motor sem recalcular quem se relaciona com quem", () => {
    const nodes = toFlowNodes(genogram);
    const edges = toFlowEdges(genogram);
    expect(nodes).toHaveLength(genogram.nodes.length);
    expect(nodes.map((node) => node.id)).toEqual(genogram.nodes.map((node) => node.id));
    expect(edges).toHaveLength(genogram.edges.length);
    expect(edges[0]?.source).toBe("p1");
    expect(edges[0]?.target).toBe("p2");
    expect(nodes[0]?.position).toEqual({ x: genogram.nodes[0]!.x, y: genogram.nodes[0]!.y });
  });

  it("preserva a qualidade do vinculo no estilo da aresta", () => {
    const [edge] = toFlowEdges(genogram);
    expect(edge?.style?.stroke).toBeTruthy();
    expect(edge?.data?.quality).toBe("strong");
  });

  it("descarta arestas cujo extremo nao existe no modelo", () => {
    const broken: DiagramModel = {
      ...genogram,
      edges: [{ id: "x", sourceId: "p1", targetId: "fantasma", label: "quebrada", quality: "weak", direction: "none", perspective: "consolidada" }],
    };
    expect(toFlowEdges(broken)).toEqual([]);
  });

  it("renderiza o genograma com os rotulos esperados", async () => {
    render(<FamilyDiagramFlow model={genogram} />);
    expect(await screen.findByText("Ana")).toBeTruthy();
    expect(screen.getByText("Bruno")).toBeTruthy();
    expect(screen.getByTestId("family-diagram-flow")).toBeTruthy();
  });

  it("renderiza o ecomapa distinguindo familia, pessoa e recurso", async () => {
    render(<FamilyDiagramFlow model={ecomap} />);
    expect(await screen.findByText("Horizonte")).toBeTruthy();
    expect(screen.getByText("UBS")).toBeTruthy();
    expect(screen.getAllByTestId("flow-node-person").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("flow-node-resource")).toHaveLength(1);
    expect(screen.getAllByTestId("flow-node-family")).toHaveLength(1);
  });

  it("prepara as arestas com tipo, traço e seta coerentes com o vinculo", () => {
    // O jsdom nao mede os handles, entao o React Flow nao desenha o path das arestas aqui.
    // O que se verifica aqui e o contrato traduzido; o desenho e conferido no navegador.
    const [edge] = toFlowEdges(genogram);
    expect(edge?.type).toBe("familyEdge");
    expect(edge?.style?.stroke).toBeTruthy();
    expect(Number(edge?.style?.strokeWidth)).toBeGreaterThan(0);
    expect(edge?.data?.quality).toBe("strong");
    expect(edge?.markerEnd).toBeUndefined();

    const directed = toFlowEdges({
      ...genogram,
      edges: [{ ...genogram.edges[0]!, direction: "from-source" }],
    });
    expect(directed[0]?.markerEnd).toBeDefined();
  });

  it("mantem a narrativa do motor disponivel para a mesma camada", () => {
    expect(relationshipNarrative(genogram)).toContain("Perspectiva");
    expect(relationshipNarrative(ecomap)).toContain("entidades");
  });
});

describe("rotulos em portugues do diagrama", () => {
  it("traduz tipo, estado e faixa etaria dos nos", () => {
    const model = buildEcomap({
      family, people,
      resources: [{ id: "res1", familyId: "f1", name: "UBS", type: "health", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 }],
      links: [{ id: "l1", familyId: "f1", resourceId: "res1", personId: "p1", quality: "adequate", direction: "to-source", intensity: "high", perspectiveLabel: "consolidada", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 }],
    });
    const resource = model.nodes.find((node) => node.id === "res1");
    expect(resource?.subtitle).toBe("saude · ativo");
    expect(resource?.subtitle).not.toContain("health");
    expect(resource?.subtitle).not.toContain("active");
    const person = model.nodes.find((node) => node.id === "p1");
    expect(person?.subtitle).not.toContain("adult");
  });

  it("traduz os rotulos de acessibilidade da biblioteca", () => {
    expect(flowAriaLabels["controls.zoomIn.ariaLabel"]).toBe("Aproximar");
    expect(flowAriaLabels["minimap.ariaLabel"]).toBe("Mapa geral do diagrama");
    expect(Object.values(flowAriaLabels).every((value) => !/[A-Za-z]{4,} /.test(value) || /[a-zA-Z]/.test(value))).toBe(true);
  });

  it("traduz o erro de container sem container no grafo", () => {
    expect(translateFlowError("004", "The parent container needs a width and a height to render the graph.")).toMatch(/largura e altura/i);
    expect(translateFlowError("999", "mensagem original")).toBe("mensagem original");
  });
});
