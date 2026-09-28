import type { CarePlan, ConditionRecord, ExamResultRecord, PersonMedicationRecord, ScreeningEpisode } from "@/src/contracts/longitudinal";
import type { HandoffDraft, SharedCard } from "@/src/contracts/sharing";
import type { Encounter } from "@/src/contracts/care";
import type { Person } from "@/src/contracts/family";
import { sharingDecision } from "./sharing-policy";

type CareEntity = ConditionRecord|PersonMedicationRecord|ExamResultRecord|ScreeningEpisode|CarePlan;

export function createSharedCards(entities:CareEntity[]):SharedCard[] {
 return entities.map((entity)=>{
  const decision=sharingDecision(entity,"person-summary");
  let sourceType:SharedCard["sourceType"]; let title:string; let body:string; let stateLabel:string;
  if ("originalLabel" in entity) { sourceType="condition"; title=entity.originalLabel; body=entity.sharedSummary??"Esta informação ainda precisa ser explicada antes de compartilhar."; stateLabel=entity.clinicalState; }
  else if ("reportedName" in entity) { sourceType="medication"; title=entity.reportedName; body=entity.sharedSummary??`Uso informado: ${entity.actualUseText??"a confirmar"}.`; stateLabel=entity.state; }
  else if ("examName" in entity) { sourceType="exam"; title=entity.examName; body=entity.sharedSummary??`Resultado registrado: ${entity.valueText}${entity.unit?` ${entity.unit}`:""}.`; stateLabel=entity.interpretationState; }
  else if ("objective" in entity) { sourceType="plan"; title=entity.title; body=entity.sharedSummary??entity.objective; stateLabel=entity.state; }
  else { sourceType="screening"; title=entity.title; body=entity.sharedSummary??"Este item está sendo acompanhado."; stateLabel=entity.state; }
  return { id:entity.id, sourceType, title, body, stateLabel, selected:decision.allowed&&!decision.requiresReview, blocked:!decision.allowed, ...(decision.reasons[0]?{blockReason:decision.reasons.join(" ")}: {}) };
 });
}

export function buildHandoff(person:Person, entities:CareEntity[], encounters:Encounter[], duration:HandoffDraft["duration"]):HandoffDraft {
 const facts=entities.slice(0,duration==="30s"?3:duration==="2min"?8:999).map((entity)=>{
  if("originalLabel" in entity) return `${entity.originalLabel} (${entity.kind}, ${entity.clinicalState})`;
  if("reportedName" in entity) return `${entity.reportedName}: ${entity.state}`;
  if("examName" in entity) return `${entity.examName}: ${entity.valueText}${entity.unit?` ${entity.unit}`:" unidade não informada"}`;
  if("objective" in entity) return `Plano: ${entity.title} (${entity.state})`;
  return `Rastreamento: ${entity.title} (${entity.state})`;
 });
 const recent=encounters.filter((item)=>item.personIds.includes(person.id)).slice(0,duration==="30s"?1:duration==="2min"?3:999);
 return { duration, identification:`${person.displayName??person.code}, ${person.lifeStage??"faixa etária não informada"}.`, facts, interpretations:[], actions:recent.map((item)=>item.nextStep).filter((value):value is string=>Boolean(value)), questions:[] };
}

export function transcriptionText(person:Person, entities:CareEntity[], encounters:Encounter[]):string {
 const draft=buildHandoff(person,entities,encounters,"full");
 return [`IDENTIFICAÇÃO`,draft.identification,"","DADOS REGISTRADOS",...draft.facts.map((item)=>`- ${item}`),"","ENCONTROS RECENTES",...encounters.filter((item)=>item.personIds.includes(person.id)).slice(0,5).map((item)=>`- ${item.occurredAt}: ${item.title}${item.nextStep?` | Próximo: ${item.nextStep}`:""}`)].join("\n");
}
