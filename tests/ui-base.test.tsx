import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Aba, Aviso, Botao, Salvo } from "@/app/ui";

describe("componentes base", () => {
  it("Botao aceita as quatro variantes e nao escreve tipo errado", () => {
    for (const variante of ["primario", "secundario", "luz", "perigo"] as const) {
      const { unmount } = render(<Botao variante={variante}>Texto</Botao>);
      const botao = screen.getByRole("button", { name: "Texto" });
      expect(botao).toHaveClass(`btn-${variante}`);
      expect(botao).toHaveAttribute("type", "button");
      unmount();
    }
  });

  it("Aba ativa se anuncia por aria-current, não só por cor", () => {
    render(<><Aba ativa>Ativa</Aba><Aba>Inativa</Aba></>);
    expect(screen.getByRole("button", { name: "Ativa" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Inativa" })).not.toHaveAttribute("aria-current");
  });

  it("Aviso de erro usa role alert e carrega glifo, porque cor sozinha não sobrevive a sol", () => {
    render(<Aviso tom="erro" titulo="Falhou">Não foi possível salvar.</Aviso>);
    const aviso = screen.getByRole("alert");
    expect(aviso).toHaveTextContent("Falhou");
    expect(aviso.querySelector(".aviso-glifo")).toBeTruthy();
  });

  it("Aviso informativo é status, não alert: não interrompe quem está lendo", () => {
    render(<Aviso tom="info">Rascunho automático ativo.</Aviso>);
    expect(screen.getByRole("status")).toHaveTextContent("Rascunho automático ativo.");
  });

  it("cada tom de aviso tem seu proprio par de cor e de borda", () => {
    const { container } = render(
      <><Aviso tom="info">i</Aviso><Aviso tom="sucesso">s</Aviso><Aviso tom="atencao">a</Aviso><Aviso tom="erro">e</Aviso></>,
    );
    const classes = [...container.querySelectorAll(".aviso")].map((n) => n.className);
    expect(new Set(classes).size).toBe(4);
  });

  it("Salvo só existe quando visível, para não anunciar nada falso", () => {
    const { rerender } = render(<Salvo visivel={false} />);
    expect(screen.queryByText(/salvo/i)).toBeNull();
    rerender(<Salvo visivel />);
    expect(screen.getByRole("status")).toHaveTextContent(/salvo/i);
  });
});
