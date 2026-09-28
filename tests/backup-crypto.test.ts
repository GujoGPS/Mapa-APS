import { describe, expect, it } from "vitest";
import { protectBackup, unprotectBackup } from "@/src/backup/crypto";

describe("backup protegido", () => {
  it("cifra e decifra conteúdo", async () => {
    const source = JSON.stringify({ synthetic: true, family: "F-001" });
    const backup = await protectBackup(source, "senha-demo-muito-forte");
    expect(backup.protected).toBe(true);
    expect(await unprotectBackup(backup, "senha-demo-muito-forte")).toBe(source);
  });
  it("rejeita senha curta", async () => {
    await expect(protectBackup("{}", "curta")).rejects.toThrow();
  });
});
