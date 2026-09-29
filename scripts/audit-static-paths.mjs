import { normalize } from "node:path";

export function normalizeAuditPath(path) {
  return normalize(path).replaceAll("\\", "/");
}

export function isClinicalSourcesPath(path) {
  return normalizeAuditPath(path) === "src/clinical/sources.ts";
}
