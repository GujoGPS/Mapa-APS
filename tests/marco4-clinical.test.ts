import {describe,expect,it} from "vitest";
import {conditions,medicationKnowledge} from "@/src/clinical/content";
import {validateClinicalLibrary} from "@/src/clinical/validation";
describe("biblioteca clínica",()=>{
 it("contém as cinco condições piloto",()=>expect(conditions.map((c)=>c.id)).toEqual(["has","dm2","drc","dyslipidemia","obesity"]));
 it("todas as afirmações têm fonte",()=>expect(conditions.every((c)=>Object.values(c.sections).flat().every((x)=>x.sourceIds.length>0))).toBe(true));
 it("mantém doses bloqueadas até auditoria por produto",()=>expect(medicationKnowledge.every((m)=>m.doseStatus==="not-published")).toBe(true));
 it("valida referências e status preliminar",()=>expect(validateClinicalLibrary().valid).toBe(true));
});
