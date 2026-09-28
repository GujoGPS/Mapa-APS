import scenario from "@/src/data/synthetic/wave-d-semester.json";
import {checksumOf} from "@/src/storage/hash";
export interface SimulationCheck{id:string;passed:boolean;evidence:string}
export interface SimulationResult{synthetic:true;checks:SimulationCheck[];passed:number;failed:number;semesterChecksum:string;report:string}
export async function runWaveDSimulation():Promise<SimulationResult>{
 const checks:SimulationCheck[]=[];const check=(id:string,passed:boolean,evidence:string)=>checks.push({id,passed,evidence});
 check("synthetic-marker",scenario.synthetic===true,"Conjunto explicitamente sintético");
 check("expected-not-limit",scenario.semester.expectedFamilyCount===2&&scenario.families.length>=2,"Duas famílias esperadas sem limite rígido");
 const horizonte=scenario.families.find(f=>f.nickname==="Horizonte");const travessia=scenario.families.find(f=>f.nickname==="Travessia");
 if(!horizonte||!("medications" in horizonte)||!("exams" in horizonte))throw new Error("Cenário Horizonte incompleto.");
 if(!travessia)throw new Error("Cenário Travessia ausente.");
 check("longitudinal-encounters",scenario.families.every(f=>f.encounters.length>=2),"Cada família possui dois encontros");
 check("unknown-medication",horizonte.medications.some(m=>m.identification==="partial"),"Medicamento parcialmente identificado preservado");
 check("no-dose",scenario.families.flatMap(f=>"medications" in f?f.medications:[]).every(m=>m.dosePublished===false),"Nenhuma posologia publicada");
 check("exam-unit-guard",horizonte.exams.some(e=>!e.unit&&e.interpretationState==="insufficient-data"),"Exame sem unidade não interpretado");
 check("multiple-households","households" in travessia&&travessia.households.length===2,"Adolescente em dois domicílios");
 check("perspectives","relationships" in travessia&&new Set(travessia.relationships.map(r=>r.perspective)).size>=2,"Perspectivas divergentes preservadas");
 check("third-party-blocked","thirdPartyNotes" in travessia&&travessia.thirdPartyNotes.every(n=>n.sharingState==="blocked"),"Informação de terceiro bloqueada");
 check("screening-process","screenings" in travessia&&travessia.screenings.some(s=>s.state==="postponed"&&s.laterState==="accepted"),"Rastreamento representado como processo");
 check("pending-destinations",scenario.families.flatMap(f=>f.pending).every(p=>p.destination!=="open"),"Todas as pendências possuem destino explícito");
 check("snapshot-immutable",scenario.closure.snapshotImmutable&&scenario.closure.addendum.changesOriginal===false,"Adendo não altera snapshot");
 check("incident-drills",scenario.incidentDrills.length===3&&scenario.incidentDrills.every(i=>["reject","block"].includes(i.expected)),"Incidentes possuem resultado seguro esperado");
 const semesterChecksum=await checksumOf(scenario);const passed=checks.filter(c=>c.passed).length,failed=checks.length-passed;
 const report=["PILOTO SINTÉTICO INTEGRAL",`Semestre: ${scenario.semester.code}`,`Famílias: ${scenario.families.map(f=>f.nickname).join(", ")}`,`Checks: ${passed}/${checks.length}`,`Checksum: ${semesterChecksum}`,"",...checks.map(c=>`${c.passed?"PASS":"FAIL"} | ${c.id} | ${c.evidence}`)].join("\n");
 return{synthetic:true,checks,passed,failed,semesterChecksum,report}
}
