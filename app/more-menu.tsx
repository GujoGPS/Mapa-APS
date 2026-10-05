"use client";

import type { ReactNode } from "react";

export type MoreSection = "journey" | "history" | "prompts" | "demo" | "device";

interface Item {
  id: MoreSection;
  titulo: string;
  descricao: string;
  icone: string;
}

const ITENS: Item[] = [
  { id: "journey", titulo: "Jornada", descricao: "Semestre, encontros, pendências e reflexões do semestre.", icone: "◇" },
  { id: "history", titulo: "Histórico", descricao: "Quem foi alterado, quando e por quê, em cada família.", icone: "↺" },
  { id: "prompts", titulo: "Prompts para IA", descricao: "Montar prompt sanitizado a partir de um caso escolhido.", icone: "✎" },
  { id: "demo", titulo: "Modo demonstração", descricao: "Trabalhar com dados sintéticos isolados dos reais.", icone: "◇" },
  { id: "device", titulo: "Estado do dispositivo", descricao: "Persistência, espaço usado e backup deste aparelho.", icone: "▣" },
];

const ROTULO: Record<MoreSection, string> = {
  journey: "Jornada", history: "Histórico", prompts: "Prompts", demo: "Modo demonstração", device: "Estado do dispositivo",
};

/**
 * Menu de Mais: uma tela inicial com cartões curtos, cada um abrindo sua sub-tela.
 *
 * A navegação reusa o mesmo padrão da barra principal (estado + lista de destinos). Nada de
 * conteúdo empilhado na primeira tela, que é o que tornava a aba longa e confusa.
 */
export function MoreMenu({ aberta, aoAbrir, conteudo }: { aberta: MoreSection | undefined; aoAbrir: (section: MoreSection | undefined) => void; conteudo: ReactNode }) {
  if (aberta) return <section className="card more-menu">
    <div className="section-head">
      <p className="eyebrow">Mais · {ROTULO[aberta]}</p>
      <button onClick={() => aoAbrir(undefined)} aria-label="Voltar ao menu de Mais">← Voltar ao menu</button>
    </div>
    {conteudo}
  </section>;

  return <section className="card more-menu" aria-labelledby="more-menu-title">
    <div className="section-head">
      <div>
        <p className="eyebrow">Mais</p>
        <h2 id="more-menu-title">O que você quer ver?</h2>
      </div>
    </div>
    <nav className="more-menu-list" aria-label="Seções de Mais">
      {ITENS.map((item) => <button key={item.id} className="more-menu-card" onClick={() => aoAbrir(item.id)}>
        <span className="more-menu-icon" aria-hidden="true">{item.icone}</span>
        <span className="more-menu-text">
          <strong>{item.titulo}</strong>
          <small>{item.descricao}</small>
        </span>
      </button>)}
    </nav>
  </section>;
}
