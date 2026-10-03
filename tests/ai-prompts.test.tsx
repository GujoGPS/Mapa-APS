import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { AiPromptsPanel } from "@/app/ai-prompts-panel";

const escrever = vi.fn<(texto: string) => Promise<void>>(async () => undefined);
Object.defineProperty(globalThis.navigator, "clipboard", { value: { writeText: escrever }, configurable: true });

describe("prompts para IA externa", () => {
  it("tem as quatro categorias pedidas", () => {
    render(<AiPromptsPanel />);
    for (const nome of ["Discussão de caso", "Pesquisa de literatura", "Embelezar e explicar ecomapa", "Treino de descrição traumatológica"]) {
      expect(screen.getByRole("region", { name: nome })).toBeTruthy();
    }
  });

  it("diz que o app não envia nada para IA", () => {
    render(<AiPromptsPanel />);
    expect(screen.getByText(/não envia nada para nenhuma inteligência artificial/i)).toBeTruthy();
  });

  it("cada prompt tem uma linha de quando usar acima do texto", () => {
    render(<AiPromptsPanel />);
    const caso = screen.getByRole("region", { name: "Discussão de caso" });
    expect(within(caso).getByText(/colega de medicina\b/)).toBeTruthy();
    expect(within(caso).getByText(/Trate como discussão entre colegas de medicina/)).toBeTruthy();
  });

  it("cada categoria tem botão Copiar", () => {
    render(<AiPromptsPanel />);
    expect(screen.getAllByRole("button", { name: "Copiar" })).toHaveLength(4);
  });

  it("copia o texto do prompt para a área de transferência", async () => {
    render(<AiPromptsPanel />);
    fireEvent.click(screen.getAllByRole("button", { name: "Copiar" })[0]!);
    await waitFor(() => expect(escrever).toHaveBeenCalledTimes(1));
    expect(escrever.mock.calls[0]![0]).toMatch(/^CASO: /);
  });

  it("o texto completo do prompt de trauma está disponível", () => {
    render(<AiPromptsPanel />);
    const trauma = screen.getByRole("region", { name: "Treino de descrição traumatológica" });
    expect(within(trauma).getByText(/Não faça reconstrução pericial/)).toBeTruthy();
  });
});
