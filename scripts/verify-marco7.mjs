import { access, readFile } from "node:fs/promises";
import { evaluateMarco7Decision } from "./marco7-policy.mjs";

const required = [
  "src/audit/types.ts",
  "src/audit/gates.ts",
  "app/release-audit.tsx",
  "docs/audit/RELEASE_DECISION.json",
  "docs/audit/AUDIT_REPORT.md",
  "docs/audit/DEVICE_TEST_MATRIX.md",
  "docs/audit/INSTITUTIONAL_GATE.md",
  "next.config.ts",
];

for (const path of required) await access(path);
const decision = JSON.parse(await readFile("docs/audit/RELEASE_DECISION.json", "utf8"));
const result = evaluateMarco7Decision(decision);
if (!result.valid) throw new Error(`Marco 7 inválido:\n${result.errors.join("\n")}`);

console.log(`[ok] ${required.length} componentes do Marco 7 verificados; decisão ${decision.decision}`);
