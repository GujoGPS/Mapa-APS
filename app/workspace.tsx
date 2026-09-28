"use client";

import { type FormEvent, useMemo, useState } from "react";
import type { EncounterKind } from "@/src/contracts/care";
import { createEncounter, createFamily, createMembership, createPending, createPerson, createSemester, linkFamilyToSemester } from "@/src/domain/factories";
import { seedSyntheticSemester } from "@/src/domain/demo-seed";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { saveEntity } from "@/src/domain/repository";
import { buildTimeline, nextFamilyCode, nextPersonCode, peopleInFamily } from "@/src/domain/selectors";
import { useMapaData } from "@/src/hooks/use-mapa-data";
import { StorageDashboard } from "./storage-dashboard";
import { PersonCarePanel } from "./person-care-panel";
import { ClinicalLibrary } from "./clinical-library";
import { FamilyRelations } from "./family-relations";
import { JourneyDashboard } from "./journey-dashboard";
import { ReleaseAudit } from "./release-audit";

type Tab = "home" | "clinical" | "care" | "journey" | "more";
type Composer = "family" | "person" | "encounter" | "semester" | null;

const labels: Record<Tab, string> = { home: "Início", clinical: "Clínica", care: "Cuidado", journey: "Jornada", more: "Mais" };

export function Workspace() {
  const { data, loading, error, refresh } = useMapaData();
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

  async function seed() {
    await seedSyntheticSemester(); await refresh(); setMessage("Semestre e famílias sintéticas carregados.");
  }

  async function submitFamily(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const family = createFamily({ code: String(form.get("code")), nickname: String(form.get("nickname") || ""), focus: String(form.get("focus") || "") });
    await saveEntity(ENTITY_TYPES.family, family);
    if (activeSemester) await saveEntity(ENTITY_TYPES.semesterFamily, linkFamilyToSemester({ semesterId: activeSemester.id, familyId: family.id }));
    await refresh(); setSelectedFamilyId(family.id); setComposer(null); setMessage("Família salva e verificada no dispositivo.");
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
      <header className="app-header"><div><p className="eyebrow">Mapa</p><h1>{labels[tab]}</h1></div><span className="local-badge">Local</span></header>
      {error && <p className="error-banner" role="alert">{error}</p>}
      <p className="system-message" role="status" aria-live="polite">{message}</p>

      {tab === "home" && <>
        <section className="card hero-card"><p className="eyebrow">Agora</p><h2>{activeSemester ? activeSemester.label : "Comece sua Jornada"}</h2><p>{data.families.length ? `${data.families.length} família(s) no dispositivo e ${data.pending.filter((item) => item.destination === "open").length} pendência(s) aberta(s).` : "Crie um semestre ou carregue a simulação sintética."}</p><div className="action-row">{!activeSemester && <button onClick={() => setComposer("semester")}>Criar Jornada</button>}<button onClick={() => setComposer("encounter")} disabled={!data.families.length}>Novo encontro</button>{!data.families.length && <button onClick={seed}>Carregar demonstração</button>}</div></section>
        <section className="quick-grid"><button onClick={() => { setTab("care"); setComposer("family"); }}>Nova família</button><button onClick={() => setTab("care")}>Abrir cuidado</button><button onClick={() => setTab("journey")}>Visitar semestre</button><button onClick={() => setTab("more")}>Estado local</button></section>
        <section className="card"><p className="eyebrow">Recentes</p><Timeline items={buildTimeline(data.encounters, data.pending).slice(0, 5)} /></section>
      </>}

      {tab === "clinical" && <ClinicalLibrary />}

      {tab === "care" && <>
        <section className="card"><div className="section-head"><div><p className="eyebrow">Famílias</p><h2>Acompanhamento</h2></div><button onClick={() => setComposer("family")}>Adicionar</button></div>
          <div className="family-list">{data.families.map((family) => <button className={family.id === selectedFamilyId ? "family-button selected" : "family-button"} key={family.id} onClick={() => setSelectedFamilyId(family.id)}><span>{family.code}</span><strong>{family.nickname || "Sem apelido"}</strong><small>{family.focus || "Foco ainda não definido"}</small></button>)}</div>
        </section>
        {selectedFamily ? <section className="card"><div className="section-head"><div><p className="eyebrow">{selectedFamily.code}</p><h2>{selectedFamily.nickname || "Família"}</h2></div><button onClick={() => setComposer("person")}>Pessoa</button></div><p>{selectedFamily.focus || "Foco ainda não definido."}</p><div className="people-list">{selectedPeople.length ? selectedPeople.map((person) => <button className={person.id===selectedPersonId?"person-button selected":"person-button"} key={person.id} onClick={()=>setSelectedPersonId(person.id)}><strong>{person.displayName || person.code}</strong><span>{person.lifeStage || "faixa etária não informada"}</span></button>) : <p>Nenhuma pessoa registrada.</p>}</div>{selectedPerson&&<PersonCarePanel person={selectedPerson} familyId={selectedFamily.id} conditions={data.conditions.filter((x)=>x.personId===selectedPerson.id)} medications={data.medications.filter((x)=>x.personId===selectedPerson.id)} exams={data.examResults.filter((x)=>x.personId===selectedPerson.id)} screenings={data.screenings.filter((x)=>x.personId===selectedPerson.id)} plans={data.carePlans.filter((x)=>x.personId===selectedPerson.id)} encounters={data.encounters} onSaved={refresh}/>}<FamilyRelations family={selectedFamily} people={selectedPeople} memberships={data.memberships} relationships={data.relationships.filter((x)=>x.familyId===selectedFamily.id)} resources={data.resources.filter((x)=>x.familyId===selectedFamily.id)} links={data.externalLinks.filter((x)=>x.familyId===selectedFamily.id)} onSaved={refresh}/><h3>Trajetória familiar</h3><Timeline items={timeline} /></section> : <section className="card empty-card"><h2>Escolha uma família</h2><p>A ficha aparecerá aqui sem exigir um formulário longo.</p></section>}
      </>}

      {tab === "journey" && (journeySemester ? <JourneyDashboard data={data} semester={journeySemester} onSaved={refresh} onVisit={(familyId)=>{setSelectedFamilyId(familyId);setTab("care")}} /> : <section className="card"><p className="eyebrow">Semestre ativo</p><h2>Nenhuma Jornada ativa</h2><p>Crie uma Jornada para organizar o acompanhamento longitudinal.</p><button onClick={() => setComposer("semester")}>Criar Jornada</button></section>)}

      {tab === "more" && <><ReleaseAudit /><StorageDashboard /><section className="card"><p className="eyebrow">Marco 2</p><h2>Escopo local</h2><p>A versão está operacional para estudo, organização e demonstração acadêmica local. O Mapa não substitui prontuário ou prescrição institucional.</p></section></>}

      <nav className="bottom-nav" aria-label="Navegação principal">{(Object.keys(labels) as Tab[]).map((item) => <button key={item} className={tab===item?"active":""} onClick={() => setTab(item)}><span aria-hidden="true">{item === "home" ? "⌂" : item === "clinical" ? "+" : item === "care" ? "✦" : item === "journey" ? "◇" : "•••"}</span>{labels[item]}</button>)}</nav>

      {composer && <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposer(null); }}><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="composer-title"><div className="sheet-handle" /><button className="close-button" onClick={() => setComposer(null)} aria-label="Fechar">×</button>{composer === "family" && <FamilyForm code={nextFamilyCode(data.families)} onSubmit={submitFamily} />}{composer === "person" && selectedFamily && <PersonForm code={nextPersonCode(data.people, selectedFamily.code)} onSubmit={submitPerson} />}{composer === "encounter" && <EncounterForm families={data.families} people={data.people} memberships={data.memberships} onSubmit={submitEncounter} />}{composer === "semester" && <SemesterForm onSubmit={submitSemester} />}</section></div>}
    </main>
  );
}

function Timeline({ items }: { items: ReturnType<typeof buildTimeline> }) { return <div className="timeline">{items.length ? items.map((item) => <article key={`${item.type}-${item.id}`}><span className={`timeline-dot ${item.type}`} /><div><strong>{item.title}</strong>{item.subtitle && <p>{item.subtitle}</p>}<small>{new Date(item.at).toLocaleString("pt-BR")}</small></div></article>) : <p>Nenhum evento registrado.</p>}</div>; }
function FamilyForm({ code, onSubmit }: { code:string; onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Novo núcleo</p><h2 id="composer-title">Adicionar família</h2><label>Código<input name="code" defaultValue={code} required /></label><label>Apelido opcional<input name="nickname" placeholder="Ex.: Horizonte" /></label><label>Foco inicial<textarea name="focus" placeholder="O que motivou o acompanhamento?" /></label><button type="submit">Salvar família</button></form>; }
function PersonForm({ code, onSubmit }: { code:string; onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Nova pessoa</p><h2 id="composer-title">Adicionar à família</h2><label>Código<input name="code" defaultValue={code} required /></label><label>Nome de exibição opcional<input name="displayName" /></label><label>Faixa etária<select name="lifeStage" defaultValue="unknown"><option value="unknown">Não informada</option><option value="child">Criança</option><option value="adolescent">Adolescente</option><option value="adult">Adulta</option><option value="older-adult">Pessoa idosa</option></select></label><label>Papel familiar<input name="roleLabel" placeholder="Ex.: filha, companheiro" required /></label><label>Função de cuidado<select name="careRole" defaultValue="none"><option value="none">Não definida</option><option value="support">Apoio</option><option value="primary-caregiver">Cuidadora principal</option><option value="care-recipient">Pessoa acompanhada</option></select></label><button type="submit">Salvar pessoa</button></form>; }
function SemesterForm({ onSubmit }: { onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Nova Jornada</p><h2 id="composer-title">Criar semestre</h2><label>Código<input name="code" defaultValue="SEM-2026-2" required /></label><label>Nome<input name="label" defaultValue="UBS, segundo semestre de 2026" required /></label><label>Famílias esperadas<input name="expectedFamilyCount" type="number" min="1" defaultValue="2" required /></label><p className="fine-print">Este número organiza a Jornada, mas não limita substituições ou famílias adicionais.</p><button type="submit">Criar Jornada</button></form>; }
function EncounterForm({ families, people, memberships, onSubmit }: { families:ReturnType<typeof useMapaData>["data"]["families"]; people:ReturnType<typeof useMapaData>["data"]["people"]; memberships:ReturnType<typeof useMapaData>["data"]["memberships"]; onSubmit:(event:FormEvent<HTMLFormElement>)=>void }) { const [familyId,setFamilyId]=useState(families[0]?.id || ""); const familyPeople=familyId?peopleInFamily(people,memberships,familyId):[]; return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Registro rápido</p><h2 id="composer-title">Novo encontro</h2><label>Família<select name="familyId" value={familyId} onChange={(event)=>setFamilyId(event.target.value)} required><option value="">Escolha</option>{families.map((family)=><option key={family.id} value={family.id}>{family.code} · {family.nickname}</option>)}</select></label><label>Tipo<select name="kind" defaultValue="brief-contact"><option value="first-contact">Primeiro contato</option><option value="consultation">Consulta</option><option value="home-visit">Visita domiciliar</option><option value="brief-contact">Contato breve</option><option value="family-meeting">Reunião familiar</option><option value="supervision">Discussão com preceptoria</option><option value="review">Revisão posterior</option></select></label>{familyPeople.length>0&&<fieldset><legend>Participantes</legend>{familyPeople.map((person)=><label className="check-row" key={person.id}><input type="checkbox" name="personIds" value={person.id} />{person.displayName||person.code}</label>)}</fieldset>}<label>Assunto principal<input name="title" required /></label><label>Registro breve<textarea name="freeText" rows={4} /></label><label>Próximo passo<input name="nextStep" /></label><label>Pendência opcional<input name="pending" placeholder="Ex.: conferir documento" /></label><button type="submit">Salvar encontro</button></form>; }
