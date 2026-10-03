"use client";

import { useEffect, useMemo, useState } from "react";
import { buildPrompt, type PromptInput, type PromptKind } from "@/src/clinical/ai/prompt-builder";
import { listFactsForFamily } from "@/src/clinical/assessments/fact-repository";
import type { CareFact } from "@/src/clinical/assessments/types";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InterpersonalRelationship } from "@/src/contracts/relations";

const CATEGORIAS: { id: PromptKind; titulo: string }[] = [
  { id: "caso", titulo: "Discussão de caso" },
  { id: "literatura", titulo: "Pesquisa de literatura" },
  { id: "ecomapa", titulo: "Embelezar e explicar ecomapa" },
  { id: "trauma", titulo: "Treino de descrição traumatológica" },
];

export function AiPromptsPanel({ families, people, memberships, relationships }: {
  families: Family[];
  people: Person[];
  memberships: FamilyMembership[];
  relationships: InterpersonalRelationship[];
}) {
  const [kind, setKind] = useState<PromptKind>("caso");
  const [familyId, setFamilyId] = useState<string>();
  const [personId, setPersonId] = useState<string>();
  const [incluirPessoas, setIncluirPessoas] = useState(true);
  const [copiado, setCopiado] = useState(false);
  const [facts, setFacts] = useState<CareFact[]>([]);

  // CareFacts vivem no repositório, não no estado do app: precisam ser lidos por família escolhida.
  useEffect(() => {
    let ativo = true;
    if (!familyId) { setFacts([]); return; }
    void listFactsForFamily(familyId).then((lista) => { if (ativo) setFacts(lista); }).catch(() => { if (ativo) setFacts([]); });
    return () => { ativo = false; };
  }, [familyId]);

  const familia = families.find((item) => item.id === familyId);
  const membros = useMemo(
    () => memberships.filter((m) => m.familyId === familyId).map((m) => ({ person: people.find((p) => p.id === m.personId)!, roleLabel: m.roleLabel })).filter((m) => Boolean(m.person)),
    [memberships, people, familyId],
  );
  const pessoa = people.find((item) => item.id === personId);

  const entrada: PromptInput | undefined = useMemo(() => {
    if (!familia) return undefined;
    const doCaso = facts.filter((fact) => fact.familyId === familia.id && (pessoa ? fact.personId === pessoa.id : true));
    return {
      kind,
      family: familia,
      person: pessoa,
      members: incluirPessoas ? membros : pessoa ? [{ person: pessoa, roleLabel: undefined }] : [],
      facts: doCaso,
      nonExportableLinkLabels: relationships.filter((r) => r.familyId === familia.id && (r.sharingState === "private" || r.sharingState === "blocked")).map((r) => r.formalType),
    };
  }, [familia, pessoa, membros, facts, kind, incluirPessoas, relationships]);

  const resultado = entrada ? buildPrompt(entrada) : undefined;

  async function copiar() {
    if (!resultado) return;
    try {
      await navigator.clipboard.writeText(resultado.text);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  }

  return <section className="card ai-prompts" aria-labelledby="ai-prompts-title">
    <div className="section-head">
      <div>
        <p className="eyebrow">Mais</p>
        <h2 id="ai-prompts-title">Montar prompt para IA externa</h2>
      </div>
    </div>
    <p className="fine-print">O Mapa não envia nada para nenhuma inteligência artificial. Escolha o caso e o que entra; o prompt sai preenchido com os códigos das pessoas e os dados clínicos já derivados, sem nomes. Nada sai daqui a não ser por um botão de copiar.</p>

    <div className="prompt-form">
      <label>Tipo de conversa
        <select value={kind} onChange={(event) => setKind(event.target.value as PromptKind)}>
          {CATEGORIAS.map((item) => <option key={item.id} value={item.id}>{item.titulo}</option>)}
        </select>
      </label>

      <label>Família
        <select value={familyId ?? ""} onChange={(event) => { setFamilyId(event.target.value || undefined); setPersonId(undefined); }}>
          <option value="">Selecione a família</option>
          {families.map((item) => <option key={item.id} value={item.id}>{item.code}</option>)}
        </select>
      </label>

      {familia && <label>Pessoa
        <select value={personId ?? ""} onChange={(event) => setPersonId(event.target.value || undefined)}>
          <option value="">Família inteira</option>
          {membros.map(({ person }) => <option key={person.id} value={person.id}>{person.code}</option>)}
        </select>
      </label>}

      {familia && membros.length > 1 && <label className="prompt-check">
        <input type="checkbox" checked={incluirPessoas} onChange={(event) => setIncluirPessoas(event.target.checked)} />
        Incluir os outros integrantes da família
      </label>}
    </div>

    {!familia && <p className="fine-print">Escolha uma família para montar o prompt.</p>}

    {familia && resultado && resultado.privacy.length > 0 && <div className="prompt-excluded prompt-privacy" role="status">
      <h4>Dado da pessoa retirado por privacidade</h4>
      <p>Não entra no texto por decisão de exportação. O restante do caso segue normalmente.</p>
      <ul>{resultado.privacy.map((item) => <li key={item.id}><strong>{item.detail}</strong> — {item.reason}</li>)}</ul>
    </div>}

    {familia && resultado && resultado.gaps.length > 0 && <details className="prompt-excluded prompt-gaps">
      <summary>Lacunas de preenchimento ({resultado.gapSummary.length})</summary>
      <p>São campos que a ficha não cobre ou ainda não foram preenchidos — não é restrição sobre a pessoa.</p>
      <ul>{resultado.gapSummary.map((detalhe) => <li key={detalhe}><strong>{detalhe}</strong></li>)}</ul>
    </details>}

    {familia && resultado && <>
      <pre className="prompt-text">{resultado.text}</pre>
      <div className="action-row">
        <button onClick={() => void copiar()}>{copiado ? "Copiado" : "Copiar prompt"}</button>
      </div>
    </>}
  </section>;
}
