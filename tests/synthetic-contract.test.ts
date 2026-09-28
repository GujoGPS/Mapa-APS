import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const raw = readFileSync("src/data/synthetic/semester-2026-2.json", "utf8");
const data = JSON.parse(raw) as { synthetic: boolean; families: unknown[] };

describe("contrato dos dados de demonstração", () => {
  it("declara explicitamente que os dados são sintéticos", () => {
    expect(data.synthetic).toBe(true);
  });

  it("contém as duas famílias da simulação", () => {
    expect(data.families).toHaveLength(2);
  });
});
