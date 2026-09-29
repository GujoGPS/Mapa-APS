import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => {
  const records = new Map<string, unknown>();
  return { records, demo: undefined as { state: "active" } | undefined };
});

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
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => state.demo) }));

import {
  archiveApplication,
  completeApplication,
  createApplication,
  createRectification,
  deriveApplicationResults,
  listApplicationsByFamilyMetadata,
  listApplicationsByPerson,
  saveAnswer,
  submitForReview,
  updateDraftApplication,
} from "@/src/clinical/assessments/application";
import { migrateApplicationPayload } from "@/src/clinical/assessments/migration";
import { restoreBackup } from "@/src/backup/service";
import { createSyntheticBackup } from "@/src/backup/adversarial";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const date = "2026-01-01T00:00:00.000Z";
function envelope(id: string, entityType: string, payload: unknown) {
  return { id, entityType, payload, createdAt: date, updatedAt: date, recordVersion: 1 };
}
function seedPeople(): void {
  const family = { id: "family-1", code: "F1", state: "active", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Family;
  const person1 = { id: "person-1", code: "P1", vitalStatus: "alive", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Person;
  const person2 = { id: "person-2", code: "P2", vitalStatus: "alive", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Person;
  const membership = (personId: string) => ({ id: `membership-${personId}`, familyId: family.id, personId, roleLabel: "member", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies FamilyMembership);
  for (const value of [
    envelope(family.id, ENTITY_TYPES.family, family),
    envelope(person1.id, ENTITY_TYPES.person, person1),
    envelope(person2.id, ENTITY_TYPES.person, person2),
    envelope("membership-person-1", ENTITY_TYPES.membership, membership(person1.id)),
    envelope("membership-person-2", ENTITY_TYPES.membership, membership(person2.id)),
  ]) state.records.set(value.id, value);
}

describe("aplicações individuais ESF", () => {
  beforeEach(() => {
    state.records.clear();
    state.demo = undefined;
    seedPeople();
  });

  it("persiste respostas tipadas, mantém sujeitos independentes e gera resumo operacional", async () => {
    const first = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    const second = await createApplication({ familyId: "family-1", personId: "person-2", assessmentDate: "2026-01-01" });
    await saveAnswer(first.applicationId, {
      questionId: "header.person-name", answerType: "short-text", value: "Pessoa 1",
      source: "person", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date,
    });
    expect((await updateDraftApplication(second.applicationId, { privateNotes: "somente pessoa 2" })).privateNotes).toBe("somente pessoa 2");
    await expect(listApplicationsByPerson(first.personId)).resolves.toHaveLength(1);
    await expect(listApplicationsByFamilyMetadata("family-1")).resolves.toHaveLength(2);
  });

  it("aplica transições, bloqueia sobrescrita de concluída e cria retificação imutável", async () => {
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    await submitForReview(application.applicationId);
    const completed = await completeApplication(application.applicationId);
    await expect(updateDraftApplication(application.applicationId, { privateNotes: "não permitido" })).rejects.toThrow(/não pode ser sobrescrita/i);
    const rectification = await createRectification(completed.applicationId);
    expect(rectification.rectifiesApplicationId).toBe(completed.applicationId);
    expect(rectification.applicationId).not.toBe(completed.applicationId);
    expect(rectification.personId).toBe(completed.personId);
    expect(rectification.revisionNumber).toBe(completed.revisionNumber + 1);
    expect(await archiveApplication(rectification.applicationId)).toMatchObject({ status: "archived" });
  });

  it("marca novas aplicações demonstrativas sem permitir alteração normal", async () => {
    state.demo = { state: "active" };
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    expect(application.dataOrigin).toBe("synthetic-demo");
  });

  it("migra payload legado de respostas de forma idempotente", async () => {
    const legacy = { applicationId: "old", familyId: "family-1", personId: "person-1", instrumentId: "adult-dcnt-esf", instrumentVersion: "local-esf-2026-page-28-v1", assessmentDate: "2026-01-01", status: "draft" as const, kind: "initial" as const, createdAt: date, updatedAt: date, responses: {} };
    const migrated = migrateApplicationPayload(legacy);
    expect(migrateApplicationPayload(migrated)).toEqual(migrated);
    expect(migrated.answers).toEqual({});
    expect("responses" in migrated).toBe(false);
  });

  it("reconstrói derivados versionados sem persistir resultado clínico como resposta", async () => {
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    const enriched = await updateDraftApplication(application.applicationId, {
      answers: {
        "header.birth-date": { questionId: "header.birth-date", answerType: "date", value: "1990-01-01", source: "person", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date },
        "physical.weight": { questionId: "physical.weight", answerType: "measurement", value: 80, unit: "kg", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date },
        "physical.height": { questionId: "physical.height", answerType: "measurement", value: 2, unit: "m", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date },
      },
    });
    expect(deriveApplicationResults(enriched).map((result) => result.questionId)).toEqual(["sociodemographic.age", "physical.bmi"]);
    expect(enriched.answers["physical.bmi"]).toBeUndefined();
  });

  it("migra e restaura aplicação legada preservando checksum do payload", async () => {
    const legacy = envelope("legacy-application", ENTITY_TYPES.instrumentApplication, {
      applicationId: "legacy-application", familyId: "family-1", personId: "person-1",
      instrumentId: "adult-dcnt-esf", instrumentVersion: "local-esf-2026-page-28-v1",
      assessmentDate: "2026-01-01", status: "draft", kind: "initial", createdAt: date, updatedAt: date, responses: {},
    });
    const backup = await createSyntheticBackup({
      records: [...state.records.values(), legacy],
      meta: [], drafts: [], events: [], security: [],
    });
    const validation = await restoreBackup(backup);
    expect(validation.valid).toBe(true);
    expect(state.records.get("legacy-application")).toMatchObject({ payload: { answers: {}, schemaVersion: 1 } });
    expect((state.records.get("legacy-application") as { checksum?: string }).checksum).toBe(JSON.stringify((state.records.get("legacy-application") as { payload: unknown }).payload));
  });
});
