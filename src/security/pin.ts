import { getValue, putValue } from "@/src/storage/idb";
import { STORES, type SecurityRecord } from "@/src/storage/schema";
import { base64ToBytes, bytesToBase64 } from "./encoding";

const PIN_RECORD = "local-pin-v1";
const ITERATIONS = 210_000;

interface PinSecret {
  salt: string;
  digest: string;
  iterations: number;
}

async function derive(pin: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, material, 256);
  return new Uint8Array(bits);
}

export function validatePinPolicy(pin: string): string[] {
  const errors: string[] = [];
  if (!/^\d{6,12}$/.test(pin)) errors.push("Use de 6 a 12 dígitos.");
  if (/^(.)\1+$/.test(pin)) errors.push("Não use o mesmo dígito repetido.");
  if (["123456", "654321", "000000", "111111"].includes(pin)) errors.push("Escolha um PIN menos previsível.");
  return errors;
}

export async function hasPin(): Promise<boolean> {
  return Boolean(await getValue<SecurityRecord>(STORES.security, PIN_RECORD));
}

export async function setPin(pin: string): Promise<void> {
  const errors = validatePinPolicy(pin);
  if (errors.length) throw new Error(errors.join(" "));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const digest = await derive(pin, salt, ITERATIONS);
  const value: PinSecret = { salt: bytesToBase64(salt), digest: bytesToBase64(digest), iterations: ITERATIONS };
  await putValue(STORES.security, { id: PIN_RECORD, value, updatedAt: new Date().toISOString() } satisfies SecurityRecord);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const record = await getValue<SecurityRecord>(STORES.security, PIN_RECORD);
  if (!record) return false;
  const secret = record.value as PinSecret;
  const actual = await derive(pin, base64ToBytes(secret.salt), secret.iterations);
  const expected = base64ToBytes(secret.digest);
  if (actual.length !== expected.length) return false;
  let mismatch = 0;
  actual.forEach((byte, index) => { mismatch |= byte ^ (expected[index] ?? 0); });
  return mismatch === 0;
}

export const pinSecurityNotice = "O PIN bloqueia a interface local. Ele não substitui a proteção do dispositivo nem cifra automaticamente todos os dados.";
