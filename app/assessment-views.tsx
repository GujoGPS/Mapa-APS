"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clinicalVisibleFacts,
  factsForCurrentRevision,
  listFactsForPerson,
  longitudinalChanges,
  personVisibleFactsAfterReview,
  type CareFact,
  type InstrumentApplication,
  type LongitudinalFactChange,
} from "@/src/clinical/assessments";

interface Props {
  personId: string;
  personLabel: string;
  applications: InstrumentApplication[];
}

type View = "clinical" | "person" | "changes";

const viewLabels: Record<View, string> = {
  clinical: "Visão acadêmica",
  person: "Visão da pessoa",
  changes: "Comparar aplicações",
};

const changeLabels: Record<LongitudinalFactChange["changeType"], string> = {
  added: "novo",
  removed: "ausente na nova",
  changed: "alterado",
  unchanged: "sem mudança",
  "became-applicable": "passou a se aplicar",
  "became-not-applicable": "deixou de se aplicar",
  "newly-missing": "ficou sem dado",
  "resolved-missing": "dado recuperado",
};

const categoryLabels: Record<string, string> = {
  demographic: "Dados sociodemográficos",
  "social-context": "Contexto social",
  "reported-condition": "Condições relatadas",
  screening: "Rastreamentos",
  measurement: "Medidas",
  "calculated-result": "Cálculos derivados",
  "manual-classification": "Classificação manual",
  "physical-exam": "Exame físico",
  "foot-assessment": "Avaliação dos pés",
  "service-or-referral": "Serviços e encaminhamentos",
  "care-follow-up": "Seguimento do cuidado",
  "missing-data": "Informação faltante",
  "source-limitation": "Limitações da fonte",
  "family-context": "Contexto familiar",
  "proposed-change": "Mudanças propostas",
};

function describe(fact: CareFact): string {
  const value = typeof fact.value === "object" ? JSON.stringify(fact.value) : String(fact.value);
  return `${fact.topic}: ${value}${fact.unit ? ` ${fact.unit}` : ""}`;
}

function FactList({ facts, empty }: { facts: CareFact[]; empty: string }) {
  if (!facts.length) return <p className="fine-print">{empty}</p>;
  const groups = new Map<string, CareFact[]>();
  for (const fact of facts) {
    const bucket = groups.get(fact.category) ?? [];
    bucket.push(fact);
    groups.set(fact.category, bucket);
  }
  return <div className="fact-groups">{[...groups.entries()].map(([category, items]) => (
    <section key={category} className="fact-group">
      <h4>{categoryLabels[category] ?? category}</h4>
      <ul>{items.map((fact) => (
        <li key={fact.factId}>
          <span>{describe(fact)}</span>
          <small>{fact.certaintyState}{fact.actionable ? " · requer ação" : ""}{fact.ruleId ? ` · ${fact.ruleId}` : ""}</small>
        </li>
      ))}</ul>
    </section>
  ))}</div>;
}

export function AssessmentViews({ personId, personLabel, applications }: Props) {
  const [facts, setFacts] = useState<CareFact[]>([]);
  const [view, setView] = useState<View>("clinical");
  const [olderId, setOlderId] = useState("");
  const [newerId, setNewerId] = useState("");

  useEffect(() => {
    let active = true;
    void listFactsForPerson(personId).then((loaded) => { if (active) setFacts(loaded); }).catch(() => { if (active) setFacts([]); });
    return () => { active = false; };
  }, [personId]);

  const personApplications = useMemo(
    () => [...applications].filter((item) => item.personId === personId).sort((left, right) => left.assessmentDate.localeCompare(right.assessmentDate)),
    [applications, personId],
  );

  useEffect(() => {
    if (personApplications.length < 2) { setOlderId(""); setNewerId(""); return; }
    setOlderId((current) => current || personApplications[personApplications.length - 2]!.applicationId);
    setNewerId((current) => current || personApplications[personApplications.length - 1]!.applicationId);
  }, [personApplications]);

  const currentId = personApplications[personApplications.length - 1]?.applicationId ?? "";
  const currentFacts = factsForCurrentRevision(facts, currentId);
  const changes = useMemo(() => {
    const older = olderId ? factsForCurrentRevision(facts, olderId) : [];
    const newer = newerId ? factsForCurrentRevision(facts, newerId) : [];
    return older.length || newer.length ? longitudinalChanges(older, newer) : [];
  }, [facts, olderId, newerId]);

  const relevant = changes.filter((change) => change.changeType !== "unchanged");

  return (
    <section className="card assessment-views" aria-labelledby={`assessment-views-${personId}`}>
      <div className="section-head">
        <div><p className="eyebrow">Derivados da ficha</p><h3 id={`assessment-views-${personId}`}>Projetões de {personLabel}</h3></div>
      </div>
      <div className="relations-tabs" role="tablist">
        {(Object.keys(viewLabels) as View[]).map((item) => (
          <button key={item} role="tab" aria-selected={view === item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{viewLabels[item]}</button>
        ))}
      </div>

      {view === "clinical" && <FactList facts={clinicalVisibleFacts(currentFacts)} empty="Nenhum fato clínico derivado ainda." />}
      {view === "person" && <>
        <p className="fine-print">Notas internas, limitações da fonte e fatos pendentes de revisão não aparecem aqui.</p>
        <FactList facts={personVisibleFactsAfterReview(currentFacts)} empty="Nada liberado para a pessoa até aqui." />
      </>}
      {view === "changes" && <>
        {personApplications.length < 2
          ? <p className="fine-print">É preciso concluir ao menos duas aplicações desta pessoa para comparar.</p>
          : <>
            <div className="action-row">
              <label>Mais antiga<select value={olderId} onChange={(event) => setOlderId(event.target.value)}>{personApplications.map((item) => <option key={item.applicationId} value={item.applicationId}>{item.assessmentDate} · rev {item.revisionNumber}</option>)}</select></label>
              <label>Mais recente<select value={newerId} onChange={(event) => setNewerId(event.target.value)}>{personApplications.map((item) => <option key={item.applicationId} value={item.applicationId}>{item.assessmentDate} · rev {item.revisionNumber}</option>)}</select></label>
            </div>
            {relevant.length
              ? <ul className="fact-changes">{relevant.map((change) => <li key={change.topic}><span>{change.topic}</span><small>{changeLabels[change.changeType]}</small></li>)}</ul>
              : <p className="fine-print">Sem diferenças entre as aplicações selecionadas.</p>}
          </>}
      </>}
    </section>
  );
}
