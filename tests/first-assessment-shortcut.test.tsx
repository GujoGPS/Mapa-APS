import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("@/src/clinical/assessments", async () => {
  const actual = await vi.importActual<typeof import("@/src/clinical/assessments")>("@/src/clinical/assessments");
  return {
    ...actual,
    createApplication: vi.fn(async ({ familyId, personId, assessmentDate }: { familyId: string; personId: string; assessmentDate: string }) => ({
      applicationId: "app-atalho", familyId, personId, assessmentDate, status: "draft",
      instrumentId: "adult-dcnt-esf", instrumentVersion: "v1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
      answers: {}, applicabilityOverrides: {}, provenance: { origin: "digital-adaptation", sourceNote: "teste" },
      visibility: { scope: "individual", clinicalVisibility: "academic-private", personVisibility: "shareable-with-person", familyVisibility: "non-exportable", reviewRequired: true, projectionStrategy: "clinical-academic" },
      dataOrigin: "normal", schemaVersion: 1, revisionNumber: 1,
    })),
  };
});

import { FamilyAssessmentsPanel } from "@/app/family-assessments";
import { createApplication } from "@/src/clinical/assessments";
import type { InstrumentApplication } from "@/src/clinical/assessments";
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";

const t = "2026-01-01T00:00:00.000Z";
const family: Family = { id: "f1", code: "F-1", state: "active", createdAt: t, updatedAt: t, recordVersion: 1 };
const ana: Person = { id: "p1", code: "P-1", displayName: "Ana", vitalStatus: "alive", createdAt: t, updatedAt: t, recordVersion: 1 };
const membros: FamilyMembership[] = [
  { id: "m1", familyId: "f1", personId: "p1", roleLabel: "membro", provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "private", createdAt: t, updatedAt: t, recordVersion: 1 },
];

function Harness({ startForPersonId, onStartHandled }: { startForPersonId?: string | undefined; onStartHandled?: (() => void) | undefined }) {
  const [apps, setApps] = useState<InstrumentApplication[]>([]);
  return <FamilyAssessmentsPanel
    family={family} people={[ana]} memberships={membros} applications={apps} demoActive={false}
    onSaved={async () => { const criado = await createApplication({ familyId: family.id, personId: ana.id, assessmentDate: "2026-01-01" }); setApps([criado]); }}
    startForPersonId={startForPersonId} onStartHandled={onStartHandled} />;
}

beforeEach(() => { vi.mocked(createApplication).mockClear(); });

describe("atalho de primeira avaliação", () => {
  it("abre a ficha da pessoa pedida sem navegar pela lista", async () => {
    render(<Harness startForPersonId={ana.id} onStartHandled={() => undefined} />);
    await waitFor(() => expect(screen.getByRole("tablist", { name: "Blocos do formulário" })).toBeTruthy());
    expect(screen.getByRole("heading", { name: "Ana" })).toBeTruthy();
  });

  it("avisa que o atalho foi consumido", async () => {
    const onStartHandled = vi.fn();
    render(<Harness startForPersonId={ana.id} onStartHandled={onStartHandled} />);
    await waitFor(() => expect(onStartHandled).toHaveBeenCalledTimes(1));
  });

  it("ignora pedido de pessoa que não pertence à família", async () => {
    render(<Harness startForPersonId="p-inexistente" onStartHandled={() => undefined} />);
    await waitFor(() => expect(screen.getByRole("button", { name: /Ana/ })).toBeTruthy());
    // a pessoa existe, mas o pedido invalido nao selecionou ninguém e nao abriu ficha
    expect(screen.queryByRole("tablist", { name: "Blocos do formulário" })).toBeNull();
    expect(createApplication).not.toHaveBeenCalled();
  });
});
