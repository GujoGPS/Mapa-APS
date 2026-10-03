"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { hasPin, pinSecurityNotice, setPin, validatePinPolicy, verifyPin } from "@/src/security/pin";
import { Botao } from "./ui";

const AUTO_LOCK_MS = 5 * 60 * 1000;
const MINIMO = 6;
const MAXIMO = 12;

type GateState = "loading" | "setup" | "locked" | "unlocked";

export function SecurityGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("loading");
  const [pin, setPinValue] = useState("");
  const [erro, setErro] = useState("");

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
    setErro("");
    if (state === "setup") {
      const errors = validatePinPolicy(pin);
      if (errors.length) { setErro(errors.join(" ")); return; }
      await setPin(pin);
      setState("unlocked");
      return;
    }
    const valid = await verifyPin(pin);
    if (!valid) { setErro("PIN incorreto. O conteúdo continua bloqueado."); setPinValue(""); return; }
    setPinValue("");
    setState("unlocked");
  }

  if (state === "loading") {
    return <main className="gate"><div className="gate-card gate-esperando" role="status">Verificando a proteção local…</div></main>;
  }
  if (state === "unlocked") return <>{children}</>;

  const criando = state === "setup";
  const completo = pin.length >= MINIMO && pin.length <= MAXIMO;

  return (
    <main className="gate">
      <section className={`gate-card ${criando ? "gate-criando" : "gate-bloqueado"}`} aria-labelledby="gate-title">
        <header className="gate-topo">
          {/*
            A imagem completa traz "Pessoas · Território · Cuidado" embutido, que fica
            ilegível abaixo de uns 400px. Aqui entra só a ilustração, grande, e o nome vem
            como texto de verdade — nítido em qualquer tamanho de tela.
          */}
          <img className="gate-logo" src="/brand/icon-512.png" alt="" width={512} height={512} />
          <p className="gate-nome">Mapa</p>
        </header>

        <p className="eyebrow">Proteção local</p>
        <h1 id="gate-title">{criando ? "Crie um PIN para este dispositivo" : "Mapa protegido"}</h1>
        <p className="gate-descricao">
          {criando
            ? "O PIN protege o acesso ao Mapa neste aparelho e trava sozinho após alguns minutos sem uso."
            : "A proteção local está ativa neste aparelho. Digite seu PIN para continuar."}
        </p>

        <form onSubmit={submit} className="gate-form">
          <label htmlFor="local-pin">PIN de {MINIMO} a {MAXIMO} dígitos</label>
          <div className={`gate-campo ${erro ? "gate-campo-erro" : ""}`}>
            <input
              id="local-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={MAXIMO}
              autoComplete={criando ? "new-password" : "current-password"}
              value={pin}
              aria-invalid={erro ? true : undefined}
              aria-describedby={erro ? "gate-erro" : undefined}
              onChange={(event) => { setPinValue(event.target.value.replace(/\D/g, "")); setErro(""); }}
            />
            <span className="gate-contador" aria-hidden="true">{pin.length}/{MAXIMO}</span>
          </div>

          {erro && <p className="gate-erro" id="gate-erro" role="alert"><span aria-hidden="true">×</span>{erro}</p>}

          <Botao variante="primario" type="submit" disabled={!completo}>
            {criando ? "Configurar e entrar" : "Entrar"}
          </Botao>
          {!completo && pin.length > 0 && <p className="gate-dica">Faltam {MINIMO - pin.length} dígito(s).</p>}
        </form>

        {criando && <p className="gate-aviso">{pinSecurityNotice}</p>}
      </section>
    </main>
  );
}
