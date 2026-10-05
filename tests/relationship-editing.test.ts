import { describe, expect, it } from "vitest";
import { createRelationship, isRelationshipOpen, removedRelationship, updateRelationship } from "@/src/domain/relation-factories";
import type { RelationshipQuality } from "@/src/contracts/relations";

function vinculo(overrides: Partial<Parameters<typeof updateRelationship>[1]> = {}) {
  return createRelationship({
    familyId: "family-1",
    sourcePersonId: "p1",
    targetPersonId: "p2",
    formalType: "mãe e filha",
    quality: "strong",
    perspectiveLabel: "consolidada",
    ...overrides,
  });
}

describe("edicao e remocao de vinculo familiar", () => {
  it("edicao preserva identidade, proveniencia e data de inicio", () => {
    const original = vinculo();
    const edited = updateRelationship(original, { formalType: "mãe e filha住", quality: "conflict", perspectiveLabel: "Ana" }, "Relato atualizado em visita");
    expect(edited.id).toBe(original.id);
    expect(edited.createdAt).toBe(original.createdAt);
    expect(edited.validFrom).toBe(original.validFrom);
    expect(edited.provenance).toBe(original.provenance);
    expect(edited.recordVersion).toBe(original.recordVersion + 1);
    expect(edited.formalType).toBe("mãe e filha住");
  });

  it("edicao registra o motivo no historico sem apagar o que ja existia", () => {
    const original = vinculo();
    const first = updateRelationship(original, { formalType: "mae", quality: "weak", perspectiveLabel: "Ana" }, "Pai ausente na segunda visita");
    const second = updateRelationship(first, { formalType: "mae", quality: "adequate", perspectiveLabel: "Ana" }, "Ajuste apos conversar com a familia");
    expect(second.changeLog).toHaveLength(2);
    expect(second.changeLog?.[0]?.reason).toBe("Pai ausente na segunda visita");
    expect(second.changeLog?.[1]?.reason).toBe("Ajuste apos conversar com a familia");
    expect(second.changeLog?.[0]?.action).toBe("edited");
  });

  it("edicao sem motivo e recusada", () => {
    expect(() => updateRelationship(vinculo(), { formalType: "x", quality: "weak", perspectiveLabel: "y" }, "   ")).toThrow(/motivo/i);
  });

  it("edicao troca a sensibilidade quando o dado passa a ser de terceiro", () => {
    const edited = updateRelationship(vinculo(), { formalType: "mae", quality: "strong", perspectiveLabel: "Ana", thirdParty: true }, "Informado por terceiro");
    expect(edited.sensitivity).toBe("third-party");
    expect(edited.sharingState).toBe("blocked");
  });

  it("remocao encerra o vinculo e guarda o motivo", () => {
    const original = vinculo();
    expect(isRelationshipOpen(original)).toBe(true);
    const removed = removedRelationship(original, "Relato duplicado");
    expect(isRelationshipOpen(removed)).toBe(false);
    expect(removed.validTo).toBeTruthy();
    expect(removed.changeLog?.at(-1)?.action).toBe("deleted");
    expect(removed.changeLog?.at(-1)?.reason).toBe("Relato duplicado");
  });

  it("remocao sem motivo e recusada", () => {
    expect(() => removedRelationship(vinculo(), "")).toThrow(/motivo/i);
  });

  it("edicao remove a perspectiva quando o novo formulario nao manda uma", () => {
    const withPerspective = vinculo({ perspectivePersonId: "p1" });
    const edited = updateRelationship(withPerspective, { formalType: "mae", quality: "strong" as RelationshipQuality, perspectiveLabel: "consolidada" }, "Voltou a leitura consolidada");
    expect(edited.perspectivePersonId).toBeUndefined();
  });
});
