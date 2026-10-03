import type {ConfirmationStatus,Provenance,Sensitivity,SharingState} from "@/src/contracts/core";
import type {ExternalLink,ExternalResource,InterpersonalRelationship,RelationshipDirection,RelationshipQuality,ResourceType} from "@/src/contracts/relations";
import {auditFields,newId,nowIso,updatedAudit} from "./entity";
const trust=(thirdParty=false)=>({provenance:(thirdParty?"third-party-reported":"self-reported") as Provenance,confirmation:"reported" as ConfirmationStatus,sensitivity:(thirdParty?"third-party":"family") as Sensitivity,sharingState:(thirdParty?"blocked":"private") as SharingState});
export function createRelationship(input:{familyId:string;sourcePersonId:string;targetPersonId:string;formalType:string;quality:RelationshipQuality;direction?:RelationshipDirection;perspectivePersonId?:string;perspectiveLabel:string;notes?:string;thirdParty?:boolean}):InterpersonalRelationship{return{...auditFields(newId("relation")),...trust(input.thirdParty),familyId:input.familyId,sourcePersonId:input.sourcePersonId,targetPersonId:input.targetPersonId,formalType:input.formalType.trim(),quality:input.quality,direction:input.direction??"mutual",perspectiveLabel:input.perspectiveLabel.trim(),...(input.perspectivePersonId?{perspectivePersonId:input.perspectivePersonId}:{}),...(input.notes?.trim()?{notes:input.notes.trim()}:{}),validFrom:nowIso()}}
/**
 * Editar um vinculo nunca sobrescreve o que ja existia: a versao anterior fica no changeLog com o
 * motivo informado, e a proveniencia original permanece.
 */
export function updateRelationship(
  relationship: InterpersonalRelationship,
  input: { formalType: string; quality: RelationshipQuality; direction?: RelationshipDirection; perspectivePersonId?: string; perspectiveLabel: string; notes?: string; thirdParty?: boolean },
  reason: string,
): InterpersonalRelationship {
  if (!reason.trim()) throw new Error("Informe o motivo da alteracao.");
  const updated: InterpersonalRelationship = {
    ...relationship,
    formalType: input.formalType.trim(),
    quality: input.quality,
    direction: input.direction ?? relationship.direction,
    perspectiveLabel: input.perspectiveLabel.trim(),
    ...(relationship.validFrom ? { validFrom: relationship.validFrom } : {}),
    ...updatedAudit(relationship),
    changeLog: [...(relationship.changeLog ?? []), { at: nowIso(), action: "edited", reason: reason.trim() }],
  };
  if (input.perspectivePersonId) updated.perspectivePersonId = input.perspectivePersonId;
  else delete updated.perspectivePersonId;
  if (input.notes?.trim()) updated.notes = input.notes.trim();
  if (input.thirdParty !== undefined) {
    updated.provenance = input.thirdParty ? "third-party-reported" : "self-reported";
    updated.sensitivity = input.thirdParty ? "third-party" : "family";
    updated.sharingState = input.thirdParty ? "blocked" : "private";
  }
  return updated;
}

/** Remove o vinculo guardando o registro do que foi retirado, em vez de sumir com ele. */
export function removedRelationship(relationship: InterpersonalRelationship, reason: string): InterpersonalRelationship {
  if (!reason.trim()) throw new Error("Informe o motivo da exclusao.");
  const { validTo, ...open } = relationship;
  return {
    ...open,
    ...updatedAudit(relationship),
    validTo: nowIso(),
    changeLog: [...(relationship.changeLog ?? []), { at: nowIso(), action: "deleted", reason: reason.trim() }],
  };
}

export function isRelationshipOpen(relationship: InterpersonalRelationship): boolean {
  return !relationship.validTo;
}

export function createResource(input:{familyId:string;name:string;type:ResourceType;state?:ExternalResource["state"];description?:string}):ExternalResource{return{...auditFields(newId("resource")),familyId:input.familyId,name:input.name.trim(),type:input.type,state:input.state??"active",...(input.description?.trim()?{description:input.description.trim()}: {})}}
export function createExternalLink(input:{familyId:string;resourceId:string;personId?:string;quality:RelationshipQuality;direction?:RelationshipDirection;intensity?:ExternalLink["intensity"];perspectivePersonId?:string;perspectiveLabel:string;notes?:string;thirdParty?:boolean}):ExternalLink{return{...auditFields(newId("external-link")),...trust(input.thirdParty),familyId:input.familyId,resourceId:input.resourceId,...(input.personId?{personId:input.personId}:{}),quality:input.quality,direction:input.direction??"mutual",intensity:input.intensity??"moderate",...(input.perspectivePersonId?{perspectivePersonId:input.perspectivePersonId}:{}),perspectiveLabel:input.perspectiveLabel.trim(),...(input.notes?.trim()?{notes:input.notes.trim()}:{}),validFrom:nowIso()}}
