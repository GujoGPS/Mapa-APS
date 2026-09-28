"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { hasPin, pinSecurityNotice, setPin, validatePinPolicy, verifyPin } from "@/src/security/pin";

const AUTO_LOCK_MS = 5 * 60 * 1000;

type GateState = "loading" | "setup" | "locked" | "unlocked";

export function SecurityGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("loading");
  const [pin, setPinValue] = useState("");
  const [message, setMessage] = useState("Verificando proteção local...");

  useEffect(() => { void hasPin().then((configured) => setState(configured ? "locked" : "setup")); }, []);

  useEffect(() => {
    if (state !== "unlocked") return;
    let timer = window.setTimeout(() => setState("locked"), AUTO_LOCK_MS);
    const reset = () => { window.clearTimeout(timer); timer = window.setTimeout(() => setState("locked"), AUTO_LOCK_MS); };
    const hide = () => { if (document.visibilityState === "hidden") setState("locked"); };
    ["pointerdown", "keydown", "touchstart"].forEach((event) => window.addEventListener(event, reset, { passive: true }));
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.clearTimeout(timer);
      ["pointerdown", "keydown", "touchstart"].forEach((event) => window.removeEventListener(event, reset));
      document.removeEventListener("visibilitychange", hide);
    };
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "setup") {
      const errors = validatePinPolicy(pin);
      if (errors.length) { setMessage(errors.join(" ")); return; }
      await setPin(pin);
      setMessage("PIN local configurado.");
      setPinValue("");
      setState("unlocked");
      return;
    }
    const valid = await verifyPin(pin);
    if (!valid) { setMessage("PIN incorreto. O conteúdo permanece bloqueado."); return; }
    setPinValue("");
    setMessage("Mapa desbloqueado neste dispositivo.");
    setState("unlocked");
  }

  if (state === "loading") return <main className="gate"><p role="status">{message}</p></main>;
  if (state === "unlocked") return <>{children}</>;

  return (
    <main className="gate">
      <section className="gate-card" aria-labelledby="gate-title">
        <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
        <p className="eyebrow">Proteção local</p>
        <h1 id="gate-title">{state === "setup" ? "Crie um PIN para este dispositivo" : "Desbloquear Mapa"}</h1>
        <p>{state === "setup" ? "O Marco 1 exige um PIN antes de abrir a área local." : "Digite o PIN configurado neste navegador."}</p>
        <form onSubmit={submit}>
          <label htmlFor="local-pin">PIN de 6 a 12 dígitos</label>
          <input id="local-pin" inputMode="numeric" pattern="[0-9]*" autoComplete={state === "setup" ? "new-password" : "current-password"} value={pin} onChange={(event) => setPinValue(event.target.value)} />
          <button type="submit">{state === "setup" ? "Configurar e entrar" : "Entrar"}</button>
        </form>
        <p className="system-message" role="status" aria-live="polite">{message}</p>
        <p className="fine-print">{pinSecurityNotice}</p>
        <p className="fine-print"><strong>Marco 1:</strong> não registre dados reais.</p>
      </section>
    </main>
  );
}
