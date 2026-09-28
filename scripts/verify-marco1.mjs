import { access, readFile } from "node:fs/promises";

const required = [
  "src/storage/idb.ts",
  "src/storage/repository.ts",
  "src/storage/status.ts",
  "src/storage/multi-tab.ts",
  "src/security/pin.ts",
  "src/backup/service.ts",
  "src/backup/crypto.ts",
  "public/sw.js",
  "app/offline/page.tsx",
  "app/security-gate.tsx"
];
for (const path of required) await access(path);
const state = await readFile("src/lib/project-state.ts", "utf8");
if (!state.includes("realDataAllowed: false")) throw new Error("Marco 1 não pode permitir dados reais.");
const sw = await readFile("public/sw.js", "utf8");
if (!sw.includes("mapa-shell-v1")) throw new Error("Cache PWA não foi versionado.");
console.log(`[ok] ${required.length} componentes do Marco 1 verificados`);
