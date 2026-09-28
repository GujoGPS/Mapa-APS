import { describe, expect, it } from "vitest";
import { createFamily, createEncounter, createPending } from "@/src/domain/factories";

describe("fábricas do Marco 2", () => {
  it("cria família ativa sem exigir foco", () => { expect(createFamily({code:"F-003"}).state).toBe("active"); });
  it("preserva encontro breve sem transformá-lo em pendência", () => { expect(createEncounter({kind:"brief-contact",title:"Contato",freeText:"Breve"}).state).toBe("saved"); });
  it("pendência é explícita e separada do texto breve", () => { expect(createPending({title:"Conferir documento"}).destination).toBe("open"); });
});
