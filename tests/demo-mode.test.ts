import { beforeEach, describe, expect, it, vi } from "vitest";

const memory = vi.hoisted(() => {
  const stores = new Map<string, Map<string, unknown>>();
  for (const name of ["meta", "records", "drafts", "events", "security"]) stores.set(name, new Map());
  return { stores };
});

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (store: string, id: string) => memory.stores.get(store)?.get(id)),
  getAllValues: vi.fn(async (store: string) => [...(memory.stores.get(store)?.values() ?? [])]),
  putValue: vi.fn(async (store: string, value: { id: string }) => { memory.stores.get(store)?.set(value.id, value); }),
  deleteValue: vi.fn(async (store: string, id: string) => { memory.stores.get(store)?.delete(id); }),
  replaceStore: vi.fn(async (store: string, values: { id: string }[]) => {
    const target = memory.stores.get(store)!;
    target.clear();
    for (const value of values) target.set(value.id, value);
  }),
  replaceAllStores: vi.fn(async (values: Record<string, { id: string }[]>) => {
    for (const [store, entries] of Object.entries(values)) {
      const target = memory.stores.get(store)!;
      target.clear();
      for (const value of entries) target.set(value.id, value);
    }
  }),
}));

vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));

import { seedSyntheticSemester } from "@/src/domain/demo-seed";
import { enterDemoMode, exitDemoMode, getDemoSession, removeDemoData } from "@/src/domain/demo-mode";
import { createFamily, updateFamily } from "@/src/domain/factories";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { findEntity, listEntities, saveEntity } from "@/src/domain/repository";
import type { Family } from "@/src/contracts/family";
import { createBackup } from "@/src/backup/service";

function envelope(id: string, entityType: string, payload: unknown) {
  return { id, entityType, payload, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", recordVersion: 1 };
}

describe("ciclo reversível de demonstração", () => {
  beforeEach(() => { for (const store of memory.stores.values()) store.clear(); });

  it("não injeta famílias sintéticas no armazenamento normal sem ativar o modo", async () => {
    const normal = envelope("normal-family-1", ENTITY_TYPES.family, { id: "normal-family-1", code: "F-001" });
    memory.stores.get("records")!.set(normal.id, normal);

    await expect(seedSyntheticSemester()).rejects.toThrow(/modo de demonstração/i);

    expect([...memory.stores.get("records")!.values()]).toEqual([normal]);
  });

  it("isola o conjunto sintético, permite editá-lo sem perder a marca e restaura os dados normais ao sair", async () => {
    const normal = envelope("normal-family-1", ENTITY_TYPES.family, { id: "normal-family-1", code: "F-001" });
    memory.stores.get("records")!.set(normal.id, normal);

    await enterDemoMode();
    expect(await findEntity(normal.id)).toBeUndefined();
    const demoFamilies = await listEntities<Family>(ENTITY_TYPES.family);
    expect(demoFamilies.length).toBeGreaterThan(0);
    expect(demoFamilies.every((family) => family.dataOrigin === "synthetic-demo")).toBe(true);
    expect((await getDemoSession())?.state).toBe("active");

    const family = demoFamilies[0]!;
    const edited = updateFamily(family, { code: family.code, nickname: "Família demonstrativa revisada", focus: family.focus ?? "" });
    await saveEntity(ENTITY_TYPES.family, edited);
    expect(await findEntity<Family>(family.id)).toMatchObject({ nickname: "Família demonstrativa revisada", dataOrigin: "synthetic-demo" });

    await exitDemoMode();
    expect(await findEntity(normal.id)).toEqual(normal.payload);
    expect(await findEntity(family.id)).toBeUndefined();
    expect(await getDemoSession()).toBeUndefined();
  });

  it("mantém a demonstração ativa entre recargas simuladas e remove apenas seus registros", async () => {
    const normal = envelope("normal-family-2", ENTITY_TYPES.family, { id: "normal-family-2", code: "F-002" });
    memory.stores.get("records")!.set(normal.id, normal);
    await enterDemoMode();

    expect((await getDemoSession())?.state).toBe("active");
    await removeDemoData();
    expect(await listEntities(ENTITY_TYPES.family)).toEqual([]);
    expect((await getDemoSession())?.state).toBe("active");

    await exitDemoMode();
    expect(await findEntity(normal.id)).toEqual(normal.payload);
  });

  it("gera backup normal do snapshot anterior sem a sessão nem os registros sintéticos", async () => {
    const normal = envelope("normal-family-3", ENTITY_TYPES.family, { id: "normal-family-3", code: "F-003" });
    memory.stores.get("records")!.set(normal.id, normal);
    await enterDemoMode();

    const backup = await createBackup();
    expect(backup.stores.records).toEqual([normal]);
    expect(backup.stores.meta.some((record) => (record as { id?: string }).id === "active-demo-session")).toBe(false);
  });
});