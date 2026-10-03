"use client";

import { useState } from "react";
import { VACINAS } from "@/src/clinical/vaccines";

/**
 * Calendário Nacional de Vacinação, tela informativa.
 *
 * A única interação é riscar uma vacina para comparar com a carteirinha física que está na mão.
 * Esse estado vive apenas neste componente: nada é gravado em IndexedDB, em localStorage ou em
 * qualquer outro lugar, e sair da aba desmonta o componente, o que já zera as marcações.
 */
export function VaccinesPanel() {
  const [riscadas, setRiscadas] = useState<ReadonlySet<string>>(() => new Set());

  const alternar = (id: string) => setRiscadas((atual) => {
    const proximo = new Set(atual);
    if (proximo.has(id)) proximo.delete(id); else proximo.add(id);
    return proximo;
  });

  return <section className="vaccines-panel" aria-labelledby="vaccines-title">
    <div className="section-head">
      <div>
        <p className="eyebrow">Clínica</p>
        <h2 id="vaccines-title">Vacinas</h2>
      </div>
      <button className="secondary" onClick={() => setRiscadas(new Set())} disabled={riscadas.size === 0}>Restaurar</button>
    </div>

    <p className="fine-print">
      Calendário Nacional de Vacinação 2026, do Ministério da Saúde. Material de consulta: toque para riscar
      enquanto compara com a carteirinha da pessoa. A marcação é temporária e <strong>não é salva em lugar nenhum</strong> —
      ao sair desta aba tudo volta a ficar desmarcado.
    </p>

    {VACINAS.map((faixa) => <section className="link-group vaccine-faixa" key={faixa.id} aria-label={faixa.titulo}>
      <h4>{faixa.titulo}</h4>
      <p className="fine-print">{faixa.faixa}</p>
      <ul className="vaccine-list">
        {faixa.itens.map((item) => {
          const marcada = riscadas.has(item.id);
          return <li key={item.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={marcada}
              data-efemero="true"
              className={marcada ? "vaccine-item marcada" : "vaccine-item"}
              onClick={() => alternar(item.id)}
            >
              <span className="vaccine-idade">{item.idade}</span>
              <strong className="vaccine-nome">{item.vacina}</strong>
              {item.doses && <span className="vaccine-doses">{item.doses}</span>}
              {item.obs && <small className="vaccine-obs">{item.obs}</small>}
            </button>
          </li>;
        })}
      </ul>
    </section>)}
  </section>;
}
