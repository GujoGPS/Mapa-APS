# Mapa APS: pacote de contexto 5

Este pacote contem arquivos integrais do projeto.

Cada arquivo comeca com:

# FILE: caminho/original

e termina com:

# END FILE: caminho/original

Nao interprete a ausencia de um arquivo neste pacote como ausencia no projeto. Outros arquivos podem estar nos demais pacotes.

---

# FILE: src/domain/demo-mode.ts

``typescript
import type { DemoSessionMetaRecord, DemoSessionSnapshot } from "@/src/contracts/demo";
import { DEMO_SAMPLE_FAMILY_IDS, DEMO_SAMPLE_SEMESTER_ID, DEMO_SESSION_META_ID, DEMO_SESSION_SCHEMA_VERSION, isLegacyDemoEntityId } from "@/src/contracts/demo";
import { getAllValues, replaceAllStores, replaceStore } from "@/src/storage/idb";
import { STORES, type StoreName } from "@/src/storage/schema";
import { nowIso } from "./entity";
import { seedSyntheticSemester } from "./demo-seed";
import { getDemoSession } from "./demo-session";

export { getDemoSession } from "./demo-session";

type EnvelopeLike = { id?: unknown; payload?: unknown };
type PayloadLike = { dataOrigin?: unknown; familyId?: unknown; personId?: unknown; semesterId?: unknown };

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function payloadOf(record: unknown): PayloadLike {
  const envelope = asObject(record) as EnvelopeLike;
  return asObject(envelope.payload) as PayloadLike;
}

export function syntheticDemoRecordIds(records: unknown[]): Set<string> {
  const legacyFamilyIds = new Set<string>(DEMO_SAMPLE_FAMILY_IDS);
  const legacyPersonIds = new Set<string>();
  for (const record of records) {
    const payload = payloadOf(record);
    if (typeof payload.familyId === "string" && legacyFamilyIds.has(payload.familyId) && typeof payload.personId === "string") {
      legacyPersonIds.add(payload.personId);
    }
  }

  return new Set(records.flatMap((record) => {
    const envelope = asObject(record) as EnvelopeLike;
    const id = typeof envelope.id === "string" ? envelope.id : undefined;
    const payload = payloadOf(record);
    const belongsToLegacyFamily = typeof payload.familyId === "string" && legacyFamilyIds.has(payload.familyId);
    const isSynthetic = payload.dataOrigin === "synthetic-demo"
      || Boolean(id && (isLegacyDemoEntityId(id) || legacyPersonIds.has(id)))
      || belongsToLegacyFamily
      || payload.semesterId === DEMO_SAMPLE_SEMESTER_ID
      || (typeof payload.personId === "string" && legacyPersonIds.has(payload.personId));
    return isSynthetic && id ? [id] : [];
  }));
}

export function excludeSyntheticDemoRecords(records: unknown[]): unknown[] {
  const syntheticIds = syntheticDemoRecordIds(records);
  return records.filter((record) => {
    const id = asObject(record).id;
    return typeof id !== "string" || !syntheticIds.has(id);
  });
}

async function readAllStores(): Promise<Record<StoreName, unknown[]>> {
  const names = Object.values(STORES) as StoreName[];
  const entries = await Promise.all(names.map(async (name) => [name, await getAllValues(name)] as const));
  return Object.fromEntries(entries) as Record<StoreName, unknown[]>;
}

export async function enterDemoMode(): Promise<DemoSessionSnapshot> {
  if (await getDemoSession()) throw new Error("O modo demonstração já está ativo.");

  const stores = await readAllStores();
  const normalRecords = excludeSyntheticDemoRecords(stores[STORES.records]);
  const session: DemoSessionSnapshot = {
    state: "active",
    schemaVersion: DEMO_SESSION_SCHEMA_VERSION,
    startedAt: nowIso(),
    snapshotRecords: normalRecords,
    snapshotDrafts: stores[STORES.drafts],
    snapshotEvents: stores[STORES.events],
  };
  const sessionRecord: DemoSessionMetaRecord = { id: DEMO_SESSION_META_ID, value: session, updatedAt: session.startedAt };

  stores[STORES.records] = [];
  stores[STORES.drafts] = [];
  stores[STORES.events] = [];
  stores[STORES.meta] = [
    ...stores[STORES.meta].filter((record) => asObject(record).id !== DEMO_SESSION_META_ID),
    sessionRecord,
  ];
  await replaceAllStores(stores);

  try {
    await seedSyntheticSemester();
    return session;
  } catch (error) {
    await exitDemoMode();
    throw error;
  }
}

export async function removeDemoData(): Promise<number> {
  const records = await getAllValues(STORES.records);
  const syntheticIds = syntheticDemoRecordIds(records);
  await replaceStore(STORES.records, records.filter((record) => {
    const id = asObject(record).id;
    return typeof id !== "string" || !syntheticIds.has(id);
  }));
  return syntheticIds.size;
}

export async function exitDemoMode(): Promise<boolean> {
  const session = await getDemoSession();
  if (!session) return false;

  const stores = await readAllStores();
  stores[STORES.records] = session.snapshotRecords;
  stores[STORES.drafts] = session.snapshotDrafts;
  stores[STORES.events] = session.snapshotEvents;
  stores[STORES.meta] = stores[STORES.meta].filter((record) => asObject(record).id !== DEMO_SESSION_META_ID);
  await replaceAllStores(stores);
  return true;
}

export async function countSyntheticDemoData(): Promise<number> {
  return syntheticDemoRecordIds(await getAllValues(STORES.records)).size;
}

``

# END FILE: src/domain/demo-mode.ts

---

# FILE: src/domain/demo-seed.ts

``typescript
import semesterDemo from "@/src/data/synthetic/semester-2026-2.json";
import type { Family, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import { auditFields } from "./entity";
import { ENTITY_TYPES } from "./entity-types";
import { saveEntity } from "./repository";
import { getDemoSession } from "./demo-session";

export async function seedSyntheticSemester(): Promise<void> {
  if (semesterDemo.synthetic !== true) throw new Error("O conjunto não é sintético.");
  if (!(await getDemoSession())) throw new Error("Ative o modo de demonstração antes de carregar dados sintéticos.");
  const at = new Date().toISOString();
  const semester: Semester = { ...auditFields(semesterDemo.semester.id, at), code: semesterDemo.semester.code, label: semesterDemo.semester.label, state: "active", expectedFamilyCount: semesterDemo.semester.expectedFamilyCount, startsAt: at };
  await saveEntity(ENTITY_TYPES.semester, semester);
  for (const item of semesterDemo.families) {
    const family: Family = { ...auditFields(item.id, at), code: item.code, nickname: item.nickname, focus: item.focus, state: "active", openedAt: at };
    await saveEntity(ENTITY_TYPES.family, family);
    const link: SemesterFamilyLink = { ...auditFields(`link_${item.id}`, at), semesterId: semester.id, familyId: family.id, state: "active", startedAt: at };
    await saveEntity(ENTITY_TYPES.semesterFamily, link);
  }
}

``

# END FILE: src/domain/demo-seed.ts

---

# FILE: src/domain/demo-session.ts

``typescript
import type { DemoSessionMetaRecord, DemoSessionSnapshot } from "@/src/contracts/demo";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";
import { getValue } from "@/src/storage/idb";
import { STORES } from "@/src/storage/schema";

export async function getDemoSession(): Promise<DemoSessionSnapshot | undefined> {
  const record = await getValue<DemoSessionMetaRecord>(STORES.meta, DEMO_SESSION_META_ID);
  if (!record) return undefined;
  if (
    record.value?.state !== "active"
    || record.value.schemaVersion !== 2
    || !Array.isArray(record.value.snapshotRecords)
    || !Array.isArray(record.value.snapshotDrafts)
    || !Array.isArray(record.value.snapshotEvents)
  ) {
    throw new Error("A sessão de demonstração local está inconsistente. Os dados não foram alterados.");
  }
  return record.value;
}

``

# END FILE: src/domain/demo-session.ts

---

# FILE: src/domain/diagram-engine.ts

``typescript
import type {Family,FamilyMembership,Household,Person,ResidencePeriod} from "@/src/contracts/family";
import type {ExternalLink,ExternalResource,InterpersonalRelationship,RelationshipQuality} from "@/src/contracts/relations";
export interface DiagramNode{id:string;label:string;subtitle?:string;kind:"person"|"family"|"resource"|"household";x:number;y:number;state?:string;}
export interface DiagramEdge{id:string;sourceId:string;targetId:string;label:string;quality:RelationshipQuality;direction:"mutual"|"from-source"|"to-source"|"none";perspective:string;}
export interface DiagramModel{kind:"genogram"|"ecomap";nodes:DiagramNode[];edges:DiagramEdge[];perspectiveLabel:string;periodLabel:string;manifest:{expectedNodes:number;expectedEdges:number;divergentEdges:number;};}
const ring=(index:number,total:number,radius:number,centerX=300,centerY=220)=>{const angle=-Math.PI/2+(index*Math.PI*2)/Math.max(total,1);return{x:centerX+Math.cos(angle)*radius,y:centerY+Math.sin(angle)*radius}};
export function buildGenogram(input:{family:Family;people:Person[];memberships:FamilyMembership[];relationships:InterpersonalRelationship[];households?:Household[];residences?:ResidencePeriod[];layer:"structural"|"household"|"clinical"|"functional";perspectivePersonId?:string;periodLabel?:string}):DiagramModel{const members=input.memberships.filter((m)=>m.familyId===input.family.id&&!m.validTo);const people=input.people.filter((p)=>members.some((m)=>m.personId===p.id));const nodes:DiagramNode[]=people.map((p,i)=>{const pos=ring(i,people.length,145);const role=members.find((m)=>m.personId===p.id)?.roleLabel;const subtitle=input.layer==="functional"?role:input.layer==="household"?"domicílio a revisar":p.lifeStage;return{id:p.id,label:p.displayName||p.code,...(subtitle?{subtitle}:{}),kind:"person",...pos}});const visible=input.relationships.filter((r)=>r.familyId===input.family.id&&!r.validTo&&(!input.perspectivePersonId||!r.perspectivePersonId||r.perspectivePersonId===input.perspectivePersonId));const edges=visible.map((r)=>({id:r.id,sourceId:r.sourcePersonId,targetId:r.targetPersonId,label:r.formalType,quality:r.quality,direction:r.direction,perspective:r.perspectiveLabel}));return{kind:"genogram",nodes,edges,perspectiveLabel:input.perspectivePersonId?people.find((p)=>p.id===input.perspectivePersonId)?.displayName||"Perspectiva selecionada":"Consolidada",periodLabel:input.periodLabel||"Atual",manifest:{expectedNodes:nodes.length,expectedEdges:edges.length,divergentEdges:edges.filter((e)=>e.quality==="divergent").length}}}
export function buildEcomap(input:{family:Family;people:Person[];resources:ExternalResource[];links:ExternalLink[];perspectivePersonId?:string;periodLabel?:string}):DiagramModel{const center:DiagramNode={id:input.family.id,label:input.family.nickname||input.family.code,subtitle:"família",kind:"family",x:300,y:220};const resources=input.resources.filter((r)=>r.familyId===input.family.id&&r.state!=="closed");const linkedPeople=input.people.filter((person)=>input.links.some((link)=>link.familyId===input.family.id&&link.personId===person.id));const personNodes=linkedPeople.map((person,index)=>({id:person.id,label:person.displayName||person.code,subtitle:"membro",kind:"person" as const,...ring(index,Math.max(linkedPeople.length,1),72)}));const nodes=[center,...personNodes,...resources.map((r,i)=>({id:r.id,label:r.name,subtitle:`${r.type} · ${r.state}`,kind:"resource" as const,...ring(i,resources.length,175)}))];const visible=input.links.filter((l)=>l.familyId===input.family.id&&!l.validTo&&(!input.perspectivePersonId||!l.perspectivePersonId||l.perspectivePersonId===input.perspectivePersonId));const edges=visible.map((l)=>({id:l.id,sourceId:l.personId||input.family.id,targetId:l.resourceId,label:l.intensity,quality:l.quality,direction:l.direction,perspective:l.perspectiveLabel}));return{kind:"ecomap",nodes,edges,perspectiveLabel:input.perspectivePersonId?input.people.find((p)=>p.id===input.perspectivePersonId)?.displayName||"Perspectiva selecionada":"Consolidada",periodLabel:input.periodLabel||"Atual",manifest:{expectedNodes:nodes.length,expectedEdges:edges.length,divergentEdges:edges.filter((e)=>e.quality==="divergent").length}}}
export function relationshipNarrative(model:DiagramModel):string{const nodes=new Map(model.nodes.map((n)=>[n.id,n.label]));const lines=model.edges.map((e)=>`${nodes.get(e.sourceId)||"Família"} → ${nodes.get(e.targetId)||"recurso"}: ${e.label}, vínculo ${e.quality}, direção ${e.direction}, perspectiva ${e.perspective}.`);return[`Mapa ${model.kind==="genogram"?"familiar":"de rede"}.`,`Perspectiva: ${model.perspectiveLabel}. Período: ${model.periodLabel}.`,`${model.manifest.expectedNodes} entidades e ${model.manifest.expectedEdges} vínculos.`,...lines].join("\n")}
export function qualityStyle(q:RelationshipQuality){return q==="strong"?{stroke:"#0f766e",width:5,dash:""}:q==="conflict"?{stroke:"#b45309",width:3,dash:"3 4"}:q==="weak"?{stroke:"#64748b",width:2,dash:"7 6"}:q==="ruptured"?{stroke:"#991b1b",width:3,dash:"2 8"}:q==="divergent"?{stroke:"#7e22ce",width:4,dash:"9 4 2 4"}:{stroke:"#475569",width:2,dash:""}}

``

# END FILE: src/domain/diagram-engine.ts

---

# FILE: src/domain/diagram-prompt.ts

``typescript
import type {DiagramModel} from "@/src/domain/diagram-engine";
const risky=[/\b\d{3}[. -]?\d{3}[. -]?\d{3}[- ]?\d{2}\b/g,/\b\(?\d{2}\)?\s?9?\d{4}[- ]?\d{4}\b/g,/\b[A-ZÀ-Ý][a-zà-ÿ]+\s+[A-ZÀ-Ý][a-zà-ÿ]+\b/g];
export function possibleIdentifiers(text:string):string[]{return risky.flatMap((pattern)=>text.match(pattern)??[])}
export function diagramPrompt(model:DiagramModel):string{const entities=model.nodes.map((n)=>`- ${n.id}: ${n.kind}; rótulo ${n.label}; ${n.subtitle||"sem subtítulo"}`).join("\n");const links=model.edges.map((e)=>`- ${e.id}: ${e.sourceId} -> ${e.targetId}; ${e.label}; qualidade ${e.quality}; direção ${e.direction}; perspectiva ${e.perspective}`).join("\n");return `OBJETIVO
Produzir ${model.kind==="genogram"?"um genograma em camadas":"um ecomapa familiar"} a partir da estrutura abaixo.

REGRAS
- Não inventar pessoas, recursos, vínculos ou diagnósticos.
- Preservar divergências e perspectivas.
- Usar apenas os códigos fornecidos.
- Antes de desenhar, validar por escrito a contagem esperada.
- Se houver ambiguidade, perguntar em vez de completar.

PERSPECTIVA
${model.perspectiveLabel}

PERÍODO
${model.periodLabel}

MANIFESTO
Entidades esperadas: ${model.manifest.expectedNodes}
Vínculos esperados: ${model.manifest.expectedEdges}
Vínculos divergentes: ${model.manifest.divergentEdges}

ENTIDADES
${entities}

VÍNCULOS
${links}`}

``

# END FILE: src/domain/diagram-prompt.ts

---

# FILE: src/domain/entity.ts

``typescript
import type { AuditFields, EntityId, ISODateTime } from "@/src/contracts/core";

export function newId(prefix: string): EntityId {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function nowIso(): ISODateTime { return new Date().toISOString(); }

export function auditFields(id: EntityId, at = nowIso()): AuditFields {
  return { id, createdAt: at, updatedAt: at, recordVersion: 1 };
}

export function updatedAudit<T extends AuditFields>(record: T): Pick<AuditFields, "id" | "createdAt" | "updatedAt" | "recordVersion"> {
  return { id: record.id, createdAt: record.createdAt, updatedAt: nowIso(), recordVersion: record.recordVersion + 1 };
}

``

# END FILE: src/domain/entity.ts

---

# FILE: src/domain/entity-types.ts

``typescript
export const ENTITY_TYPES = {
  family: "family",
  person: "person",
  membership: "family-membership",
  household: "household",
  residence: "residence-period",
  semester: "semester",
  semesterFamily: "semester-family-link",
  encounter: "encounter",
  pending: "pending-item",
  condition: "condition-record",
  medication: "person-medication",
  examResult: "exam-result",
  screening: "screening-episode",
  carePlan: "care-plan",
  patientSuggestion: "patient-suggestion",
  interpersonalRelationship: "interpersonal-relationship",
  externalResource: "external-resource",
  externalLink: "external-link",
  diagramLayout: "diagram-layout",
  reflection: "reflection",
  competencyEvidence: "competency-evidence",
  supervisorFeedback: "supervisor-feedback",
  semesterSnapshot: "semester-snapshot",
  addendum: "addendum",
  instrumentApplication: "instrument-application",
  proposedDomainChange: "proposed-domain-change",
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

``

# END FILE: src/domain/entity-types.ts

---

# FILE: src/domain/factories.ts

``typescript
import type { ConfirmationStatus, Provenance, Sensitivity, SharingState } from "@/src/contracts/core";
import type { Encounter, EncounterKind, PendingItem, PendingKind } from "@/src/contracts/care";
import type { Family, FamilyMembership, Person, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import { auditFields, newId, nowIso, updatedAudit } from "./entity";

const defaultTrust = {
  provenance: "self-reported" as Provenance,
  confirmation: "reported" as ConfirmationStatus,
  sensitivity: "health" as Sensitivity,
  sharingState: "review" as SharingState,
};

export function createFamily(input: { code: string; nickname?: string; focus?: string }): Family {
  return { ...auditFields(newId("family")), code: input.code.trim(), ...(input.nickname?.trim() ? { nickname: input.nickname.trim() } : {}), ...(input.focus?.trim() ? { focus: input.focus.trim() } : {}), state: "active", openedAt: nowIso() };
}

export function updateFamily(family: Family, input: { code: string; nickname?: string; focus?: string }): Family {
  const updated: Family = { ...family, code: input.code.trim(), ...updatedAudit(family) };
  const nickname = input.nickname?.trim();
  const focus = input.focus?.trim();
  if (nickname) updated.nickname = nickname;
  else delete updated.nickname;
  if (focus) updated.focus = focus;
  else delete updated.focus;
  return updated;
}

export function createPerson(input: { code: string; displayName?: string; lifeStage?: Person["lifeStage"] }): Person {
  return { ...auditFields(newId("person")), code: input.code.trim(), ...(input.displayName?.trim() ? { displayName: input.displayName.trim() } : {}), ...(input.lifeStage ? { lifeStage: input.lifeStage } : {}), vitalStatus: "alive" };
}

export function createMembership(input: { personId: string; familyId: string; roleLabel: string; careRole?: FamilyMembership["careRole"] }): FamilyMembership {
  return { ...auditFields(newId("membership")), ...defaultTrust, sensitivity: "family", sharingState: "private", personId: input.personId, familyId: input.familyId, roleLabel: input.roleLabel.trim(), ...(input.careRole ? { careRole: input.careRole } : {}), validFrom: nowIso() };
}

export function createEncounter(input: { kind: EncounterKind; occurredAt?: string; familyId?: string; personIds?: string[]; title: string; freeText?: string; topics?: string[]; nextStep?: string; semesterId?: string }): Encounter {
  const at = input.occurredAt || nowIso();
  return { ...auditFields(newId("encounter")), ...defaultTrust, sensitivity: "health", sharingState: "private", kind: input.kind, occurredAt: at, ...(input.familyId ? { familyId: input.familyId } : {}), personIds: input.personIds ?? [], title: input.title.trim(), freeText: input.freeText?.trim() ?? "", topics: input.topics ?? [], ...(input.nextStep?.trim() ? { nextStep: input.nextStep.trim() } : {}), ...(input.semesterId ? { semesterId: input.semesterId } : {}), state: "saved" };
}

export function createPending(input: { title: string; kind?: PendingKind; familyId?: string; personId?: string; encounterId?: string; semesterId?: string; details?: string }): PendingItem {
  return { ...auditFields(newId("pending")), ...defaultTrust, sensitivity: "health", sharingState: "private", title: input.title.trim(), ...(input.details?.trim() ? { details: input.details.trim() } : {}), kind: input.kind ?? "complete-record", priority: "routine", ...(input.familyId ? { familyId: input.familyId } : {}), ...(input.personId ? { personId: input.personId } : {}), ...(input.encounterId ? { encounterId: input.encounterId } : {}), ...(input.semesterId ? { semesterId: input.semesterId } : {}), destination: "open" };
}

export function createSemester(input: { code: string; label: string; expectedFamilyCount?: number }): Semester {
  return { ...auditFields(newId("semester")), code: input.code.trim(), label: input.label.trim(), state: "active", expectedFamilyCount: input.expectedFamilyCount ?? 2, startsAt: nowIso() };
}

export function linkFamilyToSemester(input: { semesterId: string; familyId: string; state?: SemesterFamilyLink["state"]; reason?: string }): SemesterFamilyLink {
  return { ...auditFields(newId("semester-family")), semesterId: input.semesterId, familyId: input.familyId, state: input.state ?? "active", startedAt: nowIso(), ...(input.reason ? { reason: input.reason } : {}) };
}

``

# END FILE: src/domain/factories.ts

---

# FILE: src/domain/journey-factories.ts

``typescript
import type {ConfirmationStatus,Provenance,Sensitivity,SharingState} from "@/src/contracts/core";
import type {Addendum,CompetencyEvidence,Reflection,SupervisorFeedback} from "@/src/contracts/journey";
import {auditFields,newId,nowIso} from "./entity";
const trust={provenance:"self-reported" as Provenance,confirmation:"reported" as ConfirmationStatus,sensitivity:"personal" as Sensitivity,sharingState:"private" as SharingState};
export function createReflection(input:{semesterId:string;familyId?:string;encounterId?:string;title:string;text:string;learning?:string[];nextQuestions?:string[]}):Reflection{return{...auditFields(newId("reflection")),...trust,semesterId:input.semesterId,...(input.familyId?{familyId:input.familyId}:{}),...(input.encounterId?{encounterId:input.encounterId}:{}),title:input.title.trim(),text:input.text.trim(),learning:input.learning??[],nextQuestions:input.nextQuestions??[]}}
export function createCompetency(input:{semesterId:string;familyId?:string;personId?:string;encounterId?:string;competency:string;description:string}):CompetencyEvidence{return{...auditFields(newId("competency")),...trust,semesterId:input.semesterId,...(input.familyId?{familyId:input.familyId}:{}),...(input.personId?{personId:input.personId}:{}),...(input.encounterId?{encounterId:input.encounterId}:{}),competency:input.competency.trim(),description:input.description.trim(),evidenceDate:nowIso(),state:"draft"}}
export function createFeedback(input:{semesterId:string;familyId?:string;personId?:string;encounterId?:string;topic?:string;text:string;action?:string}):SupervisorFeedback{return{...auditFields(newId("feedback")),provenance:"supervisor-guidance",confirmation:"reported",sensitivity:"personal",sharingState:"private",semesterId:input.semesterId,...(input.familyId?{familyId:input.familyId}:{}),...(input.personId?{personId:input.personId}:{}),...(input.encounterId?{encounterId:input.encounterId}:{}),...(input.topic?.trim()?{topic:input.topic.trim()}:{}),text:input.text.trim(),receivedAt:nowIso(),...(input.action?.trim()?{action:input.action.trim()}:{}),state:"received"}}
export function createAddendum(input:{snapshotId:string;semesterId:string;title:string;text:string;reason:string}):Addendum{return{...auditFields(newId("addendum")),...trust,snapshotId:input.snapshotId,semesterId:input.semesterId,title:input.title.trim(),text:input.text.trim(),reason:input.reason.trim(),authoredAt:nowIso()}}

``

# END FILE: src/domain/journey-factories.ts

---

# FILE: src/domain/journey-report.ts

``typescript
import type {Encounter,PendingItem} from "@/src/contracts/care";import type {Family,FamilyMembership,Person,Semester,SemesterFamilyLink} from "@/src/contracts/family";import type {CompetencyEvidence,Reflection,SupervisorFeedback} from "@/src/contracts/journey";
export interface FamilyTrajectory {familyId:string;code:string;name:string;focus:string;memberCount:number;encounterCount:number;openPending:number;lastEncounter?:string;nextStep?:string;learningCount:number;feedbackCount:number;changes:string[];}
export function familyTrajectories(input:{semester:Semester;families:Family[];links:SemesterFamilyLink[];memberships:FamilyMembership[];encounters:Encounter[];pending:PendingItem[];reflections:Reflection[];feedbacks:SupervisorFeedback[]}):FamilyTrajectory[]{const linked=new Set(input.links.filter(l=>l.semesterId===input.semester.id).map(l=>l.familyId));return input.families.filter(f=>linked.has(f.id)).map(f=>{const encounters=input.encounters.filter(e=>e.familyId===f.id&&e.semesterId===input.semester.id).sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));const pending=input.pending.filter(p=>p.familyId===f.id&&p.semesterId===input.semester.id&&p.destination==="open");return{familyId:f.id,code:f.code,name:f.nickname||f.code,focus:f.focus||"Foco não definido",memberCount:input.memberships.filter(m=>m.familyId===f.id&&!m.validTo).length,encounterCount:encounters.length,openPending:pending.length,...(encounters[0]?{lastEncounter:encounters[0].occurredAt}:{}),...(encounters.find(e=>e.nextStep)?.nextStep?{nextStep:encounters.find(e=>e.nextStep)!.nextStep}:{}),learningCount:input.reflections.filter(r=>r.familyId===f.id).length,feedbackCount:input.feedbacks.filter(x=>x.familyId===f.id).length,changes:[...new Set(encounters.map(e=>e.title))].slice(0,5)}})}
export function semesterReport(input:{semester:Semester;trajectories:FamilyTrajectory[];reflections:Reflection[];competencies:CompetencyEvidence[];feedbacks:SupervisorFeedback[];pending:PendingItem[]}):string{const lines=[`RELATÓRIO DO SEMESTRE`,`Código: ${input.semester.code}`,`Jornada: ${input.semester.label}`,`Famílias esperadas: ${input.semester.expectedFamilyCount} (expectativa, não limite)`,`Famílias vinculadas: ${input.trajectories.length}`,"",`TRAJETÓRIAS`];input.trajectories.forEach(t=>{lines.push("",`${t.code} · ${t.name}`,`Foco: ${t.focus}`,`Pessoas: ${t.memberCount} | Encontros: ${t.encounterCount} | Pendências abertas: ${t.openPending}`,`Último encontro: ${t.lastEncounter||"não registrado"}`,`Próximo passo: ${t.nextStep||"não registrado"}`,`Reflexões: ${t.learningCount} | Feedbacks: ${t.feedbackCount}`)});lines.push("",`APRENDIZAGENS`,...input.reflections.map(r=>`- ${r.title}: ${r.learning.join("; ")||r.text}`),"",`EVIDÊNCIAS DE COMPETÊNCIA`,...input.competencies.map(c=>`- ${c.competency}: ${c.description} [${c.state}]`),"",`FEEDBACKS`,...input.feedbacks.map(f=>`- ${f.text}${f.action?` | Ação: ${f.action}`:""}`),"",`PENDÊNCIAS COM CONTINUIDADE`,...input.pending.filter(p=>["continuity-recommended","continuity-confirmed","not-completed"].includes(p.destination)).map(p=>`- ${p.title}: ${p.destination}`));return lines.join("\n")}

``

# END FILE: src/domain/journey-report.ts

---

# FILE: src/domain/longitudinal-factories.ts

``typescript
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

``

# END FILE: src/domain/longitudinal-factories.ts

---

# FILE: src/domain/relation-factories.ts

``typescript
import type {ConfirmationStatus,Provenance,Sensitivity,SharingState} from "@/src/contracts/core";
import type {ExternalLink,ExternalResource,InterpersonalRelationship,RelationshipDirection,RelationshipQuality,ResourceType} from "@/src/contracts/relations";
import {auditFields,newId,nowIso} from "./entity";
const trust=(thirdParty=false)=>({provenance:(thirdParty?"third-party-reported":"self-reported") as Provenance,confirmation:"reported" as ConfirmationStatus,sensitivity:(thirdParty?"third-party":"family") as Sensitivity,sharingState:(thirdParty?"blocked":"private") as SharingState});
export function createRelationship(input:{familyId:string;sourcePersonId:string;targetPersonId:string;formalType:string;quality:RelationshipQuality;direction?:RelationshipDirection;perspectivePersonId?:string;perspectiveLabel:string;notes?:string;thirdParty?:boolean}):InterpersonalRelationship{return{...auditFields(newId("relation")),...trust(input.thirdParty),familyId:input.familyId,sourcePersonId:input.sourcePersonId,targetPersonId:input.targetPersonId,formalType:input.formalType.trim(),quality:input.quality,direction:input.direction??"mutual",perspectiveLabel:input.perspectiveLabel.trim(),...(input.perspectivePersonId?{perspectivePersonId:input.perspectivePersonId}:{}),...(input.notes?.trim()?{notes:input.notes.trim()}:{}),validFrom:nowIso()}}
export function createResource(input:{familyId:string;name:string;type:ResourceType;state?:ExternalResource["state"];description?:string}):ExternalResource{return{...auditFields(newId("resource")),familyId:input.familyId,name:input.name.trim(),type:input.type,state:input.state??"active",...(input.description?.trim()?{description:input.description.trim()}: {})}}
export function createExternalLink(input:{familyId:string;resourceId:string;personId?:string;quality:RelationshipQuality;direction?:RelationshipDirection;intensity?:ExternalLink["intensity"];perspectivePersonId?:string;perspectiveLabel:string;notes?:string;thirdParty?:boolean}):ExternalLink{return{...auditFields(newId("external-link")),...trust(input.thirdParty),familyId:input.familyId,resourceId:input.resourceId,...(input.personId?{personId:input.personId}:{}),quality:input.quality,direction:input.direction??"mutual",intensity:input.intensity??"moderate",...(input.perspectivePersonId?{perspectivePersonId:input.perspectivePersonId}:{}),perspectiveLabel:input.perspectiveLabel.trim(),...(input.notes?.trim()?{notes:input.notes.trim()}:{}),validFrom:nowIso()}}

``

# END FILE: src/domain/relation-factories.ts

---

# FILE: src/domain/repository.ts

``typescript
import type { AuditFields } from "@/src/contracts/core";
import { deleteValue, getAllValues, getValue } from "@/src/storage/idb";
import { checksumOf } from "@/src/storage/hash";
import { MultiTabCoordinator } from "@/src/storage/multi-tab";
import { getDemoSession } from "./demo-session";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import type { EntityType } from "./entity-types";

const coordination = typeof window !== "undefined" ? new MultiTabCoordinator() : undefined;
if (coordination) coordination.start();

export async function saveEntity<T extends AuditFields>(entityType: EntityType, entity: T): Promise<T> {
  const demoSession = await getDemoSession();
  let persistedEntity = entity;
  if (demoSession) {
    const existing = await getValue<StoredEnvelope<T>>(STORES.records, entity.id);
    const belongsToNormalSnapshot = demoSession.snapshotRecords.some((record) => Boolean(record && typeof record === "object" && "id" in record && record.id === entity.id));
    if ((belongsToNormalSnapshot && existing?.payload.dataOrigin !== "synthetic-demo") || (existing && existing.payload.dataOrigin !== "synthetic-demo")) {
      throw new Error("Dados normais estão isolados durante a demonstração e não podem ser alterados neste modo.");
    }
    persistedEntity = { ...entity, dataOrigin: "synthetic-demo" } as T;
  }

  const checksum = await checksumOf(persistedEntity);
  const envelope: StoredEnvelope<T> = { id: persistedEntity.id, entityType, payload: persistedEntity, createdAt: persistedEntity.createdAt, updatedAt: persistedEntity.updatedAt, recordVersion: persistedEntity.recordVersion, checksum };
  const { putValue } = await import("@/src/storage/idb");
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<T>>(STORES.records, persistedEntity.id);
  if (!readBack || readBack.checksum !== checksum || (await checksumOf(readBack.payload)) !== checksum) throw new Error("A gravação não passou pela verificação de integridade.");
  coordination?.changed(persistedEntity.id);
  return persistedEntity;
}

export async function findEntity<T>(id: string): Promise<T | undefined> {
  return (await getValue<StoredEnvelope<T>>(STORES.records, id))?.payload;
}

export async function listEntities<T>(entityType: EntityType): Promise<T[]> {
  const envelopes = await getAllValues<StoredEnvelope<T>>(STORES.records);
  return envelopes.filter((entry) => entry.entityType === entityType).map((entry) => entry.payload);
}

export async function removeEntity(id: string): Promise<void> {
  await deleteValue(STORES.records, id);
  coordination?.changed(id);
}

``

# END FILE: src/domain/repository.ts

---

# FILE: src/domain/selectors.ts

``typescript
import type { Encounter, PendingItem, TimelineItem } from "@/src/contracts/care";
import type { Family, FamilyMembership, Person, SemesterFamilyLink } from "@/src/contracts/family";

export function peopleInFamily(people: Person[], memberships: FamilyMembership[], familyId: string): Person[] {
  const ids = new Set(memberships.filter((link) => link.familyId === familyId && !link.validTo).map((link) => link.personId));
  return people.filter((person) => ids.has(person.id));
}

export function activeFamiliesForSemester(families: Family[], links: SemesterFamilyLink[], semesterId: string): Family[] {
  const ids = new Set(links.filter((link) => link.semesterId === semesterId && link.state === "active").map((link) => link.familyId));
  return families.filter((family) => ids.has(family.id));
}

export function buildTimeline(encounters: Encounter[], pending: PendingItem[], familyId?: string, personId?: string): TimelineItem[] {
  const encounterItems: TimelineItem[] = encounters
    .filter((item) => (!familyId || item.familyId === familyId) && (!personId || item.personIds.includes(personId)))
    .map((item) => ({ id: item.id, at: item.occurredAt, type: "encounter", title: item.title, ...(item.nextStep ? { subtitle: `Próximo: ${item.nextStep}` } : {}), ...(item.familyId ? { familyId: item.familyId } : {}), personIds: item.personIds }));
  const pendingItems: TimelineItem[] = pending
    .filter((item) => item.destination === "open" && (!familyId || item.familyId === familyId) && (!personId || item.personId === personId))
    .map((item) => ({ id: item.id, at: item.createdAt, type: "pending", title: item.title, subtitle: "Pendência aberta", ...(item.familyId ? { familyId: item.familyId } : {}), personIds: item.personId ? [item.personId] : [] }));
  return [...encounterItems, ...pendingItems].sort((a, b) => b.at.localeCompare(a.at));
}

export function nextFamilyCode(families: Family[]): string {
  const max = families.reduce((current, family) => {
    const match = /^F-(\d+)$/.exec(family.code);
    return match ? Math.max(current, Number(match[1])) : current;
  }, 0);
  return `F-${String(max + 1).padStart(3, "0")}`;
}

export function nextPersonCode(people: Person[], familyCode: string): string {
  const prefix = familyCode.replace(/^F-/, "P-");
  const used = new Set(people.map((person) => person.code));
  for (let index = 0; index < 26; index += 1) {
    const code = `${prefix}-${String.fromCharCode(65 + index)}`;
    if (!used.has(code)) return code;
  }
  return `${prefix}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

``

# END FILE: src/domain/selectors.ts

---

# FILE: src/domain/semester-close.ts

``typescript
import type {Semester} from "@/src/contracts/family";import type {PendingItem} from "@/src/contracts/care";import type {SemesterSnapshot,SemesterSnapshotData} from "@/src/contracts/journey";import {auditFields,newId,nowIso} from "./entity";import {checksumOf} from "@/src/storage/hash";
export interface CloseReadiness {ready:boolean;blockers:string[];warnings:string[];}
export function assessCloseReadiness(semester:Semester,pending:PendingItem[],snapshotExists:boolean):CloseReadiness{const blockers:string[]=[];const warnings:string[]=[];if(!["active","review","ready-to-close"].includes(semester.state))blockers.push("Estado do semestre não permite encerramento.");if(snapshotExists)blockers.push("Já existe snapshot para este semestre.");const open=pending.filter(p=>p.semesterId===semester.id&&p.destination==="open");if(open.length)blockers.push(`${open.length} pendência(s) ainda sem destino.`);const unresolved=pending.filter(p=>p.semesterId===semester.id&&["not-completed","continuity-recommended"].includes(p.destination));if(unresolved.length)warnings.push(`${unresolved.length} processo(s) seguem inconclusos com destino explícito.`);return{ready:blockers.length===0,blockers,warnings}}
export async function createSemesterSnapshot(input:{semester:Semester;data:SemesterSnapshotData;reportText:string}):Promise<SemesterSnapshot>{const closedAt=nowIso();const contentChecksum=await checksumOf({semesterId:input.semester.id,closedAt,data:input.data,reportText:input.reportText});return{...auditFields(newId("snapshot"),closedAt),semesterId:input.semester.id,closedAt,schemaVersion:1,contentChecksum,data:structuredClone(input.data),reportText:input.reportText}}
export function closeSemester(semester:Semester):Semester{return{...semester,state:"closed",endsAt:nowIso(),updatedAt:nowIso(),recordVersion:semester.recordVersion+1}}

``

# END FILE: src/domain/semester-close.ts

---

# FILE: src/domain/sharing-policy.ts

``typescript
import type { ProvenancedRecord } from "@/src/contracts/core";
import type { ShareDecision, ShareDestination } from "@/src/contracts/sharing";

export function sharingDecision(entity: ProvenancedRecord & { id:string }, destination:ShareDestination):ShareDecision {
 const reasons:string[]=[];
 if (entity.sensitivity === "third-party") reasons.push("Informação fornecida por terceiro.");
 if (entity.sharingState === "blocked") reasons.push("Conteúdo bloqueado para compartilhamento.");
 if (entity.sharingState === "private") reasons.push("Conteúdo privado.");
 if (destination === "family-summary" && entity.sensitivity === "health") reasons.push("Informação individual de saúde não se torna familiar automaticamente.");
 if (destination === "ai-export" && ["third-party","high"].includes(entity.sensitivity)) reasons.push("Conteúdo sensível não pode entrar automaticamente em prompt.");
 const blocked = reasons.some((reason)=>reason.includes("terceiro")||reason.includes("bloqueado")) || (destination === "family-summary" && entity.sensitivity === "health") || (destination === "ai-export" && ["third-party","high"].includes(entity.sensitivity));
 const allowed = !blocked && !["private","withdrawn"].includes(entity.sharingState);
 return { entityId:entity.id, destination, allowed, requiresReview:allowed && entity.sharingState !== "shareable" && entity.sharingState !== "shared", reasons };
}

``

# END FILE: src/domain/sharing-policy.ts

---

# FILE: src/domain/wave-d-simulation.ts

``typescript
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

``

# END FILE: src/domain/wave-d-simulation.ts

---

# FILE: src/hooks/use-mapa-data.ts

``typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Encounter, PendingItem } from "@/src/contracts/care";
import type { Family, FamilyMembership, Person, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import type { CarePlan, ConditionRecord, ExamResultRecord, PatientSuggestion, PersonMedicationRecord, ScreeningEpisode } from "@/src/contracts/longitudinal";
import type { ExternalLink, ExternalResource, InterpersonalRelationship } from "@/src/contracts/relations";
import type { Addendum, CompetencyEvidence, Reflection, SemesterSnapshot, SupervisorFeedback } from "@/src/contracts/journey";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { listEntities } from "@/src/domain/repository";
import type { DemoSessionSnapshot } from "@/src/contracts/demo";
import { getDemoSession } from "@/src/domain/demo-session";
import type { InstrumentApplication } from "@/src/clinical/assessments";
import { APPLICATION_ENTITY_TYPE } from "@/src/clinical/assessments";
import { getAllValues } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";

export interface MapaData {
  families: Family[];
  people: Person[];
  memberships: FamilyMembership[];
  encounters: Encounter[];
  pending: PendingItem[];
  semesters: Semester[];
  semesterLinks: SemesterFamilyLink[];
  conditions: ConditionRecord[];
  medications: PersonMedicationRecord[];
  examResults: ExamResultRecord[];
  screenings: ScreeningEpisode[];
  carePlans: CarePlan[];
  suggestions: PatientSuggestion[];
  relationships: InterpersonalRelationship[];
  resources: ExternalResource[];
  externalLinks: ExternalLink[];
  reflections: Reflection[];
  competencies: CompetencyEvidence[];
  feedbacks: SupervisorFeedback[];
  snapshots: SemesterSnapshot[];
  addenda: Addendum[];
  assessments: InstrumentApplication[];
}

const empty: MapaData = { families: [], people: [], memberships: [], encounters: [], pending: [], semesters: [], semesterLinks: [], conditions: [], medications: [], examResults: [], screenings: [], carePlans: [], suggestions: [], relationships: [], resources: [], externalLinks: [], reflections: [], competencies: [], feedbacks: [], snapshots: [], addenda: [], assessments: [] };

export function useMapaData() {
  const [data, setData] = useState<MapaData>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [demoSession, setDemoSession] = useState<DemoSessionSnapshot>();

  const refresh = useCallback(async () => {
    try {
      const [families, people, memberships, encounters, pending, semesters, semesterLinks, conditions, medications, examResults, screenings, carePlans, suggestions, relationships, resources, externalLinks, reflections, competencies, feedbacks, snapshots, addenda, records, activeDemo] = await Promise.all([
        listEntities<Family>(ENTITY_TYPES.family), listEntities<Person>(ENTITY_TYPES.person), listEntities<FamilyMembership>(ENTITY_TYPES.membership), listEntities<Encounter>(ENTITY_TYPES.encounter), listEntities<PendingItem>(ENTITY_TYPES.pending), listEntities<Semester>(ENTITY_TYPES.semester), listEntities<SemesterFamilyLink>(ENTITY_TYPES.semesterFamily), listEntities<ConditionRecord>(ENTITY_TYPES.condition), listEntities<PersonMedicationRecord>(ENTITY_TYPES.medication), listEntities<ExamResultRecord>(ENTITY_TYPES.examResult), listEntities<ScreeningEpisode>(ENTITY_TYPES.screening), listEntities<CarePlan>(ENTITY_TYPES.carePlan), listEntities<PatientSuggestion>(ENTITY_TYPES.patientSuggestion), listEntities<InterpersonalRelationship>(ENTITY_TYPES.interpersonalRelationship), listEntities<ExternalResource>(ENTITY_TYPES.externalResource), listEntities<ExternalLink>(ENTITY_TYPES.externalLink), listEntities<Reflection>(ENTITY_TYPES.reflection), listEntities<CompetencyEvidence>(ENTITY_TYPES.competencyEvidence), listEntities<SupervisorFeedback>(ENTITY_TYPES.supervisorFeedback), listEntities<SemesterSnapshot>(ENTITY_TYPES.semesterSnapshot), listEntities<Addendum>(ENTITY_TYPES.addendum), getAllValues<StoredEnvelope<InstrumentApplication>>(STORES.records), getDemoSession(),
      ]);
      setData({ families, people, memberships, encounters, pending, semesters, semesterLinks, conditions, medications, examResults, screenings, carePlans, suggestions, relationships, resources, externalLinks, reflections, competencies, feedbacks, snapshots, addenda, assessments: records.filter((record) => record.entityType === APPLICATION_ENTITY_TYPE).map((record) => record.payload) });
      setDemoSession(activeDemo);
      setError(undefined);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao carregar dados locais."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh, demoSession };
}

``

# END FILE: src/hooks/use-mapa-data.ts

---

# FILE: src/lib/project-state.ts

``typescript
export const projectState = {
  name: "Mapa",
  signature: "Clínica, família e território",
  version: "Marco 0",
  productionStarted: true,
  clinicalProductionStarted: false,
  realDataAllowed: false,
  expectedFamiliesPerSemester: 2,
  expectedFamiliesAreLimit: false,
} as const;

``

# END FILE: src/lib/project-state.ts

---

# FILE: src/pwa/register.ts

``typescript
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return undefined;
  if (process.env.NODE_ENV !== "production") return undefined;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

``

# END FILE: src/pwa/register.ts

---

# FILE: src/security/encoding.ts

``typescript
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

``

# END FILE: src/security/encoding.ts

---

# FILE: src/security/pin.ts

``typescript
import { getValue, putValue } from "@/src/storage/idb";
import { STORES, type SecurityRecord } from "@/src/storage/schema";
import { base64ToBytes, bytesToBase64 } from "./encoding";

const PIN_RECORD = "local-pin-v1";
const ITERATIONS = 210_000;

interface PinSecret {
  salt: string;
  digest: string;
  iterations: number;
}

async function derive(pin: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, material, 256);
  return new Uint8Array(bits);
}

export function validatePinPolicy(pin: string): string[] {
  const errors: string[] = [];
  if (!/^\d{6,12}$/.test(pin)) errors.push("Use de 6 a 12 dígitos.");
  if (/^(.)\1+$/.test(pin)) errors.push("Não use o mesmo dígito repetido.");
  if (["123456", "654321", "000000", "111111"].includes(pin)) errors.push("Escolha um PIN menos previsível.");
  return errors;
}

export async function hasPin(): Promise<boolean> {
  return Boolean(await getValue<SecurityRecord>(STORES.security, PIN_RECORD));
}

export async function setPin(pin: string): Promise<void> {
  const errors = validatePinPolicy(pin);
  if (errors.length) throw new Error(errors.join(" "));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const digest = await derive(pin, salt, ITERATIONS);
  const value: PinSecret = { salt: bytesToBase64(salt), digest: bytesToBase64(digest), iterations: ITERATIONS };
  await putValue(STORES.security, { id: PIN_RECORD, value, updatedAt: new Date().toISOString() } satisfies SecurityRecord);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const record = await getValue<SecurityRecord>(STORES.security, PIN_RECORD);
  if (!record) return false;
  const secret = record.value as PinSecret;
  const actual = await derive(pin, base64ToBytes(secret.salt), secret.iterations);
  const expected = base64ToBytes(secret.digest);
  if (actual.length !== expected.length) return false;
  let mismatch = 0;
  actual.forEach((byte, index) => { mismatch |= byte ^ (expected[index] ?? 0); });
  return mismatch === 0;
}

export const pinSecurityNotice = "O PIN bloqueia a interface local. Ele não substitui a proteção do dispositivo nem cifra automaticamente todos os dados.";

``

# END FILE: src/security/pin.ts

---

# FILE: src/storage/autosave.ts

``typescript
import { putValue } from "./idb";
import { STORES, type DraftRecord } from "./schema";

export type SavePhase = "idle" | "saving" | "saved" | "error";

export class DraftAutosave {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private revision = 0;

  schedule(id: string, scope: string, payload: unknown, delayMs = 500): Promise<DraftRecord> {
    this.cancel();
    const revision = ++this.revision;
    return new Promise((resolve, reject) => {
      this.timer = setTimeout(async () => {
        const record: DraftRecord = { id, scope, payload, updatedAt: new Date().toISOString() };
        try {
          await putValue(STORES.drafts, record);
          if (revision === this.revision) resolve(record);
        } catch (error) {
          reject(error);
        }
      }, delayMs);
    });
  }

  cancel(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
}

``

# END FILE: src/storage/autosave.ts

---

# FILE: src/storage/hash.ts

``typescript
function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, inner]) => [key, normalize(inner)]),
    );
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(normalize(value));
}

export async function sha256Hex(value: string | Uint8Array): Promise<string> {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function checksumOf(value: unknown): Promise<string> {
  return sha256Hex(canonicalJson(value));
}

``

# END FILE: src/storage/hash.ts

---

# FILE: src/storage/idb.ts

``typescript
import { MAPA_DB_NAME, MAPA_DB_VERSION, STORES, type StoreName } from "./schema";

let openPromise: Promise<IDBDatabase> | undefined;

function createSchema(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(STORES.meta)) db.createObjectStore(STORES.meta, { keyPath: "id" });
  if (!db.objectStoreNames.contains(STORES.records)) {
    const store = db.createObjectStore(STORES.records, { keyPath: "id" });
    store.createIndex("entityType", "entityType", { unique: false });
    store.createIndex("updatedAt", "updatedAt", { unique: false });
  }
  if (!db.objectStoreNames.contains(STORES.drafts)) db.createObjectStore(STORES.drafts, { keyPath: "id" });
  if (!db.objectStoreNames.contains(STORES.events)) {
    const store = db.createObjectStore(STORES.events, { keyPath: "id" });
    store.createIndex("occurredAt", "occurredAt", { unique: false });
    store.createIndex("entityId", "entityId", { unique: false });
  }
  if (!db.objectStoreNames.contains(STORES.security)) db.createObjectStore(STORES.security, { keyPath: "id" });
}

export function openMapaDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB não está disponível."));
  if (openPromise) return openPromise;

  openPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(MAPA_DB_NAME, MAPA_DB_VERSION);
    request.onupgradeneeded = () => createSchema(request.result);
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error("Falha ao abrir o banco local."));
    request.onblocked = () => reject(new Error("Atualização bloqueada por outra aba aberta."));
  });
  return openPromise;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Operação IndexedDB falhou."));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Transação falhou."));
    tx.onabort = () => reject(tx.error ?? new Error("Transação foi cancelada."));
  });
}

export async function putValue<T>(storeName: StoreName, value: T): Promise<void> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readwrite", { durability: "strict" });
  tx.objectStore(storeName).put(value);
  await transactionDone(tx);
}

export async function getValue<T>(storeName: StoreName, id: string): Promise<T | undefined> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readonly");
  const result = await requestResult(tx.objectStore(storeName).get(id));
  await transactionDone(tx);
  return result as T | undefined;
}

export async function getAllValues<T>(storeName: StoreName): Promise<T[]> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readonly");
  const result = await requestResult(tx.objectStore(storeName).getAll());
  await transactionDone(tx);
  return result as T[];
}

export async function deleteValue(storeName: StoreName, id: string): Promise<void> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readwrite", { durability: "strict" });
  tx.objectStore(storeName).delete(id);
  await transactionDone(tx);
}

export async function replaceStore(storeName: StoreName, values: unknown[]): Promise<void> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readwrite", { durability: "strict" });
  const store = tx.objectStore(storeName);
  store.clear();
  values.forEach((value) => store.put(value));
  await transactionDone(tx);
}

export async function replaceAllStores(valuesByStore: Record<StoreName, unknown[]>): Promise<void> {
  const db = await openMapaDatabase();
  const names = Object.values(STORES);
  const tx = db.transaction(names, "readwrite", { durability: "strict" });
  for (const name of names) {
    const store = tx.objectStore(name);
    store.clear();
    valuesByStore[name].forEach((value) => store.put(value));
  }
  await transactionDone(tx);
}

export async function clearMapaDatabaseForTests(): Promise<void> {
  const db = await openMapaDatabase();
  const names = Object.values(STORES);
  const tx = db.transaction(names, "readwrite");
  names.forEach((name) => tx.objectStore(name).clear());
  await transactionDone(tx);
}

``

# END FILE: src/storage/idb.ts

---

# FILE: src/storage/multi-tab.ts

``typescript
export interface TabMessage {
  type: "hello" | "heartbeat" | "editing" | "released" | "data-changed";
  tabId: string;
  entityId?: string;
  at: number;
}

export class MultiTabCoordinator {
  readonly tabId = crypto.randomUUID();
  private channel: BroadcastChannel | undefined;
  private heartbeat: ReturnType<typeof setInterval> | undefined;
  private listeners = new Set<(message: TabMessage) => void>();

  start(): void {
    if (typeof BroadcastChannel === "undefined") return;
    this.channel = new BroadcastChannel("mapa-coordination-v1");
    this.channel.onmessage = (event: MessageEvent<TabMessage>) => {
      if (event.data.tabId !== this.tabId) this.listeners.forEach((listener) => listener(event.data));
    };
    this.send({ type: "hello", tabId: this.tabId, at: Date.now() });
    this.heartbeat = setInterval(() => this.send({ type: "heartbeat", tabId: this.tabId, at: Date.now() }), 10_000);
  }

  onMessage(listener: (message: TabMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  editing(entityId: string): void { this.send({ type: "editing", tabId: this.tabId, entityId, at: Date.now() }); }
  released(entityId: string): void { this.send({ type: "released", tabId: this.tabId, entityId, at: Date.now() }); }
  changed(entityId: string): void { this.send({ type: "data-changed", tabId: this.tabId, entityId, at: Date.now() }); }

  stop(): void {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.channel?.close();
  }

  private send(message: TabMessage): void { this.channel?.postMessage(message); }
}

``

# END FILE: src/storage/multi-tab.ts

---

# FILE: src/storage/repository.ts

``typescript
import { getValue, putValue } from "./idb";
import { checksumOf } from "./hash";
import { STORES, type StoredEnvelope } from "./schema";

export interface SaveReceipt {
  id: string;
  checksum: string;
  savedAt: string;
  verified: boolean;
}

export async function saveRecordVerified<T>(input: Omit<StoredEnvelope<T>, "checksum">): Promise<SaveReceipt> {
  const checksum = await checksumOf(input.payload);
  const value: StoredEnvelope<T> = { ...input, checksum };
  await putValue(STORES.records, value);

  const readBack = await getValue<StoredEnvelope<T>>(STORES.records, input.id);
  const verified = Boolean(readBack && readBack.checksum === checksum && (await checksumOf(readBack.payload)) === checksum);
  if (!verified) throw new Error("O registro foi gravado, mas a verificação de integridade falhou.");

  return { id: input.id, checksum, savedAt: input.updatedAt, verified };
}

export function createEnvelope<T>(id: string, entityType: string, payload: T, previousVersion = 0): Omit<StoredEnvelope<T>, "checksum"> {
  const now = new Date().toISOString();
  return { id, entityType, payload, createdAt: now, updatedAt: now, recordVersion: previousVersion + 1 };
}

``

# END FILE: src/storage/repository.ts

---

# FILE: src/storage/schema.ts

``typescript
export const MAPA_DB_NAME = "mapa-local";
export const MAPA_DB_VERSION = 1;

export const STORES = {
  meta: "meta",
  records: "records",
  drafts: "drafts",
  events: "events",
  security: "security",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

export interface StoredEnvelope<T = unknown> {
  id: string;
  entityType: string;
  payload: T;
  createdAt: string;
  updatedAt: string;
  recordVersion: number;
  checksum?: string;
}

export interface MetaRecord {
  id: string;
  value: unknown;
  updatedAt: string;
}

export interface DraftRecord {
  id: string;
  scope: string;
  payload: unknown;
  updatedAt: string;
  expiresAt?: string;
}

export interface EventRecord {
  id: string;
  type: string;
  entityId?: string;
  occurredAt: string;
  payload?: unknown;
}

export interface SecurityRecord {
  id: string;
  value: unknown;
  updatedAt: string;
}

``

# END FILE: src/storage/schema.ts

---

# FILE: src/storage/status.ts

``typescript
export type PersistenceState = "persistent" | "best-effort" | "unsupported" | "error";

export interface StorageStatus {
  persistence: PersistenceState;
  usage?: number;
  quota?: number;
  usageRatio?: number;
}

export async function readStorageStatus(): Promise<StorageStatus> {
  if (typeof navigator === "undefined" || !navigator.storage) return { persistence: "unsupported" };
  try {
    const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const estimate = navigator.storage.estimate ? await navigator.storage.estimate() : {};
    const usage = estimate.usage;
    const quota = estimate.quota;
    return {
      persistence: persisted ? "persistent" : "best-effort",
      ...(usage !== undefined ? { usage } : {}),
      ...(quota !== undefined ? { quota } : {}),
      ...(usage !== undefined && quota ? { usageRatio: usage / quota } : {}),
    };
  } catch {
    return { persistence: "error" };
  }
}

export async function requestPersistentStorage(): Promise<StorageStatus> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return readStorageStatus();
  try { await navigator.storage.persist(); } catch { /* status reports the failure */ }
  return readStorageStatus();
}

``

# END FILE: src/storage/status.ts

---

# FILE: tests/adult-dcnt-esf-calculations.test.ts

``typescript
import { describe, expect, it } from "vitest";
import {
  calculateBloodPressureMean,
  calculateBmi,
  classifyBmi,
  classifyWaistCircumference,
  deriveAdultAgeBand,
} from "@/src/clinical/assessments";

describe("cálculos puros da avaliação adulta DCNT ESF", () => {
  it("deriva idade considerando aniversário e faixas adultas", () => {
    expect(deriveAdultAgeBand("2000-09-29", "2026-09-28")).toMatchObject({ ageYears: 25, band: "age-18-29", eligible: true });
    expect(deriveAdultAgeBand("2000-09-28", "2026-09-28")).toMatchObject({ ageYears: 26, band: "age-18-29", eligible: true });
    expect(deriveAdultAgeBand("1981-09-28", "2026-09-28").band).toBe("age-45-59");
    expect(deriveAdultAgeBand("1996-09-28", "2026-09-28").band).toBe("age-30-44");
    expect(deriveAdultAgeBand("2008-09-28", "2026-09-28")).toMatchObject({ ageYears: 18, band: "age-18-29" });
    expect(deriveAdultAgeBand("2009-09-28", "2026-09-28")).toEqual({ ageYears: 17, eligible: false });
    expect(deriveAdultAgeBand("1997-09-29", "2026-09-28").band).toBe("age-18-29");
    expect(deriveAdultAgeBand("1982-09-29", "2026-09-28").band).toBe("age-30-44");
    expect(deriveAdultAgeBand("1967-09-29", "2026-09-28").band).toBe("age-45-59");
    expect(deriveAdultAgeBand("1947-09-29", "2026-09-28").band).toBe("age-60-79");
    expect(deriveAdultAgeBand("1946-09-28", "2026-09-28").band).toBe("age-80-plus");
    expect(() => deriveAdultAgeBand("invalid", "2026-09-28")).toThrow(/Data inválida/);
    expect(() => deriveAdultAgeBand("2027-01-01", "2026-09-28")).toThrow(/anterior ao nascimento/);
  });

  it("calcula e classifica IMC com limites contínuos", () => {
    expect(calculateBmi(80, 2)).toBe(20);
    expect(classifyBmi(18.49)).toBe("underweight");
    expect(classifyBmi(18.5)).toBe("normal");
    expect(classifyBmi(24.99)).toBe("normal");
    expect(classifyBmi(25)).toBe("overweight");
    expect(classifyBmi(29.99)).toBe("overweight");
    expect(classifyBmi(30)).toBe("obesity-i");
    expect(classifyBmi(34.99)).toBe("obesity-i");
    expect(classifyBmi(35)).toBe("obesity-ii");
    expect(classifyBmi(39.99)).toBe("obesity-ii");
    expect(classifyBmi(40)).toBe("obesity-iii");
    expect(() => calculateBmi(0, 1.7)).toThrow();
    expect(() => calculateBmi(70, 0)).toThrow();
    expect(() => calculateBmi(Number.NaN, 1.7)).toThrow();
    expect(() => classifyBmi(Number.POSITIVE_INFINITY)).toThrow();
  });

  it("calcula média de PA somente com duas visitas completas", () => {
    expect(calculateBloodPressureMean([{ systolic: 120, diastolic: 80 }, { systolic: 130, diastolic: 84 }])).toEqual({ systolicMean: 125, diastolicMean: 82 });
    expect(calculateBloodPressureMean(undefined)).toBeUndefined();
    expect(() => calculateBloodPressureMean([{ systolic: 120, diastolic: 0 }, { systolic: 130, diastolic: 84 }])).toThrow();
    expect(calculateBloodPressureMean([{ systolic: 121, diastolic: 81 }, { systolic: 122, diastolic: 82 }])).toEqual({ systolicMean: 121.5, diastolicMean: 81.5 });
  });

  it("classifica circunferência somente com critério local explícito", () => {
    expect(classifyWaistCircumference(93.9, "male-local-rule")).toBe("low");
    expect(classifyWaistCircumference(94, "male-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(102, "male-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(102.1, "male-local-rule")).toBe("very-increased");
    expect(classifyWaistCircumference(79.9, "female-local-rule")).toBe("low");
    expect(classifyWaistCircumference(80, "female-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(88, "female-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(88.1, "female-local-rule")).toBe("very-increased");
    expect(classifyWaistCircumference(90, "not-selected")).toBeUndefined();
  });
});

``

# END FILE: tests/adult-dcnt-esf-calculations.test.ts

---

# FILE: tests/adult-dcnt-esf-definition.test.ts

``typescript
import { describe, expect, it } from "vitest";
import {
  adultDcntEsfDefinition,
  canCompareApplications,
  conservativeVisibility,
  validateEcomapLink,
  validateEcomapProposal,
  validateInstrumentApplication,
  validateInstrumentDefinition,
} from "@/src/clinical/assessments";
import type { EcomapLink, InstrumentApplication } from "@/src/clinical/assessments";

const byId = (id: string) => adultDcntEsfDefinition.questions.find((question) => question.id === id);

describe("definição versionada da avaliação adulta DCNT ESF", () => {
  it("preserva metadados, seções disponíveis e lacunas da fonte", () => {
    expect(adultDcntEsfDefinition.id).toBe("adult-dcnt-esf");
    expect(adultDcntEsfDefinition.version).toBe("local-esf-2026-page-28-v1");
    expect(adultDcntEsfDefinition.origin).toContain("Instrumento local");
    expect(adultDcntEsfDefinition.sourcePage).toBe(28);
    expect(adultDcntEsfDefinition.availableSections).toEqual([1, 2, 6, 7, 8]);
    expect(adultDcntEsfDefinition.missingSections).toEqual([3, 4, 5]);
    expect(adultDcntEsfDefinition.sections.filter((section) => section.status === "source-missing")).toHaveLength(3);
    expect(adultDcntEsfDefinition.sections.find((section) => section.printedBlockNumber === 8)?.status).toBe("title-only-in-source");
  });

  it("mantém a completude dos campos e opções da página", () => {
    expect(adultDcntEsfDefinition.sections).toHaveLength(10);
    expect(adultDcntEsfDefinition.questions).toHaveLength(45);
    expect(adultDcntEsfDefinition.questions.reduce((total, question) => total + question.options.length, 0)).toBe(114);
    expect(adultDcntEsfDefinition.questions.map((question) => question.id)).toEqual(expect.arrayContaining([
      "header.person-name", "header.cpf", "header.birth-date", "header.health-unit", "header.community-health-worker", "header.assessment-date",
      "sociodemographic.age", "sociodemographic.self-declared-race", "sociodemographic.marital-status", "sociodemographic.education",
      "sociodemographic.current-occupation", "sociodemographic.family-income-per-capita",
      "health.diagnosed-chronic-conditions", "health.other-chronic-condition-description", "health.chronic-disease-follow-up-exams", "health.hypertension-blood-pressure-follow-up",
      "screening.cervical-preventive", "screening.mammography", "screening.bone-densitometry", "screening.colorectal-cancer",
      "physical.weight", "physical.height", "physical.bmi", "physical.waist-circumference", "physical.waist-classification",
      "laboratory.hba1c.value", "laboratory.hba1c.date", "blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-1.date",
      "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic", "blood-pressure.visit-2.date", "blood-pressure.mean",
      "blood-pressure.control", "cardiovascular-risk", "foot.skin-and-deformity-findings", "foot.neuropathy-screening",
      "foot.right.dorsalis-pedis-pulse", "foot.right.posterior-tibial-pulse", "foot.left.dorsalis-pedis-pulse", "foot.left.posterior-tibial-pulse",
      "summary.services", "summary.other-service-description", "summary.ciap-2",
    ]));
    expect(byId("sociodemographic.self-declared-race")?.options).toHaveLength(5);
    expect(byId("sociodemographic.marital-status")?.options).toHaveLength(5);
    expect(byId("sociodemographic.education")?.options).toHaveLength(7);
    expect(byId("sociodemographic.current-occupation")?.options).toHaveLength(8);
    expect(byId("sociodemographic.family-income-per-capita")?.options).toHaveLength(7);
    expect(byId("health.diagnosed-chronic-conditions")?.options).toHaveLength(12);
    expect(byId("foot.skin-and-deformity-findings")?.options).toHaveLength(10);
    expect(byId("summary.services")?.options).toHaveLength(7);
    expect(byId("summary.services")?.options.every((option) => option.domainEffect === "proposed-network-or-referral-change")).toBe(true);
    expect(byId("health.diagnosed-chronic-conditions")?.options.find((option) => option.id === "other")?.domainEffect).toBe("proposal-only");
  });

  it("valida IDs, dependências, proveniência e visibilidade sem perguntas inventadas", () => {
    const result = validateInstrumentDefinition(adultDcntEsfDefinition);
    expect(result).toEqual({ valid: true, errors: [] });
    const sectionsWithoutQuestions = adultDcntEsfDefinition.sections.filter((section) => !section.implementable);
    expect(sectionsWithoutQuestions.every((section) => section.questions.length === 0)).toBe(true);
    expect(adultDcntEsfDefinition.questions.every((question) => question.provenance.origin && question.visibility)).toBe(true);
    expect(adultDcntEsfDefinition.questions.every((question) => question.visibility.scope !== "individual" || conservativeVisibility(question))).toBe(true);
    expect(adultDcntEsfDefinition.ambiguities).toHaveLength(10);
    expect(adultDcntEsfDefinition.ambiguities.map((ambiguity) => ambiguity.id)).toEqual(expect.arrayContaining([
      "occupation-selection-mode", "cervical-overlap", "mammography-overlap-gap", "bone-densitometry-overlap",
      "colorectal-method", "tacs-acs", "blood-pressure-control-threshold", "cardiovascular-risk-algorithm",
      "block-8-title-only", "missing-blocks",
    ]));
    expect(adultDcntEsfDefinition.sections.find((section) => section.printedBlockNumber === 8)?.declarativeCapabilities).toHaveLength(12);
    expect(adultDcntEsfDefinition.futureServiceStates).toHaveLength(12);
  });

  it("modela condicionais locais sem transformar ausência em resposta negativa", () => {
    expect(byId("health.other-chronic-condition-description")?.applicability?.dependencies).toEqual(["health.diagnosed-chronic-conditions"]);
    expect(byId("health.chronic-disease-follow-up-exams")?.applicability?.whenNotApplicable).toBe("not-applicable");
    expect(byId("health.hypertension-blood-pressure-follow-up")?.applicability?.condition).toContain("hypertension");
    expect(byId("screening.mammography")?.applicability?.manualReviewAllowed).toBe(true);
  });

  it("exige contexto familiar e sujeito clínico em cada aplicação", () => {
    const application = {
      applicationId: "application-1",
      familyId: "family-1",
      personId: "person-1",
      instrumentId: adultDcntEsfDefinition.id,
      instrumentVersion: adultDcntEsfDefinition.version,
      assessmentDate: "2026-09-28",
      status: "draft",
      kind: "initial",
      createdAt: "2026-09-28T00:00:00.000Z",
      updatedAt: "2026-09-28T00:00:00.000Z",
      answers: {},
      applicabilityOverrides: {},
      provenance: { origin: "digital-adaptation", sourceNote: "test" },
      visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
      dataOrigin: "normal",
      schemaVersion: 1,
      revisionNumber: 1,
    } satisfies InstrumentApplication;
    expect(validateInstrumentApplication(application).valid).toBe(true);
    expect(validateInstrumentApplication({ ...application, personId: "" }).valid).toBe(false);
    expect(validateInstrumentApplication({ ...application, familyId: "" }).valid).toBe(false);
    expect(validateInstrumentApplication({ ...application, familyId: "person-1" }).valid).toBe(false);
  });

  it("mantém aplicações e projeções individuais, sem detalhe clínico familiar", () => {
    const clinical = {
      subjectPersonId: "person-1", familyId: "family-1", scope: "individual",
      clinicalVisibility: "academic-private", personVisibility: "shareable-with-person",
      familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic",
      applicationId: "application-1", kind: "clinical-academic",
    } as const;
    const person = { ...clinical, kind: "person-friendly" } as const;
    expect(clinical.subjectPersonId).toBe(person.subjectPersonId);
    expect(clinical.familyVisibility).not.toBe("shareable-with-family");
    expect(person.subjectPersonId).toBe("person-1");
    expect(byId("health.diagnosed-chronic-conditions")?.visibility.familyVisibility).toBe("non-exportable");
    const first = {
      applicationId: "application-1", familyId: "family-1", personId: "person-1", instrumentId: "adult-dcnt-esf", instrumentVersion: "v1",
      assessmentDate: "2026-01-01", status: "completed", kind: "initial", createdAt: "2026-01-01", updatedAt: "2026-01-01",
      answers: {}, applicabilityOverrides: {}, provenance: { origin: "digital-adaptation", sourceNote: "test" },
      visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
      dataOrigin: "normal", schemaVersion: 1, revisionNumber: 1,
    } as InstrumentApplication;
    expect(canCompareApplications(first, { ...first, applicationId: "application-2", assessmentDate: "2026-06-01" })).toBe(true);
    expect(canCompareApplications(first, { ...first, applicationId: "application-3", personId: "person-2" })).toBe(false);
  });

  it("diferencia ecomapa familiar, membros selecionados, proposta e vínculo ativo", () => {
    const familyLink = {
      networkRelationshipId: "network-1", familyId: "family-1", scope: "family", relatedPersonIds: [],
      serviceOrNetworkId: "ubs", status: "active", source: "printed-local-form",
      visibility: byId("header.health-unit")!.visibility, createdAt: "2026-09-28T00:00:00.000Z", updatedAt: "2026-09-28T00:00:00.000Z",
    } satisfies EcomapLink;
    expect(validateEcomapLink(familyLink, ["person-1", "person-2"]).valid).toBe(true);
    expect(validateEcomapLink({ ...familyLink, scope: "selected-members", relatedPersonIds: [] }, ["person-1"]).valid).toBe(false);
    expect(validateEcomapLink({ ...familyLink, scope: "selected-members", relatedPersonIds: ["person-3"] }, ["person-1"]).valid).toBe(false);
    expect(validateEcomapProposal({
      proposalId: "proposal-1", familyId: "family-1", subjectPersonId: "person-1", applicationId: "application-1",
      serviceOrNetworkId: "caps", proposedScope: "selected-members", relatedPersonIds: ["person-1"],
      proposedStatus: "suggested", justificationPrivate: "Revisão humana necessária.", visibility: byId("health.diagnosed-chronic-conditions")!.visibility,
      decision: "pending-review",
    }, ["person-1"]).valid).toBe(true);
  });
});

``

# END FILE: tests/adult-dcnt-esf-definition.test.ts

---

# FILE: tests/assessment-application.test.ts

``typescript
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => {
  const records = new Map<string, unknown>();
  return { records, demo: undefined as { state: "active" } | undefined };
});

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (_store: string, id: string) => state.records.get(id)),
  getAllValues: vi.fn(async () => [...state.records.values()]),
  putValue: vi.fn(async (_store: string, value: { id: string }) => { state.records.set(value.id, value); }),
  replaceAllStores: vi.fn(async (stores: Record<string, { id: string }[]>) => {
    state.records.clear();
    for (const value of stores.records ?? []) state.records.set(value.id, value);
  }),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => state.demo) }));

import {
  archiveApplication,
  completeApplication,
  createApplication,
  createRectification,
  deriveApplicationResults,
  listApplicationsByFamilyMetadata,
  listApplicationsByPerson,
  saveAnswer,
  submitForReview,
  updateDraftApplication,
} from "@/src/clinical/assessments/application";
import { migrateApplicationPayload } from "@/src/clinical/assessments/migration";
import { restoreBackup } from "@/src/backup/service";
import { createSyntheticBackup } from "@/src/backup/adversarial";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const date = "2026-01-01T00:00:00.000Z";
function envelope(id: string, entityType: string, payload: unknown) {
  return { id, entityType, payload, createdAt: date, updatedAt: date, recordVersion: 1 };
}
function seedPeople(): void {
  const family = { id: "family-1", code: "F1", state: "active", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Family;
  const person1 = { id: "person-1", code: "P1", vitalStatus: "alive", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Person;
  const person2 = { id: "person-2", code: "P2", vitalStatus: "alive", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies Person;
  const membership = (personId: string) => ({ id: `membership-${personId}`, familyId: family.id, personId, roleLabel: "member", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: date, updatedAt: date, recordVersion: 1 } satisfies FamilyMembership);
  for (const value of [
    envelope(family.id, ENTITY_TYPES.family, family),
    envelope(person1.id, ENTITY_TYPES.person, person1),
    envelope(person2.id, ENTITY_TYPES.person, person2),
    envelope("membership-person-1", ENTITY_TYPES.membership, membership(person1.id)),
    envelope("membership-person-2", ENTITY_TYPES.membership, membership(person2.id)),
  ]) state.records.set(value.id, value);
}

describe("aplicações individuais ESF", () => {
  beforeEach(() => {
    state.records.clear();
    state.demo = undefined;
    seedPeople();
  });

  it("persiste respostas tipadas, mantém sujeitos independentes e gera resumo operacional", async () => {
    const first = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    const second = await createApplication({ familyId: "family-1", personId: "person-2", assessmentDate: "2026-01-01" });
    await saveAnswer(first.applicationId, {
      questionId: "header.person-name", answerType: "short-text", value: "Pessoa 1",
      source: "person", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date,
    });
    expect((await updateDraftApplication(second.applicationId, { privateNotes: "somente pessoa 2" })).privateNotes).toBe("somente pessoa 2");
    await expect(listApplicationsByPerson(first.personId)).resolves.toHaveLength(1);
    await expect(listApplicationsByFamilyMetadata("family-1")).resolves.toHaveLength(2);
  });

  it("aplica transições, bloqueia sobrescrita de concluída e cria retificação imutável", async () => {
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    await submitForReview(application.applicationId);
    const completed = await completeApplication(application.applicationId);
    await expect(updateDraftApplication(application.applicationId, { privateNotes: "não permitido" })).rejects.toThrow(/não pode ser sobrescrita/i);
    const rectification = await createRectification(completed.applicationId);
    expect(rectification.rectifiesApplicationId).toBe(completed.applicationId);
    expect(rectification.applicationId).not.toBe(completed.applicationId);
    expect(rectification.personId).toBe(completed.personId);
    expect(rectification.revisionNumber).toBe(completed.revisionNumber + 1);
    expect(await archiveApplication(rectification.applicationId)).toMatchObject({ status: "archived" });
  });

  it("marca novas aplicações demonstrativas sem permitir alteração normal", async () => {
    state.demo = { state: "active" };
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    expect(application.dataOrigin).toBe("synthetic-demo");
  });

  it("migra payload legado de respostas de forma idempotente", async () => {
    const legacy = { applicationId: "old", familyId: "family-1", personId: "person-1", instrumentId: "adult-dcnt-esf", instrumentVersion: "local-esf-2026-page-28-v1", assessmentDate: "2026-01-01", status: "draft" as const, kind: "initial" as const, createdAt: date, updatedAt: date, responses: {} };
    const migrated = migrateApplicationPayload(legacy);
    expect(migrateApplicationPayload(migrated)).toEqual(migrated);
    expect(migrated.answers).toEqual({});
    expect("responses" in migrated).toBe(false);
  });

  it("reconstrói derivados versionados sem persistir resultado clínico como resposta", async () => {
    const application = await createApplication({ familyId: "family-1", personId: "person-1", assessmentDate: "2026-01-01" });
    const enriched = await updateDraftApplication(application.applicationId, {
      answers: {
        "header.birth-date": { questionId: "header.birth-date", answerType: "date", value: "1990-01-01", source: "person", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date },
        "physical.weight": { questionId: "physical.weight", answerType: "measurement", value: 80, unit: "kg", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date },
        "physical.height": { questionId: "physical.height", answerType: "measurement", value: 2, unit: "m", source: "observation", status: "answered", applicabilityState: "applicable", answeredAt: date, updatedAt: date },
      },
    });
    expect(deriveApplicationResults(enriched).map((result) => result.questionId)).toEqual(["sociodemographic.age", "physical.bmi"]);
    expect(enriched.answers["physical.bmi"]).toBeUndefined();
  });

  it("migra e restaura aplicação legada preservando checksum do payload", async () => {
    const legacy = envelope("legacy-application", ENTITY_TYPES.instrumentApplication, {
      applicationId: "legacy-application", familyId: "family-1", personId: "person-1",
      instrumentId: "adult-dcnt-esf", instrumentVersion: "local-esf-2026-page-28-v1",
      assessmentDate: "2026-01-01", status: "draft", kind: "initial", createdAt: date, updatedAt: date, responses: {},
    });
    const backup = await createSyntheticBackup({
      records: [...state.records.values(), legacy],
      meta: [], drafts: [], events: [], security: [],
    });
    const validation = await restoreBackup(backup);
    expect(validation.valid).toBe(true);
    expect(state.records.get("legacy-application")).toMatchObject({ payload: { answers: {}, schemaVersion: 1 } });
    expect((state.records.get("legacy-application") as { checksum?: string }).checksum).toBe(JSON.stringify((state.records.get("legacy-application") as { payload: unknown }).payload));
  });
});

``

# END FILE: tests/assessment-application.test.ts

---

# FILE: tests/backup-crypto.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { protectBackup, unprotectBackup } from "@/src/backup/crypto";

describe("backup protegido", () => {
  it("cifra e decifra conteúdo", async () => {
    const source = JSON.stringify({ synthetic: true, family: "F-001" });
    const backup = await protectBackup(source, "senha-demo-muito-forte");
    expect(backup.protected).toBe(true);
    expect(await unprotectBackup(backup, "senha-demo-muito-forte")).toBe(source);
  });
  it("rejeita senha curta", async () => {
    await expect(protectBackup("{}", "curta")).rejects.toThrow();
  });
});

``

# END FILE: tests/backup-crypto.test.ts

---

# FILE: tests/demo-mode.test.ts

``typescript
import { beforeEach, describe, expect, it, vi } from "vitest";

const memory = vi.hoisted(() => {
  const stores = new Map<string, Map<string, unknown>>();
  for (const name of ["meta", "records", "drafts", "events", "security"]) stores.set(name, new Map());
  return { stores };
});

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (store: string, id: string) => memory.stores.get(store)?.get(id)),
  getAllValues: vi.fn(async (store: string) => [...(memory.stores.get(store)?.values() ?? [])]),
  putValue: vi.fn(async (store: string, value: { id: string }) => { memory.stores.get(store)?.set(value.id, value); }),
  deleteValue: vi.fn(async (store: string, id: string) => { memory.stores.get(store)?.delete(id); }),
  replaceStore: vi.fn(async (store: string, values: { id: string }[]) => {
    const target = memory.stores.get(store)!;
    target.clear();
    for (const value of values) target.set(value.id, value);
  }),
  replaceAllStores: vi.fn(async (values: Record<string, { id: string }[]>) => {
    for (const [store, entries] of Object.entries(values)) {
      const target = memory.stores.get(store)!;
      target.clear();
      for (const value of entries) target.set(value.id, value);
    }
  }),
}));

vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));

import { seedSyntheticSemester } from "@/src/domain/demo-seed";
import { enterDemoMode, exitDemoMode, getDemoSession, removeDemoData } from "@/src/domain/demo-mode";
import { createFamily, updateFamily } from "@/src/domain/factories";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { findEntity, listEntities, saveEntity } from "@/src/domain/repository";
import type { Family } from "@/src/contracts/family";
import { createBackup } from "@/src/backup/service";

function envelope(id: string, entityType: string, payload: unknown) {
  return { id, entityType, payload, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", recordVersion: 1 };
}

describe("ciclo reversível de demonstração", () => {
  beforeEach(() => { for (const store of memory.stores.values()) store.clear(); });

  it("não injeta famílias sintéticas no armazenamento normal sem ativar o modo", async () => {
    const normal = envelope("normal-family-1", ENTITY_TYPES.family, { id: "normal-family-1", code: "F-001" });
    memory.stores.get("records")!.set(normal.id, normal);

    await expect(seedSyntheticSemester()).rejects.toThrow(/modo de demonstração/i);

    expect([...memory.stores.get("records")!.values()]).toEqual([normal]);
  });

  it("isola o conjunto sintético, permite editá-lo sem perder a marca e restaura os dados normais ao sair", async () => {
    const normal = envelope("normal-family-1", ENTITY_TYPES.family, { id: "normal-family-1", code: "F-001" });
    memory.stores.get("records")!.set(normal.id, normal);

    await enterDemoMode();
    expect(await findEntity(normal.id)).toBeUndefined();
    const demoFamilies = await listEntities<Family>(ENTITY_TYPES.family);
    expect(demoFamilies.length).toBeGreaterThan(0);
    expect(demoFamilies.every((family) => family.dataOrigin === "synthetic-demo")).toBe(true);
    expect((await getDemoSession())?.state).toBe("active");

    const family = demoFamilies[0]!;
    const edited = updateFamily(family, { code: family.code, nickname: "Família demonstrativa revisada", focus: family.focus ?? "" });
    await saveEntity(ENTITY_TYPES.family, edited);
    expect(await findEntity<Family>(family.id)).toMatchObject({ nickname: "Família demonstrativa revisada", dataOrigin: "synthetic-demo" });

    await exitDemoMode();
    expect(await findEntity(normal.id)).toEqual(normal.payload);
    expect(await findEntity(family.id)).toBeUndefined();
    expect(await getDemoSession()).toBeUndefined();
  });

  it("isola e restaura rascunhos e eventos, sem alterar a segurança global", async () => {
    const normalDraft = { id: "normal-draft", scope: "family", payload: { text: "rascunho normal" } };
    const normalEvent = { id: "normal-event", type: "family-created", entityId: "normal-family-1" };
    const security = { id: "pin", value: { hash: "preserve-me" }, updatedAt: "2026-01-01T00:00:00.000Z" };
    memory.stores.get("drafts")!.set(normalDraft.id, normalDraft);
    memory.stores.get("events")!.set(normalEvent.id, normalEvent);
    memory.stores.get("security")!.set(security.id, security);

    await enterDemoMode();
    memory.stores.get("drafts")!.set("demo-draft", { id: "demo-draft", scope: "demo", payload: { text: "rascunho sintético" } });
    memory.stores.get("events")!.set("demo-event", { id: "demo-event", type: "demo-change" });

    expect([...memory.stores.get("drafts")!.values()]).toEqual([
      { id: "demo-draft", scope: "demo", payload: { text: "rascunho sintético" } },
    ]);
    expect([...memory.stores.get("events")!.values()]).toEqual([
      { id: "demo-event", type: "demo-change" },
    ]);
    expect([...memory.stores.get("security")!.values()]).toEqual([security]);

    await exitDemoMode();
    expect([...memory.stores.get("drafts")!.values()]).toEqual([normalDraft]);
    expect([...memory.stores.get("events")!.values()]).toEqual([normalEvent]);
    expect([...memory.stores.get("security")!.values()]).toEqual([security]);
  });

  it("mantém a demonstração ativa entre recargas simuladas e remove apenas seus registros", async () => {
    const normal = envelope("normal-family-2", ENTITY_TYPES.family, { id: "normal-family-2", code: "F-002" });
    memory.stores.get("records")!.set(normal.id, normal);
    await enterDemoMode();

    expect((await getDemoSession())?.state).toBe("active");
    await removeDemoData();
    expect(await listEntities(ENTITY_TYPES.family)).toEqual([]);
    expect((await getDemoSession())?.state).toBe("active");

    await exitDemoMode();
    expect(await findEntity(normal.id)).toEqual(normal.payload);
  });

  it("gera backup normal do snapshot anterior sem a sessão nem os registros sintéticos", async () => {
    const normal = envelope("normal-family-3", ENTITY_TYPES.family, { id: "normal-family-3", code: "F-003" });
    memory.stores.get("records")!.set(normal.id, normal);
    await enterDemoMode();
    memory.stores.get("drafts")!.set("demo-draft", { id: "demo-draft", scope: "demo", payload: { text: "sintético" } });
    memory.stores.get("events")!.set("demo-event", { id: "demo-event", type: "demo-change" });

    const backup = await createBackup();
    expect(backup.stores.records).toEqual([normal]);
    expect(backup.stores.drafts).toEqual([]);
    expect(backup.stores.events).toEqual([]);
    expect(backup.stores.meta.some((record) => (record as { id?: string }).id === "active-demo-session")).toBe(false);
  });
});
``

# END FILE: tests/demo-mode.test.ts

---

# FILE: tests/family-assessments.test.tsx

``tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assessmentRendererFor, FamilyAssessmentsPanel } from "@/app/family-assessments";
import { adultDcntEsfDefinition } from "@/src/clinical/assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InstrumentApplication } from "@/src/clinical/assessments";

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "family-1", code: "F-1", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const personOne: Person = { id: "person-1", code: "P-1", displayName: "Pessoa Um", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const personTwo: Person = { id: "person-2", code: "P-2", displayName: "Pessoa Dois", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const memberships: FamilyMembership[] = [
  { id: "membership-1", familyId: family.id, personId: personOne.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
  { id: "membership-2", familyId: family.id, personId: personTwo.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];

function application(personId: string, applicationId: string, answerText: string): InstrumentApplication {
  return {
    applicationId,
    familyId: family.id,
    personId,
    instrumentId: "adult-dcnt-esf",
    instrumentVersion: "local-esf-2026-page-28-v1",
    assessmentDate: "2026-01-01",
    status: "draft",
    kind: "initial",
    createdAt: timestamp,
    updatedAt: timestamp,
    answers: {
      "header.person-name": {
        questionId: "header.person-name",
        answerType: "short-text",
        value: answerText,
        answeredAt: timestamp,
        updatedAt: timestamp,
        source: "person",
        status: "answered",
        applicabilityState: "applicable",
      },
    },
    applicabilityOverrides: {},
    provenance: { origin: "digital-adaptation", sourceNote: "teste" },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal",
    schemaVersion: 1,
    revisionNumber: 1,
  };
}

describe("interface de avaliações na família", () => {
  it.each([...new Set(adultDcntEsfDefinition.questions.map((question) => question.answerType))])("possui renderer dedicado para answerType %s", (answerType) => {
    expect(assessmentRendererFor(answerType)).not.toBe("unknown");
  });
  it("mostra somente metadados na visão familiar e isola aplicações por pessoa", async () => {
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[application(personOne.id, "app-1", "Resposta privada um"), application(personTwo.id, "app-2", "Resposta privada dois")]} demoActive={false} onSaved={async () => undefined} />);

    expect(screen.getByText("Avaliações")).toBeTruthy();
    expect(screen.getByText("Pessoa Um")).toBeTruthy();
    expect(screen.getByText("Pessoa Dois")).toBeTruthy();
    expect(screen.queryByText("Resposta privada um")).toBeNull();
    expect(screen.queryByText("Resposta privada dois")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByDisplayValue("Resposta privada um")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Dois/ }));
    await waitFor(() => expect(screen.queryByDisplayValue("Resposta privada um")).toBeNull());
  });

  it("renderiza pressão por visita, cintura com critério e revisão legível", async () => {
    const item = application(personOne.id, "app-3", "Pessoa Um");
    item.waistCriterion = "male-local-rule";
    item.answers = {
      ...item.answers,
      "physical.waist-circumference": { questionId: "physical.waist-circumference", answerType: "measurement", value: 102.1, unit: "cm", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-1.systolic": { questionId: "blood-pressure.visit-1.systolic", answerType: "blood-pressure", value: { systolic: 120 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-1.diastolic": { questionId: "blood-pressure.visit-1.diastolic", answerType: "blood-pressure", value: { diastolic: 80 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-1.date": { questionId: "blood-pressure.visit-1.date", answerType: "date", value: "2026-01-01", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-2.systolic": { questionId: "blood-pressure.visit-2.systolic", answerType: "blood-pressure", value: { systolic: 130 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-2.diastolic": { questionId: "blood-pressure.visit-2.diastolic", answerType: "blood-pressure", value: { diastolic: 84 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-2.date": { questionId: "blood-pressure.visit-2.date", answerType: "date", value: "2026-02-01", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
    };
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 6/ })[0]!);
    expect(screen.getByLabelText(/PA visita 1 — sistólica/)).toHaveValue(120);
    expect(screen.getByLabelText(/PA visita 1 — diastólica/)).toHaveValue(80);
    expect(screen.getByLabelText(/PA visita 2 — sistólica/)).toHaveValue(130);
    expect(screen.getByLabelText(/PA visita 2 — diastólica/)).toHaveValue(84);
    expect(screen.getByText("muito aumentado")).toBeTruthy();
    expect(screen.getByText("125.0 / 82.0 mmHg (média das duas visitas)")).toBeTruthy();
    expect(screen.getByText(/Visita 1: 120\/80 mmHg/)).toBeTruthy();
    expect(screen.getAllByText(/Bloco 3: Fonte ausente/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 8/ }).at(-1)!);
    expect(screen.getByText(/capacidades futuras/i)).toBeTruthy();
  });

  it("marca uma resposta dependente como não aplicável sem apagar seu valor", async () => {
    const item = application(personOne.id, "app-4", "Pessoa Um");
    item.answers["health.diagnosed-chronic-conditions"] = {
      questionId: "health.diagnosed-chronic-conditions", answerType: "multiple-choice", value: ["hypertension"], answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable",
    };
    item.answers["health.hypertension-blood-pressure-follow-up"] = {
      questionId: "health.hypertension-blood-pressure-follow-up", answerType: "yes-no", value: "yes", answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable",
    };
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 2/ })[0]!);
    expect(screen.getAllByText("Sim").some((node) => node.parentElement?.querySelector("input:checked") !== null)).toBe(true);
  });

  it("anuncia erro de salvamento sem perder edição local", async () => {
    const item = application(personOne.id, "app-error", "Pessoa Um");
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => { throw new Error("falha simulada"); }} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    const field = screen.getByDisplayValue("Pessoa Um");
    fireEvent.change(field, { target: { value: "Alteração local" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
    expect(await screen.findByText(/Erro ao salvar/i)).toBeTruthy();
    expect(screen.getByDisplayValue("Alteração local")).toBeTruthy();
  });

  it("mostra revisão manual de aplicabilidade e preserva o valor", async () => {
    const item = application(personOne.id, "app-override", "Pessoa Um");
    item.answers["health.diagnosed-chronic-conditions"] = { questionId: "health.diagnosed-chronic-conditions", answerType: "multiple-choice", value: ["hypertension"], answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable" };
    item.answers["health.hypertension-blood-pressure-follow-up"] = { questionId: "health.hypertension-blood-pressure-follow-up", answerType: "yes-no", value: "yes", answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable" };
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 2/ })[0]!);
    const selects = screen.getAllByDisplayValue(/Usar regra automática/);
    fireEvent.change(screen.getAllByPlaceholderText("Justificativa breve obrigatória")[0]!, { target: { value: "Revisão manual local" } });
    fireEvent.change(selects[0]!, { target: { value: "not-applicable" } });
    expect(screen.getAllByText(/override manual|justificativa/i).length).toBeGreaterThan(0);
  });
});

``

# END FILE: tests/family-assessments.test.tsx

---

# FILE: tests/family-assessments-demo.test.tsx

``tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DemoModePanel } from "@/app/demo-mode-panel";
import { FamilyAssessmentsPanel } from "@/app/family-assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InstrumentApplication } from "@/src/clinical/assessments";

const state = vi.hoisted(() => ({ active: false, applications: [] as InstrumentApplication[] }));
vi.mock("@/src/domain/demo-mode", () => ({
  enterDemoMode: vi.fn(async () => { state.active = true; return { version: 2, state: "active" }; }),
  exitDemoMode: vi.fn(async () => { state.active = false; state.applications = []; return true; }),
  removeDemoData: vi.fn(async () => { state.applications = []; return 1; }),
}));
vi.mock("@/src/clinical/assessments", async () => {
  const actual = await vi.importActual<typeof import("@/src/clinical/assessments")>("@/src/clinical/assessments");
  return {
    ...actual,
    createApplication: vi.fn(async ({ familyId, personId, assessmentDate, kind }: { familyId: string; personId: string; assessmentDate: string; kind?: "initial" | "reassessment" }) => {
      const application = { applicationId: "demo-application", familyId, personId, assessmentDate, status: "draft", kind: kind ?? "initial", instrumentId: "adult-dcnt-esf", instrumentVersion: "local-esf-2026-page-28-v1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", answers: {}, applicabilityOverrides: {}, provenance: { origin: "digital-adaptation", sourceNote: "teste" }, visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" }, dataOrigin: "synthetic-demo", schemaVersion: 1, revisionNumber: 1 } as InstrumentApplication;
      state.applications = [application];
      return application;
    }),
    updateDraftApplication: vi.fn(async (_id: string, changes: { answers: InstrumentApplication["answers"] }) => {
      state.applications = [{ ...state.applications[0]!, ...changes, updatedAt: "2026-01-02T00:00:00.000Z" } as InstrumentApplication];
      return state.applications[0]!;
    }),
  };
});

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "demo-family", code: "D-1", nickname: "Família demonstrativa", state: "active", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const person: Person = { id: "demo-person", code: "D-P1", displayName: "Pessoa demonstrativa", vitalStatus: "alive", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const secondPerson: Person = { id: "demo-person-2", code: "D-P2", displayName: "Pessoa dois", vitalStatus: "alive", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const membership: FamilyMembership = { id: "demo-membership", familyId: family.id, personId: person.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", dataOrigin: "synthetic-demo", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const secondMembership: FamilyMembership = { ...membership, id: "demo-membership-2", personId: secondPerson.id };

function DemoFlow() {
  const [, refresh] = React.useState(0);
  return <><DemoModePanel active={state.active} families={state.active ? [family] : []} onChanged={async () => refresh((value) => value + 1)} /><FamilyAssessmentsPanel family={family} people={[person, secondPerson]} memberships={[membership, secondMembership]} applications={state.applications} demoActive={state.active} onSaved={async () => refresh((value) => value + 1)} /></>;
}

describe("fluxo de avaliações no modo demonstração", () => {
  beforeEach(() => { state.active = false; state.applications = []; });

  it("entra, cria, salva, isola, restaura e remove aplicação sintética", async () => {
    render(<DemoFlow />);
    fireEvent.click(screen.getByRole("button", { name: "Entrar no modo demonstração" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar entrada" }));
    await waitFor(() => expect(screen.getByText("Demonstração ativa. Os dados normais estão isolados e podem ser restaurados ao sair.")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: /Pessoa demonstrativa/ }));
    fireEvent.click(screen.getByRole("button", { name: "Nova aplicação" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy());
    expect(screen.getByText(/Aplicação demonstrativa/)).toBeTruthy();
    fireEvent.change(screen.getAllByRole("textbox")[0]!, { target: { value: "Resposta sintética" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
    await waitFor(() => expect(screen.getAllByRole("status").some((node) => /Salvo em|Salvo\./.test(node.textContent ?? ""))).toBe(true));
    fireEvent.click(screen.getByRole("button", { name: /Pessoa dois/ }));
    expect(screen.getByText("Nenhuma aplicação para esta pessoa.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Pessoa demonstrativa/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByDisplayValue("Resposta sintética")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Sair e restaurar estado anterior" }));
    await waitFor(() => expect(screen.getByText("Nenhuma aplicação para esta pessoa.")).toBeTruthy());
    expect(state.applications).toHaveLength(0);
    expect(screen.getByText("Entrar no modo demonstração")).toBeTruthy();
  });
});

``

# END FILE: tests/family-assessments-demo.test.tsx

---

# FILE: tests/hash.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { canonicalJson, checksumOf } from "@/src/storage/hash";

describe("integridade canônica", () => {
  it("ordena chaves antes de serializar", () => {
    expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
  });
  it("produz checksum estável", async () => {
    expect(await checksumOf({ synthetic: true })).toHaveLength(64);
  });
});

``

# END FILE: tests/hash.test.ts

---

# FILE: tests/marco2-factories.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { createFamily, createEncounter, createPending } from "@/src/domain/factories";

describe("fábricas do Marco 2", () => {
  it("cria família ativa sem exigir foco", () => { expect(createFamily({code:"F-003"}).state).toBe("active"); });
  it("preserva encontro breve sem transformá-lo em pendência", () => { expect(createEncounter({kind:"brief-contact",title:"Contato",freeText:"Breve"}).state).toBe("saved"); });
  it("pendência é explícita e separada do texto breve", () => { expect(createPending({title:"Conferir documento"}).destination).toBe("open"); });
});

``

# END FILE: tests/marco2-factories.test.ts

---

# FILE: tests/marco2-selectors.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { nextFamilyCode, peopleInFamily, buildTimeline } from "@/src/domain/selectors";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

describe("seletores do Marco 2", () => {
  it("gera o próximo código familiar sem impor limite", () => {
    const families = [{ code: "F-001" }, { code: "F-004" }] as Family[];
    expect(nextFamilyCode(families)).toBe("F-005");
  });
  it("permite uma pessoa em mais de uma família", () => {
    const person = { id: "p1" } as Person;
    const links = [{ personId:"p1",familyId:"f1" },{ personId:"p1",familyId:"f2" }] as FamilyMembership[];
    expect(peopleInFamily([person],links,"f1")).toEqual([person]);
    expect(peopleInFamily([person],links,"f2")).toEqual([person]);
  });
  it("ordena timeline da mais recente para a mais antiga", () => {
    const events = buildTimeline([{ id:"e1",occurredAt:"2026-01-01",title:"Antigo",personIds:[] },{ id:"e2",occurredAt:"2026-02-01",title:"Novo",personIds:[] }] as never[],[]);
    expect(events.map((item)=>item.title)).toEqual(["Novo","Antigo"]);
  });
});

``

# END FILE: tests/marco2-selectors.test.ts

---

# FILE: tests/marco3-handoff.test.ts

``typescript
import { describe,expect,it } from "vitest";
import { buildHandoff,createSharedCards } from "@/src/domain/care-selectors";
import { createCondition } from "@/src/domain/longitudinal-factories";
import type { Person } from "@/src/contracts/family";

describe("transformações do Marco 3",()=>{
 it("mantém fatos separados de interpretações",()=>{const person={id:"p1",code:"P-001-A",vitalStatus:"alive"} as unknown as Person;const draft=buildHandoff(person,[createCondition({personId:"p1",label:"HAS relatada",kind:"reported"})],[],"30s");expect(draft.facts.length).toBe(1);expect(draft.interpretations).toEqual([]);});
 it("não seleciona automaticamente item que requer revisão",()=>{const cards=createSharedCards([createCondition({personId:"p1",label:"HAS",kind:"reported",sharedSummary:"Acompanhamento da pressão."})]);expect(cards[0]?.selected).toBe(false);});
});

``

# END FILE: tests/marco3-handoff.test.ts

---

# FILE: tests/marco3-sharing.test.ts

``typescript
import { describe,expect,it } from "vitest";
import { sharingDecision } from "@/src/domain/sharing-policy";
import { createCondition,createExamResult } from "@/src/domain/longitudinal-factories";

describe("privacidade do Marco 3",()=>{
 it("bloqueia informação de terceiro no resumo",()=>{const item=createCondition({personId:"p1",label:"Relato",kind:"vulnerability",thirdParty:true});expect(sharingDecision(item,"person-summary").allowed).toBe(false);});
 it("exame sem unidade fica com dados insuficientes",()=>{expect(createExamResult({personId:"p1",examName:"Exame",valueText:"10"}).interpretationState).toBe("insufficient-data");});
});

``

# END FILE: tests/marco3-sharing.test.ts

---

# FILE: tests/marco4-clinical.test.ts

``typescript
import {describe,expect,it} from "vitest";
import {conditions,medicationKnowledge} from "@/src/clinical/content";
import {validateClinicalLibrary} from "@/src/clinical/validation";
describe("biblioteca clínica",()=>{
 it("contém as cinco condições piloto",()=>expect(conditions.map((c)=>c.id)).toEqual(["has","dm2","drc","dyslipidemia","obesity"]));
 it("todas as afirmações têm fonte",()=>expect(conditions.every((c)=>Object.values(c.sections).flat().every((x)=>x.sourceIds.length>0))).toBe(true));
 it("mantém doses bloqueadas até auditoria por produto",()=>expect(medicationKnowledge.every((m)=>m.doseStatus==="not-published")).toBe(true));
 it("valida referências e status preliminar",()=>expect(validateClinicalLibrary().valid).toBe(true));
});

``

# END FILE: tests/marco4-clinical.test.ts

---

# FILE: tests/marco5-diagrams.test.ts

``typescript
import {describe,expect,it} from "vitest";import {buildEcomap,buildGenogram,relationshipNarrative} from "@/src/domain/diagram-engine";import {diagramPrompt,possibleIdentifiers} from "@/src/domain/diagram-prompt";
const family={id:"f1",code:"F-001",state:"active",createdAt:"",updatedAt:"",recordVersion:1} as const;const people=[{id:"p1",code:"P-001-A",vitalStatus:"alive"},{id:"p2",code:"P-001-B",vitalStatus:"alive"}] as never[];const memberships=[{id:"m1",familyId:"f1",personId:"p1",roleLabel:"mãe",createdAt:"",updatedAt:"",recordVersion:1},{id:"m2",familyId:"f1",personId:"p2",roleLabel:"filha",createdAt:"",updatedAt:"",recordVersion:1}] as never[];
describe("diagramas familiares",()=>{it("gera genograma determinístico com manifesto",()=>{const m=buildGenogram({family,people,memberships,relationships:[],layer:"structural"});expect(m.manifest.expectedNodes).toBe(2);expect(m.kind).toBe("genogram")});it("gera ecomapa com família central",()=>{const m=buildEcomap({family,people,resources:[],links:[]});expect(m.nodes[0]?.id).toBe("f1")});it("prompt inclui manifesto e regra de não invenção",()=>{const m=buildEcomap({family,people,resources:[],links:[]});const p=diagramPrompt(m);expect(p).toContain("Não inventar");expect(p).toContain("Entidades esperadas: 1")});it("narrativa possui perspectiva",()=>{expect(relationshipNarrative(buildEcomap({family,people,resources:[],links:[]}))).toContain("Perspectiva")});it("detector encontra telefone simples",()=>{expect(possibleIdentifiers("51 99999-9999").length).toBeGreaterThan(0)})});

``

# END FILE: tests/marco5-diagrams.test.ts

---

# FILE: tests/marco6-journey.test.ts

``typescript
import {describe,expect,it} from "vitest";import {assessCloseReadiness,createSemesterSnapshot} from "@/src/domain/semester-close";import {semesterReport} from "@/src/domain/journey-report";import type {Semester} from "@/src/contracts/family";
const semester={id:"s1",code:"SEM-1",label:"Semestre",state:"active",expectedFamilyCount:2,createdAt:"",updatedAt:"",recordVersion:1} as Semester;
describe("encerramento da Jornada",()=>{it("bloqueia pendência sem destino",()=>{const r=assessCloseReadiness(semester,[{semesterId:"s1",destination:"open"}] as never[],false);expect(r.ready).toBe(false)});it("aceita processo inconcluso com destino explícito",()=>{const r=assessCloseReadiness(semester,[{semesterId:"s1",destination:"continuity-recommended"}] as never[],false);expect(r.ready).toBe(true);expect(r.warnings.length).toBe(1)});it("snapshot possui checksum e cópia",async()=>{const data={semester,families:[],familyLinks:[],people:[],memberships:[],encounters:[],pending:[],conditions:[],medications:[],examResults:[],screenings:[],carePlans:[],relationships:[],resources:[],externalLinks:[],reflections:[],competencies:[],feedbacks:[]};const s=await createSemesterSnapshot({semester,data,reportText:"relatório"});expect(s.contentChecksum).toHaveLength(64);expect(s.data).not.toBe(data)});it("relatório declara expectativa não limite",()=>{expect(semesterReport({semester,trajectories:[],reflections:[],competencies:[],feedbacks:[],pending:[]})).toContain("expectativa, não limite")})});

``

# END FILE: tests/marco6-journey.test.ts

---

# FILE: tests/marco7-gate.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { evaluateMarco7Decision, REQUIRED_LOCAL_GATES } from "@/scripts/marco7-policy.mjs";

const currentDecision = JSON.parse(readFileSync("docs/audit/RELEASE_DECISION.json", "utf8"));

describe("gate do Marco 7", () => {
  it("reconhece GO LOCAL com decisão estruturada e determinística", () => {
    const first = evaluateMarco7Decision(currentDecision);
    const second = evaluateMarco7Decision(JSON.parse(JSON.stringify(currentDecision)));

    expect(first).toEqual({ valid: true, errors: [] });
    expect(second).toEqual(first);
    expect(currentDecision.decision).toBe("GO LOCAL");
    expect(currentDecision.realDataAllowed).toBe(false);
    expect(currentDecision.publicDistributionAllowed).toBe(false);
    expect(currentDecision.replacesOfficialRecord).toBe(false);
    expect(REQUIRED_LOCAL_GATES).toHaveLength(5);
  });

  it("não transforma limitações normais de escopo em NO-GO", () => {
    const result = evaluateMarco7Decision({
      ...currentDecision,
      gates: currentDecision.gates.map((gate: { id: string; status: string; blocking: boolean }) => ({
        ...gate,
        status: ["device-matrix", "full-db-encryption", "security-review", "accessibility", "clinical-review", "pharmacology", "institutional"].includes(gate.id)
          ? "manual"
          : gate.status,
        blocking: false,
      })),
    });

    expect(result.valid).toBe(true);
  });

  it("produz NO-GO quando um bloqueio local genuíno é explicitamente aberto", () => {
    const report = structuredClone(currentDecision);
    report.gates = report.gates.map((gate: { id: string; status: string; blocking: boolean }) =>
      gate.id === "backup-restore" ? { ...gate, status: "failed", blocking: true } : gate,
    );

    const result = evaluateMarco7Decision(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Gate local obrigatório não aprovado: backup-restore.");
    expect(result.errors).toContain("Bloqueador explícito permanece aberto: backup-restore.");
  });

  it("não depende da frase histórica NO-GO", () => {
    const report = structuredClone(currentDecision);
    report.auditText = "A decisão anterior NO-GO foi superada.";

    expect(evaluateMarco7Decision(report).valid).toBe(true);
  });
});

``

# END FILE: tests/marco7-gate.test.ts

---

# FILE: tests/pharmacology-catalog.test.ts

``typescript
import {describe,expect,it} from "vitest";
import {pharmacologyCatalog} from "@/src/clinical/pharmacology/catalog";
import {publishablePharmacologyEntries,validatePharmacologyEntry} from "@/src/clinical/pharmacology/validation";
import {EXAMPLE_PHARMACOLOGY_ENTRY} from "@/src/clinical/pharmacology/example";
describe("caderno farmacológico autoral",()=>{it("disponibiliza fichas do catálogo preenchido",()=>{expect(pharmacologyCatalog.length).toBeGreaterThan(0);expect(publishablePharmacologyEntries(pharmacologyCatalog).length).toBeGreaterThan(0)});it("não publica o molde",()=>expect(publishablePharmacologyEntries([EXAMPLE_PHARMACOLOGY_ENTRY])).toEqual([]));it("detecta placeholders",()=>expect(validatePharmacologyEntry(EXAMPLE_PHARMACOLOGY_ENTRY)).toContain("existem placeholders não preenchidos"))});

``

# END FILE: tests/pharmacology-catalog.test.ts

---

# FILE: tests/pin-policy.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { validatePinPolicy } from "@/src/security/pin";

describe("política de PIN", () => {
  it("rejeita PIN curto e previsível", () => {
    expect(validatePinPolicy("123456").length).toBeGreaterThan(0);
  });
  it("aceita PIN numérico menos previsível", () => {
    expect(validatePinPolicy("804261")).toEqual([]);
  });
});

``

# END FILE: tests/pin-policy.test.ts

---

# FILE: tests/project-state.test.ts

``typescript
import { describe, expect, it } from "vitest";
import { projectState } from "@/src/lib/project-state";

describe("estado do Marco 0", () => {
  it("não permite dados reais", () => {
    expect(projectState.realDataAllowed).toBe(false);
  });

  it("trata duas famílias como expectativa, não limite", () => {
    expect(projectState.expectedFamiliesPerSemester).toBe(2);
    expect(projectState.expectedFamiliesAreLimit).toBe(false);
  });
});

``

# END FILE: tests/project-state.test.ts

---

# FILE: tests/security-gate.test.tsx

``tsx
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasPin, pinSecurityNotice, setPin, validatePinPolicy, verifyPin } from "@/src/security/pin";
import { SecurityGate } from "@/app/security-gate";

vi.mock("@/src/security/pin", () => ({
  hasPin: vi.fn(),
  pinSecurityNotice: "O PIN bloqueia a interface local. Ele não substitui a proteção do dispositivo nem cifra automaticamente todos os dados.",
  setPin: vi.fn(),
  validatePinPolicy: vi.fn(() => []),
  verifyPin: vi.fn(),
}));

const mockHasPin = vi.mocked(hasPin);
const mockSetPin = vi.mocked(setPin);
const mockValidatePinPolicy = vi.mocked(validatePinPolicy);
const mockVerifyPin = vi.mocked(verifyPin);

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  mockSetPin.mockResolvedValue(undefined);
  mockValidatePinPolicy.mockReturnValue([]);
  mockVerifyPin.mockResolvedValue(true);
});

describe("tela de proteção local", () => {
  it("apresenta uma orientação de configuração sem mensagens do Marco 1", async () => {
    mockHasPin.mockResolvedValue(false);
    render(<SecurityGate>Conteúdo local</SecurityGate>);

    expect(await screen.findByRole("heading", { name: "Crie um PIN para este dispositivo" })).toBeInTheDocument();
    expect(screen.getByText("Defina um PIN para proteger o acesso ao Mapa neste dispositivo.")).toBeInTheDocument();
    expect(screen.getByText(pinSecurityNotice)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Escolha um PIN para configurar a proteção local.");
    expect(screen.queryByText(/Marco 1/i)).not.toBeInTheDocument();
  });

  it("mostra o estado protegido após encontrar um PIN já configurado", async () => {
    mockHasPin.mockResolvedValue(true);
    render(<SecurityGate>Conteúdo local</SecurityGate>);

    expect(await screen.findByRole("heading", { name: "Mapa protegido" })).toBeInTheDocument();
    expect(screen.getByText("A proteção local está ativa neste dispositivo. Digite seu PIN para continuar.")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Proteção local ativa neste dispositivo."));
    expect(screen.queryByText("Verificando proteção local...")).not.toBeInTheDocument();
    expect(screen.queryByText(pinSecurityNotice)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marco 1/i)).not.toBeInTheDocument();
  });
});

``

# END FILE: tests/security-gate.test.tsx

---

# FILE: tests/setup.ts

``typescript
import "@testing-library/jest-dom/vitest";

``

# END FILE: tests/setup.ts

---

# FILE: tests/synthetic-contract.test.ts

``typescript
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const raw = readFileSync("src/data/synthetic/semester-2026-2.json", "utf8");
const data = JSON.parse(raw) as { synthetic: boolean; families: unknown[] };

describe("contrato dos dados de demonstração", () => {
  it("declara explicitamente que os dados são sintéticos", () => {
    expect(data.synthetic).toBe(true);
  });

  it("contém as duas famílias da simulação", () => {
    expect(data.families).toHaveLength(2);
  });
});

``

# END FILE: tests/synthetic-contract.test.ts

---

# FILE: tsconfig.json

``json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": [
      "dom",
      "dom.iterable",
      "es2022"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

``

# END FILE: tsconfig.json

---

# FILE: vitest.config.ts

``typescript
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});

``

# END FILE: vitest.config.ts

---

