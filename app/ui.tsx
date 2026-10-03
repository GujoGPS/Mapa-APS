"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

/**
 * Componentes base.
 *
 * Tudo aqui puxa dos tokens de app/styles.css — nenhuma cor, medida ou curva escrita solta.
 * A regra que atravessa todos eles: no celular, uma mão só e a pessoa na frente, o alvo tem
 * 44px e o estado nunca depende só de cor.
 */

export type BotaoVariante = "primario" | "secundario" | "luz" | "perigo";

export function Botao({
  variante = "secundario",
  className = "",
  children,
  ...resto
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: BotaoVariante }) {
  return (
    <button type="button" className={`btn btn-${variante} ${className}`.trim()} {...resto}>
      {children}
    </button>
  );
}

/**
 * Estado ativo: cor dourada mais uma forma. A forma é o que garante a leitura sob luz forte,
 * onde cor sozinha não separa mais ativo de erro.
 */
export function Aba({
  ativa,
  children,
  className = "",
  ...resto
}: ButtonHTMLAttributes<HTMLButtonElement> & { ativa?: boolean }) {
  return (
    <button
      type="button"
      aria-current={ativa ? "page" : undefined}
      className={`aba ${ativa ? "aba-ativa" : ""} ${className}`.trim()}
      {...resto}
    >
      {children}
    </button>
  );
}

/**
 * Aviso. Sempre com ícone e texto: o terracota sozinho não sobrevive a sol na cara.
 */
export function Aviso({
  tom = "info",
  titulo,
  children,
}: {
  tom?: "info" | "sucesso" | "atencao" | "erro";
  titulo?: string;
  children: ReactNode;
}) {
  const glifo = { info: "i", sucesso: "✓", atencao: "!", erro: "×" }[tom];
  return (
    <div className={`aviso aviso-${tom}`} role={tom === "erro" ? "alert" : "status"}>
      <span className="aviso-glifo" aria-hidden="true">{ glifo }</span>
      <div className="aviso-corpo">
        {titulo && <strong className="aviso-titulo">{titulo}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/** Confirmação efêmera de que algo mudou. O verde entra aqui, nunca no dourado. */
export function Salvo({ visivel }: { visivel: boolean }) {
  if (!visivel) return null;
  return (
    <span className="salvo" role="status">
      <span className="salvo-glifo" aria-hidden="true">✓</span> Salvo
    </span>
  );
}

/** Cartão. A superfície base: noite elevada, borda discreta, sem sombra pesada. */
export function Cartao({
  titulo,
  acao,
  children,
  className = "",
}: {
  titulo?: ReactNode;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`cartao ${className}`.trim()}>
      {(titulo || acao) && (
        <header className="cartao-topo">
          {titulo && <h2 className="cartao-titulo">{titulo}</h2>}
          {acao && <div className="cartao-acao">{acao}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/**
 * Campo de formulário.
 *
 * O rótulo é sempre visível e o campo nunca depende só de cor para indicar erro: quando
 * `erro` vem preenchido, o texto do erro entra em leitura automática e o campo ganha forma
 * (borda terracota + anel), não apenas tinta.
 */
export function Campo({
  rotulo,
  erro,
  dica,
  children,
  id,
}: {
  rotulo: string;
  erro?: string;
  dica?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
  id?: string;
}) {
  const campoId = id ?? `campo-${rotulo.replace(/\W+/g, "-").toLowerCase()}`;
  const erroId = `${campoId}-erro`;
  const dicaId = `${campoId}-dica`;
  const descrito = [erro ? erroId : null, dica ? dicaId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`campo ${erro ? "campo-com-erro" : ""}`.trim()}>
      <label className="campo-rotulo" htmlFor={campoId}>{rotulo}</label>
      {children({ id: campoId, "aria-invalid": erro ? true : undefined, "aria-describedby": descrito })}
      {dica && <p className="campo-dica" id={dicaId}>{dica}</p>}
      {erro && <p className="campo-erro" id={erroId} role="alert">{erro}</p>}
    </div>
  );
}
