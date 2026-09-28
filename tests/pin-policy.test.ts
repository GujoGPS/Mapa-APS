import { describe, expect, it } from "vitest";
import { validatePinPolicy } from "@/src/security/pin";

describe("política de PIN", () => {
  it("rejeita PIN curto e previsível", () => {
    expect(validatePinPolicy("123456").length).toBeGreaterThan(0);
  });
  it("aceita PIN numérico menos previsível", () => {
    expect(validatePinPolicy("804261")).toEqual([]);
  });
});
