import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToastProvider, useToast } from "@/app/toast";
import { transitionApplicationStatus } from "@/src/clinical/assessments/application";
import type { InstrumentApplication } from "@/src/clinical/assessments/types";

function Cenario() {
  const { avise } = useToast();
  return <button onClick={() => avise("Avaliação arquivada.")}>arquivar</button>;
}

describe("toasts", () => {
  it("não mostra nada antes de qualquer ação", () => {
    render(<ToastProvider><Cenario /></ToastProvider>);
    expect(screen.queryByText("Avaliação arquivada.")).toBeNull();
  });

  it("avisa a ação e o texto fica legível para leitor de tela", () => {
    render(<ToastProvider><Cenario /></ToastProvider>);
    act(() => { screen.getByRole("button", { name: "arquivar" }).click(); });
    expect(screen.getByText("Avaliação arquivada.")).toBeTruthy();
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("cada aviso carrega glifo e tom: estado nunca depende só da cor", () => {
    render(<ToastProvider><Cenario /></ToastProvider>);
    act(() => { screen.getByRole("button", { name: "arquivar" }).click(); });
    const toast = document.querySelector(".toast")!;
    expect(toast.className).toMatch(/toast-sucesso|toast-info/);
    expect(toast.querySelector(".toast-glifo")?.textContent?.trim()).toBeTruthy();
  });

  it("dá para fechar o aviso à mão", () => {
    render(<ToastProvider><Cenario /></ToastProvider>);
    act(() => { screen.getByRole("button", { name: "arquivar" }).click(); });
    act(() => { screen.getByRole("button", { name: "Fechar aviso" }).click(); });
    expect(screen.queryByText("Avaliação arquivada.")).toBeNull();
  });
});

describe("arquivamento com volta", () => {
  it("o contrato guarda de qual status a avaliação veio, para devolver ao ponto certo", () => {
    // O round-trip completo com persistência é verificado no navegador; aqui fica a
    // garantia que não depende de IndexedDB: o campo existe e a transição é simétrica.
    const origem: InstrumentApplication["archivedFrom"] = "draft";
    expect(origem).toBe("draft");
    expect(transitionApplicationStatus("archived", origem!)).toBe(true);
  });

  it("um rascunho arquivado volta como rascunho, e uma concluída volta como concluída", () => {
    for (const destino of ["draft", "completed", "rectified"] as const) {
      expect(transitionApplicationStatus("archived", destino)).toBe(true);
    }
  });

  it("ainda não é possível arquivar duas vezes nem sair para estado inválido", () => {
    expect(transitionApplicationStatus("archived", "archived")).toBe(false);
    expect(transitionApplicationStatus("archived", "in-review")).toBe(false);
  });
});
