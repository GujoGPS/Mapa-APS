"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Folha inferior compartilhada, montada por portal direto no body.
 *
 * Por que portal: `.card` usa `backdrop-filter`, que cria containing block. Um descendente com
 * `position: fixed` dentro de um card deixa de ser fixo em relacao a viewport e passa a ser fixo
 * em relacao ao card — o formulario nasce abaixo da dobra e some junto com a rolagem. Montando no
 * body, nenhum ancestral futuro com transform, filter ou backdrop-filter quebra o dialogo.
 */

export interface SheetProps {
  open?: boolean;
  onClose?: () => void;
  /** Nome acessivel do dialogo. Preferir labelledBy quando o titulo esta dentro do painel. */
  label?: string;
  labelledBy?: string;
  role?: "dialog" | "alertdialog";
  /** Alca visual de arraste, usada no fluxo principal. */
  handle?: boolean;
  /** Fecha ao clicar fora. Desligado por padrao para nao perder o que foi digitado sem querer. */
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

export function Sheet({ open = true, onClose, label, labelledBy, role = "dialog", handle = false, closeOnBackdrop = false, children }: SheetProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // createPortal nao existe no servidor; o dialogo so aparece depois da hidratacao.
  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="sheet-backdrop"
      role="presentation"
      onMouseDown={closeOnBackdrop && onClose ? (event) => { if (event.target === event.currentTarget) onClose(); } : undefined}
    >
      <section
        className="sheet"
        role={role}
        aria-modal="true"
        {...(labelledBy ? { "aria-labelledby": labelledBy } : label ? { "aria-label": label } : {})}
      >
        {handle && <div className="sheet-handle" />}
        {onClose && <button className="close-button" onClick={onClose} aria-label="Fechar">×</button>}
        {children}
      </section>
    </div>,
    document.body,
  );
}
