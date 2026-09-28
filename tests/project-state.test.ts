import { describe, expect, it } from "vitest";
import { projectState } from "@/src/lib/project-state";

describe("estado do Marco 0", () => {
  it("não permite dados reais", () => {
    expect(projectState.realDataAllowed).toBe(false);
  });

  it("trata duas famílias como expectativa, não limite", () => {
    expect(projectState.expectedFamiliesPerSemester).toBe(2);
    expect(projectState.expectedFamiliesAreLimit).toBe(false);
  });
});
