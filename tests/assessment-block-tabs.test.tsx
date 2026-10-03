import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FamilyAssessmentsPanel } from "@/app/family-assessments";
import { adultDcntEsfDefinition } from "@/src/clinical/assessments";
import type { InstrumentApplication } from "@/src/clinical/assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const t = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "f1", code: "F-1", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const person: Person = { id: "p1", code: "P-1", displayName: "Ana", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const membros: FamilyMembership[] = [
  { id: "m1", familyId: "f1", personId: "p1", roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: t, updatedAt: t, recordVersion: 1 },
];

function draft(answers: Record<string, unknown> = {}): InstrumentApplication {
  return {
    applicationId: "app-1", familyId: family.id, personId: person.id, instrumentId: "adult-dcnt-esf",
    instrumentVersion: adultDcntEsfDefinition.version, assessmentDate: "2026-01-01", status: "draft",
    createdAt: t, updatedAt: t, answers, applicabilityOverrides: {},
    provenance: { origin: "digital-adaptation", sourceNote: "teste" },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal", schemaVersion: 1, revisionNumber: 1,
  } as unknown as InstrumentApplication;
}

async function abrir(answers: Record<string, unknown> = {}) {
  render(<FamilyAssessmentsPanel family={family} people={[person]} memberships={membros} applications={[draft(answers)]} demoActive={false} onSaved={async () => undefined} />);
  fireEvent.click(await screen.findByRole("button", { name: /Ana/ }));
  fireEvent.click(await screen.findByRole("button", { name: "Continuar" }));
  return screen.findByRole("tablist", { name: "Blocos do formulário" });
}

describe("abas dos blocos do instrumento", () => {
  it("lidera com o nome do que a seção coleta e deixa o número da ficha como secundário", async () => {
    const tablist = await abrir();
    const aba = within(tablist).getByRole("tab", { name: /Perfil sociodemográfico/ });
    expect(aba.textContent).toMatch(/^Perfil sociodemográfico/);
    expect(aba.textContent).toMatch(/Bloco 1 da ficha/);
  });

  it("não existe aba para bloco que a ficha pula", async () => {
    // A folha vai do Bloco 2 direto ao Bloco 6. Não há 3, 4 nem 5 para digitalizar.
    const tablist = await abrir();
    for (const rotulo of ["Bloco 3", "Bloco 4", "Bloco 5"]) {
      expect(within(tablist).queryByRole("tab", { name: new RegExp(rotulo) })).toBeNull();
    }
    expect(within(tablist).getAllByRole("tab")).toHaveLength(adultDcntEsfDefinition.sections.length);
  });

  it("o Bloco 8 aponta para onde a funcionalidade vive, em vez de dizer que falta", async () => {
    const tablist = await abrir();
    const aba = within(tablist).getByRole("tab", { name: /Genograma, ecomapa e observações/ });
    expect(aba.textContent).toMatch(/Ver em Cuidado/);
    expect(aba.textContent).not.toMatch(/Fonte ausente/);
  });

  it("mostra a prévia de preenchimento sem precisar entrar no bloco", async () => {
    const bloco1 = adultDcntEsfDefinition.sections.find((s) => s.printedBlockNumber === 1)!;
    const pergunta = bloco1.questions[0]!;
    const tablist = await abrir({
      [pergunta.id]: { questionId: pergunta.id, answerType: pergunta.answerType, value: "1980-01-01", answeredAt: t, updatedAt: t, source: "person", status: "answered", applicabilityState: "applicable" },
    });
    const aba = within(tablist).getByRole("tab", { name: /Perfil sociodemográfico/ });
    const previa = within(aba).getByText(/preenchidos/);
    expect(previa.textContent).toMatch(/1 de/);
    expect(previa.textContent).toMatch(/pendentes/);
  });

});
