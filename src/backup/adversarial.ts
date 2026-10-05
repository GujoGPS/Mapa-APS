import { checksumOf } from "@/src/storage/hash";
import { MAPA_DB_VERSION, STORES, type StoreName } from "@/src/storage/schema";
import { BACKUP_FORMAT, BACKUP_VERSION, type BackupPayload, type BackupValidation } from "./types";

const storeNames=Object.values(STORES) as StoreName[];
export async function createSyntheticBackup(stores?:Partial<Record<StoreName,unknown[]>>):Promise<BackupPayload>{
 const complete={} as Record<StoreName,unknown[]>;const checks={} as Record<StoreName,string>;
 for(const name of storeNames){complete[name]=structuredClone(stores?.[name]??[]);checks[name]=await checksumOf(complete[name])}
 const base: Omit<BackupPayload, "payloadChecksum">={format:BACKUP_FORMAT,version:BACKUP_VERSION,schemaVersion:MAPA_DB_VERSION,createdAt:new Date(0).toISOString(),appVersion:"synthetic-adversarial",protected:false as const,stores:complete,storeChecksums:checks};
 return{...base,payloadChecksum:await checksumOf(base)}
}
export async function validateBackupPure(backup:BackupPayload):Promise<BackupValidation>{
 const errors:string[]=[];const warnings:string[]=[];const counts:Partial<Record<StoreName,number>>={};
 if(backup.format!==BACKUP_FORMAT)errors.push("Formato de backup desconhecido.");
 if(backup.version!==BACKUP_VERSION)errors.push("Versão de backup não suportada.");
 if(backup.schemaVersion>MAPA_DB_VERSION)errors.push("O backup exige uma versão mais nova do aplicativo.");
 if(!backup.stores||!backup.storeChecksums)errors.push("Estrutura de stores ausente.");
 if(backup.stores&&backup.storeChecksums)for(const store of storeNames){const records=backup.stores[store];if(!Array.isArray(records)){errors.push(`Store ausente: ${store}.`);continue}counts[store]=records.length;if(await checksumOf(records)!==backup.storeChecksums[store])errors.push(`Integridade inválida em ${store}.`)}
 const{payloadChecksum,...base}=backup;if(await checksumOf(base)!==payloadChecksum)errors.push("Checksum global inválido.");
 if(backup.schemaVersion<MAPA_DB_VERSION)warnings.push("O backup será migrado antes da restauração.");
 if(backup.stores?.records){
  const records=backup.stores.records as Array<{entityType?:string;payload?:Record<string, unknown> }>;
  const families=new Set(records.filter((record)=>record.entityType==="family").map((record)=>record.payload?.id));
  const people=new Set(records.filter((record)=>record.entityType==="person").map((record)=>record.payload?.id));
  const memberships=records.filter((record)=>record.entityType==="family-membership").map((record)=>record.payload);
  for(const record of records.filter((entry)=>entry.entityType==="instrument-application")){
   const application=record.payload;
   if(!application?.applicationId||typeof application.familyId!=="string"||typeof application.personId!=="string")errors.push("Aplicação de instrumento incompleta.");
   if(typeof application?.familyId==="string"&&!families.has(application.familyId))errors.push(`Aplicação ${String(application.applicationId??"desconhecida")} referencia família inexistente.`);
   if(typeof application?.personId==="string"&&!people.has(application.personId))errors.push(`Aplicação ${String(application.applicationId??"desconhecida")} referencia pessoa inexistente.`);
   if(typeof application?.familyId==="string"&&typeof application.personId==="string"&&!memberships.some((membership)=>membership?.familyId===application.familyId&&membership?.personId===application.personId))errors.push(`Aplicação ${String(application.applicationId??"desconhecida")} referencia vínculo inexistente.`);
  }
 }
 return{valid:errors.length===0,protected:false,errors,warnings,counts}
}
export function tamperCiphertext(value:string):string{if(!value)return value;const index=Math.floor(value.length/2);return value.slice(0,index)+(value[index]==="A"?"B":"A")+value.slice(index+1)}
export function futureSchema(backup:BackupPayload):BackupPayload{return{...structuredClone(backup),schemaVersion:MAPA_DB_VERSION+1}}
export function removeStore(backup:BackupPayload,store:StoreName):BackupPayload{const copy=structuredClone(backup) as BackupPayload;delete (copy.stores as Partial<Record<StoreName,unknown[]>>)[store];return copy}
export function corruptStore(backup:BackupPayload,store:StoreName):BackupPayload{const copy=structuredClone(backup);copy.stores[store]=[...copy.stores[store],{corrupted:true}];return copy}
