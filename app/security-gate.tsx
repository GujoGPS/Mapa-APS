"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { hasPin, pinSecurityNotice, setPin, validatePinPolicy, verifyPin } from "@/src/security/pin";

const AUTO_LOCK_MS = 5 * 60 * 1000;

type GateState = "loading" | "setup" | "locked" | "unlocked";

export function SecurityGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("loading");
  const [pin, setPinValue] = useState("");
  const [message, setMessage] = useState("");

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

  if (state === "loading") return <main className="gate"><p role="status">Verificando proteção local...</p></main>;
  if (state === "unlocked") return <>{children}</>;

  return (
    <main className="gate">
      <section className="gate-card" aria-labelledby="gate-title">
        <img className="brand-mark-image" src="/brand/icon-192.png" alt="" width={192} height={192} />
        <p className="eyebrow">Proteção local</p>
        <h1 id="gate-title">{state === "setup" ? "Crie um PIN para este dispositivo" : "Mapa protegido"}</h1>
        <p>{state === "setup" ? "Defina um PIN para proteger o acesso ao Mapa neste dispositivo." : "A proteção local está ativa neste dispositivo. Digite seu PIN para continuar."}</p>
        <form onSubmit={submit}>
          <label htmlFor="local-pin">PIN de 6 a 12 dígitos</label>
          <input id="local-pin" inputMode="numeric" pattern="[0-9]*" autoComplete={state === "setup" ? "new-password" : "current-password"} value={pin} onChange={(event) => setPinValue(event.target.value)} />
          <button type="submit">{state === "setup" ? "Configurar e entrar" : "Entrar"}</button>
        </form>
        <p className="system-message" role="status" aria-live="polite">{message || (state === "setup" ? "Escolha um PIN para configurar a proteção local." : "Proteção local ativa neste dispositivo.")}</p>
        {state === "setup" && <p className="fine-print">{pinSecurityNotice}</p>}
      </section>
    </main>
  );
}
