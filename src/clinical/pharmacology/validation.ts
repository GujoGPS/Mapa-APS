import type { PharmacologyEntry } from "./types";
const PLACEHOLDER=/_A_PREENCHER|MEDICAMENTO_EXEMPLO|NOME_GENERICO_A_PREENCHER/;
export function validatePharmacologyEntry(entry:PharmacologyEntry):string[]{const errors:string[]=[];if(!entry.id.trim())errors.push("id ausente");if(!entry.genericName.trim())errors.push("nome genérico ausente");if(!entry.therapeuticClass.trim())errors.push("classe ausente");if(PLACEHOLDER.test(JSON.stringify(entry)))errors.push("existem placeholders não preenchidos");if(entry.reviewStatus!=="draft"&&!entry.sources.length)errors.push("ficha revisada sem fonte");return errors}
export function publishablePharmacologyEntries(entries:PharmacologyEntry[]){return entries.filter(e=>e.reviewStatus!=="archived"&&validatePharmacologyEntry(e).length===0)}
