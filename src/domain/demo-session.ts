import type { DemoSessionMetaRecord, DemoSessionSnapshot } from "@/src/contracts/demo";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";
import { getValue } from "@/src/storage/idb";
import { STORES } from "@/src/storage/schema";

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Le a sessao de demonstracao.
 *
 * Antes esta funcao recusava qualquer sessao que nao tivesse exatamente o schema atual. Como o
 * schema 1 nao guardava drafts nem eventos, quem entrou em demonstracao antes dessa mudanca ficou
 * preso: a saida lancava o mesmo erro, `enterDemoMode` recusava reentrar e o `refresh` do app
 * inteiro quebrava junto, porque esta leitura participates do Promise.all.
 *
 * Agora a versao nao decide a validade: decide o que falta. Uma sessao antiga e valida e sai
 * normalmente, restaurando o que ainda existe no snapshot.
 */
export async function getDemoSession(): Promise<DemoSessionSnapshot | undefined> {
  const record = await getValue<DemoSessionMetaRecord>(STORES.meta, DEMO_SESSION_META_ID);
  if (!record) return undefined;
  const value = record.value as Partial<DemoSessionSnapshot> | undefined;
  if (value?.state !== "active" || !isArray(value.snapshotRecords)) {
    throw new Error("A sessão de demonstração local está inconsistente e não pode ser lida. Nada foi alterado.");
  }
  const temDrafts = isArray(value.snapshotDrafts);
  const temEventos = isArray(value.snapshotEvents);
  if (temDrafts && temEventos) return value as DemoSessionSnapshot;
  return { ...(value as DemoSessionSnapshot), incomplete: true };
}
