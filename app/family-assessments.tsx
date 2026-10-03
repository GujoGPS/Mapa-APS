"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import {
  adultDcntEsfDefinition, archiveApplication, automaticApplicabilityState, completeApplication, createAnswer, createApplication,
  createRectification, deriveApplicationResults, questionApplicable, returnApplicationToDraft, submitForReview,
  updateDraftApplication, type ApplicabilityOverride, type InstrumentAnswer, type InstrumentApplication,
  type QuestionDefinition, type SectionDefinition, validateApplicationAnswers,
} from "@/src/clinical/assessments";
import { peopleInFamily } from "@/src/domain/selectors";
import { AssessmentViews } from "./assessment-views";

interface Props { family: Family; people: Person[]; memberships: FamilyMembership[]; applications: InstrumentApplication[]; demoActive: boolean; onSaved: () => Promise<void>; startForPersonId?: string | undefined; onStartHandled?: (() => void) | undefined; }
const statusLabels: Record<InstrumentApplication["status"], string> = { "not-started": "Não iniciada", draft: "Rascunho", "in-review": "Em revisão", completed: "Concluída", rectified: "Retificada", archived: "Arquivada" };
function sectionPreview(section: SectionDefinition, application: InstrumentApplication): string {
  if (section.status === "source-missing") return "Bloco ainda não digitalizado: preenchimento indisponível temporariamente.";
  const perguntas = section.questions ?? [];
  const respondidas = perguntas.filter((q) => application.answers[q.id]?.status === "answered").length;
  const naoAplicaveis = perguntas.filter((q) => application.answers[q.id]?.applicabilityState === "not-applicable").length;
  const pendentes = perguntas.length - respondidas - naoAplicaveis;
  const partes = [`${respondidas} de ${perguntas.length} preenchidos`];
  if (naoAplicaveis) partes.push(`${naoAplicaveis} não se aplicam`);
  partes.push(pendentes ? `${pendentes} pendentes` : "sem pendências");
  return partes.join(" · ");
}

function assessmentKindLabel(application: InstrumentApplication): string {
  if (application.rectifiesApplicationId) return "Retificação de avaliação anterior";
  if (application.completedAt) return "Primeira avaliação desta pessoa";
  return "Avaliação em preenchimento";
}

/** Espera apos a ultima digitacao antes de gravar o rascunho sozinho. */
const AUTOSAVE_DEBOUNCE_MS = 1500;
const waistLabels = { "male-local-rule": "Critério local masculino", "female-local-rule": "Critério local feminino", "not-selected": "Critério não selecionado" };
const waistClassificationLabels = { low: "baixo", increased: "aumentado", "very-increased": "muito aumentado" };
const answerTypeLabels: Record<string, string> = { "short-text": "texto curto", "long-text": "texto longo", date: "data", number: "número", "single-choice": "escolha única", "multiple-choice": "múltipla escolha", "yes-no": "sim/não", "yes-no-never-did-does-not-remember": "rastreamento", measurement: "medida", "blood-pressure": "pressão arterial", "laboratory-result": "resultado laboratorial", "laterality-group": "lateralidade", "clinical-code": "código clínico", service: "serviço", "calculated-information": "informação calculada", "manual-classification": "classificação manual", "future-entity-link": "vínculo futuro" };

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

export function FamilyAssessmentsPanel({ family, people, memberships, applications, demoActive, onSaved, startForPersonId, onStartHandled }: Props) {
  const familyPeople = useMemo(() => peopleInFamily(people, memberships, family.id), [people, memberships, family.id]);
  const [personId, setPersonId] = useState(""); const [activeApplicationId, setActiveApplicationId] = useState<string>();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [editorControls, setEditorControls] = useState<{ state: "saved" | "dirty" | "saving" | "save-error"; save: () => Promise<boolean>; discard: () => void }>({ state: "saved", save: async () => true, discard: () => undefined });
  const personApplications = applications.filter((item) => item.familyId === family.id && item.personId === personId);
  // Arquivados saem da lista ativa e passam a viver em Mais → Histórico.
  const activeApplications = personApplications.filter((item) => item.status !== "archived");
  const selectedPerson = familyPeople.find((person) => person.id === personId);
  useEffect(() => setActiveApplicationId(undefined), [personId]);
  // Atalho de primeira avaliacao: consome o pedido, seleciona a pessoa e ja abre a ficha.
  useEffect(() => {
    if (!startForPersonId || !familyPeople.some((item) => item.id === startForPersonId)) return;
    setPersonId(startForPersonId);
    const action = async () => { const item = await createApplication({ familyId: family.id, personId: startForPersonId, assessmentDate: new Date().toISOString().slice(0, 10) }); await onSaved(); setActiveApplicationId(item.applicationId); onStartHandled?.(); };
    if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => { void action(); });
    else void action();
  }, [startForPersonId]);
  function guarded(action: () => void) {
    if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => action);
    else action();
  }
  async function start() { if (!personId) return; const action = async () => { const item = await createApplication({ familyId: family.id, personId, assessmentDate: new Date().toISOString().slice(0, 10) }); await onSaved(); setActiveApplicationId(item.applicationId); }; if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => { void action(); }); else await action(); }
  async function rectify(item: InstrumentApplication) { const action = async () => { const next = await createRectification(item.applicationId); await onSaved(); setActiveApplicationId(next.applicationId); }; if (editorControls.state === "dirty" || editorControls.state === "save-error") setPendingAction(() => { void action(); }); else await action(); }
  return <section className="assessments-panel" aria-labelledby={`assessments-${family.id}`}>
    <div className="section-head"><div><p className="eyebrow">Família · Avaliações</p><h2 id={`assessments-${family.id}`}>Avaliações</h2></div><span className="clinical-status">Pessoa é o sujeito clínico</span></div>
    <p className="fine-print">A visão familiar mostra somente status e datas. Respostas aparecem após seleção explícita de uma pessoa.</p>
    <div className="assessment-member-list">{familyPeople.map((person) => { const items = applications.filter((item) => item.familyId === family.id && item.personId === person.id); const latest = [...items].sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate))[0]; return <button className={person.id === personId ? "assessment-member selected" : "assessment-member"} key={person.id} onClick={() => guarded(() => setPersonId(person.id))}><strong>{person.displayName || person.code}</strong><span>{latest ? `${statusLabels[latest.status]} · ${latest.assessmentDate}` : "Avaliação não iniciada"}</span><small>{items.length} aplicação(ões)</small></button>; })}</div>
    {selectedPerson && <div className="assessment-person-area" key={selectedPerson.id}>
      <div className="assessment-person-header"><div><p className="eyebrow">Pessoa selecionada</p><h3>{selectedPerson.displayName || selectedPerson.code}</h3><small>Família {family.code} · {adultDcntEsfDefinition.version}</small></div><div className="action-row"><button onClick={() => void start()}>Nova aplicação</button></div></div>
      <AssessmentViews personId={selectedPerson.id} personLabel={selectedPerson.displayName || selectedPerson.code} applications={personApplications} />
      <div className="assessment-history">{activeApplications.length ? activeApplications.map((item) => <AssessmentHistoryCard key={item.applicationId} application={item} personLabel={selectedPerson.displayName || selectedPerson.code} onOpen={() => guarded(() => setActiveApplicationId(item.applicationId))} onRectify={() => void rectify(item)} />) : <p className="fine-print">Nenhuma aplicação ativa para esta pessoa. Rascunhos arquivados ficam em Mais → Histórico.</p>}</div>
      {applications.find((item) => item.applicationId === activeApplicationId) && <AssessmentEditor key={activeApplicationId} application={applications.find((item) => item.applicationId === activeApplicationId)!} onSaved={onSaved} onClose={() => guarded(() => setActiveApplicationId(undefined))} onRequestAction={(action) => guarded(() => { void action(); })} onEditStateChange={setEditorControls} demoActive={demoActive} />}
    </div>}
    {pendingAction && <div className="assessment-confirm" role="dialog" aria-modal="true" aria-labelledby="unsaved-title"><h4 id="unsaved-title">Há alterações não salvas</h4><p>Escolha como continuar sem descartar dados silenciosamente.</p><div className="action-row"><button onClick={() => { const action = pendingAction; void editorControls.save().then((ok) => { if (ok) { setPendingAction(null); action(); } }); }}>Salvar e continuar</button><button onClick={() => setPendingAction(null)}>Continuar editando</button><button onClick={() => { editorControls.discard(); const action = pendingAction; setPendingAction(null); action(); }}>Descartar alterações locais</button></div></div>}
  </section>;
}

function AssessmentHistoryCard({ application, personLabel, onOpen, onRectify }: { application: InstrumentApplication; personLabel: string; onOpen: () => void; onRectify: () => void }) {
  return <article className="assessment-history-card"><div><strong>{statusLabels[application.status]}</strong><span>{personLabel} · {application.assessmentDate} · revisão {application.revisionNumber}</span><small>{assessmentKindLabel(application)}</small>{application.rectifiesApplicationId && <small>Retifica a aplicação {application.rectifiesApplicationId}</small>}</div><div className="action-row"><button onClick={onOpen}>{application.status === "draft" ? "Continuar" : "Visualizar"}</button>{(application.status === "completed" || application.status === "rectified") && <button onClick={onRectify}>Iniciar retificação</button>}</div></article>;
}

function AssessmentEditor({ application: initial, onSaved, onClose, onRequestAction, onEditStateChange, demoActive }: { application: InstrumentApplication; onSaved: () => Promise<void>; onClose: () => void; onRequestAction: (action: () => Promise<void>) => void; onEditStateChange: (controls: { state: "saved" | "dirty" | "saving" | "save-error"; save: () => Promise<boolean>; discard: () => void }) => void; demoActive: boolean }) {
  const [application, setApplication] = useState(initial); const [sectionId, setSectionId] = useState(adultDcntEsfDefinition.sections[0]?.id ?? ""); const [editState, setEditState] = useState<"saved" | "dirty" | "saving" | "save-error">("saved"); const [message, setMessage] = useState(""); const [lastSaved, setLastSaved] = useState(initial.updatedAt); const firstError = useRef<HTMLDivElement>(null); const fieldRefs = useRef(new Map<string, HTMLElement>());
  useEffect(() => { setApplication(initial); setEditState("saved"); setLastSaved(initial.updatedAt); }, [initial]);
  useEffect(() => { onEditStateChange({ state: editState, save, discard: () => { setApplication(initial); setEditState("saved"); } }); }, [editState, initial, onEditStateChange]);
  useEffect(() => { const handler = (event: BeforeUnloadEvent) => { if (editState === "dirty" || editState === "save-error") { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", handler); return () => window.removeEventListener("beforeunload", handler); }, [editState]);
  const validation = validateApplicationAnswers(application, adultDcntEsfDefinition, "draft"); const structural = validateApplicationAnswers(application, adultDcntEsfDefinition, "complete"); const results = deriveApplicationResults(application); const section = adultDcntEsfDefinition.sections.find((item) => item.id === sectionId) ?? adultDcntEsfDefinition.sections[0]; const editable = application.status === "draft" || application.status === "in-review";
  const sectionProgress = adultDcntEsfDefinition.sections.map((item) => ({ section: item, status: statusForSection(item, application, structural) }));
  function markChanged(next: InstrumentApplication) { setApplication(next); setEditState("dirty"); }
  const autosaveTimer = useRef<number | undefined>(undefined);
  function cancelAutosave() { if (autosaveTimer.current !== undefined) { window.clearTimeout(autosaveTimer.current); autosaveTimer.current = undefined; } }
  // Gravacao automatica: so reage a estado "dirty", entao nao interfere em revisao, conclusao nem retificacao.
  useEffect(() => {
    if (editState !== "dirty" || !editable) return;
    autosaveTimer.current = window.setTimeout(() => { autosaveTimer.current = undefined; void save({ autosave: true }); }, AUTOSAVE_DEBOUNCE_MS);
    return cancelAutosave;
  }, [application, editState, editable]);
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
  async function save(options: { autosave?: boolean } = {}): Promise<boolean> { cancelAutosave(); setEditState("saving"); try { const saved = await updateDraftApplication(application.applicationId, { answers: application.answers, applicabilityOverrides: application.applicabilityOverrides, ...(application.privateNotes === undefined ? {} : { privateNotes: application.privateNotes }), ...(application.waistCriterion === undefined ? {} : { waistCriterion: application.waistCriterion }) }); setApplication(saved); setEditState("saved"); setLastSaved(saved.updatedAt); setMessage(options.autosave ? "Salvo automaticamente." : "Salvo."); await onSaved(); return true; } catch (error) { setEditState("save-error"); setMessage(error instanceof Error ? error.message : "Erro ao salvar."); return false; } }
  function discard() { setApplication(initial); setEditState("saved"); setMessage("Alterações locais descartadas."); }
  async function review() { await save(); const next = await submitForReview(application.applicationId); setApplication(next); await onSaved(); }
  async function complete() { if (!structural.valid) { const first = firstBlockingQuestion(application, structural); if (first) { setSectionId(first.sectionId); window.setTimeout(() => fieldRefs.current.get(first.id)?.focus(), 0); } firstError.current?.focus(); setMessage(`Há ${structural.errors.length + (structural.missing?.length ?? 0)} pendência(s) impeditiva(s).`); return; } const next = await completeApplication(application.applicationId); setApplication(next); await onSaved(); setMessage("Aplicação concluída e preservada como registro imutável."); }
  const close = () => { if (editState === "dirty" || editState === "save-error") onClose(); else onClose(); };
  return <section className="assessment-editor" aria-labelledby={`assessment-editor-${application.applicationId}`}>
    <div className="assessment-editor-header"><div><p className="eyebrow">Pessoa {application.personId}</p><h3 id={`assessment-editor-${application.applicationId}`}>{adultDcntEsfDefinition.title}</h3><small>{adultDcntEsfDefinition.version} · {statusLabels[application.status]} · {application.assessmentDate}</small></div><button onClick={close}>Fechar ficha</button></div>
    {demoActive && <p className="scope-callout">Aplicação demonstrativa: desaparece ao sair da demonstração e não entra no backup normal.</p>}
    <p className="assessment-save-status">{editState === "dirty" ? "Alterações não salvas" : editState === "saving" ? "Salvando…" : editState === "save-error" ? `Erro ao salvar: ${message}` : `Salvo em ${new Date(lastSaved).toLocaleString("pt-BR")}`}</p>
    <div className="assessment-progress"><strong>Conclusão dos campos disponíveis nesta versão</strong><span>{sectionProgress.filter((item) => !["source-missing", "not-applicable"].includes(item.status)).filter((item) => item.status === "structurally-complete").length}/{sectionProgress.filter((item) => item.status !== "source-missing").length} blocos incorporados</span><div className="assessment-section-statuses">{sectionProgress.map(({ section: item, status }) => <span key={item.id} data-status={status}>{item.printedBlockNumber ? `Bloco ${item.printedBlockNumber}` : "Cabeçalho"}: {statusLabel(status)}</span>)}</div></div>
    <div className="assessment-section-tabs" role="tablist" aria-label="Blocos do formulário">{adultDcntEsfDefinition.sections.map((item) => {
      const ausente = item.status === "source-missing";
      return <button role="tab" aria-selected={item.id === section?.id} key={item.id} className={item.id === section?.id ? "active" : ""} onClick={() => setSectionId(item.id)}>
        <span className="assessment-tab-title">{item.title}</span>
        <small>{item.printedBlockNumber ? `Bloco ${item.printedBlockNumber}` : "Cabeçalho"}</small>
        <small className="assessment-tab-preview">{sectionPreview(item, application)}</small>
        {ausente && <small className="assessment-tab-missing">Fonte ausente — bloco ainda não foi digitalizado</small>}
      </button>;
    })}</div>
    <div className="assessment-autosave" role="status" aria-live="polite" aria-label="Salvamento automático" data-state={editState}>{editState === "dirty" ? "Alterações não salvas — salvando automaticamente…" : editState === "saving" ? "Salvando automaticamente…" : editState === "save-error" ? `Falha ao salvar: ${message}` : `Salvo automaticamente em ${new Date(lastSaved).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}</div>
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
