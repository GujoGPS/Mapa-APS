import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const banco = { meta: [] as unknown[], records: [] as unknown[], drafts: [] as unknown[], events: [] as unknown[], security: [] as unknown[] };
vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async (store: string, id: string) => banco[store as keyof typeof banco]?.find((r) => (r as { id: string }).id === id)),
  getAllValues: vi.fn(async (store: string) => [...(banco[store as keyof typeof banco] ?? [])]),
  putValue: vi.fn(async () => undefined),
  deleteValue: vi.fn(async () => undefined),
  replaceStore: vi.fn(async () => undefined),
  replaceAllStores: vi.fn(async () => undefined),
  clearMapaDatabaseForTests: vi.fn(async () => undefined),
  openMapaDatabase: vi.fn(async () => undefined),
}));

import { Workspace } from "@/app/workspace";

async function abrirMais() {
  render(<Workspace />);
  await waitFor(() => expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeTruthy());
  fireEvent.click(screen.getByRole("button", { name: /Mais/ }));
}

describe("Mais como menu de navegação", () => {
  it("abre com um menu, sem o conteúdo empilhado", async () => {
    await abrirMais();
    expect(screen.getByRole("navigation", { name: "Seções de Mais" })).toBeTruthy();
    // Nada de conteúdo direto na tela inicial
    expect(screen.queryByRole("region", { name: "Serviços ofertados" })).toBeNull();
    expect(screen.queryByRole("region", { name: "Conexões familiares" })).toBeNull();
    expect(screen.queryByRole("region", { name: "Prompts" })).toBeNull();
  });

  it("oferece um cartão curto para cada seção", async () => {
    await abrirMais();
    const menu = screen.getByRole("navigation", { name: "Seções de Mais" });
    const cartoes = [...menu.querySelectorAll("button")].map((b) => b.textContent ?? "");
    expect(cartoes.length).toBeGreaterThanOrEqual(4);
    expect(cartoes.join(" ")).toMatch(/Jornada/);
    expect(cartoes.join(" ")).toMatch(/Histórico/);
    expect(cartoes.join(" ")).toMatch(/Prompts/);
    expect(cartoes.join(" ")).toMatch(/dispositivo|Estado/i);
  });

  it("cada cartão leva à sua sub-tela", async () => {
    await abrirMais();
    fireEvent.click(screen.getByRole("button", { name: /Histórico/ }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Histórico" })).toBeTruthy());
  });

  it("a sub-tela de Prompts mostra o montador de prompt", async () => {
    await abrirMais();
    fireEvent.click(screen.getByRole("button", { name: /Prompts/ }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /Montar prompt/i })).toBeTruthy());
  });

  it("a sub-tela da Jornada mostra o semestre ou o convite a criar", async () => {
    await abrirMais();
    fireEvent.click(screen.getByRole("button", { name: /Jornada/ }));
    await waitFor(() => expect(screen.getAllByText(/Nenhuma Jornada ativa/).length).toBeGreaterThan(0));
  });

  it("a sub-tela do dispositivo mostra o estado de armazenamento", async () => {
    await abrirMais();
    fireEvent.click(screen.getByRole("button", { name: /dispositivo/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /Estado do dispositivo/i })).toBeTruthy());
  });

  it("permite voltar ao menu sem sair de Mais", async () => {
    await abrirMais();
    fireEvent.click(screen.getByRole("button", { name: /Histórico/ }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Histórico" })).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: /Voltar ao menu de Mais/ }));
    await waitFor(() => expect(screen.getByRole("navigation", { name: "Seções de Mais" })).toBeTruthy());
  });

  it("o modo demonstração continua acessível", async () => {
    await abrirMais();
    fireEvent.click(screen.getByRole("button", { name: /demonstração/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /Modo demonstração/i })).toBeTruthy());
  });
});
