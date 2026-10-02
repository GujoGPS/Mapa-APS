import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FamilyDiagramFlow, toFlowEdges, toFlowNodes } from "@/app/family-relations-flow";
import { buildEcomap, buildGenogram, relationshipNarrative, type DiagramModel } from "@/src/domain/diagram-engine";
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

  it("mantem a narrativa do motor disponivel para a mesma camada", () => {
    expect(relationshipNarrative(genogram)).toContain("Perspectiva");
    expect(relationshipNarrative(ecomap)).toContain("entidades");
  });
});
