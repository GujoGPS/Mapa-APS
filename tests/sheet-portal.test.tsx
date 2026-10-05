import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/storage/idb", () => ({
  getValue: vi.fn(async () => undefined),
  getAllValues: vi.fn(async () => []),
  putValue: vi.fn(async () => undefined),
}));
vi.mock("@/src/storage/hash", () => ({ checksumOf: vi.fn(async (value: unknown) => JSON.stringify(value)) }));
vi.mock("@/src/domain/demo-session", () => ({ getDemoSession: vi.fn(async () => undefined) }));

import { Sheet } from "@/app/sheet";
import { PersonCarePanel } from "@/app/person-care-panel";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "f1", code: "F-001", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const person: Person = { id: "p1", code: "P-1", displayName: "Ana", lifeStage: "adult", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };

describe("Sheet ancorado a viewport", () => {
  it("e montado dentro do body, e nao dentro de quem o renderiza", async () => {
    const { container } = render(<Sheet label="Teste"><p>conteudo</p></Sheet>);
    const dialog = await screen.findByRole("dialog", { name: "Teste" });
    const backdrop = dialog.parentElement!;
    expect(backdrop.className).toBe("sheet-backdrop");
    expect(backdrop.parentElement).toBe(document.body);
    expect(container.contains(backdrop)).toBe(false);
  });

  it("escapa do ancestral com backdrop-filter, que criaria containing block para o fixed", async () => {
    // .card usa backdrop-filter: blur(18px): um fixed dentro dele para de ser relativo a viewport.
    const { container } = render(<div className="card" style={{ padding: 20 }}><Sheet label="Dentro de card"><p>conteudo</p></Sheet></div>);
    const dialog = await screen.findByRole("dialog", { name: "Dentro de card" });
    const backdrop = dialog.parentElement!;

    expect(backdrop.className).toBe("sheet-backdrop");
    expect(backdrop.parentElement).toBe(document.body);
    expect(container.querySelector(".sheet-backdrop")).toBeNull();
    // Nenhum ancestral entre o dialogo e o body pode recriar o containing block.
    let ancestor = backdrop.parentElement;
    while (ancestor && ancestor !== document.body) {
      expect(ancestor.className).not.toContain("card");
      ancestor = ancestor.parentElement;
    }
  });

  it("nao renderiza quando esta fechado", () => {
    const { container } = render(<Sheet open={false} label="Fechado"><p>conteudo</p></Sheet>);
    expect(container.textContent).toBe("");
    expect(document.body.querySelector(".sheet-backdrop")).toBeNull();
  });

  it("fecha com Escape quando ha acao de fechar", async () => {
    const onClose = vi.fn();
    render(<Sheet label="Esc" onClose={onClose}><p>conteudo</p></Sheet>);
    await screen.findByRole("dialog", { name: "Esc" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("o formulario de cuidado abre ancorado a viewport mesmo dentro do card da familia", async () => {
    render(
      <div className="card">
        <PersonCarePanel
          person={person}
          familyId={family.id}
          conditions={[]}
          medications={[]}
          exams={[]}
          screenings={[]}
          plans={[]}
          encounters={[]}
          onSaved={async () => undefined}
        />
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Condição" }));
    const dialog = await screen.findByRole("dialog");
    const backdrop = dialog.parentElement!;
    expect(backdrop.parentElement).toBe(document.body);
    expect(backdrop.closest(".card")).toBeNull();
  });
});
