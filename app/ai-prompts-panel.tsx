"use client";

import { useState } from "react";

interface PromptItem {
  id: string;
  quando: string;
  texto: string;
}

interface PromptGroup {
  id: string;
  titulo: string;
  resumo: string;
  itens: PromptItem[];
}

const GRUPOS: PromptGroup[] = [
  {
    id: "caso",
    titulo: "Discussão de caso",
    resumo: "Segunda opinião sobre um caso clínico, com rigor de discussão entre colegas.",
    itens: [
      {
        id: "caso-clinico",
        quando: "Quando quiser discutir um caso com a IA como faria com um colega de medicina.",
        texto: `CASO: [cole aqui os dados já anonimizados da família/pessoa]. Preciso discutir este caso clínico com você: [descreva o que precisa — segunda opinião, abordagem terapêutica, dúvida específica]. Trate como discussão entre colegas de medicina, com rigor técnico completo, sem hedging desnecessário.`,
      },
    ],
  },
  {
    id: "literatura",
    titulo: "Pesquisa de literatura",
    resumo: "Para saber o que a evidência atual diz, e se ainda vale.",
    itens: [
      {
        id: "busca-literatura",
        quando: "Antes de afirmar que algo é consenso, ou para montar uma pergunta de pesquisa.",
        texto: `Preciso de literatura médica atualizada sobre: [tema]. Para cada fonte que você trouxer, informe o ano de publicação, se é estudo isolado, revisão sistemática ou consenso de sociedade médica, e se o achado ainda é considerado válido hoje ou foi superado por evidência mais recente.`,
      },
    ],
  },
  {
    id: "ecomapa",
    titulo: "Embelezar e explicar ecomapa",
    resumo: "Transforma nós e vínculos em texto corrido, organizado por força de vínculo.",
    itens: [
      {
        id: "texto-ecomapa",
        quando: "Na hora de apresentar a rede a um preceptor, quando o desenho não se explica sozinho.",
        texto: `ECOMAPA: [cole aqui a estrutura do ecomapa/genograma já anonimizada — nós e vínculos]. Reorganize isso em um texto corrido claro, organizado por força de vínculo (forte, fragilizado, rompido, conflituoso), adequado para apresentação a um preceptor.`,
      },
    ],
  },
  {
    id: "trauma",
    titulo: "Treino de descrição traumatológica",
    resumo: "Revisão da sua escrita clínica, sem virar perícia.",
    itens: [
      {
        id: "revisao-descricao",
        quando: "Depois de escrever a descrição de um atendimento, para conferir clareza e sequência.",
        texto: `TRAUMA: Vou te mandar uma descrição de achados de um atendimento/acidente que escrevi. Quero que você avalie só a MINHA descrição — clareza, terminologia, sequência, achados ao exame. Não faça reconstrução pericial (causa, dinâmica do acidente, culpa, estimativa de tempo/velocidade). Aponte o que está faltando para um registro clínico completo, sem inventar dado que eu não dei. Aqui está minha descrição: [cole aqui]`,
      },
    ],
  },
];

export function AiPromptsPanel() {
  const [copiado, setCopiado] = useState<string>();

  async function copiar(id: string, texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(id);
      window.setTimeout(() => setCopiado((atual) => (atual === id ? undefined : atual)), 2200);
    } catch {
      setCopiado(undefined);
    }
  }

  return <section className="card ai-prompts" aria-labelledby="ai-prompts-title">
    <div className="section-head">
      <div>
        <p className="eyebrow">Mais</p>
        <h2 id="ai-prompts-title">Prompts para IA externa</h2>
      </div>
    </div>
    <p className="fine-print">O Mapa não envia nada para nenhuma inteligência artificial. Estes textos são para copiar e colar onde você quiser — cole sempre dados anonimizados.</p>

    {GRUPOS.map((grupo) => <section className="link-group" key={grupo.id} aria-label={grupo.titulo}>
      <h4>{grupo.titulo}</h4>
      <p className="fine-print">{grupo.resumo}</p>
      {grupo.itens.map((item) => <div className="prompt-item" key={item.id}>
        <p className="prompt-when">{item.quando}</p>
        <pre className="prompt-text">{item.texto}</pre>
        <div className="action-row">
          <button onClick={() => void copiar(item.id, item.texto)}>{copiado === item.id ? "Copiado" : "Copiar"}</button>
        </div>
      </div>)}
    </section>)}
  </section>;
}
