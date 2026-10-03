import { describe, expect, it } from "vitest";
import { buildPrompt, type PromptInput } from "@/src/clinical/ai/prompt-builder";
import type { CareFact } from "@/src/clinical/assessments/types";
import type { Family, Person } from "@/src/contracts/family";

const t = "2026-01-01T00:00:00.000Z";
const familia: Family = { id: "f1", code: "F-001", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const ana: Person = { id: "p1", code: "P-001-A", displayName: "Ana Souza", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const bruno: Person = { id: "p2", code: "P-001-B", displayName: "Bruno Lima", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };

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
    members: [{ person: ana, roleLabel: "mãe" }, { person: bruno, roleLabel: "filho" }],
    facts: [fato({ factId: "cf-idade", topic: "age", value: 46, derivationType: "calculated" }), fato()],
    ...extra,
  };
}

describe("prompt monta mesmo com restricao parcial", () => {
  it("nao trava: o texto e montado normalmente", () => {
    const r = buildPrompt(entrada({ facts: [fato({ familyVisibility: "hidden" })] }));
    expect(r.text).not.toBe("");
    expect(r.text).toContain("F-001");
  });

  it("retira apenas o dado restrito e mantem os demais", () => {
    const r = buildPrompt(entrada({ facts: [fato({ factId: "secreto", topic: "segredo", familyVisibility: "hidden" }), fato({ factId: "ok", topic: "peso" })] }));
    expect(r.text).toContain("peso");
    expect(r.text).not.toContain("segredo");
  });

  it("informa o que foi retirado e por que", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "segredo", familyVisibility: "hidden" })] }));
    expect(r.excluded.length).toBe(1);
    expect(r.excluded[0]!.reason).toMatch(/não exportável/i);
  });

  it("retira a pessoa restrita da lista sem derrubar as outras", () => {
    const r = buildPrompt(entrada({ nonExportablePersonIds: ["p1"] }));
    expect(r.text).not.toContain("P-001-A");
    expect(r.text).toContain("P-001-B");
  });

  it("retira vinculo restrito e segue", () => {
    const r = buildPrompt(entrada({ nonExportableLinkLabels: ["segredo familiar"] }));
    expect(r.text).toContain("F-001");
    expect(r.excluded.length).toBe(1);
  });
});

describe("retirada de identificadores", () => {
  it("nunca inclui nome", () => {
    const r = buildPrompt(entrada());
    expect(r.text).not.toContain("Ana Souza");
    expect(r.text).not.toContain("Bruno Lima");
  });

  it("nunca inclui CPF vindo de texto livre", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "observacao", value: "Paciente CPF 123.456.789-00", derivationType: "reported" })] }));
    expect(r.text).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });

  it("nunca inclui data completa em texto livre", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "observacao", value: "nascida em 04/03/1980", derivationType: "reported" })] }));
    expect(r.text).not.toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(r.text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("nunca inclui endereco em texto livre", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "observacao", value: "mora na Rua das Flores, 120 - CEP 88000-000", derivationType: "reported" })] }));
    expect(r.text).not.toMatch(/Rua das Flores/);
    expect(r.text).not.toMatch(/\d{5}-\d{3}/);
  });

  it("retira fato derivado de pergunta de identificador", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "cpf", sourceQuestionIds: ["header.cpf"], derivationType: "reported" })] }));
    expect(r.text).not.toContain("cpf");
    expect(r.excluded.length).toBe(1);
  });

  it("mantem o texto clinico legitimo intacto", () => {
    const r = buildPrompt(entrada());
    expect(r.text).toContain("peso");
    expect(r.text).toContain("76 kg");
  });
});
