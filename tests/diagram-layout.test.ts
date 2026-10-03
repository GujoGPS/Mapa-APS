import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ records: new Map<string, unknown>(), demo: undefined as { state: "active" } | undefined }));

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (_store: string, id: string) => state.records.get(id)),
  getAllValues: vi.fn(async () => [...state.records.values()]),
  putValue: vi.fn(async (_store: string, value: { id: string }) => { state.records.set(value.id, value); }),
  deleteValue: vi.fn(async (_store: string, id: string) => { state.records.delete(id); }),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => state.demo) }));

import { hasMovedPositions, layoutScopeKey, mergePositions, positionsFromNodes } from "@/src/domain/diagram-layout";
import { clearPositions, loadPositions, savePositions } from "@/src/domain/diagram-layout-store";

const engineNodes = [
  { id: "p1", x: 100, y: 200 },
  { id: "p2", x: 300, y: 400 },
];

describe("posicoes do diagrama salvas pelo arrasto", () => {
  beforeEach(() => { state.records.clear(); state.demo = undefined; });

  it("sem layout salvo usa exatamente o desenho do motor", () => {
    expect(mergePositions(engineNodes, undefined)).toEqual({ p1: { x: 100, y: 200 }, p2: { x: 300, y: 400 } });
  });

  it("posicao salva sobrepoe a do motor sem perder ninguem", () => {
    const merged = mergePositions(engineNodes, { p1: { x: 10, y: 20 } });
    expect(merged.p1).toEqual({ x: 10, y: 20 });
    expect(merged.p2).toEqual({ x: 300, y: 400 });
  });

  it("no novo usa a posicao do motor e guarda a antiga para o no voltar", () => {
    const merged = mergePositions([...engineNodes, { id: "p3", x: 50, y: 60 }], { p1: { x: 10, y: 20 }, saiu: { x: 1, y: 2 } });
    expect(merged.p3).toEqual({ x: 50, y: 60 });
    expect(merged.saiu).toEqual({ x: 1, y: 2 });
  });

  it("ignora posicao corrompida em vez de quebrar o desenho", () => {
    const merged = mergePositions(engineNodes, { p1: { x: Number.NaN, y: 20 } });
    expect(merged.p1).toEqual({ x: 100, y: 200 });
  });

  it("guarda e recupera o layout do mesmo escopo", async () => {
    const scope = { familyId: "family-1", kind: "genogram" as const, layer: "structural" };
    await savePositions(scope, { p1: { x: 11, y: 22 } }, "Atual");
    await expect(loadPositions(scope)).resolves.toEqual({ p1: { x: 11, y: 22 } });
  });

  it("nao mistura escopos diferentes", async () => {
    await savePositions({ familyId: "family-1", kind: "genogram", layer: "structural" }, { p1: { x: 1, y: 1 } }, "Atual");
    await savePositions({ familyId: "family-1", kind: "ecomap" }, { p1: { x: 2, y: 2 } }, "Atual");
    await savePositions({ familyId: "family-1", kind: "genogram", layer: "clinical" }, { p1: { x: 3, y: 3 } }, "Atual");
    await expect(loadPositions({ familyId: "family-1", kind: "genogram", layer: "structural" })).resolves.toEqual({ p1: { x: 1, y: 1 } });
    await expect(loadPositions({ familyId: "family-1", kind: "ecomap" })).resolves.toEqual({ p1: { x: 2, y: 2 } });
    expect(layoutScopeKey({ familyId: "family-1", kind: "genogram" })).not.toBe(layoutScopeKey({ familyId: "family-2", kind: "genogram" }));
  });

  it("marca o layout demonstrativo como sintetico", async () => {
    state.demo = { state: "active" };
    const saved = await savePositions({ familyId: "family-1", kind: "genogram" }, { p1: { x: 5, y: 5 } }, "Atual");
    expect(saved.dataOrigin).toBe("synthetic-demo");
  });

  it("reset remove o layout e volta ao desenho do motor", async () => {
    const scope = { familyId: "family-1", kind: "genogram" as const };
    await savePositions(scope, { p1: { x: 9, y: 9 } }, "Atual");
    await expect(clearPositions(scope)).resolves.toBe(1);
    await expect(loadPositions(scope)).resolves.toBeUndefined();
  });

  it("detecta movimento real do usuario", () => {
    const before = { p1: { x: 1, y: 1 } };
    expect(hasMovedPositions(before, { p1: { x: 1, y: 1 } })).toBe(false);
    expect(hasMovedPositions(before, positionsFromNodes([{ id: "p1", position: { x: 4, y: 4 } }]))).toBe(true);
  });
});
