import { access, readFile } from "node:fs/promises";
const required=["src/contracts/care.ts","src/domain/factories.ts","src/domain/repository.ts","src/domain/selectors.ts","src/domain/demo-seed.ts","src/hooks/use-mapa-data.ts","app/workspace.tsx"];
for (const path of required) await access(path);
const workspace=await readFile("app/workspace.tsx","utf8");
if (!workspace.includes("Famílias esperadas")) throw new Error("Jornada perdeu a linguagem de expectativa.");
const storageDashboard=await readFile("app/storage-dashboard.tsx","utf8");
if (!workspace.includes("modo demonstração isolado")) throw new Error("Política de demonstração isolada ausente.");
// Decisão vigente: dado sintético de demonstração nunca entra em backup, e não há opção para incluir.
// O gate anterior exigia a checkbox; agora exige a ausência dela e a política explícita.
if (storageDashboard.includes("Incluir dados sintéticos")) throw new Error("A opção de incluir sintéticos no backup foi reintroduzida.");
if (!storageDashboard.includes("demonstração nunca entram")) throw new Error("Política de backup sem sintéticos ausente.");
console.log(`[ok] ${required.length} componentes do Marco 2 verificados`);
