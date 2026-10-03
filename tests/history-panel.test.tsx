import type React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HistoryPanel } from "@/app/history-panel";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InterpersonalRelationship, ExternalLink } from "@/src/contracts/relations";
import type { InstrumentApplication } from "@/src/clinical/assessments";

const t = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "f1", code: "F-1", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const outra: Family = { id: "f2", code: "F-2", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const ana: Person = { id: "p1", code: "P-1", displayName: "Ana", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const bruno: Person = { id: "p2", code: "P-2", displayName: "Bruno", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const membros: FamilyMembership[] = [
  { id: "m1", familyId: "f1", personId: "p1", roleLabel: "mãe", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: t, updatedAt: t, recordVersion: 1 },
  { id: "m2", familyId: "f1", personId: "p2", roleLabel: "filho", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: t, updatedAt: t, recordVersion: 1 },
];

function vinculo(extra: Partial<InterpersonalRelationship> = {}): InterpersonalRelationship {
  return {
    id: "r1", familyId: "f1",
    sourcePersonId: "p1", targetPersonId: "p2", formalType: "mãe e filho",
    quality: "strong", direction: "reciprocal", perspectiveLabel: "Ana",
    provenance: "self-reported", confirmation: "reported", sensitivity: "family",
    sharingState: "private", createdAt: t, updatedAt: t, recordVersion: 1,
    changeLog: [
      { at: "2026-01-01T10:00:00.000Z", action: "created", reason: "criado no primeiro encontro" },
      { at: "2026-02-01T10:00:00.000Z", action: "edited", reason: "pai ausente na última visita" },
    ],
    ...extra,
  } as unknown as InterpersonalRelationship;
}

function app(extra: Partial<InstrumentApplication>): InstrumentApplication {
  return {
    applicationId: "app-base", familyId: "f1", personId: "p1", instrumentId: "adult-dcnt-esf",
    instrumentVersion: "v1", assessmentDate: "2026-01-01", status: "completed",
    createdAt: t, updatedAt: t, answers: {}, applicabilityOverrides: {},
    provenance: { origin: "digital-adaptation", sourceNote: "teste" },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal", schemaVersion: 1, revisionNumber: 1,
    ...extra,
    ...(extra.status === "archived" ? { completedAt: undefined as unknown as string } : {}),
  } as unknown as InstrumentApplication;
}

function props(over: Record<string, unknown> = {}) {
  return {
    families: [family, outra], people: [ana, bruno], memberships: membros,
    relationships: [vinculo()], externalLinks: [] as ExternalLink[],
    assessments: [
      app({ applicationId: "app-1", status: "completed", completedAt: "2026-01-02T12:00:00.000Z" }),
      app({ applicationId: "app-2", status: "completed", rectifiesApplicationId: "app-1", assessmentDate: "2026-06-01", completedAt: "2026-06-02T12:00:00.000Z" }),
      app({ applicationId: "app-3", status: "archived" } as Partial<InstrumentApplication>),
    ],
    ...over,
  } as unknown as React.ComponentProps<typeof HistoryPanel>;
}

describe("Histórico por família", () => {
  it("separa Conexões familiares e Prontuário dentro da família", () => {
    render(<HistoryPanel {...props()} />);
    fireEvent.click(screen.getByRole("button", { name: /F-1/ }));
    expect(screen.getByRole("heading", { name: "Conexões familiares" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Prontuário" })).toBeTruthy();
  });

  it("mostra o histórico de mudanças de cada vínculo com o motivo", () => {
    render(<HistoryPanel {...props()} />);
    fireEvent.click(screen.getByRole("button", { name: /F-1/ }));
    const conexoes = screen.getByRole("region", { name: "Conexões familiares" });
    expect(within(conexoes).getByText("mãe e filho")).toBeTruthy();
    expect(within(conexoes).getByText(/pai ausente na última visita/)).toBeTruthy();
    expect(within(conexoes).getByText(/criado no primeiro encontro/)).toBeTruthy();
  });

  it("mostra a cadeia da retificação dizendo qual aplicação substituiu qual", () => {
    render(<HistoryPanel {...props()} />);
    fireEvent.click(screen.getByRole("button", { name: /F-1/ }));
    const prontuario = screen.getByRole("region", { name: "Prontuário" });
    expect(within(prontuario).getByText(/retifica a aplicação app-1/)).toBeTruthy();
    expect(within(prontuario).getAllByText(/Rascunho arquivado/).length).toBe(1);
  });

  it("não mostra família sem registro", () => {
    render(<HistoryPanel {...props()} />);
    const lista = screen.getByRole("list", { name: "Famílias" });
    expect(within(lista).queryByText(/F-2/)).toBeNull();
  });

  it("explica quando a família ainda não tem histórico", () => {
    render(<HistoryPanel {...props()} />);
    fireEvent.click(screen.getByRole("button", { name: /F-1/ }));
    expect(screen.getByRole("button", { name: /F-1/ })).toBeTruthy();
  });
});
