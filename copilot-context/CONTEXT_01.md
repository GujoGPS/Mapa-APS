# Mapa APS: pacote de contexto 1

Este pacote contem arquivos integrais do projeto.

Cada arquivo comeca com:

# FILE: caminho/original

e termina com:

# END FILE: caminho/original

Nao interprete a ausencia de um arquivo neste pacote como ausencia no projeto. Outros arquivos podem estar nos demais pacotes.

---

# FILE: .github/pull_request_template.md

``markdown
## Objetivo

## Impacto em dados e migrações

## Impacto clínico ou farmacológico

## Impacto em privacidade

## Testes executados

- [ ] lint
- [ ] typecheck
- [ ] testes
- [ ] build
- [ ] documentação

## Evidências

``

# END FILE: .github/pull_request_template.md

---

# FILE: .github/workflows/ci.yml

``yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm install
      - run: npm run verify
      - run: npm run build

``

# END FILE: .github/workflows/ci.yml

---

# FILE: .vscode/extensions.json

``json
{"recommendations":["dbaeumer.vscode-eslint","esbenp.prettier-vscode","ms-vscode.vscode-typescript-next"]}

``

# END FILE: .vscode/extensions.json

---

# FILE: .vscode/tasks.json

``json
{"version":"2.0.0","tasks":[{"label":"Mapa: instalar","type":"shell","command":"npm install","problemMatcher":[]},{"label":"Mapa: desenvolvimento","type":"shell","command":"npm run dev","isBackground":true,"problemMatcher":[]},{"label":"Mapa: build Next.js","type":"shell","command":"npm run build","problemMatcher":[]},{"label":"Mapa: servir build estático","type":"shell","command":"python -m http.server 4173 -d dist-production","isBackground":true,"problemMatcher":[]}]}

``

# END FILE: .vscode/tasks.json

---

# FILE: app/client-bootstrap.tsx

``tsx
"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/src/pwa/register";

export function ClientBootstrap() {
  useEffect(() => { void registerServiceWorker(); }, []);
  return null;
}

``

# END FILE: app/client-bootstrap.tsx

---

# FILE: app/clinical-library.tsx

``tsx
"use client";
import {useMemo,useState} from "react";
import {conditions,examKnowledge} from "@/src/clinical/content";
import {pharmacologyCatalog} from "@/src/clinical/pharmacology/catalog";
import {publishablePharmacologyEntries} from "@/src/clinical/pharmacology/validation";
import {sourceById,clinicalSources} from "@/src/clinical/sources";
import {validateClinicalLibrary} from "@/src/clinical/validation";
import type {ClinicalCondition} from "@/src/clinical/types";

type View="conditions"|"medications"|"exams"|"sources";
export function ClinicalLibrary(){const[view,setView]=useState<View>("conditions");const[query,setQuery]=useState("");const[selected,setSelected]=useState<ClinicalCondition>();const validation=useMemo(()=>validateClinicalLibrary(),[]);const q=query.toLowerCase();const filtered=conditions.filter((c)=>[c.name,c.shortName,...c.synonyms,c.summary].join(" ").toLowerCase().includes(q));return <section className="clinical-library"><header className="clinical-header"><div><p className="eyebrow">Biblioteca clínica piloto</p><h1>Clínica</h1></div><span className={validation.valid?"clinical-status ok":"clinical-status error"}>{validation.valid?"Estrutura válida":"Revisar estrutura"}</span></header><label className="clinical-search"><span>Buscar</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Condição, exame ou medicamento"/></label><nav className="clinical-tabs">{(["conditions","medications","exams","sources"] as View[]).map((item)=><button className={view===item?"active":""} onClick={()=>{setView(item);setSelected(undefined)}} key={item}>{item==="conditions"?"Condições":item==="medications"?"Medicamentos":item==="exams"?"Exames":"Fontes"}</button>)}</nav>
{view==="conditions"&&!selected&&<div className="clinical-grid">{filtered.map((condition)=><button className="clinical-card" onClick={()=>setSelected(condition)} key={condition.id}><span>{condition.publicationLevel}</span><h2>{condition.shortName}</h2><p>{condition.summary}</p><small>{condition.sourceIds.length} fonte(s)</small></button>)}</div>}
{view==="conditions"&&selected&&<ConditionDetail condition={selected} onBack={()=>setSelected(undefined)}/>} 
{view==="medications"&&<div className="clinical-grid">{publishablePharmacologyEntries(pharmacologyCatalog).filter((m)=>[m.genericName,m.therapeuticClass,...(m.brandNames??[])].join(" ").toLowerCase().includes(q)).map((m)=><article className="clinical-card static" key={m.id}><span>{m.reviewStatus}</span><h2>{m.genericName}</h2><strong>{m.therapeuticClass}</strong>{m.mechanism&&<p>{m.mechanism}</p>}<h3>Apresentações</h3><ul>{m.presentations.map((x)=><li key={x}>{x}</li>)}</ul>{m.doseProfiles.map((d,i)=><section className="claim" key={`${m.id}-${i}`}><h3>{d.indication} · {d.population}</h3><p><b>Via:</b> {d.route} · <b>Apresentação:</b> {d.presentation}</p>{d.initial&&<p><b>Início:</b> {d.initial}</p>}{d.titration&&<p><b>Titulação:</b> {d.titration}</p>}{d.usual&&<p><b>Usual:</b> {d.usual}</p>}{d.interval&&<p><b>Intervalo:</b> {d.interval}</p>}{d.target&&<p><b>Alvo:</b> {d.target}</p>}{d.maximum&&<p><b>Máxima:</b> {d.maximum}</p>}{d.renalAdjustment&&<p><b>Ajuste renal:</b> {d.renalAdjustment}</p>}{d.hepaticAdjustment&&<p><b>Ajuste hepático:</b> {d.hepaticAdjustment}</p>}{d.notes&&<p>{d.notes}</p>}</section>)}<h3>Monitoramento</h3><ul>{m.monitoring.map((x)=><li key={x}>{x}</li>)}</ul><div className="source-links">{m.sources.map((source,i)=>source.url?<a key={`${m.id}-source-${i}`} href={source.url} target="_blank" rel="noreferrer">{source.organization}: {source.title}</a>:<span key={`${m.id}-source-${i}`}>{source.organization}: {source.title}</span>)}</div></article>)}{publishablePharmacologyEntries(pharmacologyCatalog).length===0&&<article className="clinical-card static"><span>Caderno autoral</span><h2>Catálogo farmacológico vazio</h2><p>Adicione tuas fichas em <code>src/clinical/pharmacology/catalog.ts</code>.</p><small>Use o molde em <code>src/clinical/pharmacology/example.ts</code>.</small></article>}</div>}
{view==="exams"&&<div className="clinical-grid">{examKnowledge.filter((e)=>[e.name,e.purpose].join(" ").toLowerCase().includes(q)).map((e)=><article className="clinical-card static" key={e.id}><span>{e.publicationLevel}</span><h2>{e.name}</h2><p>{e.purpose}</p><h3>Travas interpretativas</h3><ul>{e.interpretationGuardrails.map((x)=><li key={x}>{x}</li>)}</ul><SourceLinks ids={e.sourceIds}/></article>)}</div>}
{view==="sources"&&<div className="source-list">{clinicalSources.map((source)=><article key={source.id}><div><span>{source.kind} · {source.status}</span><h2>{source.title}</h2><p>{source.organization} · {source.publishedAt}{source.updatedAt?` · atualizado ${source.updatedAt}`:""}</p>{source.notes&&<p className="safety-callout">{source.notes}</p>}</div><a href={source.url} target="_blank" rel="noreferrer">Abrir fonte</a></article>)}</div>}
<footer className="clinical-footer"><strong>Caderno farmacológico:</strong> a interface mostra as fichas do catálogo que passam pela validação; o molde de exemplo não é carregado no aplicativo.</footer></section>}
function ConditionDetail({condition,onBack}:{condition:ClinicalCondition;onBack:()=>void}){return <article className="condition-detail"><button className="back-button" onClick={onBack}>← Voltar</button><span className="clinical-status">{condition.publicationLevel}</span><h1>{condition.name}</h1><p>{condition.summary}</p><p className="shared-callout">Para a pessoa: {condition.sharedSummary}</p><p className="scope-callout">Escopo: {condition.scope}</p>{Object.entries(condition.sections).map(([key,claims])=><section key={key}><h2>{sectionLabel(key)}</h2>{claims.map((claim)=><article className="claim" key={claim.id}><p>{claim.text}</p>{claim.sharedText&&<p className="shared-callout">{claim.sharedText}</p>}<div><span>{claim.level}</span><span>revisado {claim.reviewedAt}</span><span>revisar até {claim.reviewDueAt}</span></div><SourceLinks ids={claim.sourceIds}/></article>)}</section>)}<SourceLinks ids={condition.sourceIds}/></article>}
function SourceLinks({ids}:{ids:string[]}){return <div className="source-links">{ids.map((id)=>{const s=sourceById(id);return s?<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.organization}: {s.title}</a>:<span key={id}>Fonte ausente: {id}</span>})}</div>}
function sectionLabel(key:string){return ({quick:"Visão rápida",diagnosis:"Diagnóstico",assessment:"Avaliação inicial",monitoring:"Monitoramento",nonDrug:"Manejo não farmacológico",medication:"Farmacologia",referral:"Encaminhamento"} as Record<string,string>)[key]??key}

``

# END FILE: app/clinical-library.tsx

---

# FILE: app/demo-mode-panel.tsx

``tsx
"use client";

import { useState } from "react";
import type { Family } from "@/src/contracts/family";
import { isSyntheticDemoFamily } from "@/src/contracts/demo";
import { enterDemoMode, exitDemoMode, removeDemoData } from "@/src/domain/demo-mode";

interface Props {
  active: boolean;
  families: Family[];
  onChanged: () => Promise<void>;
}

type Confirmation = "enter" | "remove" | null;

export function DemoModePanel({ active, families, onChanged }: Props) {
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const syntheticFamilyCount = families.filter(isSyntheticDemoFamily).length;

  async function enter() {
    setBusy(true);
    try {
      await enterDemoMode();
      await onChanged();
      setMessage("Demonstração ativa. Os dados normais estão isolados e podem ser restaurados ao sair.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível entrar na demonstração.");
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  }

  async function exit() {
    setBusy(true);
    try {
      await exitDemoMode();
      await onChanged();
      setMessage("Modo demonstração encerrado; estado anterior restaurado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível restaurar o estado anterior.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const count = await removeDemoData();
      await onChanged();
      setMessage(count ? `${count} registro(s) sintético(s) removido(s). Os dados normais foram preservados.` : "Nenhum registro sintético identificado para remoção.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível remover os dados sintéticos.");
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  }

  return (
    <section className="card" aria-labelledby="demo-mode-title">
      <p className="eyebrow">Ambiente local separado</p>
      <h2 id="demo-mode-title">Modo demonstração</h2>
      {active ? (
        <>
          <p className="safety-callout" role="status"><strong>Ativo · somente dados sintéticos.</strong> Os registros normais estão ocultos e guardados em um snapshot local.</p>
          <div className="action-row">
            <button type="button" disabled={busy} onClick={() => void exit()}>Sair e restaurar estado anterior</button>
            <button type="button" className="secondary" disabled={busy} onClick={() => setConfirmation("remove")}>Remover dados de demonstração</button>
          </div>
          <p className="fine-print">Remover apaga somente os registros desta demonstração e mantém o snapshot; sair restaura os dados anteriores.</p>
        </>
      ) : (
        <>
          <p>Entrar guarda os registros normais em um snapshot, remove do espaço ativo as sementes sintéticas antigas e abre um conjunto demonstrativo separado. Nenhum registro normal é apagado.</p>
          {syntheticFamilyCount > 0 && <p className="shared-callout">Há {syntheticFamilyCount} família(s) sintética(s) legada(s) no armazenamento atual; elas serão retiradas do espaço normal ao iniciar.</p>}
          <div className="action-row">
            <button type="button" disabled={busy} onClick={() => setConfirmation("enter")}>Entrar no modo demonstração</button>
            <button type="button" className="secondary" disabled={busy || syntheticFamilyCount === 0} onClick={() => setConfirmation("remove")}>Remover demonstração antiga</button>
          </div>
        </>
      )}
      <p className="system-message" role="status" aria-live="polite">{message}</p>
      {confirmation && (
        <div className="sheet-backdrop" role="presentation">
          <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="demo-confirm-title">
            <p className="eyebrow">Confirmação</p>
            <h3 id="demo-confirm-title">{confirmation === "enter" ? "Entrar na demonstração isolada?" : "Remover registros sintéticos?"}</h3>
            {confirmation === "enter" ? (
              <p>O aplicativo guardará os registros normais e mostrará apenas famílias sintéticas. Alterações feitas durante a demonstração continuarão marcadas como sintéticas. Ao sair, o estado anterior será restaurado.</p>
            ) : (
              <p>{active ? "Esta ação apaga somente os registros sintéticos da sessão atual. A demonstração permanece ativa; use “Sair e restaurar estado anterior” para voltar aos dados normais." : "Esta ação remove somente registros identificados como parte da demonstração antiga. Famílias normais e seus dados não serão alterados."}</p>
            )}
            <div className="action-row">
              <button type="button" disabled={busy} onClick={() => void (confirmation === "enter" ? enter() : remove())}>{confirmation === "enter" ? "Confirmar entrada" : "Confirmar remoção"}</button>
              <button type="button" className="secondary" disabled={busy} onClick={() => setConfirmation(null)}>Cancelar</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

``

# END FILE: app/demo-mode-panel.tsx

---

# FILE: app/family-assessments.tsx

``tsx
"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import {
  adultDcntEsfDefinition, archiveApplication, completeApplication, createAnswer, createApplication,
  createRectification, deriveApplicationResults, returnApplicationToDraft, submitForReview,
  updateDraftApplication, type ApplicabilityOverride, type InstrumentAnswer, type InstrumentApplication,
  type QuestionDefinition, type SectionDefinition, validateApplicationAnswers,
} from "@/src/clinical/assessments";
import { peopleInFamily } from "@/src/domain/selectors";

interface Props { family: Family; people: Person[]; memberships: FamilyMembership[]; applications: InstrumentApplication[]; demoActive: boolean; onSaved: () => Promise<void>; }
const statusLabels: Record<InstrumentApplication["status"], string> = { "not-started": "Não iniciada", draft: "Rascunho", "in-review": "Em revisão", completed: "Concluída", rectified: "Retificada", archived: "Arquivada" };
const waistLabels = { "male-local-rule": "Critério local masculino", "female-local-rule": "Critério local feminino", "not-selected": "Critério não selecionado" };
const waistClassificationLabels = { low: "baixo", increased: "aumentado", "very-increased": "muito aumentado" };
const answerTypeLabels: Record<string, string> = { "short-text": "texto curto", "long-text": "texto longo", date: "data", number: "número", "single-choice": "escolha única", "multiple-choice": "múltipla escolha", "yes-no": "sim/não", "yes-no-never-did-does-not-remember": "rastreamento", measurement: "medida", "blood-pressure": "pressão arterial", "laboratory-result": "resultado laboratorial", "laterality-group": "lateralidade", "clinical-code": "código clínico", service: "serviço", "calculated-information": "informação calculada", "manual-classification": "classificação manual", "future-entity-link": "vínculo futuro" };

function questionApplicable(application: InstrumentApplication, question: QuestionDefinition): boolean {
  if (!question.applicability) return true;
  const override = application.applicabilityOverrides[question.id];
  if (override) return override.state === "applicable";
  if (question.applicability.condition.includes("contains")) {
    const dependency = application.answers[question.applicability.dependencies[0] ?? ""];
    const values = dependency?.answerType === "multiple-choice" ? dependency.value : dependency?.answerType === "single-choice" ? [dependency.value] : [];
    if (question.applicability.condition.includes("other")) return values.includes("other");
    if (question.applicability.condition.includes("hypertension")) return values.includes("hypertension");
    return values.length > 0;
  }

  return false;
}

function automaticApplicabilityState(application: InstrumentApplication, question: QuestionDefinition): "applicable" | "not-applicable" | "not-assessed" {
  if (!question.applicability) return "applicable";
  if (question.applicability.condition.includes("contains")) return questionApplicable({ ...application, applicabilityOverrides: {} }, question) ? "applicable" : "not-applicable";
  return "not-assessed";
}

export function assessmentRendererFor(answerType: QuestionDefinition["answerType"]): string {
  if (answerType === "short-text") return "short-text";
  if (answerType === "long-text") return "long-text";
  if (answerType === "date") return "date";
  if (answerType === "number") return "number";
  if (answerType === "measurement") return "measurement";
  if (answerType === "laboratory-result") return "laboratory-result";
  if (answerType === "blood-pressure") return "blood-pressure";
  if (answerType === "multiple-choice") return "multiple-choice";
  if (["single-choice", "yes-no", "yes-no-never-did-does-not-remember", "laterality-group", "manual-classification", "service"].includes(answerType)) return "choice";
  if (answerType === "clinical-code") return "clinical-code";
  if (answerType === "future-entity-link") return "future-entity-link";
  if (answerType === "calculated-information") return "calculated-information";
  return "unknown";
}

function answerText(answer?: InstrumentAnswer): string {
  if (!answer) return "Não informado";
  if (answer.applicabilityState === "not-applicable") return "Não aplicável (valor anterior preservado)";
  if (Array.isArray(answer.value)) return answer.value.join(", ");
  if (typeof answer.value === "object") return "Resposta estruturada";
  return String(answer.value);
}

function statusForSection(section: SectionDefinition, application: InstrumentApplication, validation: ReturnType<typeof validateApplicationAnswers>) {
  if (section.status === "source-missing") return "source-missing";
  if (!section.implementable) return "not-applicable";
  const questions = section.questions.filter((question) => question.answerType !== "calculated-information");
  const applicable = questions.filter((question) => questionApplicable(application, question));
  const answered = applicable.filter((question) => Boolean(application.answers[question.id]));
  if (!answered.length) return "not-started";
  if (validation.errors.some((error) => section.questions.some((question) => error.startsWith(`${question.id}:`)))) return "needs-review";
  if (answered.length === applicable.length) return "structurally-complete";
  return "in-progress";
}

function statusLabel(status: string) { return ({ "not-started": "Não iniciado", "in-progress": "Em andamento", "structurally-complete": "Estruturalmente completo", "needs-review": "Requer revisão", "not-applicable": "Não aplicável", "source-missing": "Fonte ausente" } as Record<string, string>)[status] ?? status; }

function firstBlockingQuestion(application: InstrumentApplication, validation: ReturnType<typeof validateApplicationAnswers>): QuestionDefinition | undefined {
  return adultDcntEsfDefinition.questions.find((question) => validation.errors.some((error) => error.startsWith(`${question.id}:`)) || validation.missing?.some((missing) => missing.startsWith(question.id)) || (question.required && !application.answers[question.id] && questionApplicable(application, question)));
}

export function FamilyAssessmentsPanel({ family, people, memberships, applications, demoActive, onSaved }: Props) {
  const familyPeople = useMemo(() => peopleInFamily(people, memberships, family.id), [people, memberships, family.id]);
  const [personId, setPersonId] = useState(""); const [activeApplicationId, setActiveApplicationId] = useState<string>();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [editorControls, setEditorControls] = useState<{ state: "saved" | "dirty" | "saving" | "save-error"; save: () => Promise<boolean>; discard: () => void }>({ state: "saved", save: async () => true, discard: () => undefined });
  const personApplications = applications.filter((item) => item.familyId === family.id && item.personId === personId);
  const selectedPerson = familyPeople.find((person) => person.id === personId);
  useEffect(() => setActiveApplicationId(undefined), [personId]);
  function guarded(action: () => void) {
    if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => action);
    else action();
  }
  async function start(kind: "initial" | "reassessment" = "initial") { if (!personId) return; const action = async () => { const item = await createApplication({ familyId: family.id, personId, assessmentDate: new Date().toISOString().slice(0, 10), kind }); await onSaved(); setActiveApplicationId(item.applicationId); }; if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => { void action(); }); else await action(); }
  async function rectify(item: InstrumentApplication) { const action = async () => { const next = await createRectification(item.applicationId); await onSaved(); setActiveApplicationId(next.applicationId); }; if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => { void action(); }); else await action(); }
  return <section className="assessments-panel" aria-labelledby={`assessments-${family.id}`}>
    <div className="section-head"><div><p className="eyebrow">Família · Avaliações</p><h2 id={`assessments-${family.id}`}>Avaliações</h2></div><span className="clinical-status">Pessoa é o sujeito clínico</span></div>
    <p className="fine-print">A visão familiar mostra somente status e datas. Respostas aparecem após seleção explícita de uma pessoa.</p>
    <div className="assessment-member-list">{familyPeople.map((person) => { const items = applications.filter((item) => item.familyId === family.id && item.personId === person.id); const latest = [...items].sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate))[0]; return <button className={person.id === personId ? "assessment-member selected" : "assessment-member"} key={person.id} onClick={() => guarded(() => setPersonId(person.id))}><strong>{person.displayName || person.code}</strong><span>{latest ? `${statusLabels[latest.status]} · ${latest.assessmentDate}` : "Avaliação não iniciada"}</span><small>{items.length} aplicação(ões)</small></button>; })}</div>
    {selectedPerson && <div className="assessment-person-area" key={selectedPerson.id}>
      <div className="assessment-person-header"><div><p className="eyebrow">Pessoa selecionada</p><h3>{selectedPerson.displayName || selectedPerson.code}</h3><small>Família {family.code} · {adultDcntEsfDefinition.version}</small></div><div className="action-row"><button onClick={() => void start()}>Nova aplicação</button><button onClick={() => void start("reassessment")}>Nova longitudinal</button></div></div>
      <div className="assessment-history">{personApplications.length ? personApplications.map((item) => <AssessmentHistoryCard key={item.applicationId} application={item} onOpen={() => guarded(() => setActiveApplicationId(item.applicationId))} onRectify={() => void rectify(item)} />) : <p className="fine-print">Nenhuma aplicação para esta pessoa.</p>}</div>
      {applications.find((item) => item.applicationId === activeApplicationId) && <AssessmentEditor key={activeApplicationId} application={applications.find((item) => item.applicationId === activeApplicationId)!} onSaved={onSaved} onClose={() => guarded(() => setActiveApplicationId(undefined))} onRequestAction={(action) => guarded(() => { void action(); })} onEditStateChange={setEditorControls} demoActive={demoActive} />}
    </div>}
    {pendingAction && <div className="assessment-confirm" role="dialog" aria-modal="true" aria-labelledby="unsaved-title"><h4 id="unsaved-title">Há alterações não salvas</h4><p>Escolha como continuar sem descartar dados silenciosamente.</p><div className="action-row"><button onClick={() => { const action = pendingAction; void editorControls.save().then((ok) => { if (ok) { setPendingAction(null); action(); } }); }}>Salvar e continuar</button><button onClick={() => setPendingAction(null)}>Continuar editando</button><button onClick={() => { editorControls.discard(); const action = pendingAction; setPendingAction(null); action(); }}>Descartar alterações locais</button></div></div>}
  </section>;
}

function AssessmentHistoryCard({ application, onOpen, onRectify }: { application: InstrumentApplication; onOpen: () => void; onRectify: () => void }) {
  return <article className="assessment-history-card"><div><strong>{statusLabels[application.status]}</strong><span>{application.assessmentDate} · revisão {application.revisionNumber}</span>{application.rectifiesApplicationId && <small>Retifica {application.rectifiesApplicationId}</small>}</div><div className="action-row"><button onClick={onOpen}>{application.status === "draft" ? "Continuar" : "Visualizar"}</button>{(application.status === "completed" || application.status === "rectified") && <button onClick={onRectify}>Iniciar retificação</button>}</div></article>;
}

function AssessmentEditor({ application: initial, onSaved, onClose, onRequestAction, onEditStateChange, demoActive }: { application: InstrumentApplication; onSaved: () => Promise<void>; onClose: () => void; onRequestAction: (action: () => Promise<void>) => void; onEditStateChange: (controls: { state: "saved" | "dirty" | "saving" | "save-error"; save: () => Promise<boolean>; discard: () => void }) => void; demoActive: boolean }) {
  const [application, setApplication] = useState(initial); const [sectionId, setSectionId] = useState(adultDcntEsfDefinition.sections[0]?.id ?? ""); const [editState, setEditState] = useState<"saved" | "dirty" | "saving" | "save-error">("saved"); const [message, setMessage] = useState(""); const [lastSaved, setLastSaved] = useState(initial.updatedAt); const firstError = useRef<HTMLDivElement>(null); const fieldRefs = useRef(new Map<string, HTMLElement>());
  useEffect(() => { setApplication(initial); setEditState("saved"); setLastSaved(initial.updatedAt); }, [initial]);
  useEffect(() => { onEditStateChange({ state: editState, save, discard: () => { setApplication(initial); setEditState("saved"); } }); }, [editState, initial, onEditStateChange]);
  useEffect(() => { const handler = (event: BeforeUnloadEvent) => { if (editState === "dirty" || editState === "save-error") { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", handler); return () => window.removeEventListener("beforeunload", handler); }, [editState]);
  const validation = validateApplicationAnswers(application, adultDcntEsfDefinition, "draft"); const structural = validateApplicationAnswers(application, adultDcntEsfDefinition, "complete"); const results = deriveApplicationResults(application); const section = adultDcntEsfDefinition.sections.find((item) => item.id === sectionId) ?? adultDcntEsfDefinition.sections[0]; const editable = application.status === "draft" || application.status === "in-review";
  const sectionProgress = adultDcntEsfDefinition.sections.map((item) => ({ section: item, status: statusForSection(item, application, structural) }));
  function markChanged(next: InstrumentApplication) { setApplication(next); setEditState("dirty"); }
  function updateApplicability(next: InstrumentApplication): InstrumentApplication {
    const answers = { ...next.answers };
    for (const question of adultDcntEsfDefinition.questions) if (question.applicability && answers[question.id]) {
      const applicable = questionApplicable(next, question); const current = answers[question.id]!;
      answers[question.id] = { ...current, applicabilityState: next.applicabilityOverrides[question.id] ? "manually-overridden" : applicable ? "applicable" : "not-applicable" };
    }
    return { ...next, answers };
  }
  function setAnswer(question: QuestionDefinition, value: string | string[] | number) {
    const previous = application.answers[question.id]; let answer: InstrumentAnswer;
    if (question.answerType === "multiple-choice") answer = createAnswer({ questionId: question.id, answerType: question.answerType, value: Array.isArray(value) ? value : [], applicabilityState: "applicable" } as InstrumentAnswer);
    else if (["number", "measurement", "laboratory-result"].includes(question.answerType)) answer = createAnswer({ questionId: question.id, answerType: question.answerType, value: Number(value), ...(question.unit ? { unit: question.unit } : {}), applicabilityState: "applicable" } as InstrumentAnswer);
    else if (question.answerType === "blood-pressure") {
      const old = previous?.answerType === "blood-pressure" ? previous.value : {}; const numeric = Number(value);
      const field = question.id.endsWith(".systolic") ? "systolic" : "diastolic";
      answer = createAnswer({ questionId: question.id, answerType: "blood-pressure", value: { ...old, [field]: numeric }, unit: "mmHg", applicabilityState: "applicable" } as InstrumentAnswer);
    } else answer = createAnswer({ questionId: question.id, answerType: question.answerType, value: String(value), applicabilityState: "applicable" } as InstrumentAnswer);
    markChanged(updateApplicability({ ...application, answers: { ...application.answers, [question.id]: answer }, updatedAt: new Date().toISOString() }));
  }
  function setWaistCriterion(value: InstrumentApplication["waistCriterion"]) { markChanged({ ...application, waistCriterion: value, updatedAt: new Date().toISOString() }); }
  function setApplicabilityOverride(question: QuestionDefinition, state: ApplicabilityOverride["state"] | undefined, justification: string) {
    const overrides = { ...application.applicabilityOverrides };
    if (!state) delete overrides[question.id];
    else overrides[question.id] = { questionId: question.id, state, justification, source: "person", updatedAt: new Date().toISOString() };
    const current = application.answers[question.id];
    const answers = current ? { ...application.answers, [question.id]: { ...current, applicabilityState: (state ? "manually-overridden" : automaticApplicabilityState(application, question)) as InstrumentAnswer["applicabilityState"] } } : application.answers;
    markChanged({ ...application, applicabilityOverrides: overrides, answers, updatedAt: new Date().toISOString() });
  }
  async function save(): Promise<boolean> { setEditState("saving"); try { const saved = await updateDraftApplication(application.applicationId, { answers: application.answers, applicabilityOverrides: application.applicabilityOverrides, ...(application.privateNotes === undefined ? {} : { privateNotes: application.privateNotes }), ...(application.waistCriterion === undefined ? {} : { waistCriterion: application.waistCriterion }) }); setApplication(saved); setEditState("saved"); setLastSaved(saved.updatedAt); setMessage("Salvo."); await onSaved(); return true; } catch (error) { setEditState("save-error"); setMessage(error instanceof Error ? error.message : "Erro ao salvar."); return false; } }
  function discard() { setApplication(initial); setEditState("saved"); setMessage("Alterações locais descartadas."); }
  async function review() { await save(); const next = await submitForReview(application.applicationId); setApplication(next); await onSaved(); }
  async function complete() { if (!structural.valid) { const first = firstBlockingQuestion(application, structural); if (first) { setSectionId(first.sectionId); window.setTimeout(() => fieldRefs.current.get(first.id)?.focus(), 0); } firstError.current?.focus(); setMessage(`Há ${structural.errors.length + (structural.missing?.length ?? 0)} pendência(s) impeditiva(s).`); return; } const next = await completeApplication(application.applicationId); setApplication(next); await onSaved(); setMessage("Aplicação concluída e preservada como registro imutável."); }
  const close = () => { if (editState === "dirty" || editState === "save-error") onClose(); else onClose(); };
  return <section className="assessment-editor" aria-labelledby={`assessment-editor-${application.applicationId}`}>
    <div className="assessment-editor-header"><div><p className="eyebrow">Pessoa {application.personId}</p><h3 id={`assessment-editor-${application.applicationId}`}>{adultDcntEsfDefinition.title}</h3><small>{adultDcntEsfDefinition.version} · {statusLabels[application.status]} · {application.assessmentDate}</small></div><button onClick={close}>Fechar ficha</button></div>
    {demoActive && <p className="scope-callout">Aplicação demonstrativa: desaparece ao sair da demonstração e não entra no backup normal.</p>}
    <div className="assessment-save-status" role="status" aria-live="polite">{editState === "dirty" ? "Alterações não salvas" : editState === "saving" ? "Salvando…" : editState === "save-error" ? `Erro ao salvar: ${message}` : `Salvo em ${new Date(lastSaved).toLocaleString("pt-BR")}`}</div>
    <div className="assessment-progress"><strong>Conclusão dos campos disponíveis nesta versão</strong><span>{sectionProgress.filter((item) => !["source-missing", "not-applicable"].includes(item.status)).filter((item) => item.status === "structurally-complete").length}/{sectionProgress.filter((item) => item.status !== "source-missing").length} blocos incorporados</span><div className="assessment-section-statuses">{sectionProgress.map(({ section: item, status }) => <span key={item.id} data-status={status}>{item.printedBlockNumber ? `Bloco ${item.printedBlockNumber}` : "Cabeçalho"}: {statusLabel(status)}</span>)}</div></div>
    <div className="assessment-section-tabs" role="tablist">{adultDcntEsfDefinition.sections.map((item) => <button role="tab" aria-selected={item.id === section?.id} key={item.id} className={item.id === section?.id ? "active" : ""} onClick={() => setSectionId(item.id)}>{item.printedBlockNumber ? `Bloco ${item.printedBlockNumber}` : "Cabeçalho"} · {item.title}</button>)}</div>
    {section && <AssessmentSection section={section} application={application} editable={editable} onAnswer={setAnswer} onWaistCriterion={setWaistCriterion} onApplicabilityOverride={setApplicabilityOverride} results={results} firstError={firstError} firstBlocking={firstBlockingQuestion(application, structural)} registerField={(id, element) => { if (element) fieldRefs.current.set(id, element); else fieldRefs.current.delete(id); }} />}
    <StructuralReview application={application} results={results} validation={structural} />
    <div className="action-row"><button disabled={!editable || editState !== "dirty"} onClick={() => void save()}>Salvar rascunho</button>{application.status === "draft" && <><button disabled={!editable} onClick={() => void review()}>Enviar para revisão</button><button onClick={() => onRequestAction(async () => { await archiveApplication(application.applicationId); await onSaved(); })}>Arquivar</button></>}{application.status === "in-review" && <><button onClick={() => onRequestAction(async () => { await returnApplicationToDraft(application.applicationId); await onSaved(); })}>Devolver para rascunho</button><button onClick={() => void complete()}>Concluir</button><button onClick={() => onRequestAction(async () => { await archiveApplication(application.applicationId); await onSaved(); })}>Arquivar</button></>}{(application.status === "completed" || application.status === "rectified") && <button onClick={() => onRequestAction(async () => { await archiveApplication(application.applicationId); await onSaved(); })}>Arquivar</button>}</div>
    {message && <p ref={firstError} tabIndex={-1} className="fine-print">{message}</p>}
  </section>;
}

function AssessmentSection({ section, application, editable, onAnswer, onWaistCriterion, onApplicabilityOverride, results, firstError, firstBlocking, registerField }: { section: SectionDefinition; application: InstrumentApplication; editable: boolean; onAnswer: (question: QuestionDefinition, value: string | string[] | number) => void; onWaistCriterion: (value: InstrumentApplication["waistCriterion"]) => void; onApplicabilityOverride: (question: QuestionDefinition, state: ApplicabilityOverride["state"] | undefined, justification: string) => void; results: ReturnType<typeof deriveApplicationResults>; firstError: RefObject<HTMLDivElement | null>; firstBlocking: QuestionDefinition | undefined; registerField: (id: string, element: HTMLElement | null) => void }) {
  if (section.status === "source-missing") return <section className="assessment-missing-source"><h4>{section.title}</h4><p>Fonte ainda não disponível. Este bloco não entra no progresso preenchível e não bloqueia a conclusão dos campos disponíveis.</p></section>;
  if (section.status === "title-only-in-source") return <section className="assessment-missing-source"><h4>{section.title}</h4><p>A fonte disponível contém apenas o título. Capacidades futuras, sem campos clínicos:</p><ul>{section.declarativeCapabilities?.map((item) => <li key={item}>{item.replaceAll("-", " ")}</li>)}</ul></section>;
  return <section className="assessment-question-list"><h4>{section.title}</h4>{section.questions.map((question) => {
    const answer = application.answers[question.id]; const applicable = questionApplicable(application, question); const result = results.find((item) => item.questionId === question.id);
    if (question.id === "physical.waist-classification") return <CalculatedField key={question.id} label={question.printedLabel} value={result ? waistClassificationLabels[result.value as keyof typeof waistClassificationLabels] : "Não calculada: selecione um critério local."} />;
    if (question.answerType === "calculated-information") return <CalculatedField key={question.id} label={question.printedLabel} value={formatResult(question.id, result)} />;
    if (question.applicability) return <div key={question.id}><div className="assessment-not-applicable"><strong>{question.printedLabel}</strong><span>Regra: {question.applicability.condition}</span><span>Estado: {application.applicabilityOverrides[question.id] ? (application.applicabilityOverrides[question.id]?.state === "applicable" ? "Aplicável por override manual" : "Não aplicável por override manual") : applicable ? "Aplicável pela regra" : question.applicability.whenNotApplicable === "manual-review" ? "Precisa de revisão" : "Não aplicável pela regra"}</span>{answer && !applicable && <span>Valor anterior preservado e inativo.</span>}</div>{question.applicability.manualReviewAllowed && editable && <ApplicabilityControl question={question} application={application} onChange={onApplicabilityOverride} />}{applicable && <QuestionField question={question} {...(answer ? { answer } : {})} editable={editable} onAnswer={onAnswer} invalid={firstBlocking?.id === question.id} registerField={registerField} />}</div>;
      if (question.id === "physical.waist-circumference") return <div key={question.id}><QuestionField question={question} {...(answer ? { answer } : {})} editable={editable} onAnswer={onAnswer} /><label className="assessment-field">Critério local aplicado<select value={application.waistCriterion ?? "not-selected"} disabled={!editable} onChange={(event) => onWaistCriterion(event.target.value as InstrumentApplication["waistCriterion"])}><option value="not-selected">Não selecionado</option><option value="male-local-rule">Masculino local</option><option value="female-local-rule">Feminino local</option></select></label></div>;
      return <QuestionField key={question.id} question={question} {...(answer ? { answer } : {})} editable={editable && applicable} onAnswer={onAnswer} invalid={firstBlocking?.id === question.id} registerField={registerField} />;
  })}</section>;
}

function ApplicabilityControl({ question, application, onChange }: { question: QuestionDefinition; application: InstrumentApplication; onChange: (question: QuestionDefinition, state: ApplicabilityOverride["state"] | undefined, justification: string) => void }) {
  const override = application.applicabilityOverrides[question.id];
  const automatic = automaticApplicabilityState(application, question);
  const [justification, setJustification] = useState(override?.justification ?? "");
  const [selected, setSelected] = useState<ApplicabilityOverride["state"] | "">(override?.state ?? "");
  const commit = (state: ApplicabilityOverride["state"] | "") => { setSelected(state); if (!state) onChange(question, undefined, ""); else if (justification.trim()) onChange(question, state, justification.trim()); };
  return <fieldset className="assessment-applicability"><legend>Revisão manual da aplicabilidade</legend><select value={selected} onChange={(event) => commit(event.target.value as ApplicabilityOverride["state"] | "")}><option value="">Usar regra automática ({automatic === "not-assessed" ? "precisa de revisão" : automatic === "applicable" ? "aplicável" : "não aplicável"})</option><option value="applicable">Aplicável por override manual</option><option value="not-applicable">Não aplicável por override manual</option></select><input value={justification} placeholder="Justificativa breve obrigatória" onChange={(event) => { setJustification(event.target.value); if (selected && event.target.value.trim()) onChange(question, selected, event.target.value.trim()); }} /><small>{selected && !justification.trim() ? "Justificativa breve obrigatória para aplicar a revisão." : "O override não cria elegibilidade clínica; apenas registra revisão manual."}</small></fieldset>;
}

function formatResult(questionId: string, result: ReturnType<typeof deriveApplicationResults>[number] | undefined) {
  if (!result) return "Não calculado: dados necessários ausentes.";
  if (questionId === "sociodemographic.age" && typeof result.value === "object" && result.value) { const value = result.value as { ageYears: number; band?: string }; return `${value.ageYears} anos · faixa ${value.band ?? "fora da população"} (calculada pela data de nascimento e data da avaliação)`; }
  if (questionId === "physical.bmi" && typeof result.value === "object" && result.value) { const value = result.value as { bmi: number; classification: string }; return `${value.bmi.toFixed(2)} kg/m² · classificação: ${value.classification}`; }
  if (questionId === "blood-pressure.mean" && typeof result.value === "object" && result.value) { const value = result.value as { systolicMean: number; diastolicMean: number }; return `${value.systolicMean.toFixed(1)} / ${value.diastolicMean.toFixed(1)} mmHg (média das duas visitas)`; }
  return String(result.value);
}
function CalculatedField({ label, value }: { label: string; value: string }) { return <div className="assessment-calculated"><strong>{label}</strong><span>{value}</span></div>; }

function StructuralReview({ application, results, validation }: { application: InstrumentApplication; results: ReturnType<typeof deriveApplicationResults>; validation: ReturnType<typeof validateApplicationAnswers> }) {
  return <section className="assessment-review" aria-labelledby="structural-review-title"><h4 id="structural-review-title">Revisão estrutural</h4><p>{validation.errors.length} erros · {(validation.warnings ?? []).length} avisos · {(validation.missing ?? []).length} dados ausentes</p>{adultDcntEsfDefinition.sections.map((section) => <details key={section.id}><summary>{section.printedBlockNumber ? `Bloco ${section.printedBlockNumber}` : "Cabeçalho"} · {section.title}</summary>{section.status === "source-missing" ? <p>Fonte ausente.</p> : <ul>{section.questions.map((question) => { const answer = application.answers[question.id]; const result = results.find((item) => item.questionId === question.id); return <li key={question.id}><strong>{question.printedLabel}:</strong> {result ? `calculado · ${formatResult(question.id, result)}` : answer?.applicabilityState === "not-applicable" ? "não aplicável" : answer ? `${answerText(answer)} · ${question.answerType === "manual-classification" ? "manual" : question.answerType}` : "não avaliado"}</li>; })}{section.id === "physical-exam-and-clinical-parameters" && <><li><strong>Critério de cintura:</strong> {waistLabels[application.waistCriterion ?? "not-selected"]}</li><li><strong>PA por visita:</strong> {formatPressureReview(application)}</li></>}</ul>}</details>)}</section>;
}

function formatPressureReview(application: InstrumentApplication): string {
  return [1, 2].map((visit) => {
    const systolic = application.answers[`blood-pressure.visit-${visit}.systolic`]?.value;
    const diastolic = application.answers[`blood-pressure.visit-${visit}.diastolic`]?.value;
    const date = application.answers[`blood-pressure.visit-${visit}.date`]?.value;
    const s = systolic && typeof systolic === "object" && "systolic" in systolic ? systolic.systolic : "—";
    const d = diastolic && typeof diastolic === "object" && "diastolic" in diastolic ? diastolic.diastolic : "—";
    return `Visita ${visit}: ${s}/${d} mmHg · ${typeof date === "string" ? date : "data não informada"}`;
  }).join(" · ");
}

function QuestionField({ question, answer, editable, onAnswer, invalid, registerField }: { question: QuestionDefinition; answer?: InstrumentAnswer; editable: boolean; onAnswer: (question: QuestionDefinition, value: string | string[] | number) => void; invalid?: boolean; registerField?: (id: string, element: HTMLElement | null) => void }) {
  const value = answer?.value; const label = `${question.printedLabel}${question.unit ? ` (${question.unit})` : ""}`; const inputId = `question-${question.id}`; const errorId = `${inputId}-error`;
  if (question.answerType === "multiple-choice") return <fieldset className="assessment-field" aria-invalid={invalid} aria-describedby={errorId}><legend>{label}</legend>{question.options.map((option, index) => <label className="check-row" key={option.id}><input ref={index === 0 ? (element) => registerField?.(question.id, element) : undefined} type="checkbox" checked={Array.isArray(value) && value.includes(option.value)} disabled={!editable} onChange={(event) => { const current = Array.isArray(value) ? value : []; onAnswer(question, event.target.checked ? [...current, option.value] : current.filter((item) => item !== option.value)); }} />{option.label}</label>)}{invalid && <span id={errorId} role="alert">Campo precisa de revisão.</span>}</fieldset>;
  if (["single-choice", "yes-no", "yes-no-never-did-does-not-remember", "laterality-group", "manual-classification", "service"].includes(question.answerType)) return <fieldset className="assessment-field" aria-invalid={invalid} aria-describedby={errorId}><legend>{label}</legend>{question.options.map((option, index) => <label className="radio-row" key={option.id}><input ref={index === 0 ? (element) => registerField?.(question.id, element) : undefined} type="radio" name={question.id} value={option.value} checked={value === option.value} disabled={!editable} onChange={(event) => onAnswer(question, event.target.value)} />{option.label}</label>)}{invalid && <span id={errorId} role="alert">Campo precisa de revisão.</span>}</fieldset>;
  if (question.answerType === "calculated-information") return <CalculatedField label={label} value="Calculado pelo instrumento." />;
  if (question.answerType === "future-entity-link") return <div className="assessment-not-applicable"><strong>{label}</strong><span>Vínculo futuro não está disponível nesta interface; nenhuma resposta foi criada.</span></div>;
  const isBloodPressure = question.answerType === "blood-pressure"; const structured = isBloodPressure && value && typeof value === "object" ? value as { systolic?: number; diastolic?: number } : undefined; const display = isBloodPressure ? (question.id.endsWith(".systolic") ? structured?.systolic : structured?.diastolic) : value;
  if (!["short-text", "long-text", "date", "number", "measurement", "laboratory-result", "clinical-code", "future-entity-link", "blood-pressure"].includes(question.answerType)) return <div role="alert">Renderer não reconhecido para {answerTypeLabels[question.answerType] ?? question.answerType}.</div>;
  if (question.answerType === "long-text") return <label className="assessment-field" htmlFor={inputId}>{label}<textarea id={inputId} aria-describedby={errorId} value={typeof value === "string" ? value : ""} disabled={!editable} onChange={(event) => onAnswer(question, event.target.value)} /></label>;
  return <label className="assessment-field" htmlFor={inputId}>{label}<input ref={(element) => registerField?.(question.id, element)} id={inputId} aria-describedby={errorId} aria-invalid={invalid || answer?.status === "invalid"} min={["number", "measurement", "laboratory-result", "blood-pressure"].includes(question.answerType) ? 0.0001 : undefined} step={["measurement", "blood-pressure"].includes(question.answerType) ? "0.1" : "any"} type={["number", "measurement", "laboratory-result", "blood-pressure"].includes(question.answerType) ? "number" : question.answerType === "date" ? "date" : "text"} value={display === undefined ? "" : String(display)} disabled={!editable} onChange={(event) => onAnswer(question, ["number", "measurement", "laboratory-result", "blood-pressure"].includes(question.answerType) ? Number(event.target.value) : event.target.value)} /> <span id={errorId} role={invalid ? "alert" : undefined}> {invalid ? "Campo precisa de revisão." : `Campo ${question.printedLabel}, tipo ${answerTypeLabels[question.answerType]}`}</span></label>;
}

``

# END FILE: app/family-assessments.tsx

---

# FILE: app/family-relations.tsx

``tsx
"use client";
import {type FormEvent,type RefObject,useMemo,useRef,useState} from "react";
import type {Family,FamilyMembership,Person} from "@/src/contracts/family";
import type {ExternalLink,ExternalResource,InterpersonalRelationship,RelationshipQuality} from "@/src/contracts/relations";
import {buildEcomap,buildGenogram,qualityStyle,relationshipNarrative,type DiagramModel} from "@/src/domain/diagram-engine";
import {diagramPrompt,possibleIdentifiers} from "@/src/domain/diagram-prompt";
import {createExternalLink,createRelationship,createResource} from "@/src/domain/relation-factories";
import {ENTITY_TYPES} from "@/src/domain/entity-types";import {saveEntity} from "@/src/domain/repository";
interface Props{family:Family;people:Person[];memberships:FamilyMembership[];relationships:InterpersonalRelationship[];resources:ExternalResource[];links:ExternalLink[];onSaved:()=>Promise<void>}
type View="genogram"|"ecomap"|"narrative"|"prompt";type Composer="relationship"|"resource"|"external-link"|null;
export function FamilyRelations(p:Props){const[view,setView]=useState<View>("genogram");const[layer,setLayer]=useState<"structural"|"household"|"clinical"|"functional">("structural");const[perspective,setPerspective]=useState("");const[composer,setComposer]=useState<Composer>(null);const[message,setMessage]=useState("");const svgRef=useRef<SVGSVGElement>(null);const model=useMemo(()=>view==="ecomap"?buildEcomap({family:p.family,people:p.people,resources:p.resources,links:p.links,...(perspective?{perspectivePersonId:perspective}:{})}):buildGenogram({family:p.family,people:p.people,memberships:p.memberships,relationships:p.relationships,layer,...(perspective?{perspectivePersonId:perspective}:{})}),[view,layer,perspective,p]);const prompt=diagramPrompt(model);const ids=possibleIdentifiers(prompt);
async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);if(composer==="relationship")await saveEntity(ENTITY_TYPES.interpersonalRelationship,createRelationship({familyId:p.family.id,sourcePersonId:String(f.get("source")),targetPersonId:String(f.get("target")),formalType:String(f.get("formalType")),quality:String(f.get("quality")) as RelationshipQuality,perspectiveLabel:String(f.get("perspectiveLabel")),...(String(f.get("perspectivePersonId"))?{perspectivePersonId:String(f.get("perspectivePersonId"))}:{}),thirdParty:f.get("thirdParty")==="on"}));if(composer==="resource"){const resource=createResource({familyId:p.family.id,name:String(f.get("name")),type:String(f.get("type")) as ExternalResource["type"],state:String(f.get("state")) as ExternalResource["state"]});await saveEntity(ENTITY_TYPES.externalResource,resource)}if(composer==="external-link")await saveEntity(ENTITY_TYPES.externalLink,createExternalLink({familyId:p.family.id,resourceId:String(f.get("resourceId")),...(String(f.get("personId"))?{personId:String(f.get("personId"))}:{}),quality:String(f.get("quality")) as RelationshipQuality,perspectiveLabel:String(f.get("perspectiveLabel")),...(String(f.get("perspectivePersonId"))?{perspectivePersonId:String(f.get("perspectivePersonId"))}:{}),thirdParty:f.get("thirdParty")==="on"}));await p.onSaved();setComposer(null);setMessage("Relação salva com perspectiva e temporalidade.")}
function exportSvg(){const svg=svgRef.current;if(!svg)return;const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:"image/svg+xml"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`mapa-${view}-${p.family.code}.svg`;a.click();URL.revokeObjectURL(url);setMessage("Diagrama SVG exportado.")}
return <section className="relations-panel"><div className="relations-head"><div><p className="eyebrow">Relações</p><h2>Família, vínculos e território</h2></div><button onClick={()=>setComposer(view==="ecomap"?"resource":"relationship")}>Adicionar</button></div><p role="status" className="system-message">{message}</p><div className="relations-tabs">{(["genogram","ecomap","narrative","prompt"] as View[]).map(x=><button className={view===x?"active":""} onClick={()=>setView(x)} key={x}>{x==="genogram"?"Genograma":x==="ecomap"?"Ecomapa":x==="narrative"?"Narrativa":"Prompt IA"}</button>)}</div><div className="diagram-controls"><label>Perspectiva<select value={perspective} onChange={e=>setPerspective(e.target.value)}><option value="">Consolidada</option>{p.people.map(x=><option key={x.id} value={x.id}>{x.displayName||x.code}</option>)}</select></label>{view==="genogram"&&<label>Camada<select value={layer} onChange={e=>setLayer(e.target.value as typeof layer)}><option value="structural">Estrutural</option><option value="household">Domiciliar</option><option value="clinical">Clínica</option><option value="functional">Funcional</option></select></label>}<button onClick={exportSvg} disabled={view==="narrative"||view==="prompt"}>Exportar SVG</button>{view==="ecomap"&&<button onClick={()=>setComposer("external-link")} disabled={!p.resources.length}>Vincular recurso</button>}</div>{(view==="genogram"||view==="ecomap")&&<DiagramSvg model={model} svgRef={svgRef}/>} {view==="narrative"&&<pre className="diagram-text">{relationshipNarrative(model)}</pre>} {view==="prompt"&&<section className="prompt-panel"><p className={ids.length?"safety-callout":"shared-callout"}>{ids.length?`Possíveis identificadores encontrados: ${ids.length}. Revise antes de copiar.`:"Nenhum identificador direto óbvio detectado. A revisão manual continua obrigatória."}</p><textarea readOnly value={prompt}/><button onClick={async()=>{await navigator.clipboard.writeText(prompt);setMessage("Prompt copiado para a área de transferência.")}}>Copiar prompt estruturado</button></section>}{composer&&<div className="sheet-backdrop"><section className="sheet"><button className="close-button" onClick={()=>setComposer(null)}>×</button><RelationForm kind={composer} people={p.people} resources={p.resources} onSubmit={submit}/></section></div>}<DiagramDescription model={model}/></section>}
function DiagramSvg({model,svgRef}:{model:DiagramModel;svgRef:RefObject<SVGSVGElement|null>}){const map=new Map(model.nodes.map(n=>[n.id,n]));return <svg ref={svgRef} className="family-diagram" viewBox="0 0 600 440" role="img" aria-labelledby="diagram-title diagram-desc"><title id="diagram-title">{model.kind==="genogram"?"Genograma":"Ecomapa"} da família</title><desc id="diagram-desc">{model.manifest.expectedNodes} entidades e {model.manifest.expectedEdges} vínculos. Perspectiva {model.perspectiveLabel}.</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="context-stroke"/></marker></defs>{model.edges.map(e=>{const a=map.get(e.sourceId)||map.get(model.nodes[0]?.id||"");const b=map.get(e.targetId);if(!a||!b)return null;const st=qualityStyle(e.quality);return <g key={e.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={st.stroke} strokeWidth={st.width} strokeDasharray={st.dash} markerEnd={e.direction==="from-source"?"url(#arrow)":undefined} markerStart={e.direction==="to-source"?"url(#arrow)":undefined}/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-6} className="edge-label">{e.label}</text></g>})}{model.nodes.map(n=><g key={n.id} transform={`translate(${n.x},${n.y})`}><rect x="-58" y="-30" width="116" height="60" rx={n.kind==="person"?12:30} className={`diagram-node ${n.kind}`}/><text textAnchor="middle" y="-3" className="node-label">{n.label.slice(0,18)}</text><text textAnchor="middle" y="15" className="node-subtitle">{(n.subtitle||n.kind).slice(0,22)}</text></g>)}</svg>}
function DiagramDescription({model}:{model:DiagramModel}){return <details className="diagram-description"><summary>Descrição textual acessível</summary><pre>{relationshipNarrative(model)}</pre></details>}
function RelationForm({kind,people,resources,onSubmit}:{kind:NonNullable<Composer>;people:Person[];resources:ExternalResource[];onSubmit:(e:FormEvent<HTMLFormElement>)=>void}){return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Abordagem familiar</p><h2>{kind==="relationship"?"Nova relação":kind==="resource"?"Novo recurso":"Vincular recurso"}</h2>{kind==="relationship"&&<><label>Origem<select name="source" required>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label><label>Destino<select name="target" required>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label><label>Relação formal<input name="formalType" placeholder="Ex.: mãe, companheira, cuidado" required/></label></>}{kind==="resource"&&<><label>Nome<input name="name" required/></label><label>Tipo<select name="type"><option value="health">Saúde</option><option value="education">Educação</option><option value="community">Comunidade</option><option value="extended-family">Família ampliada</option><option value="social-assistance">Assistência social</option><option value="work">Trabalho</option><option value="other">Outro</option></select></label><label>Estado<select name="state"><option value="active">Ativo</option><option value="potential">Potencial</option><option value="inactive">Inativo</option></select></label></>}{kind==="external-link"&&<><label>Recurso<select name="resourceId">{resources.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label><label>Pessoa específica (opcional)<select name="personId"><option value="">Família inteira</option>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label></>}{kind!=="resource"&&<><label>Qualidade<select name="quality"><option value="adequate">Adequado</option><option value="strong">Forte</option><option value="weak">Fraco</option><option value="conflict">Conflitivo</option><option value="ruptured">Rompido</option><option value="divergent">Divergente</option><option value="unknown">Desconhecido</option></select></label><label>Perspectiva<select name="perspectivePersonId"><option value="">Consolidada</option>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label><label>Descrição da perspectiva<input name="perspectiveLabel" defaultValue="Relato atual" required/></label><label className="check-row"><input type="checkbox" name="thirdParty"/>Informação confidencial de terceiro</label></>}<button type="submit">Salvar</button></form>}

``

# END FILE: app/family-relations.tsx

---

# FILE: app/journey-dashboard.tsx

``tsx
"use client";
import {type FormEvent,useMemo,useState} from "react";import type {MapaData} from "@/src/hooks/use-mapa-data";import type {Family,Semester} from "@/src/contracts/family";import type {PendingClosure,SemesterSnapshotData} from "@/src/contracts/journey";import {createAddendum,createCompetency,createFeedback,createReflection} from "@/src/domain/journey-factories";import {familyTrajectories,semesterReport} from "@/src/domain/journey-report";import {assessCloseReadiness,closeSemester,createSemesterSnapshot} from "@/src/domain/semester-close";import {ENTITY_TYPES} from "@/src/domain/entity-types";import {saveEntity} from "@/src/domain/repository";import type {PendingItem} from "@/src/contracts/care";import {updatedAudit} from "@/src/domain/entity";
interface Props{data:MapaData;semester:Semester;onSaved:()=>Promise<void>;onVisit:(familyId:string)=>void}
type Composer="reflection"|"competency"|"feedback"|"close"|"addendum"|null;
export function JourneyDashboard({data,semester,onSaved,onVisit}:Props){const[composer,setComposer]=useState<Composer>(null);const[selectedFamily,setSelectedFamily]=useState("");const[message,setMessage]=useState("");const snapshot=data.snapshots.find(s=>s.semesterId===semester.id);const trajectories=useMemo(()=>familyTrajectories({semester,families:data.families,links:data.semesterLinks,memberships:data.memberships,encounters:data.encounters,pending:data.pending,reflections:data.reflections,feedbacks:data.feedbacks}),[data,semester]);const relatedPending=data.pending.filter(p=>p.semesterId===semester.id);const readiness=assessCloseReadiness(semester,relatedPending,Boolean(snapshot));const report=semesterReport({semester,trajectories,reflections:data.reflections.filter(r=>r.semesterId===semester.id),competencies:data.competencies.filter(c=>c.semesterId===semester.id),feedbacks:data.feedbacks.filter(f=>f.semesterId===semester.id),pending:relatedPending});
async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);if(composer==="reflection")await saveEntity(ENTITY_TYPES.reflection,createReflection({semesterId:semester.id,...(selectedFamily?{familyId:selectedFamily}:{}),title:String(f.get("title")),text:String(f.get("text")),learning:String(f.get("learning")||"").split("\n").filter(Boolean),nextQuestions:String(f.get("questions")||"").split("\n").filter(Boolean)}));if(composer==="competency")await saveEntity(ENTITY_TYPES.competencyEvidence,createCompetency({semesterId:semester.id,...(selectedFamily?{familyId:selectedFamily}:{}),competency:String(f.get("competency")),description:String(f.get("description"))}));if(composer==="feedback")await saveEntity(ENTITY_TYPES.supervisorFeedback,createFeedback({semesterId:semester.id,...(selectedFamily?{familyId:selectedFamily}:{}),topic:String(f.get("topic")||""),text:String(f.get("text")),action:String(f.get("action")||"")}));if(composer==="addendum"&&snapshot)await saveEntity(ENTITY_TYPES.addendum,createAddendum({snapshotId:snapshot.id,semesterId:semester.id,title:String(f.get("title")),text:String(f.get("text")),reason:String(f.get("reason"))}));await onSaved();setComposer(null);setMessage("Jornada atualizada.")}
async function setPendingDestination(item:PendingItem,destination:PendingClosure){await saveEntity(ENTITY_TYPES.pending,{...item,...updatedAudit(item),destination});await onSaved()}
async function close(){const currentData:SemesterSnapshotData={semester,families:data.families.filter(f=>data.semesterLinks.some(l=>l.semesterId===semester.id&&l.familyId===f.id)),familyLinks:data.semesterLinks.filter(l=>l.semesterId===semester.id),people:data.people,memberships:data.memberships,encounters:data.encounters.filter(e=>e.semesterId===semester.id),pending:data.pending.filter(p=>p.semesterId===semester.id),conditions:data.conditions,medications:data.medications,examResults:data.examResults,screenings:data.screenings,carePlans:data.carePlans,relationships:data.relationships,resources:data.resources,externalLinks:data.externalLinks,reflections:data.reflections.filter(r=>r.semesterId===semester.id),competencies:data.competencies.filter(c=>c.semesterId===semester.id),feedbacks:data.feedbacks.filter(f=>f.semesterId===semester.id)};const snap=await createSemesterSnapshot({semester,data:currentData,reportText:report});await saveEntity(ENTITY_TYPES.semesterSnapshot,snap);await saveEntity(ENTITY_TYPES.semester,closeSemester(semester));await onSaved();setComposer(null);setMessage("Semestre encerrado com snapshot imutável.")}
return <section className="journey-complete"><header className="journey-header"><div><p className="eyebrow">Jornada completa</p><h2>{semester.label}</h2><p>{semester.expectedFamilyCount} famílias esperadas, {trajectories.length} vinculadas. Expectativa não é limite.</p></div><span className={`semester-state ${semester.state}`}>{semester.state}</span></header><p role="status" className="system-message">{message}</p><div className="journey-actions"><button onClick={()=>setComposer("reflection")}>Reflexão</button><button onClick={()=>setComposer("competency")}>Competência</button><button onClick={()=>setComposer("feedback")}>Feedback</button><button onClick={()=>downloadText(`relatorio-${semester.code}.txt`,snapshot?.reportText||report)}>Relatório</button>{semester.state!=="closed"&&!snapshot&&<button onClick={()=>setComposer("close")}>Encerrar</button>}{snapshot&&<button onClick={()=>setComposer("addendum")}>Adendo</button>}</div>{snapshot&&<section className="snapshot-banner"><strong>Snapshot fechado em {new Date(snapshot.closedAt).toLocaleString("pt-BR")}</strong><span>Checksum: {snapshot.contentChecksum.slice(0,16)}…</span><p>Registros futuros não alteram este retrato. Correções são feitas por adendo.</p></section>}
<div className="trajectory-grid">{trajectories.map(t=><article className="trajectory-card" key={t.familyId}><p className="eyebrow">{t.code}</p><h3>{t.name}</h3><p>{t.focus}</p><div><span>{t.memberCount} pessoa(s)</span><span>{t.encounterCount} encontro(s)</span><span>{t.openPending} pendência(s)</span></div><dl><dt>Último encontro</dt><dd>{t.lastEncounter?new Date(t.lastEncounter).toLocaleDateString("pt-BR"):"não registrado"}</dd><dt>Próximo passo</dt><dd>{t.nextStep||"não registrado"}</dd><dt>Aprendizados</dt><dd>{t.learningCount}</dd><dt>Feedbacks</dt><dd>{t.feedbackCount}</dd></dl><button onClick={()=>onVisit(t.familyId)}>Visitar família</button></article>)}</div>
<section className="journey-section"><h3>Reflexões</h3>{data.reflections.filter(r=>r.semesterId===semester.id).map(r=><article key={r.id}><strong>{r.title}</strong><p>{r.text}</p><small>{r.learning.join(" · ")}</small></article>)}</section><section className="journey-section"><h3>Evidências de competência</h3>{data.competencies.filter(c=>c.semesterId===semester.id).map(c=><article key={c.id}><strong>{c.competency}</strong><p>{c.description}</p><small>{c.state}</small></article>)}</section><section className="journey-section"><h3>Feedbacks de preceptoria</h3>{data.feedbacks.filter(f=>f.semesterId===semester.id).map(f=><article key={f.id}><strong>{f.topic||"Feedback"}</strong><p>{f.text}</p>{f.action&&<small>Ação: {f.action}</small>}</article>)}</section>{snapshot&&<section className="journey-section"><h3>Adendos</h3>{data.addenda.filter(a=>a.snapshotId===snapshot.id).map(a=><article key={a.id}><strong>{a.title}</strong><p>{a.text}</p><small>Motivo: {a.reason} · {new Date(a.authoredAt).toLocaleString("pt-BR")}</small></article>)}</section>}
{composer&&<div className="sheet-backdrop"><section className="sheet"><button className="close-button" onClick={()=>setComposer(null)}>×</button>{composer==="close"?<ClosePanel pending={relatedPending} readiness={readiness} onDestination={setPendingDestination} onClose={close}/>:<JourneyForm kind={composer} families={data.families} selectedFamily={selectedFamily} setSelectedFamily={setSelectedFamily} onSubmit={submit}/>}</section></div>}</section>}
function JourneyForm({kind,families,selectedFamily,setSelectedFamily,onSubmit}:{kind:Exclude<Composer,"close"|null>;families:Family[];selectedFamily:string;setSelectedFamily:(x:string)=>void;onSubmit:(e:FormEvent<HTMLFormElement>)=>void}){return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Memória acadêmica</p><h2>{kind}</h2>{kind!=="addendum"&&<label>Família relacionada (opcional)<select value={selectedFamily} onChange={e=>setSelectedFamily(e.target.value)}><option value="">Sem vínculo específico</option>{families.map(f=><option key={f.id} value={f.id}>{f.code} · {f.nickname}</option>)}</select></label>}{kind==="reflection"&&<><label>Título<input name="title" required/></label><label>Reflexão<textarea name="text" required/></label><label>Aprendizados, um por linha<textarea name="learning"/></label><label>Próximas perguntas<textarea name="questions"/></label></>}{kind==="competency"&&<><label>Competência<input name="competency" required/></label><label>Evidência<textarea name="description" required/></label></>}{kind==="feedback"&&<><label>Tema<input name="topic"/></label><label>Feedback recebido<textarea name="text" required/></label><label>Ação decorrente<textarea name="action"/></label></>}{kind==="addendum"&&<><label>Título<input name="title" required/></label><label>Correção ou complemento<textarea name="text" required/></label><label>Motivo<textarea name="reason" required/></label></>}<button type="submit">Salvar</button></form>}
function ClosePanel({pending,readiness,onDestination,onClose}:{pending:PendingItem[];readiness:ReturnType<typeof assessCloseReadiness>;onDestination:(p:PendingItem,d:PendingClosure)=>Promise<void>;onClose:()=>Promise<void>}){return <section className="close-panel"><p className="eyebrow">Encerramento por etapas</p><h2>Preparar snapshot</h2>{readiness.blockers.map(x=><p className="safety-callout" key={x}>{x}</p>)}{readiness.warnings.map(x=><p className="shared-callout" key={x}>{x}</p>)}<h3>Pendências</h3>{pending.map(p=><article key={p.id}><strong>{p.title}</strong><select value={p.destination} onChange={e=>void onDestination(p,e.target.value as PendingClosure)}><option value="open">Sem destino</option><option value="completed">Concluída</option><option value="not-completed">Não concluída</option><option value="continuity-recommended">Continuidade recomendada</option><option value="continuity-confirmed">Continuidade confirmada</option><option value="not-recoverable">Informação não recuperável</option><option value="no-longer-relevant">Deixou de ser pertinente</option><option value="merged">Incorporada a outra</option></select></article>)}<button className="primary-close" disabled={!readiness.ready} onClick={()=>void onClose()}>Criar snapshot e encerrar</button><p className="fine-print">Processos inconclusos são permitidos quando recebem destino explícito. O snapshot não apaga dados vivos.</p></section>}
function downloadText(name:string,text:string){const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}

``

# END FILE: app/journey-dashboard.tsx

---

# FILE: app/layout.tsx

``tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./styles.css";
import { ClientBootstrap } from "./client-bootstrap";
import { SecurityGate } from "./security-gate";

export const metadata: Metadata = {
  title: "Mapa | Clínica, família e território",
  description: "Fundação do Mapa, guia clínico e familiar para a APS.",
  applicationName: "Mapa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#071512" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <ClientBootstrap />
        <SecurityGate>{children}</SecurityGate>
      </body>
    </html>
  );
}

``

# END FILE: app/layout.tsx

---

# FILE: app/manifest.ts

``typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mapa: Clínica, família e território",
    short_name: "Mapa",
    description: "Guia clínico, familiar e territorial para apoio na APS.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f6",
    theme_color: "#0f5f52",
    lang: "pt-BR",
    categories: ["medical", "education", "productivity"],
  };
}

``

# END FILE: app/manifest.ts

---

# FILE: app/offline/page.tsx

``tsx
export default function OfflinePage() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Sem conexão</p>
        <h1>O Mapa continua no dispositivo.</h1>
        <p>O conteúdo já armazenado permanece disponível. Algumas rotas ainda podem exigir uma primeira abertura online neste marco.</p>
      </section>
    </main>
  );
}

``

# END FILE: app/offline/page.tsx

---

# FILE: app/page.tsx

``tsx
import { Workspace } from "./workspace";
export default function HomePage() { return <Workspace />; }

``

# END FILE: app/page.tsx

---

# FILE: app/person-care-panel.tsx

``tsx
"use client";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import type { Person } from "@/src/contracts/family";
import type { CarePlan, ConditionRecord, ExamResultRecord, PersonMedicationRecord, ScreeningEpisode } from "@/src/contracts/longitudinal";
import type { Encounter } from "@/src/contracts/care";
import { createCarePlan, createCondition, createExamResult, createMedication, createPatientSuggestion, createScreening } from "@/src/domain/longitudinal-factories";
import { buildHandoff, createSharedCards, transcriptionText } from "@/src/domain/care-selectors";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { saveEntity } from "@/src/domain/repository";
import { verifyPin } from "@/src/security/pin";

interface Props { person:Person; familyId:string; conditions:ConditionRecord[]; medications:PersonMedicationRecord[]; exams:ExamResultRecord[]; screenings:ScreeningEpisode[]; plans:CarePlan[]; encounters:Encounter[]; onSaved:()=>Promise<void>; }
type Composer="condition"|"medication"|"exam"|"screening"|"plan"|null;
export function PersonCarePanel(props:Props){
 const [composer,setComposer]=useState<Composer>(null); const [presentation,setPresentation]=useState(false); const [handoff,setHandoff]=useState<"30s"|"2min"|"full"|null>(null); const [transcription,setTranscription]=useState(false); const [selected,setSelected]=useState<Set<string>>(new Set());
 const entities=useMemo(()=>[...props.conditions,...props.medications,...props.exams,...props.screenings,...props.plans],[props.conditions,props.medications,props.exams,props.screenings,props.plans]);
 const cards=useMemo(()=>createSharedCards(entities),[entities]);
 const selectedCards=cards.filter((card)=>selected.has(card.id)&&!card.blocked);
 async function save(entityType:Parameters<typeof saveEntity>[0], entity:Parameters<typeof saveEntity>[1]){ await saveEntity(entityType,entity); await props.onSaved(); setComposer(null); }
 async function submit(event:FormEvent<HTMLFormElement>){ event.preventDefault(); const f=new FormData(event.currentTarget); if(composer==="condition") await save(ENTITY_TYPES.condition,createCondition({personId:props.person.id,label:String(f.get("label")),kind:String(f.get("kind")) as ConditionRecord["kind"],sharedSummary:String(f.get("sharedSummary")||""),thirdParty:f.get("thirdParty")==="on"})); if(composer==="medication") await save(ENTITY_TYPES.medication,createMedication({personId:props.person.id,reportedName:String(f.get("reportedName")),presentationText:String(f.get("presentationText")||""),prescribedUseText:String(f.get("prescribedUseText")||""),actualUseText:String(f.get("actualUseText")||""),sharedSummary:String(f.get("sharedSummary")||"")})); if(composer==="exam") await save(ENTITY_TYPES.examResult,createExamResult({personId:props.person.id,examName:String(f.get("examName")),valueText:String(f.get("valueText")),unit:String(f.get("unit")||""),...(String(f.get("collectedAt")||"") ? { collectedAt:String(f.get("collectedAt")) } : {}),documentAvailable:f.get("documentAvailable")==="on",sharedSummary:String(f.get("sharedSummary")||"")})); if(composer==="screening") await save(ENTITY_TYPES.screening,createScreening({personId:props.person.id,title:String(f.get("title")),sharedSummary:String(f.get("sharedSummary")||"")})); if(composer==="plan") await save(ENTITY_TYPES.carePlan,createCarePlan({personId:props.person.id,familyId:props.familyId,title:String(f.get("title")),objective:String(f.get("objective")),target:String(f.get("target")) as CarePlan["target"],sharedSummary:String(f.get("sharedSummary")||"")})); }
 const toggle=(id:string)=>setSelected((old)=>{const next=new Set(old); next.has(id)?next.delete(id):next.add(id); return next;});
 return <section className="care-panel">
  <div className="care-title"><div><p className="eyebrow">Mapa da pessoa</p><h2>{props.person.displayName||props.person.code}</h2></div><button onClick={()=>setPresentation(true)} disabled={!selectedCards.length}>Mostrar resumo</button></div>
  <div className="care-actions"><button onClick={()=>setComposer("condition")}>Condição</button><button onClick={()=>setComposer("medication")}>Medicamento</button><button onClick={()=>setComposer("exam")}>Exame</button><button onClick={()=>setComposer("screening")}>Rastreamento</button><button onClick={()=>setComposer("plan")}>Plano</button></div>
  <div className="care-sections"><CareSection title="Condições" count={props.conditions.length}>{props.conditions.map((item)=><CareRow key={item.id} title={item.originalLabel} meta={`${item.kind} · ${item.clinicalState}`} checked={selected.has(item.id)} blocked={Boolean(cards.find((c)=>c.id===item.id)?.blocked)} onToggle={()=>toggle(item.id)} />)}</CareSection><CareSection title="Medicamentos" count={props.medications.length}>{props.medications.map((item)=><CareRow key={item.id} title={item.reportedName} meta={`${item.state}${item.actualUseText?` · ${item.actualUseText}`:""}`} checked={selected.has(item.id)} blocked={Boolean(cards.find((c)=>c.id===item.id)?.blocked)} onToggle={()=>toggle(item.id)} />)}</CareSection><CareSection title="Exames" count={props.exams.length}>{props.exams.map((item)=><CareRow key={item.id} title={item.examName} meta={`${item.valueText}${item.unit?` ${item.unit}`:" · unidade ausente"}`} checked={selected.has(item.id)} blocked={Boolean(cards.find((c)=>c.id===item.id)?.blocked)} onToggle={()=>toggle(item.id)} />)}</CareSection><CareSection title="Rastreamentos" count={props.screenings.length}>{props.screenings.map((item)=><CareRow key={item.id} title={item.title} meta={item.state} checked={selected.has(item.id)} blocked={Boolean(cards.find((c)=>c.id===item.id)?.blocked)} onToggle={()=>toggle(item.id)} />)}</CareSection><CareSection title="Plano" count={props.plans.length}>{props.plans.map((item)=><CareRow key={item.id} title={item.title} meta={`${item.target} · ${item.state}`} checked={selected.has(item.id)} blocked={Boolean(cards.find((c)=>c.id===item.id)?.blocked)} onToggle={()=>toggle(item.id)} />)}</CareSection></div>
  <div className="professional-tools"><button onClick={()=>setHandoff("30s")}>Passagem 30 s</button><button onClick={()=>setHandoff("2min")}>Passagem 2 min</button><button onClick={()=>setHandoff("full")}>Passagem completa</button><button onClick={()=>setTranscription(true)}>Transcrição</button></div>
  {composer&&<div className="sheet-backdrop"><section className="sheet" role="dialog" aria-modal="true"><button className="close-button" onClick={()=>setComposer(null)}>×</button><CareForm kind={composer} onSubmit={submit}/></section></div>}
  {presentation&&<PresentationMode person={props.person} cards={selectedCards} onExit={()=>setPresentation(false)} onSuggest={async(text)=>{await saveEntity(ENTITY_TYPES.patientSuggestion,createPatientSuggestion({personId:props.person.id,text}));await props.onSaved();}}/>}
  {handoff&&<TextOverlay title={`Passagem ${handoff}`} text={formatHandoff(buildHandoff(props.person,entities,props.encounters,handoff))} onExit={()=>setHandoff(null)}/>} {transcription&&<TextOverlay title="Visão para transcrição" text={transcriptionText(props.person,entities,props.encounters)} onExit={()=>setTranscription(false)}/>} 
 </section>;
}
function CareSection({title,count,children}:{title:string;count:number;children:ReactNode}){const[open,setOpen]=useState(true);return <section className="care-section"><button className="care-section-head" onClick={()=>setOpen(!open)}><span>{title}</span><span>{count} {open?"⌃":"⌄"}</span></button>{open&&<div>{count?children:<p className="fine-print">Nenhum item registrado.</p>}</div>}</section>}
function CareRow({title,meta,checked,blocked,onToggle}:{title:string;meta:string;checked:boolean;blocked?:boolean;onToggle:()=>void}){return <article className="care-row"><div><strong>{title}</strong><small>{meta}</small></div><label><input type="checkbox" checked={checked} disabled={blocked} onChange={onToggle}/>{blocked?"Privado":"Resumo"}</label></article>}
function CareForm({kind,onSubmit}:{kind:NonNullable<Composer>;onSubmit:(e:FormEvent<HTMLFormElement>)=>void}){return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Cuidado longitudinal</p><h2>Novo {kind}</h2>{kind==="condition"&&<><label>Termo registrado<input name="label" required/></label><label>Natureza<select name="kind"><option value="reported">Relatada</option><option value="confirmed">Confirmada</option><option value="hypothesis">Hipótese</option><option value="risk-factor">Fator de risco</option><option value="symptom">Sintoma</option><option value="vulnerability">Vulnerabilidade</option></select></label><label className="check-row"><input type="checkbox" name="thirdParty"/>Informação fornecida por terceiro</label></>}{kind==="medication"&&<><label>Nome informado<input name="reportedName" required/></label><label>Apresentação<input name="presentationText"/></label><label>Uso prescrito<input name="prescribedUseText"/></label><label>Uso real informado<input name="actualUseText"/></label></>}{kind==="exam"&&<><label>Exame<input name="examName" required/></label><label>Valor<input name="valueText" required/></label><label>Unidade<input name="unit"/></label><label>Data da coleta<input name="collectedAt" type="date"/></label><label className="check-row"><input type="checkbox" name="documentAvailable"/>Documento apresentado</label></>}{kind==="screening"&&<label>Rastreamento<input name="title" required/></label>}{kind==="plan"&&<><label>Título<input name="title" required/></label><label>Objetivo<textarea name="objective" required/></label><label>Alvo<select name="target"><option value="person">Pessoa</option><option value="caregiver">Cuidador</option><option value="dyad">Díade</option><option value="family">Família</option><option value="team">Equipe</option></select></label></>}<label>Linguagem para a pessoa<textarea name="sharedSummary" placeholder="Opcional. Escreva de forma clara, sem diagnóstico não confirmado."/></label><button type="submit">Salvar</button></form>}
function PresentationMode({person,cards,onExit,onSuggest}:{person:Person;cards:ReturnType<typeof createSharedCards>;onExit:()=>void;onSuggest:(text:string)=>Promise<void>}){const[suggestion,setSuggestion]=useState("");const[exitRequested,setExitRequested]=useState(false);const[exitPin,setExitPin]=useState("");const[exitMessage,setExitMessage]=useState("");async function confirmExit(){if(await verifyPin(exitPin)){onExit();return;}setExitMessage("PIN incorreto. O resumo continua isolado.");}return <div className="presentation-mode"><header><div><p>Resumo de acompanhamento</p><h1>{person.displayName||person.code}</h1></div><button onClick={()=>setExitRequested(true)}>Sair</button></header><main><p className="presentation-notice">Este material ajuda você a acompanhar seu cuidado. O prontuário completo permanece na unidade de saúde.</p>{cards.map((card)=><article key={card.id}><span>{card.sourceType}</span><h2>{card.title}</h2><p>{card.body}</p><small>{card.stateLabel}</small></article>)}<section className="suggestion-box"><h2>Algo precisa ser corrigido?</h2><textarea value={suggestion} onChange={(e)=>setSuggestion(e.target.value)} placeholder="Sua observação ficará pendente de revisão."/><button disabled={!suggestion.trim()} onClick={async()=>{await onSuggest(suggestion);setSuggestion("");}}>Enviar sugestão</button></section></main>{exitRequested&&<div className="presentation-exit"><section><h2>Voltar ao modo profissional</h2><p>Digite o PIN local para impedir acesso acidental às outras famílias.</p><input inputMode="numeric" pattern="[0-9]*" value={exitPin} onChange={(e)=>setExitPin(e.target.value)} aria-label="PIN local"/><button onClick={confirmExit}>Confirmar saída</button><button className="secondary" onClick={()=>{setExitRequested(false);setExitPin("");setExitMessage("");}}>Continuar no resumo</button><p role="status">{exitMessage}</p></section></div>}</div>}
function TextOverlay({title,text,onExit}:{title:string;text:string;onExit:()=>void}){return <div className="text-overlay"><header><h1>{title}</h1><button onClick={onExit}>Fechar</button></header><pre>{text}</pre></div>}
function formatHandoff(d:ReturnType<typeof buildHandoff>){return [`IDENTIFICAÇÃO`,d.identification,"","FATOS",...d.facts.map((x)=>`- ${x}`),"","INTERPRETAÇÕES",...(d.interpretations.length?d.interpretations.map((x)=>`- ${x}`):["- Não preenchidas automaticamente."]),"","AÇÕES",...(d.actions.length?d.actions.map((x)=>`- ${x}`):["- Nenhuma ação registrada."]),"","PERGUNTAS",...(d.questions.length?d.questions.map((x)=>`- ${x}`):["- Adicione suas perguntas antes da discussão."])].join("\n")}

``

# END FILE: app/person-care-panel.tsx

---

# FILE: app/release-audit.tsx

``tsx
import { releaseDecision } from "@/src/audit/gates";

export function ReleaseAudit() {
  const report = releaseDecision();
  return (
    <section className="release-audit">
      <header>
        <div>
          <p className="eyebrow">Prontidão operacional</p>
          <h2>Versão local aprovada</h2>
        </div>
        <span className="release-decision go">{report.decision}</span>
      </header>
      <p className="shared-callout">
        Build, persistência, backup, segurança local, acessibilidade basal e piloto sintético foram validados para o escopo acadêmico local.
      </p>
      <div className="audit-summary">
        <div><strong>{report.passed}</strong><span>Aprovados</span></div>
        <div><strong>0</strong><span>Bloqueios locais</span></div>
      </div>
      <div className="audit-gates">
        {report.gates.map((gate) => (
          <article key={gate.id} className="audit-gate passed">
            <div><span>{gate.area}</span><h3>{gate.title}</h3></div>
            <strong>aprovado</strong>
            <ul>{gate.evidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul>
            <p><b>Manutenção:</b> {gate.nextAction}</p>
          </article>
        ))}
      </div>
      <small>Escopo: uso acadêmico local. O Mapa não substitui prontuário institucional nem prescrição profissional.</small>
    </section>
  );
}

``

# END FILE: app/release-audit.tsx

---

# FILE: app/security-gate.tsx

``tsx
"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { hasPin, pinSecurityNotice, setPin, validatePinPolicy, verifyPin } from "@/src/security/pin";

const AUTO_LOCK_MS = 5 * 60 * 1000;

type GateState = "loading" | "setup" | "locked" | "unlocked";

export function SecurityGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("loading");
  const [pin, setPinValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { void hasPin().then((configured) => setState(configured ? "locked" : "setup")); }, []);

  useEffect(() => {
    if (state !== "unlocked") return;
    let timer = window.setTimeout(() => setState("locked"), AUTO_LOCK_MS);
    const reset = () => { window.clearTimeout(timer); timer = window.setTimeout(() => setState("locked"), AUTO_LOCK_MS); };
    const hide = () => { if (document.visibilityState === "hidden") setState("locked"); };
    ["pointerdown", "keydown", "touchstart"].forEach((event) => window.addEventListener(event, reset, { passive: true }));
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.clearTimeout(timer);
      ["pointerdown", "keydown", "touchstart"].forEach((event) => window.removeEventListener(event, reset));
      document.removeEventListener("visibilitychange", hide);
    };
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "setup") {
      const errors = validatePinPolicy(pin);
      if (errors.length) { setMessage(errors.join(" ")); return; }
      await setPin(pin);
      setMessage("PIN local configurado.");
      setPinValue("");
      setState("unlocked");
      return;
    }
    const valid = await verifyPin(pin);
    if (!valid) { setMessage("PIN incorreto. O conteúdo permanece bloqueado."); return; }
    setPinValue("");
    setMessage("Mapa desbloqueado neste dispositivo.");
    setState("unlocked");
  }

  if (state === "loading") return <main className="gate"><p role="status">Verificando proteção local...</p></main>;
  if (state === "unlocked") return <>{children}</>;

  return (
    <main className="gate">
      <section className="gate-card" aria-labelledby="gate-title">
        <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
        <p className="eyebrow">Proteção local</p>
        <h1 id="gate-title">{state === "setup" ? "Crie um PIN para este dispositivo" : "Mapa protegido"}</h1>
        <p>{state === "setup" ? "Defina um PIN para proteger o acesso ao Mapa neste dispositivo." : "A proteção local está ativa neste dispositivo. Digite seu PIN para continuar."}</p>
        <form onSubmit={submit}>
          <label htmlFor="local-pin">PIN de 6 a 12 dígitos</label>
          <input id="local-pin" inputMode="numeric" pattern="[0-9]*" autoComplete={state === "setup" ? "new-password" : "current-password"} value={pin} onChange={(event) => setPinValue(event.target.value)} />
          <button type="submit">{state === "setup" ? "Configurar e entrar" : "Entrar"}</button>
        </form>
        <p className="system-message" role="status" aria-live="polite">{message || (state === "setup" ? "Escolha um PIN para configurar a proteção local." : "Proteção local ativa neste dispositivo.")}</p>
        {state === "setup" && <p className="fine-print">{pinSecurityNotice}</p>}
      </section>
    </main>
  );
}

``

# END FILE: app/security-gate.tsx

---

# FILE: app/storage-dashboard.tsx

``tsx
"use client";

import { useEffect, useState } from "react";
import { serializeBackup } from "@/src/backup/service";
import { createEnvelope, saveRecordVerified } from "@/src/storage/repository";
import { readStorageStatus, requestPersistentStorage, type StorageStatus } from "@/src/storage/status";

function formatBytes(value?: number): string {
  if (value === undefined) return "indisponível";
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 ** 2).toFixed(1)} MB`;
}

export function StorageDashboard() {
  const [status, setStatus] = useState<StorageStatus>({ persistence: "unsupported" });
  const [message, setMessage] = useState("Verificando armazenamento local...");
  const [busy, setBusy] = useState(false);
  const [includeSynthetic, setIncludeSynthetic] = useState(false);

  useEffect(() => { void readStorageStatus().then((next) => { setStatus(next); setMessage("Armazenamento verificado."); }); }, []);

  async function persist() {
    setBusy(true);
    const next = await requestPersistentStorage();
    setStatus(next);
    setMessage(next.persistence === "persistent" ? "Armazenamento persistente concedido." : "O navegador manteve o modo de melhor esforço. Faça backups frequentes.");
    setBusy(false);
  }

  async function testWrite() {
    setBusy(true);
    try {
      const receipt = await saveRecordVerified(createEnvelope("demo-integrity-check", "system-check", { synthetic: true, note: "Marco 1" }));
      setMessage(receipt.verified ? `Gravação confirmada às ${new Date(receipt.savedAt).toLocaleTimeString("pt-BR")}.` : "A gravação não foi confirmada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Falha desconhecida."); }
    setBusy(false);
  }

  async function downloadBackup() {
    setBusy(true);
    try {
      const content = await serializeBackup(undefined, { includeSynthetic });
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `mapa-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage(includeSynthetic ? "Backup preparado com dados sintéticos, conforme sua seleção explícita." : "Backup normal preparado; dados sintéticos e sessão de demonstração foram excluídos.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Falha ao gerar backup."); }
    setBusy(false);
  }

  return (
    <section className="card" aria-labelledby="storage-title">
      <p className="eyebrow">Fundação local-first</p>
      <h2 id="storage-title">Estado do dispositivo</h2>
      <div className="storage-grid">
        <div><span>Persistência</span><strong>{status.persistence}</strong></div>
        <div><span>Uso estimado</span><strong>{formatBytes(status.usage)}</strong></div>
        <div><span>Quota estimada</span><strong>{formatBytes(status.quota)}</strong></div>
      </div>
      <p className="system-message" role="status" aria-live="polite">{message}</p>
      <label className="check-row"><input type="checkbox" checked={includeSynthetic} onChange={(event) => setIncludeSynthetic(event.target.checked)} />Incluir dados sintéticos neste backup</label>
      <div className="action-row">
        <button type="button" disabled={busy} onClick={persist}>Solicitar persistência</button>
        <button type="button" disabled={busy} onClick={testWrite}>Testar gravação</button>
        <button type="button" disabled={busy} onClick={downloadBackup}>Gerar backup</button>
      </div>
      <p className="fine-print">O padrão exclui registros sintéticos. Marque a opção acima somente se quiser incluí-los explicitamente.</p>
    </section>
  );
}

``

# END FILE: app/storage-dashboard.tsx

---

# FILE: app/styles.css

``css
:root {
  color-scheme: light dark;
  --bg: #f4f7f6;
  --surface: rgba(255, 255, 255, 0.82);
  --text: #10201d;
  --muted: #5a6b67;
  --line: rgba(15, 95, 82, 0.14);
  --brand: #0f5f52;
  --brand-2: #3c8e7c;
  --warning: #b36b17;
  --shadow: 0 18px 50px rgba(13, 52, 45, 0.08);
}

* { box-sizing: border-box; }
html { min-height: 100%; background: var(--bg); }
body {
  min-height: 100%; margin: 0; color: var(--text); background:
    radial-gradient(circle at 12% 0%, rgba(60, 142, 124, 0.17), transparent 32rem),
    var(--bg);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
button, input, textarea, select { font: inherit; }

.shell { width: min(100%, 54rem); margin: 0 auto; padding: 2.2rem 1rem 6rem; }
.hero { display: flex; align-items: center; gap: 1rem; padding: 1.25rem 0 2rem; }
.hero h1 { margin: 0; font-size: clamp(2.5rem, 12vw, 4.8rem); line-height: .88; letter-spacing: -.065em; }
.signature { margin: .6rem 0 0; color: var(--muted); font-size: 1.05rem; }
.eyebrow { margin: 0 0 .6rem; color: var(--brand); font-size: .76rem; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
.brand-mark { width: 4.2rem; height: 4.2rem; position: relative; flex: 0 0 auto; }
.brand-mark span { position: absolute; border-radius: 999px; background: var(--brand); box-shadow: 0 0 0 7px rgba(15, 95, 82, .08); }
.brand-mark span:nth-child(1) { width: 1rem; height: 1rem; left: .15rem; top: 1.65rem; }
.brand-mark span:nth-child(2) { width: .82rem; height: .82rem; right: .25rem; top: .35rem; }
.brand-mark span:nth-child(3) { width: .72rem; height: .72rem; right: .4rem; bottom: .2rem; }
.brand-mark::before, .brand-mark::after { content: ""; position: absolute; height: .22rem; border-radius: 1rem; background: linear-gradient(90deg, var(--brand), var(--brand-2)); transform-origin: left center; left: .85rem; top: 2rem; }
.brand-mark::before { width: 2.55rem; transform: rotate(-31deg); }
.brand-mark::after { width: 2.45rem; transform: rotate(28deg); }
.card { margin-top: 1rem; padding: 1.35rem; border: 1px solid var(--line); border-radius: 1.65rem; background: var(--surface); box-shadow: var(--shadow); backdrop-filter: blur(18px); }
.lead { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: start; }
.card h2 { margin: 0; max-width: 18ch; font-size: clamp(1.4rem, 5vw, 2.1rem); letter-spacing: -.035em; }
.card p:not(.eyebrow) { color: var(--muted); line-height: 1.6; }
.milestone { display: inline-flex; padding: .45rem .75rem; border-radius: 999px; background: rgba(15, 95, 82, .1); color: var(--brand); font-weight: 750; white-space: nowrap; }
.status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; margin-top: 1rem; }
.status-card { display: flex; align-items: flex-start; gap: .7rem; min-height: 6rem; padding: 1rem; border: 1px solid var(--line); border-radius: 1.35rem; background: var(--surface); }
.status-card p { margin: 0 0 .35rem; color: var(--muted); font-size: .86rem; }
.status-card strong { line-height: 1.25; }
.dot { width: .65rem; height: .65rem; margin-top: .25rem; flex: 0 0 auto; border-radius: 999px; }
.dot-ok { background: #238267; }
.dot-neutral { background: #71807c; }
.dot-warning { background: var(--warning); }
.next-list { margin: 1rem 0 0; padding-left: 1.2rem; color: var(--muted); line-height: 1.75; }
footer { padding: 1.5rem .25rem; color: var(--muted); font-size: .84rem; text-align: center; }

@media (max-width: 34rem) {
  .shell { padding-top: 1rem; }
  .lead { grid-template-columns: 1fr; }
  .milestone { justify-self: start; }
  .status-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: no-preference) {
  .card, .status-card { animation: rise .55s both; }
  .status-card:nth-child(2) { animation-delay: .05s; }
  .status-card:nth-child(3) { animation-delay: .1s; }
  .status-card:nth-child(4) { animation-delay: .15s; }
  @keyframes rise { from { opacity: 0; transform: translateY(8px); } }
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #071512;
    --surface: rgba(12, 31, 27, .84);
    --text: #edf8f5;
    --muted: #a6bbb5;
    --line: rgba(137, 213, 195, .16);
    --brand: #78cfba;
    --brand-2: #b7e8dc;
    --shadow: 0 24px 60px rgba(0, 0, 0, .25);
  }
}


.storage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .65rem; margin-top: 1rem; }
.storage-grid div { padding: .85rem; border-radius: 1rem; background: rgba(15, 95, 82, .07); }
.storage-grid span { display: block; color: var(--muted); font-size: .78rem; margin-bottom: .3rem; }
.storage-grid strong { font-size: .95rem; }
.system-message { min-height: 1.5rem; }
.action-row { display: flex; flex-wrap: wrap; gap: .65rem; }
.action-row button { min-height: 2.8rem; padding: .7rem .95rem; border: 1px solid var(--line); border-radius: 1rem; color: var(--text); background: rgba(15, 95, 82, .1); font-weight: 700; cursor: pointer; }
.action-row button:disabled { opacity: .55; cursor: wait; }
.action-row button:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }
.fine-print { font-size: .78rem; }
@media (max-width: 34rem) { .storage-grid { grid-template-columns: 1fr; } .action-row { display: grid; } }


.gate { min-height: 100dvh; display: grid; place-items: center; padding: 1rem; }
.gate-card { width: min(100%, 28rem); padding: 1.4rem; border: 1px solid var(--line); border-radius: 1.7rem; background: var(--surface); box-shadow: var(--shadow); }
.gate-card h1 { margin: 0; letter-spacing: -.04em; }
.gate-card form { display: grid; gap: .65rem; margin-top: 1.2rem; }
.gate-card label { font-weight: 700; }
.gate-card input { min-height: 3rem; padding: .7rem .9rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--bg); color: var(--text); font-size: 1.2rem; letter-spacing: .18em; }
.gate-card button { min-height: 3rem; border: 0; border-radius: 1rem; background: var(--brand); color: var(--bg); font-weight: 800; }


.app-shell { padding-bottom: 7rem; }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: .8rem .25rem .2rem; }
.app-header h1 { margin: 0; font-size: 2rem; letter-spacing: -.05em; }
.local-badge { padding: .4rem .65rem; border-radius: 999px; color: var(--brand); background: rgba(15,95,82,.1); font-size: .75rem; font-weight: 800; }
.hero-card h2 { max-width: none; }
.quick-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: .7rem; margin-top: 1rem; }
.quick-grid button, .section-head button, .journey-family button { min-height: 3.2rem; border: 1px solid var(--line); border-radius: 1.2rem; color: var(--text); background: var(--surface); font-weight: 800; box-shadow: var(--shadow); }
.section-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.section-head h2 { max-width: none; }
.section-head button { min-height: 2.6rem; padding: .5rem .85rem; }
.family-list { display: grid; gap: .6rem; margin-top: 1rem; }
.family-button { display: grid; grid-template-columns: auto 1fr; gap: .15rem .7rem; width: 100%; padding: .9rem; text-align: left; color: var(--text); border: 1px solid var(--line); border-radius: 1.15rem; background: transparent; }
.family-button span { grid-row: span 2; align-self: center; color: var(--brand); font-weight: 850; }
.family-button small { color: var(--muted); }
.family-button.selected { background: rgba(15,95,82,.1); border-color: var(--brand); }
.people-list { display: grid; gap: .55rem; margin: 1rem 0; }
.people-list article { display: flex; justify-content: space-between; gap: 1rem; padding: .8rem; border-radius: 1rem; background: rgba(15,95,82,.06); }
.people-list span { color: var(--muted); font-size: .84rem; }
.timeline { display: grid; gap: .25rem; }
.timeline article { display: grid; grid-template-columns: 1rem 1fr; gap: .65rem; padding: .75rem .15rem; }
.timeline p { margin: .2rem 0; }
.timeline small { color: var(--muted); }
.timeline-dot { width: .72rem; height: .72rem; margin-top: .25rem; border-radius: 999px; background: var(--brand); box-shadow: 0 0 0 5px rgba(15,95,82,.08); }
.timeline-dot.pending { background: var(--warning); }
.journey-stats { display: flex; flex-wrap: wrap; gap: .45rem; margin: .8rem 0; }
.journey-stats span { padding: .4rem .6rem; border-radius: 999px; background: rgba(15,95,82,.08); color: var(--muted); font-size: .8rem; }
.empty-card { text-align: center; }
.bottom-nav { position: fixed; z-index: 20; left: 50%; bottom: max(.75rem, env(safe-area-inset-bottom)); width: min(calc(100% - 1rem), 36rem); transform: translateX(-50%); display: grid; grid-template-columns: repeat(5,1fr); padding: .4rem; border: 1px solid var(--line); border-radius: 1.4rem; background: color-mix(in srgb, var(--surface) 90%, transparent); box-shadow: 0 18px 55px rgba(0,0,0,.18); backdrop-filter: blur(20px); }
.bottom-nav button { display: grid; place-items: center; gap: .15rem; min-height: 3.2rem; color: var(--muted); border: 0; border-radius: 1rem; background: transparent; font-size: .72rem; font-weight: 750; }
.bottom-nav button span { font-size: 1.05rem; }
.bottom-nav button.active { color: var(--brand); background: rgba(15,95,82,.1); }
.sheet-backdrop { position: fixed; z-index: 50; inset: 0; display: grid; align-items: end; background: rgba(1,10,8,.46); }
.sheet { position: relative; width: min(100%, 42rem); max-height: 92dvh; overflow: auto; margin: 0 auto; padding: 1rem 1rem calc(1.3rem + env(safe-area-inset-bottom)); border-radius: 1.6rem 1.6rem 0 0; background: var(--bg); box-shadow: 0 -20px 60px rgba(0,0,0,.2); }
.sheet-handle { width: 3rem; height: .3rem; margin: .1rem auto 1rem; border-radius: 1rem; background: var(--line); }
.close-button { position: absolute; right: 1rem; top: .75rem; width: 2.4rem; height: 2.4rem; border: 0; border-radius: 999px; color: var(--text); background: rgba(15,95,82,.08); font-size: 1.5rem; }
.form-stack { display: grid; gap: .9rem; }
.form-stack h2 { margin: 0; font-size: 1.8rem; letter-spacing: -.04em; }
.form-stack label, .form-stack fieldset { display: grid; gap: .4rem; color: var(--muted); font-size: .86rem; font-weight: 700; }
.form-stack input, .form-stack textarea, .form-stack select { width: 100%; min-height: 3rem; padding: .75rem .85rem; border: 1px solid var(--line); border-radius: 1rem; color: var(--text); background: var(--surface); }
.form-stack textarea { resize: vertical; }
.form-stack > button { min-height: 3.2rem; border: 0; border-radius: 1rem; color: var(--bg); background: var(--brand); font-weight: 850; }
.form-stack fieldset { border: 1px solid var(--line); border-radius: 1rem; padding: .8rem; }
.check-row { display: flex !important; align-items: center; gap: .6rem !important; }
.check-row input { width: 1.2rem; min-height: 1.2rem; }
.error-banner { padding: .8rem; border-radius: 1rem; background: rgba(179,107,23,.12); color: var(--warning); }
.assessments-panel { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--line); }
.assessment-member-list { display: grid; gap: .55rem; margin-top: .8rem; }
.assessment-member { display: grid; grid-template-columns: 1fr auto; gap: .2rem .7rem; padding: .8rem; border: 1px solid var(--line); border-radius: 1rem; color: var(--text); background: transparent; text-align: left; }
.assessment-member span, .assessment-member small, .assessment-history-card span, .assessment-history-card small { color: var(--muted); font-size: .78rem; }
.assessment-member span, .assessment-member small { grid-column: 1 / -1; }
.assessment-member.selected { border-color: var(--brand); background: rgba(15,95,82,.1); }
.assessment-person-area { margin-top: 1rem; padding: 1rem; border: 1px solid var(--line); border-radius: 1.2rem; background: rgba(15,95,82,.035); }
.assessment-person-header, .assessment-editor-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.assessment-person-header h3, .assessment-editor-header h3 { margin: 0; }
.assessment-history { display: grid; gap: .55rem; margin-top: 1rem; }
.assessment-history-card { display: flex; align-items: center; justify-content: space-between; gap: .8rem; padding: .75rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--surface); }
.assessment-history-card > div:first-child { display: grid; gap: .2rem; }
.assessment-editor { margin-top: 1rem; padding: 1rem; border: 2px solid var(--brand); border-radius: 1.2rem; background: var(--bg); }
.assessment-progress { display: grid; gap: .2rem; margin: 1rem 0; padding: .8rem; border-radius: 1rem; background: rgba(15,95,82,.08); }
.assessment-progress span { color: var(--muted); font-size: .82rem; }
.assessment-section-tabs { display: flex; gap: .4rem; overflow-x: auto; padding-bottom: .75rem; }
.assessment-section-tabs button { flex: 0 0 auto; max-width: 16rem; padding: .55rem .7rem; border: 0; border-radius: .8rem; color: var(--muted); background: rgba(15,95,82,.06); font-size: .78rem; font-weight: 750; }
.assessment-section-tabs button.active { color: var(--brand); background: rgba(15,95,82,.15); }
.assessment-question-list, .assessment-missing-source, .assessment-review { margin-top: .8rem; padding: .9rem; border: 1px solid var(--line); border-radius: 1rem; }
.assessment-question-list h4, .assessment-missing-source h4, .assessment-review h4 { margin: 0 0 .8rem; }
.assessment-field { display: grid; gap: .35rem; margin-top: .75rem; color: var(--muted); font-size: .84rem; font-weight: 700; }
.assessment-field input, .assessment-field textarea { width: 100%; min-height: 2.8rem; padding: .65rem .75rem; border: 1px solid var(--line); border-radius: .8rem; color: var(--text); background: var(--surface); }
.assessment-field textarea { min-height: 5rem; resize: vertical; }
.assessment-field legend { padding: 0; color: var(--muted); }
.assessment-field { border: 0; }
.assessment-field .check-row, .assessment-field .radio-row { display: flex; align-items: center; gap: .5rem; padding: .25rem 0; font-weight: 500; }
.assessment-field input[type="checkbox"], .assessment-field input[type="radio"] { width: 1.1rem; min-height: 1.1rem; }
.assessment-calculated, .assessment-not-applicable { display: grid; gap: .25rem; margin-top: .7rem; padding: .75rem; border-radius: .8rem; background: rgba(15,95,82,.07); }
.assessment-calculated span, .assessment-not-applicable span { color: var(--muted); font-size: .82rem; }
.assessment-review ul, .assessment-missing-source ul { margin-bottom: 0; padding-left: 1.2rem; color: var(--muted); font-size: .82rem; line-height: 1.5; }
.assessment-section-statuses { display: grid; gap: .25rem; margin-top: .45rem; }
.assessment-section-statuses span { padding: .2rem .4rem; border-radius: .45rem; background: var(--surface); }
.assessment-save-status { margin: .6rem 0; padding: .55rem .7rem; border-radius: .7rem; color: var(--muted); background: rgba(15,95,82,.06); }
.assessment-confirm { position: relative; z-index: 1; margin-top: .8rem; padding: .9rem; border: 2px solid var(--warning); border-radius: 1rem; background: var(--surface); }
.assessment-field input[aria-invalid="true"] { border-color: var(--warning); outline: 2px solid rgba(179,107,23,.2); }
.assessment-question-list select { width: 100%; min-height: 2.8rem; padding: .65rem .75rem; border: 1px solid var(--line); border-radius: .8rem; color: var(--text); background: var(--surface); }
.assessment-review details { margin-top: .45rem; padding: .45rem; border-top: 1px solid var(--line); }
.assessment-review summary { cursor: pointer; font-weight: 750; }
.assessment-review li { overflow-wrap: anywhere; }
.assessment-applicability { margin-top: .6rem; padding: .65rem; border: 1px dashed var(--line); border-radius: .7rem; }
.assessment-applicability select, .assessment-applicability input { width: 100%; min-height: 2.5rem; margin-top: .35rem; padding: .5rem; border: 1px solid var(--line); border-radius: .6rem; background: var(--surface); color: var(--text); }
.assessment-applicability small { display: block; margin-top: .35rem; color: var(--muted); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (min-width: 44rem) { .assessment-member-list { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 34rem) { .assessment-person-header, .assessment-editor-header, .assessment-history-card { align-items: stretch; flex-direction: column; } }
@media (min-width: 44rem) { .family-list { grid-template-columns: repeat(2,1fr); } .journey-family { display: grid; grid-template-columns: 1fr auto; } .journey-family > * { grid-column: 1; } .journey-family > button { grid-column: 2; grid-row: 1 / span 4; align-self: center; padding: 0 1rem; } }


.person-button { display:flex; justify-content:space-between; gap:1rem; width:100%; padding:.8rem; border:1px solid transparent; border-radius:1rem; color:var(--text); background:rgba(15,95,82,.06); text-align:left; }
.person-button span { color:var(--muted); font-size:.84rem; }
.person-button.selected { border-color:var(--brand); background:rgba(15,95,82,.12); }
.care-panel { margin-top:1rem; padding-top:1rem; border-top:1px solid var(--line); }
.care-title { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.care-title h2 { margin:0; }
.care-title button,.professional-tools button { min-height:2.7rem; padding:.55rem .8rem; border:1px solid var(--line); border-radius:1rem; color:var(--text); background:rgba(15,95,82,.08); font-weight:750; }
.care-actions { display:flex; gap:.45rem; overflow:auto; padding:.9rem 0; scrollbar-width:none; }
.care-actions button { flex:0 0 auto; min-height:2.5rem; padding:.5rem .75rem; border:0; border-radius:999px; color:var(--brand); background:rgba(15,95,82,.1); font-weight:800; }
.care-sections { display:grid; gap:.6rem; }
.care-section { border:1px solid var(--line); border-radius:1rem; overflow:hidden; }
.care-section-head { display:flex; justify-content:space-between; width:100%; padding:.8rem; border:0; color:var(--text); background:transparent; font-weight:850; }
.care-section>div { padding:0 .75rem .65rem; }
.care-row { display:flex; align-items:center; justify-content:space-between; gap:.8rem; padding:.65rem 0; border-top:1px solid var(--line); }
.care-row:first-child { border-top:0; }
.care-row strong,.care-row small { display:block; }
.care-row small { margin-top:.2rem; color:var(--muted); }
.care-row label { display:grid; justify-items:center; gap:.15rem; color:var(--muted); font-size:.68rem; }
.professional-tools { display:flex; gap:.5rem; overflow:auto; padding:1rem 0; }
.presentation-mode,.text-overlay { position:fixed; z-index:100; inset:0; overflow:auto; background:var(--bg); color:var(--text); }
.presentation-mode header,.text-overlay header { position:sticky; top:0; z-index:2; display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1rem; border-bottom:1px solid var(--line); background:var(--bg); }
.presentation-mode header p,.presentation-mode header h1 { margin:0; }
.presentation-mode header p { color:var(--muted); }
.presentation-mode header button,.text-overlay header button { min-height:2.6rem; padding:.5rem .85rem; border:0; border-radius:999px; color:var(--bg); background:var(--brand); font-weight:850; }
.presentation-mode main { width:min(100%,38rem); margin:0 auto; padding:1rem 1rem 4rem; }
.presentation-notice { padding:1rem; border-radius:1rem; color:var(--muted); background:rgba(15,95,82,.08); line-height:1.5; }
.presentation-mode article { padding:1rem 0; border-bottom:1px solid var(--line); }
.presentation-mode article span { color:var(--brand); font-size:.75rem; font-weight:850; text-transform:uppercase; }
.presentation-mode article h2 { margin:.25rem 0; }
.presentation-mode article p { line-height:1.55; }
.presentation-mode article small { color:var(--muted); }
.suggestion-box { margin-top:1.4rem; padding:1rem; border:1px solid var(--line); border-radius:1.2rem; }
.suggestion-box textarea { width:100%; min-height:6rem; padding:.75rem; border:1px solid var(--line); border-radius:1rem; color:var(--text); background:var(--surface); }
.suggestion-box button { width:100%; min-height:3rem; margin-top:.7rem; border:0; border-radius:1rem; color:var(--bg); background:var(--brand); font-weight:850; }
.text-overlay pre { width:min(100%,52rem); min-height:70dvh; margin:1rem auto; padding:1rem; white-space:pre-wrap; color:var(--text); background:var(--surface); border-radius:1rem; font:inherit; line-height:1.65; }

.presentation-exit { position:fixed; z-index:120; inset:0; display:grid; place-items:center; padding:1rem; background:rgba(1,10,8,.72); }
.presentation-exit section { width:min(100%,28rem); padding:1.2rem; border-radius:1.3rem; background:var(--bg); box-shadow:var(--shadow); }
.presentation-exit input,.presentation-exit button { width:100%; min-height:3rem; margin-top:.65rem; padding:.7rem; border-radius:1rem; }
.presentation-exit input { border:1px solid var(--line); color:var(--text); background:var(--surface); font-size:1.15rem; letter-spacing:.15em; }
.presentation-exit button { border:0; color:var(--bg); background:var(--brand); font-weight:850; }
.presentation-exit button.secondary { color:var(--text); background:rgba(15,95,82,.08); }


.clinical-library { padding-bottom:1rem; }
.clinical-header { display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; }
.clinical-header h1 { margin:0; font-size:2rem; }
.clinical-status { display:inline-flex; padding:.35rem .55rem; border-radius:999px; color:var(--muted); background:rgba(15,95,82,.08); font-size:.72rem; font-weight:800; }
.clinical-status.ok { color:var(--brand); }
.clinical-status.error { color:var(--warning); }
.clinical-search { display:grid; gap:.35rem; margin:1rem 0; color:var(--muted); font-size:.8rem; font-weight:800; }
.clinical-search input { min-height:3rem; padding:.7rem .9rem; border:1px solid var(--line); border-radius:1rem; color:var(--text); background:var(--surface); }
.clinical-tabs { display:flex; gap:.4rem; overflow:auto; padding-bottom:.7rem; }
.clinical-tabs button { flex:0 0 auto; padding:.55rem .75rem; border:0; border-radius:999px; color:var(--muted); background:rgba(15,95,82,.05); font-weight:750; }
.clinical-tabs button.active { color:var(--brand); background:rgba(15,95,82,.13); }
.clinical-grid { display:grid; gap:.75rem; }
.clinical-card { width:100%; padding:1rem; border:1px solid var(--line); border-radius:1.2rem; color:var(--text); background:var(--surface); box-shadow:var(--shadow); text-align:left; }
.clinical-card>span { color:var(--brand); font-size:.7rem; font-weight:850; text-transform:uppercase; }
.clinical-card h2 { margin:.25rem 0; font-size:1.3rem; }
.clinical-card p { color:var(--muted); line-height:1.5; }
.clinical-card.static { display:block; }
.clinical-card ul,.condition-detail ul { color:var(--muted); line-height:1.55; }
.condition-detail { padding-bottom:2rem; }
.condition-detail>h1 { margin:.5rem 0; font-size:2rem; letter-spacing:-.04em; }
.condition-detail>p { line-height:1.6; }
.condition-detail>section { margin-top:1.2rem; }
.condition-detail>section>h2 { font-size:1.25rem; }
.claim { margin:.6rem 0; padding:1rem; border:1px solid var(--line); border-radius:1rem; background:var(--surface); }
.claim>p { line-height:1.55; }
.claim>div { display:flex; flex-wrap:wrap; gap:.35rem; }
.claim>div>span { padding:.3rem .45rem; border-radius:999px; color:var(--muted); background:rgba(15,95,82,.06); font-size:.68rem; }
.shared-callout,.scope-callout,.safety-callout { padding:.75rem; border-radius:.85rem; }
.shared-callout { color:var(--text)!important; background:rgba(15,95,82,.08); }
.scope-callout { color:var(--muted); border:1px solid var(--line); }
.safety-callout { color:var(--warning)!important; background:rgba(179,107,23,.1); }
.source-links { display:grid; gap:.3rem; margin-top:.7rem; }
.source-links a { color:var(--brand); font-size:.78rem; text-decoration-thickness:.08em; }
.source-list { display:grid; gap:.7rem; }
.source-list article { display:grid; grid-template-columns:1fr auto; gap:1rem; padding:1rem; border:1px solid var(--line); border-radius:1rem; background:var(--surface); }
.source-list h2 { margin:.2rem 0; font-size:1.05rem; }
.source-list p,.source-list span { margin:.2rem 0; color:var(--muted); font-size:.78rem; }
.source-list a,.back-button { align-self:start; padding:.5rem .7rem; border:0; border-radius:999px; color:var(--brand); background:rgba(15,95,82,.09); font-weight:800; text-decoration:none; }
.clinical-footer { margin-top:1rem; padding:1rem; border-radius:1rem; color:var(--muted); background:rgba(179,107,23,.08); line-height:1.5; }
@media(min-width:44rem){.clinical-grid{grid-template-columns:repeat(2,1fr)}.condition-detail{max-width:48rem;margin:0 auto}}


.relations-panel { margin-top:1rem; padding-top:1rem; border-top:1px solid var(--line); }
.relations-head { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.relations-head h2 { margin:0; }
.relations-head>button,.diagram-controls>button { min-height:2.6rem; padding:.55rem .8rem; border:1px solid var(--line); border-radius:1rem; color:var(--text); background:rgba(15,95,82,.08); font-weight:800; }
.relations-tabs { display:flex; gap:.4rem; overflow:auto; margin:.8rem 0; }
.relations-tabs button { flex:0 0 auto; padding:.5rem .7rem; border:0; border-radius:999px; color:var(--muted); background:rgba(15,95,82,.06); font-weight:750; }
.relations-tabs button.active { color:var(--brand); background:rgba(15,95,82,.14); }
.diagram-controls { display:flex; align-items:end; flex-wrap:wrap; gap:.5rem; margin-bottom:.7rem; }
.diagram-controls label { display:grid; gap:.25rem; color:var(--muted); font-size:.72rem; font-weight:800; }
.diagram-controls select { min-height:2.5rem; padding:.45rem .6rem; border:1px solid var(--line); border-radius:.85rem; color:var(--text); background:var(--surface); }
.family-diagram { width:100%; min-height:20rem; border:1px solid var(--line); border-radius:1.2rem; background:var(--surface); }
.diagram-node { fill:var(--bg); stroke:var(--brand); stroke-width:2; }
.diagram-node.family { fill:rgba(15,95,82,.12); stroke-width:4; }
.diagram-node.resource { stroke:#64748b; }
.node-label { fill:var(--text); font-size:12px; font-weight:800; }
.node-subtitle,.edge-label { fill:var(--muted); font-size:9px; }
.edge-label { paint-order:stroke; stroke:var(--surface); stroke-width:4px; }
.diagram-text,.diagram-description pre { padding:1rem; border-radius:1rem; white-space:pre-wrap; color:var(--text); background:var(--surface); font:inherit; line-height:1.6; }
.diagram-description { margin-top:.7rem; color:var(--muted); }
.diagram-description summary { cursor:pointer; font-weight:800; }
.prompt-panel textarea { width:100%; min-height:22rem; padding:1rem; border:1px solid var(--line); border-radius:1rem; color:var(--text); background:var(--surface); font:inherit; line-height:1.45; }
.prompt-panel button { width:100%; min-height:3rem; margin-top:.6rem; border:0; border-radius:1rem; color:var(--bg); background:var(--brand); font-weight:850; }


.journey-complete { padding-bottom:1rem; }
.journey-header { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; }
.journey-header h2 { margin:0; }
.semester-state { padding:.4rem .65rem; border-radius:999px; color:var(--brand); background:rgba(15,95,82,.1); font-size:.72rem; font-weight:850; }
.journey-actions { display:flex; gap:.45rem; overflow:auto; padding:.8rem 0; }
.journey-actions button { flex:0 0 auto; min-height:2.7rem; padding:.55rem .75rem; border:1px solid var(--line); border-radius:1rem; color:var(--text); background:var(--surface); font-weight:800; }
.snapshot-banner { padding:1rem; border:1px solid var(--brand); border-radius:1rem; background:rgba(15,95,82,.08); }
.snapshot-banner strong,.snapshot-banner span { display:block; }
.snapshot-banner span { margin-top:.25rem; color:var(--muted); font-family:monospace; }
.trajectory-grid { display:grid; gap:.75rem; margin-top:.8rem; }
.trajectory-card { padding:1rem; border:1px solid var(--line); border-radius:1.2rem; background:var(--surface); box-shadow:var(--shadow); }
.trajectory-card h3 { margin:.2rem 0; }
.trajectory-card>div { display:flex; flex-wrap:wrap; gap:.35rem; }
.trajectory-card>div span { padding:.35rem .5rem; border-radius:999px; color:var(--muted); background:rgba(15,95,82,.07); font-size:.75rem; }
.trajectory-card dl { display:grid; grid-template-columns:auto 1fr; gap:.35rem .7rem; }
.trajectory-card dt { color:var(--muted); font-size:.78rem; }
.trajectory-card dd { margin:0; }
.trajectory-card button { width:100%; min-height:2.8rem; border:0; border-radius:1rem; color:var(--bg); background:var(--brand); font-weight:850; }
.journey-section { margin-top:1rem; padding:1rem; border:1px solid var(--line); border-radius:1.1rem; background:var(--surface); }
.journey-section>h3 { margin-top:0; }
.journey-section article { padding:.65rem 0; border-top:1px solid var(--line); }
.journey-section article:first-of-type { border-top:0; }
.journey-section article p { margin:.25rem 0; color:var(--muted); }
.journey-section article small { color:var(--muted); }
.close-panel>h2 { margin-top:0; }
.close-panel article { display:grid; gap:.5rem; padding:.7rem 0; border-bottom:1px solid var(--line); }
.close-panel select { min-height:2.7rem; padding:.5rem; border:1px solid var(--line); border-radius:.8rem; color:var(--text); background:var(--surface); }
.primary-close { width:100%; min-height:3rem; margin-top:1rem; border:0; border-radius:1rem; color:var(--bg); background:var(--brand); font-weight:850; }
.primary-close:disabled { opacity:.45; }
@media(min-width:44rem){.trajectory-grid{grid-template-columns:repeat(2,1fr)}}


.release-audit { margin-bottom:1rem; }
.release-audit>header { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; }
.release-audit h2 { margin:0; }
.release-decision { padding:.5rem .7rem; border-radius:999px; font-weight:900; }
.release-decision.no-go { color:#991b1b; background:rgba(153,27,27,.12); }
.audit-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:.45rem; margin:.8rem 0; }
.audit-summary div { display:grid; place-items:center; padding:.7rem .3rem; border-radius:1rem; background:var(--surface); }
.audit-summary strong { font-size:1.35rem; }
.audit-summary span { color:var(--muted); font-size:.68rem; }
.audit-gates { display:grid; gap:.65rem; }
.audit-gate { padding:1rem; border:1px solid var(--line); border-left-width:5px; border-radius:1rem; background:var(--surface); }
.audit-gate.passed { border-left-color:var(--brand); }.audit-gate.failed { border-left-color:#991b1b; }.audit-gate.blocked,.audit-gate.manual { border-left-color:var(--warning); }
.audit-gate>div { display:flex; justify-content:space-between; gap:1rem; }.audit-gate h3 { margin:.2rem 0; }.audit-gate span,.audit-gate small { color:var(--muted); font-size:.72rem; }.audit-gate ul { color:var(--muted); line-height:1.45; }
@media(max-width:30rem){.audit-summary{grid-template-columns:repeat(2,1fr)}}
.clinical-card code { overflow-wrap:anywhere; color:var(--accent-strong); font-weight:700; }
.clinical-card .claim { margin-top:.8rem; }

``

# END FILE: app/styles.css

---

# FILE: app/workspace.tsx

``tsx
"use client";

import { type FormEvent, useMemo, useState } from "react";
import type { EncounterKind } from "@/src/contracts/care";
import { createEncounter, createFamily, createMembership, createPending, createPerson, createSemester, linkFamilyToSemester, updateFamily } from "@/src/domain/factories";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { saveEntity } from "@/src/domain/repository";
import { buildTimeline, nextFamilyCode, nextPersonCode, peopleInFamily } from "@/src/domain/selectors";
import { isSyntheticDemoFamily } from "@/src/contracts/demo";
import { useMapaData } from "@/src/hooks/use-mapa-data";
import { StorageDashboard } from "./storage-dashboard";
import { DemoModePanel } from "./demo-mode-panel";
import { PersonCarePanel } from "./person-care-panel";
import { ClinicalLibrary } from "./clinical-library";
import { FamilyRelations } from "./family-relations";
import { JourneyDashboard } from "./journey-dashboard";
import { ReleaseAudit } from "./release-audit";
import { FamilyAssessmentsPanel } from "./family-assessments";

type Tab = "home" | "clinical" | "care" | "journey" | "more";
type Composer = "family" | "family-edit" | "person" | "encounter" | "semester" | null;

const labels: Record<Tab, string> = { home: "Início", clinical: "Clínica", care: "Cuidado", journey: "Jornada", more: "Mais" };

export function Workspace() {
  const { data, loading, error, refresh, demoSession } = useMapaData();
  const [tab, setTab] = useState<Tab>("home");
  const [composer, setComposer] = useState<Composer>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>();
  const [selectedPersonId, setSelectedPersonId] = useState<string>();
  const [message, setMessage] = useState("Pronto.");
  const activeSemester = data.semesters.find((semester) => semester.state === "active");
  const journeySemester = activeSemester ?? [...data.semesters].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
  const selectedFamily = data.families.find((family) => family.id === selectedFamilyId);
  const selectedPeople = selectedFamilyId ? peopleInFamily(data.people, data.memberships, selectedFamilyId) : [];
  const selectedPerson = data.people.find((person) => person.id === selectedPersonId);
  const timeline = useMemo(() => buildTimeline(data.encounters, data.pending, selectedFamilyId), [data.encounters, data.pending, selectedFamilyId]);

  async function submitFamily(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const input = { code: String(form.get("code")), nickname: String(form.get("nickname") || ""), focus: String(form.get("focus") || "") };
    const family = composer === "family-edit" && selectedFamily ? updateFamily(selectedFamily, input) : createFamily(input);
    await saveEntity(ENTITY_TYPES.family, family);
    if (composer !== "family-edit" && activeSemester) await saveEntity(ENTITY_TYPES.semesterFamily, linkFamilyToSemester({ semesterId: activeSemester.id, familyId: family.id }));
    await refresh(); setSelectedFamilyId(family.id); setComposer(null); setMessage(composer === "family-edit" ? "Família atualizada; sua origem foi preservada." : "Família salva e verificada no dispositivo.");
  }

  async function submitPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedFamily) return;
    const form = new FormData(event.currentTarget);
    const person = createPerson({ code: String(form.get("code")), displayName: String(form.get("displayName") || ""), lifeStage: String(form.get("lifeStage")) as "child" | "adolescent" | "adult" | "older-adult" | "unknown" });
    const membership = createMembership({ personId: person.id, familyId: selectedFamily.id, roleLabel: String(form.get("roleLabel")), careRole: String(form.get("careRole")) as "none" | "support" | "primary-caregiver" | "care-recipient" });
    await saveEntity(ENTITY_TYPES.person, person); await saveEntity(ENTITY_TYPES.membership, membership);
    await refresh(); setComposer(null); setMessage("Pessoa e participação familiar salvas.");
  }

  async function submitEncounter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const familyId = String(form.get("familyId") || "");
    const encounter = createEncounter({ kind: String(form.get("kind")) as EncounterKind, ...(familyId ? { familyId } : {}), personIds: form.getAll("personIds").map(String), title: String(form.get("title")), freeText: String(form.get("freeText") || ""), nextStep: String(form.get("nextStep") || ""), ...(activeSemester ? { semesterId: activeSemester.id } : {}) });
    await saveEntity(ENTITY_TYPES.encounter, encounter);
    const pendingTitle = String(form.get("pending") || "").trim();
    if (pendingTitle) await saveEntity(ENTITY_TYPES.pending, createPending({ title: pendingTitle, ...(familyId ? { familyId } : {}), encounterId: encounter.id, ...(activeSemester ? { semesterId: activeSemester.id } : {}) }));
    await refresh(); setComposer(null); setMessage("Encontro salvo e timeline atualizada.");
  }

  async function submitSemester(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const semester = createSemester({ code: String(form.get("code")), label: String(form.get("label")), expectedFamilyCount: Number(form.get("expectedFamilyCount") || 2) });
    await saveEntity(ENTITY_TYPES.semester, semester); await refresh(); setComposer(null); setMessage("Jornada criada. O número de famílias é uma expectativa, não um limite.");
  }

  if (loading) return <main className="shell"><p>Carregando o dispositivo...</p></main>;
  return (
    <main className="shell app-shell">
      <header className="app-header"><div><p className="eyebrow">Mapa</p><h1>{labels[tab]}</h1></div><span className={demoSession ? "local-badge demo-badge" : "local-badge"}>{demoSession ? "DEMONSTRAÇÃO · SINTÉTICO" : "Local"}</span></header>
      {error && <p className="error-banner" role="alert">{error}</p>}
      <p className="system-message" role="status" aria-live="polite">{message}</p>

      {tab === "home" && <>
        <section className="card hero-card"><p className="eyebrow">Agora</p><h2>{activeSemester ? activeSemester.label : "Comece sua Jornada"}</h2><p>{data.families.length ? `${data.families.length} família(s) no dispositivo e ${data.pending.filter((item) => item.destination === "open").length} pendência(s) aberta(s).` : "Crie um semestre ou abra o modo demonstração isolado."}</p><div className="action-row">{!activeSemester && <button onClick={() => setComposer("semester")}>Criar Jornada</button>}<button onClick={() => setComposer("encounter")} disabled={!data.families.length}>Novo encontro</button>{!data.families.length && <button onClick={() => setTab("more")}>Modo demonstração</button>}</div></section>
        <section className="quick-grid"><button onClick={() => { setTab("care"); setComposer("family"); }}>Nova família</button><button onClick={() => setTab("care")}>Abrir cuidado</button><button onClick={() => setTab("journey")}>Visitar semestre</button><button onClick={() => setTab("more")}>Estado local</button></section>
        <section className="card"><p className="eyebrow">Recentes</p><Timeline items={buildTimeline(data.encounters, data.pending).slice(0, 5)} /></section>
      </>}

      {tab === "clinical" && <ClinicalLibrary />}

      {tab === "care" && <>
        <section className="card"><div className="section-head"><div><p className="eyebrow">Famílias</p><h2>Acompanhamento</h2></div><button onClick={() => setComposer("family")}>Adicionar</button></div>
          <div className="family-list">{data.families.map((family) => <button className={family.id === selectedFamilyId ? "family-button selected" : "family-button"} key={family.id} onClick={() => setSelectedFamilyId(family.id)}><span>{family.code}{isSyntheticDemoFamily(family) ? " · SINTÉTICA" : ""}</span><strong>{family.nickname || "Sem apelido"}</strong><small>{family.focus || "Foco ainda não definido"}</small></button>)}</div>
        </section>
        {selectedFamily ? <section className="card"><div className="section-head"><div><p className="eyebrow">{selectedFamily.code}{isSyntheticDemoFamily(selectedFamily) ? " · SINTÉTICA" : ""}</p><h2>{selectedFamily.nickname || "Família"}</h2></div><div className="action-row"><button onClick={() => setComposer("family-edit")}>Editar família</button><button onClick={() => setComposer("person")}>Pessoa</button></div></div><p>{selectedFamily.focus || "Foco ainda não definido."}</p><div className="people-list">{selectedPeople.length ? selectedPeople.map((person) => <button className={person.id===selectedPersonId?"person-button selected":"person-button"} key={person.id} onClick={()=>setSelectedPersonId(person.id)}><strong>{person.displayName || person.code}</strong><span>{person.lifeStage || "faixa etária não informada"}</span></button>) : <p>Nenhuma pessoa registrada.</p>}</div><FamilyAssessmentsPanel family={selectedFamily} people={data.people} memberships={data.memberships} applications={data.assessments} demoActive={Boolean(demoSession)} onSaved={refresh}/>{selectedPerson&&<PersonCarePanel person={selectedPerson} familyId={selectedFamily.id} conditions={data.conditions.filter((x)=>x.personId===selectedPerson.id)} medications={data.medications.filter((x)=>x.personId===selectedPerson.id)} exams={data.examResults.filter((x)=>x.personId===selectedPerson.id)} screenings={data.screenings.filter((x)=>x.personId===selectedPerson.id)} plans={data.carePlans.filter((x)=>x.personId===selectedPerson.id)} encounters={data.encounters} onSaved={refresh}/>}<FamilyRelations family={selectedFamily} people={selectedPeople} memberships={data.memberships} relationships={data.relationships.filter((x)=>x.familyId===selectedFamily.id)} resources={data.resources.filter((x)=>x.familyId===selectedFamily.id)} links={data.externalLinks.filter((x)=>x.familyId===selectedFamily.id)} onSaved={refresh}/><h3>Trajetória familiar</h3><Timeline items={timeline} /></section> : <section className="card empty-card"><h2>Escolha uma família</h2><p>A ficha aparecerá aqui sem exigir um formulário longo.</p></section>}
      </>}

      {tab === "journey" && (journeySemester ? <JourneyDashboard data={data} semester={journeySemester} onSaved={refresh} onVisit={(familyId)=>{setSelectedFamilyId(familyId);setTab("care")}} /> : <section className="card"><p className="eyebrow">Semestre ativo</p><h2>Nenhuma Jornada ativa</h2><p>Crie uma Jornada para organizar o acompanhamento longitudinal.</p><button onClick={() => setComposer("semester")}>Criar Jornada</button></section>)}

      {tab === "more" && <><DemoModePanel active={Boolean(demoSession)} families={data.families} onChanged={refresh} /><ReleaseAudit /><StorageDashboard /><section className="card"><p className="eyebrow">Marco 2</p><h2>Escopo local</h2><p>A versão está operacional para estudo, organização e demonstração acadêmica local. O Mapa não substitui prontuário ou prescrição institucional.</p></section></>}

      <nav className="bottom-nav" aria-label="Navegação principal">{(Object.keys(labels) as Tab[]).map((item) => <button key={item} className={tab===item?"active":""} onClick={() => setTab(item)}><span aria-hidden="true">{item === "home" ? "⌂" : item === "clinical" ? "+" : item === "care" ? "✦" : item === "journey" ? "◇" : "•••"}</span>{labels[item]}</button>)}</nav>

      {composer && <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposer(null); }}><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="composer-title"><div className="sheet-handle" /><button className="close-button" onClick={() => setComposer(null)} aria-label="Fechar">×</button>{composer === "family" && <FamilyForm code={nextFamilyCode(data.families)} onSubmit={submitFamily} />}{composer === "family-edit" && selectedFamily && <FamilyForm code={selectedFamily.code} family={selectedFamily} onSubmit={submitFamily} />}{composer === "person" && selectedFamily && <PersonForm code={nextPersonCode(data.people, selectedFamily.code)} onSubmit={submitPerson} />}{composer === "encounter" && <EncounterForm families={data.families} people={data.people} memberships={data.memberships} onSubmit={submitEncounter} />}{composer === "semester" && <SemesterForm onSubmit={submitSemester} />}</section></div>}
    </main>
  );
}

function Timeline({ items }: { items: ReturnType<typeof buildTimeline> }) { return <div className="timeline">{items.length ? items.map((item) => <article key={`${item.type}-${item.id}`}><span className={`timeline-dot ${item.type}`} /><div><strong>{item.title}</strong>{item.subtitle && <p>{item.subtitle}</p>}<small>{new Date(item.at).toLocaleString("pt-BR")}</small></div></article>) : <p>Nenhum evento registrado.</p>}</div>; }
function FamilyForm({ code, family, onSubmit }: { code:string; family?:ReturnType<typeof createFamily>; onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">{family ? "Editar núcleo" : "Novo núcleo"}</p><h2 id="composer-title">{family ? "Editar família" : "Adicionar família"}</h2><label>Código<input name="code" defaultValue={family?.code ?? code} required /></label><label>Apelido opcional<input name="nickname" defaultValue={family?.nickname ?? ""} placeholder="Ex.: Horizonte" /></label><label>Foco inicial<textarea name="focus" defaultValue={family?.focus ?? ""} placeholder="O que motivou o acompanhamento?" /></label><button type="submit">{family ? "Salvar alterações" : "Salvar família"}</button></form>; }
function PersonForm({ code, onSubmit }: { code:string; onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Nova pessoa</p><h2 id="composer-title">Adicionar à família</h2><label>Código<input name="code" defaultValue={code} required /></label><label>Nome de exibição opcional<input name="displayName" /></label><label>Faixa etária<select name="lifeStage" defaultValue="unknown"><option value="unknown">Não informada</option><option value="child">Criança</option><option value="adolescent">Adolescente</option><option value="adult">Adulta</option><option value="older-adult">Pessoa idosa</option></select></label><label>Papel familiar<input name="roleLabel" placeholder="Ex.: filha, companheiro" required /></label><label>Função de cuidado<select name="careRole" defaultValue="none"><option value="none">Não definida</option><option value="support">Apoio</option><option value="primary-caregiver">Cuidadora principal</option><option value="care-recipient">Pessoa acompanhada</option></select></label><button type="submit">Salvar pessoa</button></form>; }
function SemesterForm({ onSubmit }: { onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Nova Jornada</p><h2 id="composer-title">Criar semestre</h2><label>Código<input name="code" defaultValue="SEM-2026-2" required /></label><label>Nome<input name="label" defaultValue="UBS, segundo semestre de 2026" required /></label><label>Famílias esperadas<input name="expectedFamilyCount" type="number" min="1" defaultValue="2" required /></label><p className="fine-print">Este número organiza a Jornada, mas não limita substituições ou famílias adicionais.</p><button type="submit">Criar Jornada</button></form>; }
function EncounterForm({ families, people, memberships, onSubmit }: { families:ReturnType<typeof useMapaData>["data"]["families"]; people:ReturnType<typeof useMapaData>["data"]["people"]; memberships:ReturnType<typeof useMapaData>["data"]["memberships"]; onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { const [familyId,setFamilyId]=useState(families[0]?.id || ""); const familyPeople=familyId?peopleInFamily(people,memberships,familyId):[]; return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Registro rápido</p><h2 id="composer-title">Novo encontro</h2><label>Família<select name="familyId" value={familyId} onChange={(event)=>setFamilyId(event.target.value)} required><option value="">Escolha</option>{families.map((family)=><option key={family.id} value={family.id}>{family.code} · {family.nickname}</option>)}</select></label><label>Tipo<select name="kind" defaultValue="brief-contact"><option value="first-contact">Primeiro contato</option><option value="consultation">Consulta</option><option value="home-visit">Visita domiciliar</option><option value="brief-contact">Contato breve</option><option value="family-meeting">Reunião familiar</option><option value="supervision">Discussão com preceptoria</option><option value="review">Revisão posterior</option></select></label>{familyPeople.length>0&&<fieldset><legend>Participantes</legend>{familyPeople.map((person)=><label className="check-row" key={person.id}><input type="checkbox" name="personIds" value={person.id} />{person.displayName||person.code}</label>)}</fieldset>}<label>Assunto principal<input name="title" required /></label><label>Registro breve<textarea name="freeText" rows={4} /></label><label>Próximo passo<input name="nextStep" /></label><label>Pendência opcional<input name="pending" placeholder="Ex.: conferir documento" /></label><button type="submit">Salvar encontro</button></form>; }

``

# END FILE: app/workspace.tsx

---

# FILE: CONTRIBUTING.md

``markdown
# Contribuição

## Antes de alterar

1. leia `docs/PROJECT_STATE.md`;
2. leia `docs/DECISIONS.md`;
3. identifique critérios afetados;
4. crie ADR se necessário.

## Commits

Use mensagens objetivas, por exemplo:

```text
feat(storage): cria contrato de migração do IndexedDB
test(privacy): impede terceiro no resumo compartilhável
docs(adr): registra escolha do motor de ecomapa
```

## Pull requests

Devem declarar:

- objetivo;
- impacto em dados;
- impacto clínico;
- impacto em privacidade;
- testes executados;
- documentação atualizada.

``

# END FILE: CONTRIBUTING.md

---

# FILE: docs/ACCEPTANCE_CRITERIA.md

``markdown
# Critérios de Aceitação

## Fundação

- [ ] Instalar como PWA.
- [ ] Operar offline após instalação.
- [ ] Confirmar salvamento no IndexedDB.
- [ ] Solicitar armazenamento persistente quando suportado.
- [ ] Detectar múltiplas abas editando o mesmo registro.
- [ ] Atualizar sem interromper edição.
- [ ] Separar demonstração e produção.

## Pessoas e famílias

- [ ] Pessoa pode integrar múltiplas famílias.
- [ ] Pessoa pode residir em múltiplos domicílios ao longo do tempo.
- [ ] Quantidade esperada de famílias não limita cadastro ou substituição.
- [ ] Relações aceitam perspectivas divergentes.
- [ ] Informação de terceiro permanece bloqueada por padrão.

## Clínica

- [ ] Termo relatado pode ser salvo sem normalização.
- [ ] Resultado sem unidade é preservado e não interpretado.
- [ ] Resultados compatíveis podem ser comparados.
- [ ] Resultados incompatíveis não entram no mesmo gráfico.
- [ ] Interpretação histórica preserva versão.
- [ ] Marcadores contextuais aparecem sem causalidade automática.

## Instrumento local da ESF

- [ ] Definição da página 28 é tipada, versionada e possui proveniência.
- [ ] Aplicações futuras exigem `familyId` e `personId`, com `personId` como sujeito clínico.
- [ ] Blocos ausentes permanecem placeholders sem perguntas inventadas.
- [ ] Idade, IMC, média de PA e circunferência local têm cálculos puros testados.
- [ ] Controle da PA, risco cardiovascular, HbA1c e CIAP-2 permanecem manuais.
- [ ] Propostas de atualização familiar/ecomapa exigem revisão e não atualizam o domínio automaticamente.
- [ ] Avaliações aparecem dentro da família, com seleção explícita de pessoa e histórico isolado por `personId`.
- [ ] A visão familiar de avaliações mostra somente status, datas e quantidade, nunca respostas clínicas.
- [ ] A interface de avaliações mostra progresso por bloco, revisão estrutural sem narrativa clínica e confirma alterações não salvas antes de sair.
- [ ] Pressão arterial mantém sistólica, diastólica e data por visita; circunferência exige critério local explícito e só então mostra classificação calculada.
- [ ] Blocos sem fonte não entram no denominador dos campos disponíveis e o bloco 8 não cria campos clínicos.
- [ ] Rascunhos, revisão, conclusão, arquivamento e retificação preservam o original.
- [ ] Blocos sem fonte aparecem como indisponíveis, sem perguntas inventadas.

## Farmacologia

- [ ] Medicamento desconhecido pode ser registrado.
- [ ] Uso real e receita são separados.
- [ ] Dose sem unidade não é publicada.
- [ ] Regime exige indicação, população, via e apresentação.
- [ ] Duplicidade estrutural é detectável quando os medicamentos estão identificados.
- [ ] A interface declara que ausência de alerta não exclui interação.

## Compartilhamento

- [ ] Modo acompanhamento isola a navegação.
- [ ] Saída exige autenticação.
- [ ] Notas privadas não aparecem.
- [ ] Informações de terceiro não aparecem.
- [ ] A pessoa pode sugerir correção sem editar diretamente.
- [ ] Itens mostrados ficam registrados.

## Jornada

- [ ] Semestre aceita número esperado de famílias sem limite rígido.
- [ ] Família pode ser substituída sem apagar a anterior.
- [ ] Semestre mostra trajetórias e não pontuação.
- [ ] Encerramento aceita processos inconclusos com destino explícito.
- [ ] Snapshot não muda com registros futuros.
- [ ] Adendo não altera o original.

## Backup

- [ ] Arquivo é validado antes de restaurar.
- [ ] Checksum detecta corrupção.
- [ ] Migração ocorre em área temporária.
- [ ] Relações órfãs são detectadas.
- [ ] Visibilidade, layouts, snapshots e versões são preservados.
- [ ] Backup protegido explica impossibilidade de recuperação sem senha.

``

# END FILE: docs/ACCEPTANCE_CRITERIA.md

---

# FILE: docs/adr/0001-local-first-sem-nuvem-na-v1.md

``markdown
# ADR 0001: Local-first sem nuvem na primeira versão

## Estado

Aceita.

## Contexto

O Mapa armazena dados sensíveis e precisa operar em ambiente com conectividade instável. Contas e sincronização aumentariam superfície de risco, complexidade e dependência.

## Decisão

A primeira versão utiliza armazenamento local no dispositivo. Vercel distribui os arquivos do aplicativo, mas não recebe registros clínicos. IA externa funciona por cópia manual e desidentificada.

## Consequências

- funcionamento offline;
- necessidade de backup explícito;
- dados associados ao domínio de produção;
- ausência de sincronização entre dispositivos;
- necessidade de comunicar limites de persistência.

``

# END FILE: docs/adr/0001-local-first-sem-nuvem-na-v1.md

---

# FILE: docs/adr/0002-familias-esperadas-nao-limitadas.md

``markdown
# ADR 0002: Famílias esperadas não constituem limite técnico

## Estado

Aceita.

## Contexto

A previsão acadêmica é acompanhar duas famílias. Uma família pode recusar, interromper ou precisar ser substituída.

## Decisão

O semestre armazena `expectedFamilyCount`, mas permite qualquer quantidade de vínculos. A substituição encerra ou altera o vínculo com o semestre sem apagar a família ou seu histórico.

## Consequências

- Jornada permanece estável diante de recusas;
- histórico de famílias anteriores é preservado;
- critérios e testes devem cobrir substituição;
- interface comunica expectativa em vez de capacidade máxima.

``

# END FILE: docs/adr/0002-familias-esperadas-nao-limitadas.md

---

# FILE: docs/adr/0003-indexeddb-nativo-no-marco-1.md

``markdown
# ADR 0003: IndexedDB nativo no Marco 1

## Estado

Aceita.

## Contexto

A fundação precisa controlar schema, transações, verificação e migrações sem acoplar o domínio a uma biblioteca. IndexedDB é assíncrono, transacional e adequado a dados estruturados locais.

## Decisão

O Marco 1 usa uma camada própria e pequena sobre IndexedDB nativo. O domínio não acessa a API diretamente. Uma biblioteca poderá ser adotada depois por ADR, sem alterar contratos de domínio.

## Consequências

- menos dependências na fundação;
- maior responsabilidade de teste;
- controle explícito das transações;
- adaptador substituível.

``

# END FILE: docs/adr/0003-indexeddb-nativo-no-marco-1.md

---

# FILE: docs/adr/0004-pin-bloqueio-backup-cifrado.md

``markdown
# ADR 0004: PIN para bloqueio e senha separada para backup cifrado

## Estado

Aceita.

## Contexto

O bloqueio da interface e a cifragem restaurável cumprem papéis diferentes. Usar um PIN curto como chave direta de todos os dados criaria falsa segurança e risco de perda.

## Decisão

- PIN de 6 a 12 dígitos bloqueia a interface e é derivado com PBKDF2 e salt;
- backup protegido exige senha de pelo menos 12 caracteres;
- backup usa PBKDF2-SHA-256 e AES-GCM;
- não existe recuperação secreta;
- PIN não é apresentado como cifragem integral do banco.

## Consequências

A interface deve explicar o papel de cada mecanismo. Criptografia integral do banco poderá ser avaliada posteriormente por ADR e testes de desempenho.

``

# END FILE: docs/adr/0004-pin-bloqueio-backup-cifrado.md

---

# FILE: docs/adr/0005-service-worker-conservador.md

``markdown
# ADR 0005: Service Worker conservador

## Estado

Aceita.

## Decisão

- navegações usam rede com fallback de cache;
- ativos estáticos podem ser armazenados após resposta válida;
- rotas centrais possuem fallback offline;
- atualizações não dependem de AppCache;
- nenhuma resposta clínica remota é cacheada porque a primeira versão não possui API clínica pessoal.

``

# END FILE: docs/adr/0005-service-worker-conservador.md

---

