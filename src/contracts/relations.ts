import type { AuditFields, EntityId, ISODateTime, ProvenancedRecord } from "./core";
export type RelationshipQuality="strong"|"adequate"|"weak"|"conflict"|"ruptured"|"divergent"|"unknown";
export type RelationshipDirection="mutual"|"from-source"|"to-source"|"none";
export interface InterpersonalRelationship extends AuditFields,ProvenancedRecord { familyId:EntityId; sourcePersonId:EntityId; targetPersonId:EntityId; formalType:string; quality:RelationshipQuality; direction:RelationshipDirection; careDirection?:RelationshipDirection; frequency?:"daily"|"weekly"|"monthly"|"occasional"|"none"|"unknown"; perspectivePersonId?:EntityId; perspectiveLabel:string; validFrom?:ISODateTime; validTo?:ISODateTime; notes?:string; }
export type ResourceType="health"|"education"|"work"|"community"|"religion"|"extended-family"|"social-assistance"|"leisure"|"justice"|"other";
export interface ExternalResource extends AuditFields { familyId:EntityId; name:string; type:ResourceType; state:"potential"|"active"|"inactive"|"closed"; description?:string; }
export interface ExternalLink extends AuditFields,ProvenancedRecord { familyId:EntityId; resourceId:EntityId; personId?:EntityId; quality:RelationshipQuality; direction:RelationshipDirection; intensity:"low"|"moderate"|"high"|"unknown"; perspectivePersonId?:EntityId; perspectiveLabel:string; validFrom?:ISODateTime; validTo?:ISODateTime; notes?:string; }
export type DiagramKind="genogram"|"ecomap";
export interface DiagramLayout extends AuditFields { familyId:EntityId; kind:DiagramKind; perspectivePersonId?:EntityId; periodLabel:string; positions:Record<string,{x:number;y:number}>; layer:"structural"|"household"|"clinical"|"functional"|"consolidated"; }
