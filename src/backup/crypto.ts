import { base64ToBytes, bytesToBase64 } from "@/src/security/encoding";
import type { ProtectedBackup } from "./types";
import { BACKUP_FORMAT, BACKUP_VERSION } from "./types";

const ITERATIONS = 310_000;

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer;
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: asArrayBuffer(salt), iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function protectBackup(plainText: string, passphrase: string): Promise<ProtectedBackup> {
  if (passphrase.length < 12) throw new Error("A senha do backup protegido deve ter pelo menos 12 caracteres.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, ITERATIONS);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: asArrayBuffer(iv) }, key, new TextEncoder().encode(plainText));
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    protected: true,
    createdAt: new Date().toISOString(),
    algorithm: "AES-GCM",
    keyDerivation: "PBKDF2-SHA-256",
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(cipher)),
  };
}

export async function unprotectBackup(backup: ProtectedBackup, passphrase: string): Promise<string> {
  const key = await deriveKey(passphrase, base64ToBytes(backup.salt), backup.iterations);
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: asArrayBuffer(base64ToBytes(backup.iv)) },
      key,
      asArrayBuffer(base64ToBytes(backup.ciphertext)),
    );
    return new TextDecoder().decode(plain);
  } catch {
    throw new Error("Não foi possível abrir o backup. A senha pode estar incorreta ou o arquivo pode ter sido alterado.");
  }
}
