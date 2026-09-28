import { describe, expect, it } from "vitest";
import { canonicalJson, checksumOf } from "@/src/storage/hash";

describe("integridade canônica", () => {
  it("ordena chaves antes de serializar", () => {
    expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
  });
  it("produz checksum estável", async () => {
    expect(await checksumOf({ synthetic: true })).toHaveLength(64);
  });
});
