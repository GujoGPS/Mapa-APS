import { describe, expect, it } from "vitest";
import { buildPrompt, type PromptInput } from "@/src/clinical/ai/prompt-builder";
import type { CareFact } from "@/src/clinical/assessments/types";
import type { Family, Person } from "@/src/contracts/family";

const t = "2026-01-01T00:00:00.000Z";
const familia: Family = { id: "f1", code: "F-001", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const ana: Person = { id: "p1", code: "P-001-A", displayName: "Ana Souza", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };

function idade(anos: number): CareFact {
  return fato({ factId: "cf-idade", topic: "age", factType: "calculated", derivationType: "calculated", value: anos });
}

function fato(extra: Partial<CareFact> = {}): CareFact {
  return {
    factId: "cf-1", factType: "measurement", factVersion: "v1", applicationId: "app-1",
    instrumentId: "adult-dcnt-esf", instrumentVersion: "v1", familyId: "f1", personId: "p1",
    sourceQuestionIds: ["physical.weight"], subjectScope: "individual", category: "measurement",
    topic: "peso", value: 76, unit: "kg", recordedAt: t, derivationType: "measured",
    provenance: { origin: "printed-local-form", sourceNote: "ficha" },
    certaintyState: "confirmed", reviewStatus: "accepted",
    clinicalVisibility: "visible", personVisibility: "shareable-with-person", familyVisibility: "shared-context",
    actionable: false,
    ...extra,
  } as unknown as CareFact;
}

function entrada(extra: Partial<PromptInput> = {}): PromptInput {
  return {
    kind: "caso",
    family: familia,
    person: ana,
    members: [{ person: ana, roleLabel: "mãe" }],
    facts: [fato(), idade(46)],
    ...extra,
  };
}

describe("sanitizacao do prompt", () => {
  it("usa o codigo estruturado da familia e da pessoa", () => {
    const r = buildPrompt(entrada());
    expect(r.blocked).toBe(false);
    expect(r.text).toContain("F-001");
    expect(r.text).toContain("P-001-A");
  });

  it("nunca inclui o nome da pessoa", () => {
    const r = buildPrompt(entrada());
    expect(r.text).not.toContain("Ana Souza");
    expect(r.text).not.toContain("Ana");
  });

  it("nunca inclui a data de nascimento, apenas a idade", () => {
    const r = buildPrompt(entrada());
    expect(r.text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(r.text).toMatch(/46 anos/);
  });

  it("leva o dado clinico derivado dos CareFacts", () => {
    const r = buildPrompt(entrada());
    expect(r.text).toContain("peso");
    expect(r.text).toContain("76");
  });

  it("mantem proveniencia e revisao de cada fato", () => {
    const r = buildPrompt(entrada());
    expect(r.text).toMatch(/derived-from|derivado/i);
  });
});

describe("bloqueio por nao exportavel", () => {
  it("bloqueia quando algum fato e non-exportable", () => {
    const r = buildPrompt(entrada({ facts: [fato({ familyVisibility: "hidden" })] }));
    expect(r.blocked).toBe(true);
    expect(r.reasons?.join(" ")).toMatch(/não exportável/i);
  });

  it("bloqueia nota clinica privada", () => {
    const r = buildPrompt(entrada({ facts: [fato({ clinicalVisibility: "private-note" })] }));
    expect(r.blocked).toBe(true);
  });

  it("bloqueia quando a pessoa esta marcada como nao exportavel", () => {
    const r = buildPrompt(entrada({ nonExportablePersonIds: ["p1"] }));
    expect(r.blocked).toBe(true);
    expect(r.reasons?.join(" ")).toMatch(/P-001-A/);
  });

  it("bloqueia quando o vinculo familiar e nao exportavel", () => {
    const r = buildPrompt(entrada({ nonExportableLinkLabels: ["segredo familiar"] }));
    expect(r.blocked).toBe(true);
  });

  it("nao bloqueia caso limpo e explica por que quando bloqueia", () => {
    const limpo = buildPrompt(entrada());
    expect(limpo.blocked).toBe(false);
    const travado = buildPrompt(entrada({ facts: [fato({ familyVisibility: "hidden" })] }));
    expect(travado.reasons?.length).toBeGreaterThan(0);
    expect(travado.text).toBe("");
  });
});
