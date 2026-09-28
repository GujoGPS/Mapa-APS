import { describe,expect,it } from "vitest";
import { buildHandoff,createSharedCards } from "@/src/domain/care-selectors";
import { createCondition } from "@/src/domain/longitudinal-factories";
import type { Person } from "@/src/contracts/family";

describe("transformações do Marco 3",()=>{
 it("mantém fatos separados de interpretações",()=>{const person={id:"p1",code:"P-001-A",vitalStatus:"alive"} as unknown as Person;const draft=buildHandoff(person,[createCondition({personId:"p1",label:"HAS relatada",kind:"reported"})],[],"30s");expect(draft.facts.length).toBe(1);expect(draft.interpretations).toEqual([]);});
 it("não seleciona automaticamente item que requer revisão",()=>{const cards=createSharedCards([createCondition({personId:"p1",label:"HAS",kind:"reported",sharedSummary:"Acompanhamento da pressão."})]);expect(cards[0]?.selected).toBe(false);});
});
