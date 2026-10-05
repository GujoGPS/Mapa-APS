import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ records: new Map<string, unknown>() }));

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (_store: string, id: string) => state.records.get(id)),
  getAllValues: vi.fn(async () => [...state.records.values()]),
  putValue: vi.fn(async (_store: string, value: { id: string }) => { state.records.set(value.id, value); }),
  replaceAllStores: vi.fn(async (stores: Record<string, { id: string }[]>) => {
    state.records.clear();
    for (const value of stores.records ?? []) state.records.set(value.id, value);
  }),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => undefined) }));

import { migrateBackup, migrateCareFactPayload } from "@/src/clinical/assessments/migration";
import { createBackup, restoreBackup } from "@/src/backup/service";
import { createSyntheticBackup } from "@/src/backup/adversarial";
import { listFactsForPerson } from "@/src/clinical/assessments/fact-repository";
import { ENTITY_TYPES } from "@/src/domain/entity-types";

const date = "2026-01-01T00:00:00.000Z";

function legacyFactEnvelope(id: string, payload: Record<string, unknown>) {
  return { id, entityType: ENTITY_TYPES.careFact, payload, createdAt: date, updatedAt: date, recordVersion: 1 };
}

describe("migracao e backup dos fatos derivados", () => {
  beforeEach(() => state.records.clear());

  it("preenche campos ausentes de fato legado sem inventar origem sintetica", () => {
    const migrated = migrateCareFactPayload({
      factId: "legacy-fact", factType: "reported", applicationId: "app-1", instrumentId: "adult-dcnt-esf",
      instrumentVersion: "v1", familyId: "family-1", personId: "person-1", subjectScope: "individual",
      category: "demographic", topic: "marital-status", value: "married-or-stable-union", recordedAt: date,
      derivationType: "reported", provenance: { origin: "digital-adaptation", sourceNote: "legado" },
      certaintyState: "reported", reviewStatus: "needs-review", clinicalVisibility: "visible",
      personVisibility: "hidden", familyVisibility: "hidden",
    });
    expect(migrated.factVersion).toBe("1");
    expect(migrated.sourceQuestionIds).toEqual([]);
    expect(migrated.actionable).toBe(false);
    expect(migrated.dataOrigin).toBe("normal");
  });

  it("recalcula checksum ao migrar fatos dentro de um backup", async () => {
    const legacy = legacyFactEnvelope("legacy-fact", { factId: "legacy-fact", topic: "marital-status", personId: "person-1", familyId: "family-1" });
    const backup = await createSyntheticBackup({ records: [legacy], meta: [], drafts: [], events: [], security: [] });
    const migrated = await migrateBackup(backup);
    const record = migrated.stores.records.find((item) => (item as { id: string }).id === "legacy-fact") as { checksum: string; payload: { factVersion: string; dataOrigin: string } };
    expect(record.payload.factVersion).toBe("1");
    expect(record.payload.dataOrigin).toBe("normal");
    expect(record.checksum).toBe(JSON.stringify(record.payload));
  });

  it("restaura backup preservando fatos e a versao migrada", async () => {
    const legacy = legacyFactEnvelope("legacy-fact-2", { factId: "legacy-fact-2", topic: "bmi", personId: "person-1", familyId: "family-1" });
    const backup = await createSyntheticBackup({ records: [legacy], meta: [], drafts: [], events: [], security: [] });
    const validation = await restoreBackup(backup);
    expect(validation.valid).toBe(true);
    const facts = await listFactsForPerson("person-1");
    expect(facts).toHaveLength(1);
    expect(facts[0]?.factVersion).toBe("1");
  });

  it("backup normal inclui fatos normais e nao inclui sessao de demonstracao", async () => {
    state.records.set("fact-normal", { id: "fact-normal", entityType: ENTITY_TYPES.careFact, payload: { factId: "fact-normal", personId: "person-1", dataOrigin: "normal" }, createdAt: date, updatedAt: date, recordVersion: 1 });
    const backup = await createBackup();
    expect(backup.stores.records.map((item) => (item as { id: string }).id)).toContain("fact-normal");
    expect(backup.stores.meta.some((item) => (item as { id?: string }).id === "active-demo-session")).toBe(false);
  });
});
