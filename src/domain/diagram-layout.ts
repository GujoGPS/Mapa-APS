import type { DiagramLayout, DiagramKind } from "@/src/contracts/relations";

/**
 * Posicao salva pelo arrasto e uma sobreposicao, nunca uma segunda fonte de verdade. O motor de
 * dominio continua calculando o desenho inicial; o que o usuario move fica por cima. Nos que ainda
 * nao existiam continuam na posicao do motor.
 */

export interface LayoutScope {
  familyId: string;
  kind: DiagramKind;
  perspectivePersonId?: string;
  layer?: string;
}

export function layoutScopeKey(scope: LayoutScope): string {
  return `${scope.familyId}|${scope.kind}|${scope.perspectivePersonId ?? "consolidada"}|${scope.layer ?? "padrao"}`;
}

export function isLayoutForScope(layout: DiagramLayout, scope: LayoutScope): boolean {
  return (
    layout.familyId === scope.familyId &&
    layout.kind === scope.kind &&
    (layout.perspectivePersonId ?? undefined) === (scope.perspectivePersonId ?? undefined) &&
    (layout.layer ?? "padrao") === (scope.layer ?? "padrao")
  );
}

export type PositionMap = Record<string, { x: number; y: number }>;

export function mergePositions(engineNodes: { id: string; x: number; y: number }[], saved: PositionMap | undefined): PositionMap {
  if (!saved) return Object.fromEntries(engineNodes.map((node) => [node.id, { x: node.x, y: node.y }]));
  const merged: PositionMap = {};
  const known = new Set(engineNodes.map((node) => node.id));
  for (const node of engineNodes) {
    const stored = saved[node.id];
    merged[node.id] = stored && Number.isFinite(stored.x) && Number.isFinite(stored.y) ? stored : { x: node.x, y: node.y };
  }
  // Nos que sairam do grafo ficam no registro, para recuperar se voltarem.
  for (const [id, position] of Object.entries(saved)) if (!known.has(id)) merged[id] = position;
  return merged;
}

export function positionsFromNodes(nodes: { id: string; position: { x: number; y: number } }[]): PositionMap {
  return Object.fromEntries(nodes.map((node) => [node.id, { x: node.position.x, y: node.position.y }]));
}

export function hasMovedPositions(saved: PositionMap | undefined, current: PositionMap): boolean {
  if (!saved) return false;
  return Object.entries(current).some(([id, position]) => {
    const previous = saved[id];
    return !previous || previous.x !== position.x || previous.y !== position.y;
  });
}
