"use client";

import { useMemo, useState } from "react";
import type { InstrumentApplication } from "@/src/clinical/assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { ExternalLink, InterpersonalRelationship } from "@/src/contracts/relations";

const acaoRotulo: Record<"created" | "edited" | "deleted", string> = {
  created: "criado",
  edited: "editado",
  deleted: "excluído",
};

const statusRotulo: Record<InstrumentApplication["status"], string> = {
  "not-started": "Não iniciada",
  draft: "Rascunho",
  "in-review": "Em revisão",
  completed: "Concluída",
  rectified: "Retificada",
  archived: "Arquivada",
};

function quando(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

export function HistoryPanel({ families, people, memberships, relationships, externalLinks, assessments }: {
  families: Family[];
  people: Person[];
  memberships: FamilyMembership[];
  relationships: InterpersonalRelationship[];
  externalLinks: ExternalLink[];
  assessments: InstrumentApplication[];
}) {
  const [openFamily, setOpenFamily] = useState<string>();

  const nome = useMemo(() => new Map(people.map((item) => [item.id, item.displayName || item.code])), [people]);
  const familiaDe = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const m of memberships) mapa.set(m.personId, m.familyId);
    return mapa;
  }, [memberships]);

  // So entram familias que ja produziram algum registro: lista vazia nao ajuda ninguem.
  const comHistorico = families.filter((f) =>
    relationships.some((r) => r.familyId === f.id)
    || externalLinks.some((l) => l.familyId === f.id)
    || assessments.some((a) => a.familyId === f.id));

  const vinculos = relationships.filter((r) => r.familyId === openFamily);
  const avaliacoes = assessments
    .filter((a) => a.familyId === openFamily)
    .sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate));

  return <section className="card history-panel" aria-labelledby="history-title">
    <div className="section-head"><div><p className="eyebrow">Mais</p><h2 id="history-title">Quem mudou e quando</h2></div></div>
    <p className="fine-print">Quem foi alterado, quando e por quê. Avaliações concluídas e retificações mantêm a cadeia entre si.</p>

    {!comHistorico.length && <p className="fine-print">Nenhuma família com histórico registrado ainda.</p>}

    {comHistorico.length > 0 && <ul className="history-family-list" aria-label="Famílias">
      {comHistorico.map((f) => {
        const quantas = assessments.filter((a) => a.familyId === f.id).length;
        const quantos = relationships.filter((r) => r.familyId === f.id).length;
        return <li key={f.id}><button aria-expanded={f.id === openFamily} onClick={() => setOpenFamily(f.id === openFamily ? undefined : f.id)}>
          <strong>Família {f.code}</strong>
          <span>{quantos} vínculo(s) · {quantas} aplicação(ões)</span>
        </button></li>;
      })}
    </ul>}

    {openFamily && <>
      <section className="link-group" aria-label="Conexões familiares">
        <h4>Conexões familiares</h4>
        {vinculos.length === 0 && <p className="fine-print">Nenhum vínculo registrado nesta família.</p>}
        {vinculos.map((r) => {
          const mudancas = [...(r.changeLog ?? [])].reverse();
          return <div className="link-row" key={r.id}>
            <div>
              <strong>{nome.get(r.sourcePersonId) ?? r.sourcePersonId} → {nome.get(r.targetPersonId) ?? r.targetPersonId}</strong>
              <span>{r.formalType}{r.notes ? ` · ${r.notes}` : ""}</span>
              {mudancas.length === 0 && <small>Sem alterações registradas.</small>}
              {mudancas.map((m, i) => <small key={`${m.at}-${i}`}>{quando(m.at)} · {acaoRotulo[m.action]} · {m.reason}</small>)}
            </div>
          </div>;
        })}
      </section>

      <section className="link-group" aria-label="Prontuário">
        <h4>Prontuário</h4>
        {avaliacoes.length === 0 && <p className="fine-print">Nenhuma aplicação registrada nesta família.</p>}
        {avaliacoes.map((a) => <div className="link-row" key={a.applicationId}>
          <div>
            <strong>{nome.get(a.personId) ?? a.personId} · {a.assessmentDate}</strong>
            <span>{statusRotulo[a.status]} · revisão {a.revisionNumber}</span>
            {a.rectifiesApplicationId && <small>retifica a avaliação anterior desta pessoa</small>}
            {a.status === "archived" && <small>{a.completedAt ? "Registro arquivado" : "Rascunho arquivado"}</small>}
          </div>
        </div>)}
      </section>
    </>}
  </section>;
}
