import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { evaluateMarco7Decision, REQUIRED_LOCAL_GATES } from "@/scripts/marco7-policy.mjs";

const currentDecision = JSON.parse(readFileSync("docs/audit/RELEASE_DECISION.json", "utf8"));

describe("gate do Marco 7", () => {
  it("reconhece GO LOCAL com decisão estruturada e determinística", () => {
    const first = evaluateMarco7Decision(currentDecision);
    const second = evaluateMarco7Decision(JSON.parse(JSON.stringify(currentDecision)));

    expect(first).toEqual({ valid: true, errors: [] });
    expect(second).toEqual(first);
    expect(currentDecision.decision).toBe("GO LOCAL");
    expect(currentDecision.realDataAllowed).toBe(false);
    expect(currentDecision.publicDistributionAllowed).toBe(false);
    expect(currentDecision.replacesOfficialRecord).toBe(false);
    expect(REQUIRED_LOCAL_GATES).toHaveLength(5);
  });

  it("não transforma limitações normais de escopo em NO-GO", () => {
    const result = evaluateMarco7Decision({
      ...currentDecision,
      gates: currentDecision.gates.map((gate: { id: string; status: string; blocking: boolean }) => ({
        ...gate,
        status: ["device-matrix", "full-db-encryption", "security-review", "accessibility", "clinical-review", "pharmacology", "institutional"].includes(gate.id)
          ? "manual"
          : gate.status,
        blocking: false,
      })),
    });

    expect(result.valid).toBe(true);
  });

  it("produz NO-GO quando um bloqueio local genuíno é explicitamente aberto", () => {
    const report = structuredClone(currentDecision);
    report.gates = report.gates.map((gate: { id: string; status: string; blocking: boolean }) =>
      gate.id === "backup-restore" ? { ...gate, status: "failed", blocking: true } : gate,
    );

    const result = evaluateMarco7Decision(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Gate local obrigatório não aprovado: backup-restore.");
    expect(result.errors).toContain("Bloqueador explícito permanece aberto: backup-restore.");
  });

  it("não depende da frase histórica NO-GO", () => {
    const report = structuredClone(currentDecision);
    report.auditText = "A decisão anterior NO-GO foi superada.";

    expect(evaluateMarco7Decision(report).valid).toBe(true);
  });
});
