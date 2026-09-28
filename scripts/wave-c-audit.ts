import {claimReviewRows,clinicalReviewReadiness,medicationReviewRows} from "../src/clinical/review";import {clinicalSources} from "../src/clinical/sources";import {validateClinicalLibrary} from "../src/clinical/validation";
function assert(v:unknown,m:string){if(!v)throw new Error(m)}let n=0;function test(name:string,fn:()=>void){fn();n++;console.log(`[pass] ${name}`)}
const claims=claimReviewRows(),meds=medicationReviewRows(),status=clinicalReviewReadiness();
test("35 afirmações inventariadas",()=>assert(claims.length===35,`claims=${claims.length}`));
test("cinco blocos farmacológicos inventariados",()=>assert(meds.length===5,`meds=${meds.length}`));
test("nenhuma dose publicada",()=>assert(meds.every(m=>m.doseStatus==="not-published"),"dose publicada"));
test("toda medicação exige auditoria por produto",()=>assert(meds.every(m=>m.productAuditRequired),"auditoria ausente"));
test("fontes referenciadas existem",()=>assert(validateClinicalLibrary().valid,"biblioteca inválida"));
test("fonte preliminar não é promovida",()=>assert(clinicalSources.filter(s=>s.status==="preliminary").every(s=>claims.filter(c=>c.sourceIds.includes(s.id)).every(c=>c.decision==="blocked-preliminary-source")),"preliminar promovida"));
test("gate clínico permanece fechado",()=>assert(!status.ready,"gate indevidamente aberto"));
test("revisão independente ainda não falsificada",()=>assert(claims.every(c=>!c.reviewer&&!c.reviewedAt),"revisor fictício"));
console.log(`[ok] Wave C audit: ${n} testes; ${status.claims} claims; ${status.medications} blocos farmacológicos`);
