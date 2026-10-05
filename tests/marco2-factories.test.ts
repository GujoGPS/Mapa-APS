import { describe, expect, it } from "vitest";
import { createFamily, createEncounter, createPending, createPerson, updateFamily, updatePerson } from "@/src/domain/factories";

describe("fábricas do Marco 2", () => {
  it("cria família ativa sem exigir foco", () => { expect(createFamily({code:"F-003"}).state).toBe("active"); });
  it("preserva encontro breve sem transformá-lo em pendência", () => { expect(createEncounter({kind:"brief-contact",title:"Contato",freeText:"Breve"}).state).toBe("saved"); });
  it("pendência é explícita e separada do texto breve", () => { expect(createPending({title:"Conferir documento"}).destination).toBe("open"); });
});

describe("edição de família e pessoa", () => {
  it("atualiza campos da família preservando identidade e origem", () => {
    const family = createFamily({ code: "F-001", nickname: "Horizonte" });
    const edited = updateFamily(family, { code: "F-001", nickname: "Horizonte revisado", focus: "" });
    expect(edited.id).toBe(family.id);
    expect(edited.createdAt).toBe(family.createdAt);
    expect(edited.nickname).toBe("Horizonte revisado");
    expect(edited.focus).toBeUndefined();
    expect(edited.recordVersion).toBe(family.recordVersion + 1);
    expect(edited.dataOrigin).toBe(family.dataOrigin);
  });

  it("atualiza campos da pessoa preservando identidade, vitalidade e origem", () => {
    const person = createPerson({ code: "P-001", displayName: "Ana", lifeStage: "adult" });
    const edited = updatePerson(person, { code: "P-001", displayName: "Ana Paula", lifeStage: "adult" });
    expect(edited.id).toBe(person.id);
    expect(edited.createdAt).toBe(person.createdAt);
    expect(edited.displayName).toBe("Ana Paula");
    expect(edited.vitalStatus).toBe(person.vitalStatus);
    expect(edited.recordVersion).toBe(person.recordVersion + 1);
  });

  it("não apaga vitalidade nem origem sintética ao editar pessoa demonstrativa", () => {
    const person = { ...createPerson({ code: "P-002", displayName: "Bruno", lifeStage: "adult" as const }), dataOrigin: "synthetic-demo" as const };
    const edited = updatePerson(person, { code: "P-002", displayName: "", lifeStage: "older-adult" });
    expect(edited.displayName).toBeUndefined();
    expect(edited.lifeStage).toBe("older-adult");
    expect(edited.dataOrigin).toBe("synthetic-demo");
  });
});
