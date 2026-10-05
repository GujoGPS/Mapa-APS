export const REQUIRED_LOCAL_GATES = [
  "build-pipeline",
  "backup-restore",
  "storage-eviction",
  "pin-boundary",
  "privacy-workflow",
];

export function evaluateMarco7Decision(report) {
  const errors = [];
  if (report?.decision !== "GO LOCAL") errors.push("A decisão operacional deve ser GO LOCAL.");
  if (report?.realDataAllowed !== false) errors.push("GO LOCAL não autoriza dados reais.");
  if (report?.publicDistributionAllowed !== false) errors.push("GO LOCAL não autoriza distribuição pública irrestrita.");
  if (report?.replacesOfficialRecord !== false) errors.push("GO LOCAL não substitui prontuário institucional.");
  if (!Array.isArray(report?.conditions) || report.conditions.length === 0) errors.push("Condições de uso ausentes.");
  if (!Array.isArray(report?.limitations) || report.limitations.length === 0) errors.push("Limitações de escopo ausentes.");
  if (!Array.isArray(report?.evidence) || report.evidence.length === 0) errors.push("Evidências ausentes.");

  const gates = new Map((Array.isArray(report?.gates) ? report.gates : []).map((gate) => [gate.id, gate]));
  for (const gateId of REQUIRED_LOCAL_GATES) {
    const gate = gates.get(gateId);
    if (!gate || gate.status !== "passed" || gate.blocking !== false) {
      errors.push(`Gate local obrigatório não aprovado: ${gateId}.`);
    }
  }
  for (const gate of gates.values()) {
    if (gate.blocking === true && gate.status !== "passed") {
      errors.push(`Bloqueador explícito permanece aberto: ${gate.id}.`);
    }
  }
  return { valid: errors.length === 0, errors };
}
