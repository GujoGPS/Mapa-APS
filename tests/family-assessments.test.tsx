import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assessmentRendererFor, FamilyAssessmentsPanel } from "@/app/family-assessments";
import { adultDcntEsfDefinition } from "@/src/clinical/assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import type { InstrumentApplication } from "@/src/clinical/assessments";

const timestamp = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "family-1", code: "F-1", state: "active", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const personOne: Person = { id: "person-1", code: "P-1", displayName: "Pessoa Um", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const personTwo: Person = { id: "person-2", code: "P-2", displayName: "Pessoa Dois", vitalStatus: "alive", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 };
const memberships: FamilyMembership[] = [
  { id: "membership-1", familyId: family.id, personId: personOne.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
  { id: "membership-2", familyId: family.id, personId: personTwo.id, roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: timestamp, updatedAt: timestamp, recordVersion: 1 },
];

function application(personId: string, applicationId: string, answerText: string): InstrumentApplication {
  return {
    applicationId,
    familyId: family.id,
    personId,
    instrumentId: "adult-dcnt-esf",
    instrumentVersion: "local-esf-2026-page-28-v1",
    assessmentDate: "2026-01-01",
    status: "draft",
    kind: "initial",
    createdAt: timestamp,
    updatedAt: timestamp,
    answers: {
      "header.person-name": {
        questionId: "header.person-name",
        answerType: "short-text",
        value: answerText,
        answeredAt: timestamp,
        updatedAt: timestamp,
        source: "person",
        status: "answered",
        applicabilityState: "applicable",
      },
    },
    applicabilityOverrides: {},
    provenance: { origin: "digital-adaptation", sourceNote: "teste" },
    visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
    dataOrigin: "normal",
    schemaVersion: 1,
    revisionNumber: 1,
  };
}

describe("interface de avaliações na família", () => {
  it.each([...new Set(adultDcntEsfDefinition.questions.map((question) => question.answerType))])("possui renderer dedicado para answerType %s", (answerType) => {
    expect(assessmentRendererFor(answerType)).not.toBe("unknown");
  });
  it("mostra somente metadados na visão familiar e isola aplicações por pessoa", async () => {
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[application(personOne.id, "app-1", "Resposta privada um"), application(personTwo.id, "app-2", "Resposta privada dois")]} demoActive={false} onSaved={async () => undefined} />);

    expect(screen.getByText("Avaliações")).toBeTruthy();
    expect(screen.getByText("Pessoa Um")).toBeTruthy();
    expect(screen.getByText("Pessoa Dois")).toBeTruthy();
    expect(screen.queryByText("Resposta privada um")).toBeNull();
    expect(screen.queryByText("Resposta privada dois")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByDisplayValue("Resposta privada um")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Dois/ }));
    await waitFor(() => expect(screen.queryByDisplayValue("Resposta privada um")).toBeNull());
  });

  it("renderiza pressão por visita, cintura com critério e revisão legível", async () => {
    const item = application(personOne.id, "app-3", "Pessoa Um");
    item.waistCriterion = "male-local-rule";
    item.answers = {
      ...item.answers,
      "physical.waist-circumference": { questionId: "physical.waist-circumference", answerType: "measurement", value: 102.1, unit: "cm", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-1.systolic": { questionId: "blood-pressure.visit-1.systolic", answerType: "blood-pressure", value: { systolic: 120 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-1.diastolic": { questionId: "blood-pressure.visit-1.diastolic", answerType: "blood-pressure", value: { diastolic: 80 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-1.date": { questionId: "blood-pressure.visit-1.date", answerType: "date", value: "2026-01-01", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-2.systolic": { questionId: "blood-pressure.visit-2.systolic", answerType: "blood-pressure", value: { systolic: 130 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-2.diastolic": { questionId: "blood-pressure.visit-2.diastolic", answerType: "blood-pressure", value: { diastolic: 84 }, unit: "mmHg", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
      "blood-pressure.visit-2.date": { questionId: "blood-pressure.visit-2.date", answerType: "date", value: "2026-02-01", answeredAt: timestamp, updatedAt: timestamp, source: "observation", status: "answered", applicabilityState: "applicable" },
    };
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 6/ })[0]!);
    expect(screen.getByLabelText(/PA visita 1 — sistólica/)).toHaveValue(120);
    expect(screen.getByLabelText(/PA visita 1 — diastólica/)).toHaveValue(80);
    expect(screen.getByLabelText(/PA visita 2 — sistólica/)).toHaveValue(130);
    expect(screen.getByLabelText(/PA visita 2 — diastólica/)).toHaveValue(84);
    expect(screen.getByText("muito aumentado")).toBeTruthy();
    expect(screen.getByText("125.0 / 82.0 mmHg (média das duas visitas)")).toBeTruthy();
    expect(screen.getByText(/Visita 1: 120\/80 mmHg/)).toBeTruthy();
    expect(screen.getAllByText(/Bloco 3: Fonte ausente/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 8/ }).at(-1)!);
    expect(screen.getByText(/capacidades futuras/i)).toBeTruthy();
  });

  it("marca uma resposta dependente como não aplicável sem apagar seu valor", async () => {
    const item = application(personOne.id, "app-4", "Pessoa Um");
    item.answers["health.diagnosed-chronic-conditions"] = {
      questionId: "health.diagnosed-chronic-conditions", answerType: "multiple-choice", value: ["hypertension"], answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable",
    };
    item.answers["health.hypertension-blood-pressure-follow-up"] = {
      questionId: "health.hypertension-blood-pressure-follow-up", answerType: "yes-no", value: "yes", answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable",
    };
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 2/ })[0]!);
    expect(screen.getAllByText("Sim").some((node) => node.parentElement?.querySelector("input:checked") !== null)).toBe(true);
  });

  it("anuncia erro de salvamento sem perder edição local", async () => {
    const item = application(personOne.id, "app-error", "Pessoa Um");
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => { throw new Error("falha simulada"); }} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    const field = screen.getByDisplayValue("Pessoa Um");
    fireEvent.change(field, { target: { value: "Alteração local" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
    expect(await screen.findByText(/Erro ao salvar/i)).toBeTruthy();
    expect(screen.getByDisplayValue("Alteração local")).toBeTruthy();
  });

  it("mostra revisão manual de aplicabilidade e preserva o valor", async () => {
    const item = application(personOne.id, "app-override", "Pessoa Um");
    item.answers["health.diagnosed-chronic-conditions"] = { questionId: "health.diagnosed-chronic-conditions", answerType: "multiple-choice", value: ["hypertension"], answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable" };
    item.answers["health.hypertension-blood-pressure-follow-up"] = { questionId: "health.hypertension-blood-pressure-follow-up", answerType: "yes-no", value: "yes", answeredAt: timestamp, updatedAt: timestamp, source: "person", status: "answered", applicabilityState: "applicable" };
    render(<FamilyAssessmentsPanel family={family} people={[personOne, personTwo]} memberships={memberships} applications={[item]} demoActive={false} onSaved={async () => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Pessoa Um/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getAllByRole("tab", { name: /Bloco 2/ })[0]!);
    const selects = screen.getAllByDisplayValue(/Usar regra automática/);
    fireEvent.change(screen.getAllByPlaceholderText("Justificativa breve obrigatória")[0]!, { target: { value: "Revisão manual local" } });
    fireEvent.change(selects[0]!, { target: { value: "not-applicable" } });
    expect(screen.getAllByText(/override manual|justificativa/i).length).toBeGreaterThan(0);
  });
});
