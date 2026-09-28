import { describe, expect, it } from "vitest";
import { nextFamilyCode, peopleInFamily, buildTimeline } from "@/src/domain/selectors";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

describe("seletores do Marco 2", () => {
  it("gera o próximo código familiar sem impor limite", () => {
    const families = [{ code: "F-001" }, { code: "F-004" }] as Family[];
    expect(nextFamilyCode(families)).toBe("F-005");
  });
  it("permite uma pessoa em mais de uma família", () => {
    const person = { id: "p1" } as Person;
    const links = [{ personId:"p1",familyId:"f1" },{ personId:"p1",familyId:"f2" }] as FamilyMembership[];
    expect(peopleInFamily([person],links,"f1")).toEqual([person]);
    expect(peopleInFamily([person],links,"f2")).toEqual([person]);
  });
  it("ordena timeline da mais recente para a mais antiga", () => {
    const events = buildTimeline([{ id:"e1",occurredAt:"2026-01-01",title:"Antigo",personIds:[] },{ id:"e2",occurredAt:"2026-02-01",title:"Novo",personIds:[] }] as never[],[]);
    expect(events.map((item)=>item.title)).toEqual(["Novo","Antigo"]);
  });
});
