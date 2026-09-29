import { access, readFile } from "node:fs/promises";
const required=["src/contracts/care.ts","src/domain/factories.ts","src/domain/repository.ts","src/domain/selectors.ts","src/domain/demo-seed.ts","src/hooks/use-mapa-data.ts","app/workspace.tsx"];
for (const path of required) await access(path);
const workspace=await readFile("app/workspace.tsx","utf8");
if (!workspace.includes("Famílias esperadas")) throw new Error("Jornada perdeu a linguagem de expectativa.");
const storageDashboard=await readFile("app/storage-dashboard.tsx","utf8");
if (!workspace.includes("modo demonstração isolado") || !storageDashboard.includes("O padrão exclui registros sintéticos") || !storageDashboard.includes("Incluir dados sintéticos neste backup")) throw new Error("Política atual de demonstração e backup sintéticos ausente.");
console.log(`[ok] ${required.length} componentes do Marco 2 verificados`);
