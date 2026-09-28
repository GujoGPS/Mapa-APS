import type { ConfirmationStatus, Provenance, Sensitivity, SharingState } from "@/src/contracts/core";
import type { CarePlan, ConditionRecord, ExamResultRecord, PatientSuggestion, PersonMedicationRecord, ScreeningEpisode } from "@/src/contracts/longitudinal";
import { auditFields, newId } from "./entity";

const trust = (provenance: Provenance = "self-reported", confirmation: ConfirmationStatus = "reported", sensitivity: Sensitivity = "health", sharingState: SharingState = "review") => ({ provenance, confirmation, sensitivity, sharingState });

export function createCondition(input: { personId:string; label:string; kind:ConditionRecord["kind"]; clinicalState?:ConditionRecord["clinicalState"]; professionalSummary?:string; sharedSummary?:string; thirdParty?:boolean }): ConditionRecord {
 return { ...auditFields(newId("condition")), ...trust(input.thirdParty?"third-party-reported":"self-reported","reported",input.thirdParty?"third-party":"health",input.thirdParty?"blocked":"review"), personId:input.personId, originalLabel:input.label.trim(), kind:input.kind, clinicalState:input.clinicalState??"identified", ...(input.professionalSummary?.trim()?{professionalSummary:input.professionalSummary.trim()}:{}), ...(input.sharedSummary?.trim()?{sharedSummary:input.sharedSummary.trim()}: {}) };
}
export function createMedication(input:{personId:string;reportedName:string;presentationText?:string;prescribedUseText?:string;actualUseText?:string;state?:PersonMedicationRecord["state"];sharedSummary?:string}):PersonMedicationRecord {
 return { ...auditFields(newId("medication")), ...trust(), personId:input.personId, reportedName:input.reportedName.trim(), ...(input.presentationText?.trim()?{presentationText:input.presentationText.trim()}:{}), ...(input.prescribedUseText?.trim()?{prescribedUseText:input.prescribedUseText.trim()}:{}), ...(input.actualUseText?.trim()?{actualUseText:input.actualUseText.trim()}:{}), state:input.state??"reported", ...(input.sharedSummary?.trim()?{sharedSummary:input.sharedSummary.trim()}: {}) };
}
export function createExamResult(input:{personId:string;examName:string;valueText:string;unit?:string;collectedAt?:string;documentAvailable?:boolean;sharedSummary?:string}):ExamResultRecord {
 return { ...auditFields(newId("exam")), ...trust("document",input.documentAvailable?"document-confirmed":"reported"), personId:input.personId, examName:input.examName.trim(), valueText:input.valueText.trim(), ...(input.unit?.trim()?{unit:input.unit.trim()}:{}), ...(input.collectedAt?{collectedAt:input.collectedAt}:{}), documentAvailable:input.documentAvailable??false, interpretationState:input.unit?.trim()?"context-needed":"insufficient-data", ...(input.sharedSummary?.trim()?{sharedSummary:input.sharedSummary.trim()}: {}) };
}
export function createScreening(input:{personId:string;title:string;state?:ScreeningEpisode["state"];rationale?:string;sharedSummary?:string}):ScreeningEpisode {
 return { ...auditFields(newId("screening")), ...trust("system-generated","unverified"), personId:input.personId, title:input.title.trim(), state:input.state??"eligibility-review", ...(input.rationale?.trim()?{rationale:input.rationale.trim()}:{}), ...(input.sharedSummary?.trim()?{sharedSummary:input.sharedSummary.trim()}: {}) };
}
export function createCarePlan(input:{personId?:string;familyId?:string;title:string;objective:string;target:CarePlan["target"];responsibility?:string;sharedSummary?:string}):CarePlan {
 return { ...auditFields(newId("plan")), ...trust("self-reported","reported","health","review"), ...(input.personId?{personId:input.personId}:{}), ...(input.familyId?{familyId:input.familyId}:{}), title:input.title.trim(), objective:input.objective.trim(), target:input.target, ...(input.responsibility?.trim()?{responsibility:input.responsibility.trim()}:{}), state:"proposed", ...(input.sharedSummary?.trim()?{sharedSummary:input.sharedSummary.trim()}: {}) };
}
export function createPatientSuggestion(input:{personId:string;text:string;relatedEntityId?:string}):PatientSuggestion {
 return { ...auditFields(newId("suggestion")), ...trust("self-reported","reported","personal","private"), personId:input.personId, ...(input.relatedEntityId?{relatedEntityId:input.relatedEntityId}:{}), text:input.text.trim(), state:"received" };
}
