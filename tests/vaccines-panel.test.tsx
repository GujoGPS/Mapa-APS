import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { VaccinesPanel } from "@/app/vaccines-panel";
import { ClinicalLibrary } from "@/app/clinical-library";
import { VACINAS } from "@/src/clinical/vaccines";

const ids = () => VACINAS.flatMap((g) => g.itens.map((i) => i.id));

describe("calendário de vacinação", () => {
  it("tem as quatro faixas etárias oficiais", () => {
    render(<VaccinesPanel />);
    for (const faixa of ["Criança", "Adolescente e jovem", "Adulto", "Idoso"]) {
      expect(screen.getByRole("region", { name: faixa })).toBeTruthy();
    }
  });

  it("inclui a dose dos 7 meses como COVID-19, e não como pendência", () => {
    const sete = VACINAS.flatMap((g) => g.itens).filter((i) => i.idade.includes("7 meses"));
    expect(sete.length).toBeGreaterThan(0);
    expect(sete[0]!.vacina).toMatch(/COVID/i);
    expect(sete[0]!.idade).not.toMatch(/pendente/i);
    expect(screen.queryByText(/pendente da fonte/i)).toBeNull();
  });

  it("não inventa campo de entrada para item conforme histórico vacinal", () => {
    render(<VaccinesPanel />);
    const caixas = [...screen.queryAllByRole("checkbox")];
    expect(caixas.every((c) => c.getAttribute("data-efemero") === "true")).toBe(true);
    expect(screen.getAllByText(/cartão de vacina da pessoa/i).length).toBeGreaterThan(0);
  });

  it("todo item tem id único, como o React exige", () => {
    const lista = ids();
    expect(new Set(lista).size).toBe(lista.length);
  });

  it("todo item tem grupo, idade e nome de vacina", () => {
    for (const item of VACINAS.flatMap((g) => g.itens)) {
      expect(item.idade.trim().length).toBeGreaterThan(1);
      expect(item.vacina.trim().length).toBeGreaterThan(1);
    }
  });
});

describe("marcação efêmera", () => {
  it("risca e descrisca ao clicar", () => {
    render(<VaccinesPanel />);
    const primeiro = screen.getAllByRole("checkbox")[0]!;
    fireEvent.click(primeiro);
    expect(primeiro.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(primeiro);
    expect(primeiro.getAttribute("aria-checked")).toBe("false");
  });

  it("Restaurar limpa todas as marcações", () => {
    render(<VaccinesPanel />);
    const botoes = screen.getAllByRole("checkbox");
    fireEvent.click(botoes[0]!);
    fireEvent.click(botoes[3]!);
    fireEvent.click(screen.getByRole("button", { name: /Restaurar/i }));
    expect(botoes.every((b) => b.getAttribute("aria-checked") === "false")).toBe(true);
  });

  it("não grava em nenhum armazenamento", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const idb = vi.fn();
    vi.stubGlobal("indexedDB", { open: idb });
    render(<VaccinesPanel />);
    fireEvent.click(screen.getAllByRole("checkbox")[0]!);
    expect(setItem).not.toHaveBeenCalled();
    expect(idb).not.toHaveBeenCalled();
    setItem.mockRestore();
    vi.unstubAllGlobals();
  });

  it("volta sem marcações ao sair e reabrir a tela", () => {
    const { unmount } = render(<VaccinesPanel />);
    fireEvent.click(screen.getAllByRole("checkbox")[0]!);
    unmount();
    render(<VaccinesPanel />);
    expect(screen.getAllByRole("checkbox").every((b) => b.getAttribute("aria-checked") === "false")).toBe(true);
  });

  it("avisa que a marcação é temporária", () => {
    render(<VaccinesPanel />);
    expect(screen.getByText(/não é salva em lugar nenhum/i)).toBeTruthy();
  });
});

describe("fontes", () => {
  beforeEach(() => undefined);

  it("cita o calendário do Ministério da Saúde", async () => {
    const { clinicalSources } = await import("@/src/clinical/sources");
    const ids2 = clinicalSources.map((s) => s.id);
    expect(ids2.some((i) => i.includes("calendario-vacinacao-crianca-ufsc"))).toBe(true);
    expect(ids2.some((i) => i.includes("calendario-nacional-vacinacao-adolescentes"))).toBe(true);
    expect(ids2.some((i) => i.includes("calendario-nacional-vacinacao-idoso"))).toBe(true);
    expect(ids2.some((i) => i.includes("estoque"))).toBe(true);
  });
});


describe("Vacinas dentro de Clínica", () => {
  it("aparece como aba ao lado de Condições, Exames e Fontes", () => {
    render(<ClinicalLibrary />);
    const abas = screen.getAllByRole("button").map((b) => b.textContent?.trim());
    expect(abas).toEqual(expect.arrayContaining(["Condições", "Medicamentos", "Exames", "Vacinas", "Fontes"]));
  });

  it("abre o calendário ao tocar na aba", () => {
    render(<ClinicalLibrary />);
    fireEvent.click(screen.getByRole("button", { name: "Vacinas" }));
    expect(screen.getByRole("heading", { name: "Vacinas" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Criança" })).toBeTruthy();
  });

  it("as fontes de vacinação aparecem na aba Fontes", () => {
    render(<ClinicalLibrary />);
    fireEvent.click(screen.getByRole("button", { name: "Fontes" }));
    const texto = document.body.textContent ?? "";
    expect(texto).toMatch(/Calend[aá]rio Nacional de Vacina/i);
  });

  it("sair da aba e voltar limpa as marcações", () => {
    render(<ClinicalLibrary />);
    fireEvent.click(screen.getByRole("button", { name: "Vacinas" }));
    const alvo = screen.getAllByRole("checkbox")[0]!;
    fireEvent.click(alvo);
    expect(alvo.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Condições" }));
    fireEvent.click(screen.getByRole("button", { name: "Vacinas" }));
    expect(screen.getAllByRole("checkbox")[0]!.getAttribute("aria-checked")).toBe("false");
  });
});
