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
    instrumentVersion: adultDcntEsfDefinition.version, assessmentDate: "2026-01-01", status: "draft", kind: "initial",
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
  it("lidera com o nome descritivo e deixa o número como secundário", async () => {
    const tablist = await abrir();
    const aba = within(tablist).getByRole("tab", { name: /Perfil Sociodemográfico/ });
    expect(aba.textContent).toMatch(/^Perfil Sociodemográfico/);
    expect(aba.textContent).toMatch(/Bloco 1/);
  });

  it("mostra a prévia de preenchimento sem precisar entrar no bloco", async () => {
    const bloco1 = adultDcntEsfDefinition.sections.find((s) => s.printedBlockNumber === 1)!;
    const pergunta = bloco1.questions[0]!;
    const tablist = await abrir({
      [pergunta.id]: { questionId: pergunta.id, answerType: pergunta.answerType, value: "1980-01-01", answeredAt: t, updatedAt: t, source: "person", status: "answered", applicabilityState: "applicable" },
    });
    const aba = within(tablist).getByRole("tab", { name: /Perfil Sociodemográfico/ });
    const previa = within(aba).getByText(/preenchidos/);
    expect(previa.textContent).toMatch(/1 de/);
    expect(previa.textContent).toMatch(/pendentes/);
  });

  it("marca na propria aba os blocos sem fonte digitalizada", async () => {
    const tablist = await abrir();
    const aba3 = within(tablist).getByRole("tab", { name: /Bloco 3/ });
    expect(aba3.textContent).toMatch(/Fonte ausente/);
    expect(aba3.textContent).toMatch(/ainda não foi digitalizado/i);
  });

  it("não inventa nome descritivo para bloco sem fonte", async () => {
    const tablist = await abrir();
    const aba4 = within(tablist).getByRole("tab", { name: /Bloco 4/ });
    // o titulo continua sendo apenas "Bloco 4": nada foi inventado para preencher a lacuna
    const titulo = within(aba4).getByText("Bloco 4", { selector: ".assessment-tab-title" });
    expect(titulo.textContent).toBe("Bloco 4");
  });
});
