import { access, readFile } from "node:fs/promises";
const required=["src/contracts/care.ts","src/domain/factories.ts","src/domain/repository.ts","src/domain/selectors.ts","src/domain/demo-seed.ts","src/hooks/use-mapa-data.ts","app/workspace.tsx"];
for (const path of required) await access(path);
const workspace=await readFile("app/workspace.tsx","utf8");
if (!workspace.includes("Famílias esperadas")) throw new Error("Jornada perdeu a linguagem de expectativa.");
if (!workspace.includes("Somente dados sintéticos") && !(await readFile("app/storage-dashboard.tsx","utf8")).includes("Somente dados sintéticos")) throw new Error("Aviso sintético ausente.");
console.log(`[ok] ${required.length} componentes do Marco 2 verificados`);
