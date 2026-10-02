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
  completeApplication,
  createApplication,
  createRectification,
  saveAnswer,
  submitForReview,
} from "@/src/clinical/assessments/application";
import {
  listFactsForApplication,
  listFactsForPerson,
  persistApplicationFacts,
  reviewFact,
  supersedeFactsOfApplication,
} from "@/src/clinical/assessments/fact-repository";
import { factsForCurrentRevision } from "@/src/clinical/assessments/facts";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { createBackup } from "@/src/backup/service";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const date = "2026-01-01T00:00:00.000Z";
function envelope(id: string, entityType: string, payload: unknown) {
  return { id, entityType, payload, createdAt: date, updatedAt: date, recordVersion: 1 };
}
function seedPeople(): void {
  const family = { id: "family-1", code: "F1", state: "active", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Family;
  const person = { id: "person-1", code: "P1", vitalStatus: "alive", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Person;
  const membership = { id: "membership-1", familyId: family.id, personId: person.id, roleLabel: "member", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies FamilyMembership;
  for (const value of [envelope(family.id, ENTITY_TYPES.family, family), envelope(person.id, ENTITY_TYPES.person, person), envelope(membership.id, ENTITY_TYPES.membership, membership)]) {
    state.records.set(value.id, value);
  }
}

async function completedApplication(assessmentDate = "2026-01-01") {
  const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate });
  await saveAnswer(application.applicationId, { questionId: "physical.weight", answerType: "measurement", value: 80, unit: "kg", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date });
  await saveAnswer(application.applicationId, { questionId: "physical.height", answerType: "measurement", value: 1.6, unit: "m", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date });
  await submitForReview(application.applicationId);
  return completeApplication(application.applicationId);
}

describe("persistência dos fatos clínicos derivados", () => {
  beforeEach(() => {
    state.records.clear();
    state.demo = undefined;
    seedPeople();
  });

  it("persiste fatos ao concluir e mantém proveniência da aplicação", async () => {
    const completed = await completedApplication();
    const facts = await listFactsForApplication(completed.applicationId);
    expect(facts.length).toBeGreaterThan(0);
    expect(facts.every((item) => item.applicationId === completed.applicationId && item.personId === "person-1")).toBe(true);
    expect(facts.every((item) => item.dataOrigin === "normal")).toBe(true);
    await expect(listFactsForPerson("person-1")).resolves.toHaveLength(facts.length);
  });

  it("não grava respostas derivadas como se fossem respostas da ficha", async () => {
    const completed = await completedApplication();
    const facts = await listFactsForApplication(completed.applicationId);
    expect(facts.some((item) => item.topic === "bmi")).toBe(true);
    expect(completed.answers["physical.bmi"]).toBeUndefined();
  });

  it("não produz fatos enquanto a aplicação é rascunho", async () => {
    const draft = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    await expect(listFactsForApplication(draft.applicationId)).resolves.toEqual([]);
  });

  it("retificação marca os fatos anteriores como superados e persiste os novos", async () => {
    const completed = await completedApplication();
    const before = await listFactsForApplication(completed.applicationId);
    const rectification = await createRectification(completed.applicationId);
    await submitForReview(rectification.applicationId);
    const finished = await completeApplication(rectification.applicationId);

    const superseded = await listFactsForApplication(completed.applicationId);
    expect(superseded.every((item) => item.reviewStatus === "superseded" && item.invalidatedAt)).toBe(true);
    expect(factsForCurrentRevision(superseded, completed.applicationId)).toEqual([]);
    expect(before.length).toBeGreaterThan(0);

    const current = await listFactsForApplication(finished.applicationId);
    expect(current.length).toBeGreaterThan(0);
    expect(current.every((item) => item.reviewStatus !== "superseded")).toBe(true);
  });

  it("permite revisão humana sem alterar o valor derivado", async () => {
    const completed = await completedApplication();
    const target = (await listFactsForApplication(completed.applicationId)).find((item) => item.derivationType === "measured");
    expect(target).toBeDefined();
    const reviewed = await reviewFact(target!.factId, "reviewed");
    expect(reviewed.reviewStatus).toBe("reviewed");
    expect(reviewed.value).toEqual(target!.value);
  });

  it("ignora identificador de fato inexistente em vez de criar registro órfão", async () => {
    await expect(reviewFact("inexistente", "reviewed")).rejects.toThrow(/inexistente/i);
  });

  it("marca fatos demonstrativos como sintéticos e os exclui do backup normal", async () => {
    state.demo = { state: "active", schemaVersion: 1, startedAt: date, snapshotRecords: [...state.records.values()], snapshotDrafts: [], snapshotEvents: [] } as never;
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    const facts = await persistApplicationFacts({ ...application, status: "completed", completedAt: date });
    expect(facts.length).toBeGreaterThan(0);
    expect(facts.every((item) => item.dataOrigin === "synthetic-demo")).toBe(true);

    const backup = await createBackup();
    const storedIds = backup.stores.records.map((record) => (record as { id: string }).id);
    expect(storedIds).not.toContain(facts[0]!.factId);
  });

  it("preserva fatos normais enquanto a demonstração remove seus registros", async () => {
    const completed = await completedApplication();
    const normalFacts = await listFactsForApplication(completed.applicationId);
    expect(normalFacts.length).toBeGreaterThan(0);
    await supersedeFactsOfApplication(completed.applicationId, completed.applicationId);
    expect(await listFactsForApplication(completed.applicationId)).toHaveLength(normalFacts.length);
  });
});
