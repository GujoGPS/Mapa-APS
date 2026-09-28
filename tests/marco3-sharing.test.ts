import { describe,expect,it } from "vitest";
import { sharingDecision } from "@/src/domain/sharing-policy";
import { createCondition,createExamResult } from "@/src/domain/longitudinal-factories";

describe("privacidade do Marco 3",()=>{
 it("bloqueia informação de terceiro no resumo",()=>{const item=createCondition({personId:"p1",label:"Relato",kind:"vulnerability",thirdParty:true});expect(sharingDecision(item,"person-summary").allowed).toBe(false);});
 it("exame sem unidade fica com dados insuficientes",()=>{expect(createExamResult({personId:"p1",examName:"Exame",valueText:"10"}).interpretationState).toBe("insufficient-data");});
});
