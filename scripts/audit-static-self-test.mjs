import assert from "node:assert/strict";
import { isClinicalSourcesPath, normalizeAuditPath } from "./audit-static-paths.mjs";

assert.equal(normalizeAuditPath("src/clinical/sources.ts"), "src/clinical/sources.ts");
assert.equal(normalizeAuditPath("src\\clinical\\sources.ts"), "src/clinical/sources.ts");
assert.equal(isClinicalSourcesPath("src/clinical/sources.ts"), true);
assert.equal(isClinicalSourcesPath("src\\clinical\\sources.ts"), true);
assert.equal(isClinicalSourcesPath("src/other/sources.ts"), false);
console.log("[ok] caminhos POSIX e Windows normalizados; caminho externo continua rejeitado");
