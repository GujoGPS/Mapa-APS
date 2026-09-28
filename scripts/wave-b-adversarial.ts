import {createSyntheticBackup,corruptStore,futureSchema,removeStore,tamperCiphertext,validateBackupPure} from "../src/backup/adversarial";
import {protectBackup,unprotectBackup} from "../src/backup/crypto";
import {STORES} from "../src/storage/schema";
import {checksumOf} from "../src/storage/hash";
function assert(value:unknown,message:string){if(!value)throw new Error(message)}
let passed=0;async function test(name:string,fn:()=>unknown|Promise<unknown>){await fn();passed++;console.log(`[pass] ${name}`)}
const valid=await createSyntheticBackup({records:[{id:"synthetic",payload:{ok:true}}]});
await test("backup sintético válido",async()=>assert((await validateBackupPure(valid)).valid,"backup válido rejeitado"));
await test("corrupção de store detectada",async()=>assert(!(await validateBackupPure(corruptStore(valid,STORES.records))).valid,"corrupção aceita"));
await test("store ausente detectada",async()=>assert(!(await validateBackupPure(removeStore(valid,STORES.events))).valid,"store ausente aceita"));
await test("schema futuro rejeitado",async()=>assert(!(await validateBackupPure(futureSchema(valid))).valid,"schema futuro aceito"));
await test("checksum global adulterado rejeitado",async()=>{const copy=structuredClone(valid);copy.appVersion="adulterado";assert(!(await validateBackupPure(copy)).valid,"checksum global aceito")});
await test("ordem de objetos não altera checksum",async()=>assert(await checksumOf({b:2,a:1})===await checksumOf({a:1,b:2}),"canonicalização instável"));
const protectedBackup=await protectBackup(JSON.stringify(valid),"frase-secreta-sintetica");
await test("backup protegido abre com senha correta",async()=>assert((await unprotectBackup(protectedBackup,"frase-secreta-sintetica")).includes("mapa-backup"),"decrypt falhou"));
await test("senha incorreta rejeitada",async()=>{let rejected=false;try{await unprotectBackup(protectedBackup,"frase-secreta-incorreta")}catch{rejected=true}assert(rejected,"senha incorreta aceita")});
await test("ciphertext adulterado rejeitado",async()=>{let rejected=false;try{await unprotectBackup({...protectedBackup,ciphertext:tamperCiphertext(protectedBackup.ciphertext)},"frase-secreta-sintetica")}catch{rejected=true}assert(rejected,"ciphertext adulterado aceito")});
await test("senha curta recusada",async()=>{let rejected=false;try{await protectBackup("{}","curta")}catch{rejected=true}assert(rejected,"senha curta aceita")});
console.log(`[ok] Wave B adversarial: ${passed} testes`);
