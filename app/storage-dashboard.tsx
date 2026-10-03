"use client";

import { useEffect, useState } from "react";
import { useToast } from "./toast";
import { serializeBackup } from "@/src/backup/service";
import { createEnvelope, saveRecordVerified } from "@/src/storage/repository";
import { readStorageStatus, requestPersistentStorage, type StorageStatus } from "@/src/storage/status";

function formatBytes(value?: number): string {
  if (value === undefined) return "indisponível";
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${(value / 1024 ** 3).toFixed(1)} GB`;
}

function formatPercent(ratio?: number): string {
  if (ratio === undefined) return "—";
  const pct = ratio * 100;
  if (pct < 0.1) return "menos de 0,1%";
  return `${pct.toFixed(pct < 10 ? 1 : 0)}%`;
}

export function StorageDashboard() {
  const [status, setStatus] = useState<StorageStatus>({ persistence: "unsupported" });
  const { avise } = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => { void readStorageStatus().then((next) => { setStatus(next); avise("Armazenamento verificado."); }); }, []);

  async function persist() {
    setBusy(true);
    const next = await requestPersistentStorage();
    setStatus(next);
    avise(next.persistence === "persistent" ? "Armazenamento persistente concedido." : "O navegador manteve o modo de melhor esforço. Faça backups frequentes.");
    setBusy(false);
  }

  async function testWrite() {
    setBusy(true);
    try {
      const receipt = await saveRecordVerified(createEnvelope("demo-integrity-check", "system-check", { synthetic: true, note: "verificacao de integridade" }));
      avise(receipt.verified ? `Gravação confirmada às ${new Date(receipt.savedAt).toLocaleTimeString("pt-BR")}.` : "A gravação não foi confirmada.");
    } catch (error) { avise(error instanceof Error ? error.message : "Falha desconhecida."); }
    setBusy(false);
  }

  async function downloadBackup() {
    setBusy(true);
    try {
      const content = await serializeBackup();
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `mapa-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      avise("Backup preparado com os seus dados; registros de demonstração nunca entram.");
    } catch (error) { avise(error instanceof Error ? error.message : "Falha ao gerar backup."); }
    setBusy(false);
  }

  return (
    <section className="card" aria-labelledby="storage-title">
      <p className="eyebrow">Fundação local-first</p>
      <h2 id="storage-title">Estado do dispositivo</h2>
      <p className="fine-print">Este aparelho guarda os dados no próprio navegador, sem servidor. A persistência mostra se o navegador vai manter as fichas depois que você fechar o app. O espaço usado é o total do navegador, não só do Mapa — por isso aparece em porcentagem: serve para você perceber quando estiver perto de encher, não para controlar nada. Nada sai daqui a não ser por um backup que você mesmo gera.</p>
      <div className="storage-grid">
        <div><span>Persistência</span><strong>{status.persistence}</strong></div>
        <div><span>Dados guardados</span><strong>{formatBytes(status.usage)}</strong></div>
        <div><span>Espaço usado do navegador</span><strong>{formatPercent(status.usageRatio)}</strong></div>
      </div>
      <div className="action-row">
        <button type="button" disabled={busy} onClick={persist}>Solicitar persistência</button>
        <button type="button" disabled={busy} onClick={testWrite}>Testar gravação</button>
        <button type="button" disabled={busy} onClick={downloadBackup}>Gerar backup</button>
      </div>
      
    </section>
  );
}
