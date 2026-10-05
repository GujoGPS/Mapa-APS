import { describe, expect, it } from "vitest";
import { buildPrompt, type PromptInput } from "@/src/clinical/ai/prompt-builder";
import type { CareFact } from "@/src/clinical/assessments/types";
import { adultDcntEsfDefinition } from "@/src/clinical/assessments/instruments/adult-dcnt-esf/definition";
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

describe("separacao entre privacidade e lacuna de preenchimento", () => {
  it("classifica retirada de dado de pessoa como privacidade", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "segredo", familyVisibility: "hidden", derivationType: "measured", category: "measurement" })] }));
    expect(r.privacy).toHaveLength(1);
    expect(r.privacy[0]!.reason).toMatch(/não exportável/i);
    expect(r.gaps).toHaveLength(0);
  });

  it("classifica limite do instrumento como lacuna, nao como privacidade", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "bloco-3-sem-fonte", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" })] }));
    expect(r.gaps).toHaveLength(1);
    expect(r.gaps[0]!.reason).toMatch(/Lacuna/);
    expect(r.privacy).toHaveLength(0);
  });

  it("classifica dado ausente do formulário como lacuna", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "rastreamento-pendente", factType: "missing-information", category: "missing-data", familyVisibility: "hidden" })] }));
    expect(r.gaps).toHaveLength(1);
    expect(r.privacy).toHaveLength(0);
  });

  it("classifica vinculo privado como privacidade", () => {
    const r = buildPrompt(entrada({ nonExportableLinkLabels: ["segredo familiar"] }));
    expect(r.privacy).toHaveLength(1);
    expect(r.gaps).toHaveLength(0);
  });

  it("identifica cada retirada por um id unico, mesmo com topicos repetidos", () => {
    const r = buildPrompt(entrada({
      facts: [
        fato({ factId: "cf-a1", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
        fato({ factId: "cf-a2", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
      ],
    }));
    const ids = r.gaps.map((g) => g.id);
    expect(new Set(ids).size).toBe(r.gaps.length);
  });

  it("resume topicos repetidos em uma linha com contagem", () => {
    const r = buildPrompt(entrada({
      facts: [
        fato({ factId: "cf-a1", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
        fato({ factId: "cf-a2", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
        fato({ factId: "cf-a3", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
      ],
    }));
    expect(r.gapSummary).toHaveLength(1);
    expect(r.gapSummary[0]).toMatch(/3/);
  });

  it("nao mostra identificador tecnico do instrumento", () => {
    const r = buildPrompt(entrada({
      facts: [
        fato({ factId: "cf-a", topic: "waist-classification-criterion", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
        fato({ factId: "cf-b", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
        fato({ factId: "cf-c", topic: "tacs-acs", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" }),
      ],
    }));
    const texto = r.gapSummary.join(" ");
    expect(texto).not.toMatch(/waist-classification-criterion|source-missing-block-3|tacs-acs/);
  });

  it("nao deixa escapar o identificador tecnico de um topico que saiu da definicao", () => {
    // Banco antigo pode ter CareFact com o topico que existia quando os blocos 3/4/5
    // eram inventados. O prompt tem de falar humano, nunca "source-missing-block-3".
    const r = buildPrompt(entrada({ facts: [fato({ factId: "cf-b", topic: "source-missing-block-3", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden" })] }));
    expect(r.gapSummary[0]).not.toMatch(/source-missing-block/);
    expect(r.gapSummary[0]).toMatch(/[A-Za-zÀ-ÿ]/);
    expect(r.text).not.toMatch(/source-missing-block/);
  });

  it("usa o rotulo da propria ficha quando a pergunta existe", () => {
    const bloco1 = adultDcntEsfDefinition.sections.find((s) => s.printedBlockNumber === 1)!;
    const pergunta = bloco1.questions[0]!;
    const r = buildPrompt(entrada({ facts: [fato({ factId: "cf-d", topic: "limite-x", factType: "source-limitation", category: "source-limitation", familyVisibility: "hidden", sourceQuestionIds: [pergunta.id] })] }));
    expect(r.gapSummary[0]).toContain(pergunta.printedLabel);
  });

  it("mantém o total somando os dois grupos", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "privado", familyVisibility: "hidden" }), fato({ factId: "cf2", topic: "faltando", factType: "missing-information", familyVisibility: "hidden" })] }));
    expect(r.privacy.length + r.gaps.length).toBe(2);
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

  it("nao corrompe numero decimal que parece CPF", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "bmi", value: { value: 21.0557058, classification: "normal" } })] }));
    expect(r.text).toContain("21.0557058");
    expect(r.text).not.toContain("identificador removido");
  });

  it("nao corrompe medidas nem datas em formato numerico", () => {
    const r = buildPrompt(entrada({ facts: [fato({ topic: "altura", value: 172, unit: "cm" })] }));
    expect(r.text).toContain("172 cm");
  });

  it("mantem o texto clinico legitimo intacto", () => {
    const r = buildPrompt(entrada());
    expect(r.text).toContain("peso");
    expect(r.text).toContain("76 kg");
  });
});
