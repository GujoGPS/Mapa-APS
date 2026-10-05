import { beforeEach, describe, expect, it, vi } from "vitest";

/** Banco em memória: reproduz o fluxo real sem depender do IndexedDB do jsdom. */
const banco = {
  meta: [] as unknown[],
  records: [] as unknown[],
  drafts: [] as unknown[],
  events: [] as unknown[],
  security: [] as unknown[],
};

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (store: string, id: string) => banco[store as keyof typeof banco]?.find((r) => (r as { id: string }).id === id)),
  getAllValues: vi.fn(async (store: string) => [...(banco[store as keyof typeof banco] ?? [])]),
  putValue: vi.fn(async (store: string, record: { id: string }) => {
    const lista = banco[store as keyof typeof banco] as unknown[];
    const i = lista.findIndex((r) => (r as { id: string }).id === record.id);
    if (i >= 0) lista[i] = record; else lista.push(record);
  }),
  deleteValue: vi.fn(async (store: string, id: string) => {
    const lista = banco[store as keyof typeof banco] as unknown[];
    const i = lista.findIndex((r) => (r as { id: string }).id === id);
    if (i >= 0) lista.splice(i, 1);
  }),
  replaceStore: vi.fn(async (store: string, values: unknown[]) => { banco[store as keyof typeof banco] = [...values]; }),
  replaceAllStores: vi.fn(async (stores: Record<string, unknown[]>) => {
    for (const [store, values] of Object.entries(stores)) banco[store as keyof typeof banco] = [...values];
  }),
  clearMapaDatabaseForTests: vi.fn(async () => { for (const k of Object.keys(banco)) banco[k as keyof typeof banco] = []; }),
  openMapaDatabase: vi.fn(async () => undefined),
}));

vi.mock("@/src/domain/demo-seed", () => ({
  seedSyntheticSemester: vi.fn(async () => undefined),
}));

import { enterDemoMode, exitDemoMode, getDemoSession } from "@/src/domain/demo-mode";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";

beforeEach(() => {
  banco.meta = [];
  banco.records = [{ id: "p1", payload: { dataOrigin: "normal", code: "F-001" } }];
  banco.drafts = [];
  banco.events = [];
  banco.security = [];
});

describe("sair do modo demonstração", () => {
  it("entra e registra a sessão", async () => {
    await enterDemoMode();
    expect(await getDemoSession()).toBeDefined();
    expect(banco.meta.some((r) => (r as { id: string }).id === DEMO_SESSION_META_ID)).toBe(true);
  });

  it("sai e encerra a sessão", async () => {
    await enterDemoMode();
    const resultado = await exitDemoMode();
    expect(resultado).toBe(true);
    expect(await getDemoSession()).toBeUndefined();
  });

  it("restaura os registros normais ao sair", async () => {
    await enterDemoMode();
    expect(banco.records).toHaveLength(0);
    await exitDemoMode();
    expect(banco.records).toHaveLength(1);
    expect((banco.records[0] as { payload: { code: string } }).payload.code).toBe("F-001");
  });

  it("sai de sessão gravada por versão anterior do app", async () => {
    // Formato real da v1: só guardava snapshotRecords, sem drafts nem events.
    banco.meta = [{
      id: DEMO_SESSION_META_ID,
      updatedAt: "2026-01-01T00:00:00.000Z",
      value: { state: "active", schemaVersion: 1, startedAt: "2026-01-01T00:00:00.000Z", snapshotRecords: [{ id: "p1", payload: { dataOrigin: "normal", code: "F-001" } }] },
    }];
    banco.records = [{ id: "sintetico", payload: { dataOrigin: "synthetic-demo" } }];

    await expect(exitDemoMode()).resolves.toBe(true);
    expect(await getDemoSession()).toBeUndefined();
    expect(banco.records).toHaveLength(1);
    expect((banco.records[0] as { payload: { code: string } }).payload.code).toBe("F-001");
  });

  it("permite entrar de novo depois de uma sessão antiga", async () => {
    banco.meta = [{
      id: DEMO_SESSION_META_ID,
      updatedAt: "2026-01-01T00:00:00.000Z",
      value: { state: "active", schemaVersion: 1, startedAt: "2026-01-01T00:00:00.000Z", snapshotRecords: [] },
    }];
    await expect(exitDemoMode()).resolves.toBe(true);
    await expect(enterDemoMode()).resolves.toBeDefined();
  });
});
