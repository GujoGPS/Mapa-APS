import {access,readFile} from "node:fs/promises";
const required=["src/clinical/types.ts","src/clinical/sources.ts","src/clinical/content.ts","src/clinical/validation.ts","app/clinical-library.tsx"];
for(const p of required)await access(p);
const content=await readFile("src/clinical/content.ts","utf8");for(const id of ["has","dm2","drc","dyslipidemia","obesity"])if(!content.includes(`id:"${id}"`))throw new Error(`Condição ausente: ${id}`);
if(!content.includes('doseStatus:"not-published"'))throw new Error("Trava de dose ausente");
const sources=await readFile("src/clinical/sources.ts","utf8");if(!sources.includes('status:"preliminary"'))throw new Error("Fonte preliminar não marcada");
console.log(`[ok] ${required.length} componentes do Marco 4 verificados`);
