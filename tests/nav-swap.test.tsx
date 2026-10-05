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

async function renderApp() {
  const utils = render(<Workspace />);
  await waitFor(() => expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeTruthy());
  return utils;
}

describe("barra principal apos a troca", () => {
  it("UBS ocupa o lugar de Jornada na barra", async () => {
    await renderApp();
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    const rotulos = [...nav.querySelectorAll("button")].map((b) => b.textContent?.trim());
    expect(rotulos.some((r) => r?.endsWith("UBS"))).toBe(true);
    expect(rotulos.some((r) => r?.includes("Jornada"))).toBe(false);
  });

  it("UBS abre a referencia da unidade", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: /UBS/ }));
    await waitFor(() => expect(screen.getByRole("heading", { level: 2, name: "Serviços e agendamento" })).toBeTruthy());
    expect(screen.getByRole("region", { name: "Serviços ofertados" })).toBeTruthy();
  });

  it("Jornada passou para dentro de Mais e continua acessivel", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: /Mais/ }));
    // Depois da reestruturação, Mais é menu: a Jornada continua acessível a partir dele.
    fireEvent.click(screen.getByRole("button", { name: /Jornada/ }));
    await waitFor(() => expect(screen.getAllByText(/Nenhuma Jornada ativa/).length).toBeGreaterThan(0));
  });
});
