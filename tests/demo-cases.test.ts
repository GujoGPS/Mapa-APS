import { beforeEach, describe, expect, it, vi } from "vitest";

const banco = { meta: [] as unknown[], records: [] as unknown[], drafts: [] as unknown[], events: [] as unknown[], security: [] as unknown[] };

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (store: string, id: string) => banco[store as keyof typeof banco]?.find((r) => (r as { id: string }).id === id)),
  getAllValues: vi.fn(async (store: string) => [...(banco[store as keyof typeof banco] ?? [])]),
  putValue: vi.fn(async (store: string, record: { id: string }) => {
    const lista = banco[store as keyof typeof banco] as unknown[];
    const i = lista.findIndex((r) => (r as { id: string }).id === record.id);
    if (i >= 0) lista[i] = record; else lista.push(record);
  }),
  deleteValue: vi.fn(async () => undefined),
  replaceStore: vi.fn(async (store: string, values: unknown[]) => { banco[store as keyof typeof banco] = [...values]; }),
  replaceAllStores: vi.fn(async (stores: Record<string, unknown[]>) => { for (const [s, v] of Object.entries(stores)) banco[s as keyof typeof banco] = [...v]; }),
  clearMapaDatabaseForTests: vi.fn(async () => { for (const k of Object.keys(banco)) banco[k as keyof typeof banco] = []; }),
  openMapaDatabase: vi.fn(async () => undefined),
}));

vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => ({ state: "active", schemaVersion: 2, startedAt: "2026-01-01T00:00:00.000Z", snapshotRecords: [], snapshotDrafts: [], snapshotEvents: [] })) }));

import { seedSyntheticSemester } from "@/src/domain/demo-seed";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";

function payloads(entityType: string) {
  return banco.records
    .map((r) => r as { entityType: string; payload: Record<string, unknown> })
    .filter((r) => r.entityType === entityType)
    .map((r) => r.payload);
}

beforeEach(() => { for (const k of Object.keys(banco)) banco[k as keyof typeof banco] = []; });

describe("semente dos tres casos de demonstracao", () => {
  it("cria as tres familias com codigo e foco", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const familias = payloads("family");
    expect(familias).toHaveLength(3);
    expect(familias.map((f) => f.code).sort()).toEqual(["F-001", "F-002", "F-003"]);
  });

  it("marca tudo como sintético", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const pessoas = payloads("person");
    expect(pessoas.length).toBeGreaterThanOrEqual(8);
    expect(pessoas.every((p) => p.dataOrigin === "synthetic-demo")).toBe(true);
  });

  it("conclui as avaliacoes pelo caminho do dominio", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const apps = payloads("instrument-application");
    expect(apps.length).toBe(5);
    expect(apps.every((a) => a.status === "completed" || a.status === "rectified")).toBe(true);
  });

  it("cria a retificacao apontando para a avaliacao original", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const apps = payloads("instrument-application");
    const retificacoes = apps.filter((a) => a.rectifiesApplicationId);
    expect(retificacoes).toHaveLength(1);
  });

  it("deriva CareFacts clinicos das avaliacoes", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const facts = payloads("care-fact");
    const topicos = facts.map((f) => f.topic);
    expect(topicos).toContain("age-at-assessment");
    expect(topicos.some((t) => String(t).includes("bmi"))).toBe(true);
  });

  it("semeia vinculos com changeLog e vinculo privado", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const vinculos = payloads("interpersonal-relationship");
    expect(vinculos.length).toBeGreaterThanOrEqual(7);
    expect(vinculos.some((v) => Array.isArray(v.changeLog) && (v.changeLog as unknown[]).length > 0)).toBe(true);
    const privados = vinculos.filter((v) => v.sharingState === "private");
    expect(privados).toHaveLength(1);
    expect(privados[0]!.formalType).toBe("irmao");
    expect(vinculos.some((v) => v.quality === "ruptured")).toBe(true);
  });

  it("semeia conteudo clinico e rede externa", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    expect(payloads("condition-record").length).toBeGreaterThanOrEqual(6);
    expect(payloads("person-medication").length).toBeGreaterThanOrEqual(3);
    expect(payloads("exam-result").length).toBeGreaterThanOrEqual(1);
    expect(payloads("external-resource").length).toBe(3);
    expect(payloads("external-link").length).toBe(3);
    expect(payloads("encounter").length).toBeGreaterThanOrEqual(4);
    expect(payloads("pending-item").length).toBe(3);
  });

  it("nao deixa registro normal na demonstracao", { timeout: 30000 }, async () => {
    await seedSyntheticSemester();
    const naoSinteticos = payloads("person").filter((p) => p.dataOrigin !== "synthetic-demo");
    expect(naoSinteticos).toHaveLength(0);
  });
});
