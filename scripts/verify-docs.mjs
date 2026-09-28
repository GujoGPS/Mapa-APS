import { access, readFile } from "node:fs/promises";

const required = [
  "docs/PROJECT_STATE.md",
  "docs/DECISIONS.md",
  "docs/ARCHITECTURE.md",
  "docs/DATA_MODEL.md",
  "docs/PRIVACY_MODEL.md",
  "docs/PHARMACOLOGY_GOVERNANCE.md",
  "docs/ROADMAP.md",
  "docs/CHANGELOG.md"
];

for (const path of required) await access(path);

const state = await readFile("docs/PROJECT_STATE.md", "utf8");
if (!state.includes("Quantidade esperada de famílias")) {
  throw new Error("PROJECT_STATE.md perdeu a decisão sobre famílias esperadas.");
}

console.log(`[ok] ${required.length} documentos canônicos verificados`);
