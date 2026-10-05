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

/**
 * A troca de aba anima pela Web Animations API, e nao por CSS, justamente para nao
 * remontar os paineis. Estes testes travaram essa escolha: movimento e enfeite, nunca
 * condicao para o app funcionar. O ambiente de teste nao tem `matchMedia` nem `animate`,
 * que e exatamente o caso que precisa continuar funcionando.
 */
describe("transicao entre abas", () => {
  it("troca de aba mesmo sem matchMedia e sem Web Animations API", async () => {
    expect(typeof window.matchMedia).not.toBe("function");
    expect(typeof Element.prototype.animate).not.toBe("function");
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: /UBS/ }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Serviços e agendamento" })).toBeTruthy());
  });

  it("mantem um unico container estavel, para que a animacao nao remonte nada", async () => {
    const { container } = await renderApp();
    expect(container.querySelectorAll(".conteudo")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /UBS/ }));
    expect(container.querySelectorAll(".conteudo")).toHaveLength(1);
  });

  it("nao deixa a animacao pendurada quando a aba muda varias vezes", async () => {
    await renderApp();
    for (const nome of [/Clínica/, /Cuidado/, /UBS/, /Início/]) {
      fireEvent.click(screen.getByRole("button", { name: nome }));
    }
    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeTruthy();
    expect(screen.queryByText(/Pronto\./)).not.toBeInTheDocument();
  });
});
