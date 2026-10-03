"use client";

import {Sheet} from "./sheet";
import { useState } from "react";
import type { Family } from "@/src/contracts/family";
import { isSyntheticDemoFamily } from "@/src/contracts/demo";
import { enterDemoMode, exitDemoMode, removeDemoData } from "@/src/domain/demo-mode";

interface Props {
  active: boolean;
  families: Family[];
  onChanged: () => Promise<void>;
}

type Confirmation = "enter" | "remove" | null;

export function DemoModePanel({ active, families, onChanged }: Props) {
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const syntheticFamilyCount = families.filter(isSyntheticDemoFamily).length;

  async function enter() {
    setBusy(true);
    try {
      await enterDemoMode();
      await onChanged();
      setMessage("Demonstração ativa. Os dados normais estão isolados e podem ser restaurados ao sair.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível entrar na demonstração.");
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  }

  async function exit() {
    setBusy(true);
    try {
      await exitDemoMode();
      await onChanged();
      setMessage("Modo demonstração encerrado; estado anterior restaurado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível restaurar o estado anterior.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const count = await removeDemoData();
      await onChanged();
      setMessage(count ? `${count} registro(s) sintético(s) removido(s). Os dados normais foram preservados.` : "Nenhum registro sintético identificado para remoção.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível remover os dados sintéticos.");
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  }

  return (
    <section className="card" aria-labelledby="demo-mode-title">
      <p className="eyebrow">Ambiente local separado</p>
      <h2 id="demo-mode-title">Modo demonstração</h2>
      {active ? (
        <>
          <p className="safety-callout" role="status"><strong>Ativo · somente dados sintéticos.</strong> Os registros normais estão ocultos e guardados em um snapshot local.</p>
          <div className="action-row">
            <button type="button" disabled={busy} onClick={() => void exit()}>Sair e restaurar estado anterior</button>
            <button type="button" className="secondary" disabled={busy} onClick={() => setConfirmation("remove")}>Remover dados de demonstração</button>
          </div>
          <p className="fine-print">Remover apaga somente os registros desta demonstração e mantém o snapshot; sair restaura os dados anteriores.</p>
        </>
      ) : (
        <>
          <p>Entrar guarda os registros normais em um snapshot, remove do espaço ativo as sementes sintéticas antigas e abre um conjunto demonstrativo separado. Nenhum registro normal é apagado.</p>
          {syntheticFamilyCount > 0 && <p className="shared-callout">Há {syntheticFamilyCount} família(s) sintética(s) legada(s) no armazenamento atual; elas serão retiradas do espaço normal ao iniciar.</p>}
          <div className="action-row">
            <button type="button" disabled={busy} onClick={() => setConfirmation("enter")}>Entrar no modo demonstração</button>
            <button type="button" className="secondary" disabled={busy || syntheticFamilyCount === 0} onClick={() => setConfirmation("remove")}>Remover demonstração antiga</button>
          </div>
        </>
      )}
      <p className="system-message" role="status" aria-live="polite">{message}</p>
      {confirmation && (
        <Sheet open onClose={() => setConfirmation(null)} labelledBy="demo-confirm-title">
          <p className="eyebrow">Confirmação</p>
          <h3 id="demo-confirm-title">{confirmation === "enter" ? "Entrar na demonstração isolada?" : "Remover registros sintéticos?"}</h3>
          {confirmation === "enter" ? (
            <p>O aplicativo guardará os registros normais e mostrará apenas famílias sintéticas. Alterações feitas durante a demonstração continuarão marcadas como sintéticas. Ao sair, o estado anterior será restaurado.</p>
          ) : (
            <p>Esta ação remove somente registros identificados como parte da demonstração antiga. Famílias normais e seus dados não serão alterados.</p>
          )}
          <div className="action-row">
            <button type="button" disabled={busy} onClick={() => void (confirmation === "enter" ? enter() : remove())}>{confirmation === "enter" ? "Confirmar entrada" : "Confirmar remoção"}</button>
            <button type="button" className="secondary" disabled={busy} onClick={() => setConfirmation(null)}>Cancelar</button>
          </div>
        </Sheet>
      )}
    </section>
  );
}
