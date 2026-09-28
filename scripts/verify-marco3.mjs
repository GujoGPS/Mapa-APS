import {access,readFile} from "node:fs/promises";
const required=["src/contracts/longitudinal.ts","src/contracts/sharing.ts","src/domain/longitudinal-factories.ts","src/domain/sharing-policy.ts","src/domain/care-selectors.ts","app/person-care-panel.tsx"];
for(const p of required)await access(p);
const panel=await readFile("app/person-care-panel.tsx","utf8");
for(const phrase of ["Resumo de acompanhamento","O prontuário completo permanece na unidade de saúde","Passagem 30 s","Transcrição","Voltar ao modo profissional"])if(!panel.includes(phrase))throw new Error(`Fluxo ausente: ${phrase}`);
console.log(`[ok] ${required.length} componentes do Marco 3 verificados`);
