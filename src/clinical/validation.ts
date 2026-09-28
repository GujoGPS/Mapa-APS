import { clinicalSources } from "./sources";
import { conditions,examKnowledge,medicationKnowledge } from "./content";
export interface ClinicalValidation {valid:boolean;errors:string[];warnings:string[];}
export function validateClinicalLibrary():ClinicalValidation{
 const errors:string[]=[];const warnings:string[]=[];const sourceIds=new Set(clinicalSources.map((s)=>s.id));
 const check=(owner:string,ids:string[])=>ids.forEach((id)=>{if(!sourceIds.has(id))errors.push(`${owner}: fonte inexistente ${id}`)});
 conditions.forEach((condition)=>{check(condition.id,condition.sourceIds);Object.values(condition.sections).flat().forEach((claim)=>{check(claim.id,claim.sourceIds);if(!claim.text.trim())errors.push(`${claim.id}: texto vazio`);if(new Date(claim.reviewDueAt)<new Date("2026-09-27"))warnings.push(`${claim.id}: revisão vencida`);});});
 medicationKnowledge.forEach((item)=>{check(item.id,item.sourceIds);if(item.doseStatus==="not-published")warnings.push(`${item.genericName}: dose bloqueada até auditoria por produto e indicação.`);});
 examKnowledge.forEach((item)=>check(item.id,item.sourceIds));
 const preliminary=new Set(clinicalSources.filter((s)=>s.status==="preliminary").map((s)=>s.id));
 conditions.forEach((condition)=>{if(condition.sourceIds.some((id)=>preliminary.has(id))&&condition.publicationLevel!=="review-needed")errors.push(`${condition.id}: fonte preliminar exige review-needed`);});
 return {valid:errors.length===0,errors,warnings};
}
