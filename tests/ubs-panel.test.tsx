import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { UbsPanel } from "@/app/ubs-panel";

describe("referência da UBS", () => {
  it("mostra as três seções de conteúdo", () => {
    render(<UbsPanel />);
    expect(screen.getByRole("region", { name: "Serviços ofertados" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Grupos ofertados" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Como agendar" })).toBeTruthy();
  });

  it("lista os serviços que a UBS oferece", () => {
    render(<UbsPanel />);
    const servicos = screen.getByRole("region", { name: "Serviços ofertados" });
    for (const item of ["Implanon", "Tratamento Diretamente Observado", "testes rápidos", "PSE", "curativos"]) {
      expect(within(servicos).getByText(new RegExp(item, "i"))).toBeTruthy();
    }
  });

  it("lista os três grupos", () => {
    render(<UbsPanel />);
    const grupos = screen.getByRole("region", { name: "Grupos ofertados" });
    for (const item of ["Saúde e Bem-Estar físico", "Roda de terapia", "Grupo de idosos"]) {
      expect(within(grupos).getByText(item)).toBeTruthy();
    }
  });

  it("leva ao Estoque Aberto e avisa que é externo e exige cadastro", () => {
    render(<UbsPanel />);
    const link = screen.getByRole("link", { name: /Estoque Aberto/i });
    expect(link.getAttribute("href")).toBe("https://www.canoas.rs.gov.br/servicos/estoqueaberto/");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText(/abre fora do app/i)).toBeTruthy();
    expect(screen.getByText(/cadastro|documento/i)).toBeTruthy();
  });

  it("explica as duas modalidades de agendamento", () => {
    render(<UbsPanel />);
    const agendar = screen.getByRole("region", { name: "Como agendar" });
    expect(within(agendar).getByText(/até 30 dias/i)).toBeTruthy();
    expect(within(agendar).getByText(/24 horas/i)).toBeTruthy();
    expect(within(agendar).getByText(/enfermeira do acolhimento/i)).toBeTruthy();
  });

  it("diz que o agendamento depende do acolhimento", () => {
    render(<UbsPanel />);
    expect(screen.getByText(/após o acolhimento/i)).toBeTruthy();
  });

  it("não deixa serviço sem nome", () => {
    render(<UbsPanel />);
    const servicos = screen.getByRole("region", { name: "Serviços ofertados" });
    const itens = [...servicos.querySelectorAll("li")];
    expect(itens.length).toBeGreaterThanOrEqual(18);
    expect(itens.every((li) => (li.textContent ?? "").trim().length > 3)).toBe(true);
  });

  it("não duplica serviço nem grupo", () => {
    render(<UbsPanel />);
    const todos = [...document.querySelectorAll("li")].map((li) => (li.textContent ?? "").trim().toLowerCase());
    expect(new Set(todos).size).toBe(todos.length);
  });
});
