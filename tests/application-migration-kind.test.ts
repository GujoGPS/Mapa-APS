import { describe, expect, it } from "vitest";
import { migrateApplicationPayload, stripLegacyKind } from "@/src/clinical/assessments/migration";

const base = {
  applicationId: "app-1", familyId: "f1", personId: "p1", instrumentId: "adult-dcnt-esf",
  instrumentVersion: "v1", assessmentDate: "2026-01-01", status: "completed", createdAt: "2026-01-01", updatedAt: "2026-01-01",
  answers: {}, applicabilityOverrides: {},
  provenance: { origin: "digital-adaptation", sourceNote: "teste" },
  visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
  dataOrigin: "normal", schemaVersion: 1, revisionNumber: 1,
};

describe("migracao sem o campo kind", () => {
  it("remove kind de aplicacao legada", () => {
    const migrada = migrateApplicationPayload({ ...base, kind: "initial" } as never);
    expect("kind" in migrada).toBe(false);
  });

  it("remove kind mesmo em reavaliacao", () => {
    const migrada = migrateApplicationPayload({ ...base } as never);
    expect("kind" in migrada).toBe(false);
  });

  it("preserva os demais campos", () => {
    const migrada = migrateApplicationPayload({ ...base, kind: "initial" } as never);
    expect(migrada.applicationId).toBe("app-1");
    expect(migrada.revisionNumber).toBe(1);
    expect(migrada.status).toBe("completed");
  });

  it("stripLegacyKind normaliza registro ja gravado sem reescrever", () => {
    const lido = stripLegacyKind({ applicationId: "app-9", kind: "initial", status: "draft" });
    expect("kind" in lido).toBe(false);
    expect(lido.applicationId).toBe("app-9");
  });

  it("stripLegacyKind nao copia quando nao ha kind", () => {
    const original = { applicationId: "app-9" };
    expect(stripLegacyKind(original)).toBe(original);
  });

  it("nao quebra aplicacao que nunca teve kind", () => {
    const migrada = migrateApplicationPayload({ ...base } as never);
    expect(migrada.applicationId).toBe("app-1");
    expect("kind" in migrada).toBe(false);
  });
});
