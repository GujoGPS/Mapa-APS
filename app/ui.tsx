"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

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
