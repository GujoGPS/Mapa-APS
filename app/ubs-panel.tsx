"use client";

import { sourceById } from "@/src/clinical/sources";

/**
 * Referência fixa da UBS.
 *
 * Conteúdo de uma unidade só, sem configuração por instalação: é o que a equipe consulta
 * para responder ao paciente. Não carrega dado de pessoa e não entra em backup.
 */

const SERVICOS: { nome: string; detalhe?: string }[] = [
  { nome: "Implanon" },
  { nome: "Pequenos procedimentos" },
  { nome: "Consulta médica" },
  { nome: "Consulta de enfermagem" },
  { nome: "Consulta odontológica" },
  { nome: "Tratamento Diretamente Observado (TDO)", detalhe: "acompanhamento da tomada de medicação em supervisionar" },
  { nome: "Vacinas", detalhe: "aplicação e atualização de cartão de vacinação" },
  { nome: "Administração de medicamentos" },
  { nome: "Testes rápidos" },
  { nome: "Acolhimento" },
  { nome: "Visitas domiciliares" },
  { nome: "Aferição de pressão arterial" },
  { nome: "Hemoglicemia capilar (HGT)" },
  { nome: "Farmácia básica e dispensação de medicamentos" },
  { nome: "Curativos" },
  { nome: "PSE — Programa Saúde na Escola" },
  { nome: "Agendamento de exames" },
  { nome: "Grupos" },
  { nome: "Sala de espera" },
];

const GRUPOS = [
  { nome: "Saúde e Bem-Estar físico", quando: "Encontros grafados para Bewegung, atividade física e cuidado do corpo." },
  { nome: "Roda de terapia", quando: "Encontro em grupo com condução de profissional de saúde mental." },
  { nome: "Grupo de idosos", quando: "Atividades para pessoas idosas, com foco em autonomia e convivência." },
];

const MODALIDADES = [
  {
    nome: "Agendado",
    prazo: "até 30 dias",
    detalhe: "Consulta ou procedimento marcado com data e hora definidas.",
  },
  {
    nome: "Mesmo dia",
    prazo: "até 24 horas",
    detalhe: "A critério da enfermeira do acolhimento, conforme a avaliação do caso.",
  },
];

const fonteEstoqueAberto = sourceById("pm-canoas-estoque-aberto");
if (!fonteEstoqueAberto) throw new Error("Fonte do Estoque Aberto ausente do catálogo clínico.");
const ESTOQUE_ABERTO = fonteEstoqueAberto;

export function UbsPanel() {
  return <section className="card ubs-panel" aria-labelledby="ubs-title">
    <div className="section-head">
      <div>
        <p className="eyebrow">Mais · Unidade</p>
        <h2 id="ubs-title">Serviços e agendamento</h2>
      </div>
    </div>
    <p className="fine-print">O que a unidade oferece e como agendar. Conteúdo de referência desta UBS, não configurável por instalação.</p>

    <section className="link-group" aria-label="Serviços ofertados">
      <h3>Serviços ofertados</h3>
      <ul className="ubs-list">
        {SERVICOS.map((servico) => <li key={servico.nome}>
          <strong>{servico.nome}</strong>
          {servico.detalhe && <small>{servico.detalhe}</small>}
        </li>)}
      </ul>
    </section>

    <section className="link-group" aria-label="Grupos ofertados">
      <h3>Grupos ofertados</h3>
      <ul className="ubs-list">
        {GRUPOS.map((grupo) => <li key={grupo.nome}>
          <strong>{grupo.nome}</strong>
          <small>{grupo.quando}</small>
        </li>)}
      </ul>
    </section>

    <section className="link-group" aria-label="Consulta de medicamentos em estoque aberto">
      <h3>Consulta de medicamentos — Estoque Aberto</h3>
      <p>A rede municipal publica em tempo real quais medicamentos há em cada farmácia e em que quantidade. Serve para orientar o paciente antes de ele se deslocar.</p>
      <p className="fine-print">Link externo: abre fora do app, no site da Prefeitura. A consulta é online; a retirada presencial exige cadastro e documento.</p>
      <a className="ubs-link" href={ESTOQUE_ABERTO.url} target="_blank" rel="noopener noreferrer">
        Abrir Estoque Aberto da Prefeitura <span aria-hidden="true">↗</span>
      </a>
    </section>

    <section className="link-group" aria-label="Como agendar">
      <h3>Como agendar</h3>
      <p>A modalidade é definida após o acolhimento.</p>
      <ul className="ubs-list">
        {MODALIDADES.map((modalidade) => <li key={modalidade.nome}>
          <strong>{modalidade.nome} — {modalidade.prazo}</strong>
          <small>{modalidade.detalhe}</small>
        </li>)}
      </ul>
    </section>
  </section>;
}
