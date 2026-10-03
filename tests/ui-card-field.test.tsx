import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Cartao, Campo } from "@/app/ui";

describe("cartao", () => {
  it("rotulo e acao ficam em cabecalho, com acao preservada", () => {
    render(<Cartao titulo="Historico" acao={<button>Exportar</button>}>corpo</Cartao>);
    expect(screen.getByRole("heading", { name: "Historico" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Exportar" })).toBeTruthy();
    expect(screen.getByText("corpo")).toBeTruthy();
  });

  it("cartao sem titulo nao cria cabecalho vazio", () => {
    const { container } = render(<Cartao>so corpo</Cartao>);
    expect(container.querySelector(".cartao-topo")).toBeNull();
  });
});

describe("campo", () => {
  const Base = Campo;

  it("rotulo visivel sempre ligado ao controle", () => {
    render(
      <Base rotulo="Nome da pessoa">
        {(p) => <input {...p} defaultValue="Ana" />}
      </Base>,
    );
    const campo = screen.getByLabelText("Nome da pessoa");
    expect(campo.tagName).toBe("INPUT");
    expect(campo).toHaveValue("Ana");
  });

  it("sem erro, o campo nao se declara invalido nem le nada", () => {
    render(<Base rotulo="Bairro">{(p) => <input {...p} />}</Base>);
    const campo = screen.getByLabelText("Bairro");
    expect(campo).not.toHaveAttribute("aria-invalid");
    expect(campo).not.toHaveAttribute("aria-describedby");
  });

  it("com erro: marca invalido, descreve e anuncia em leitura automatica", () => {
    render(<Base rotulo="Nome" erro="Nome obrigatorio">{(p) => <input {...p} />}</Base>);
    const campo = screen.getByLabelText("Nome");
    expect(campo).toHaveAttribute("aria-invalid", "true");
    const erro = screen.getByRole("alert");
    expect(erro.textContent).toContain("Nome obrigatorio");
    // o texto do erro precisa estar ligado ao campo, senao leitor de tela nao anuncia
    expect(campo.getAttribute("aria-describedby")).toBe(erro.id);
  });

  it("erro e dica convivem e os dois ficam descritos", () => {
    render(<Base rotulo="Idade" erro="Invalido" dica="Use anos.">{(p) => <input {...p} />}</Base>);
    const campo = screen.getByLabelText("Idade");
    const ids = (campo.getAttribute("aria-describedby") ?? "").split(" ");
    expect(ids.length).toBe(2);
    expect(ids.every(Boolean)).toBe(true);
  });
});
