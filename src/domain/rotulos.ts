/**
 * Rótulos de valores internos.
 *
 * Existe porque o app guarda enums em inglês e com traço — `review-needed`, `best-effort`,
 * `older-adult` — e nada garante que a interface traduza. Quando esquECE, o valor cru aparece
 * na tela. Passar todo valor interno por aqui é a defesa: se um enum novo aparecer sem rótulo,
 * o fallback diz isso em vez de despejar o código na frente da pessoa.
 */

import type { ClinicalSourceKind, PublicationLevel } from "../clinical/types";
import type { PersistenceState } from "../storage/status";
import type { Semester } from "../contracts/family";

type SemesterState = Semester["state"];

const NAO_ROTULADO = "sem rótulo definido";

function mapa<T extends string>(rotulos: Record<T, string>) {
  // `satisfies` pega enum novo sem rótulo em tempo de compilação, não em produção.
  return rotulos satisfies Record<T, string>;
}

export const publicationLevelLabels = mapa<PublicationLevel>({
  essential: "Essencial",
  expanded: "Ampliado",
  audited: "Verificado",
  "review-needed": "Precisa de revisão",
});

export const clinicalSourceKindLabels = mapa<ClinicalSourceKind>({
  pcdt: "Protocolo clínico (PCDT)",
  guideline: "Diretriz",
  "line-of-care": "Continuidade do cuidado",
  regulatory: "Norma regulatória",
  rename: "Registro nacional",
  "official-reference": "Referência oficial",
});

export const clinicalSourceStatusLabels = mapa<"current" | "preliminary" | "superseded" | "historical">({
  current: "Vigente",
  preliminary: "Preliminar",
  superseded: "Substituída",
  historical: "Histórica",
});

export const persistenceStateLabels = mapa<PersistenceState>({
  persistent: "O navegador guarda os dados após fechar",
  "best-effort": "O navegador pode limpar os dados quando quiser",
  unsupported: "Este navegador não permite confirmar a persistência",
  error: "Não foi possível verificar o armazenamento",
});

export const semesterStateLabels = mapa<SemesterState>({
  planned: "Planejada",
  active: "Em andamento",
  review: "Em revisão",
  "ready-to-close": "Pronta para encerrar",
  closed: "Encerrada",
  archived: "Arquivada",
});

/** Traduz qualquer valor interno. Sem rotulo conhecido, diz que falta — nunca mostra o codigo. */
export function rotulo<T extends string>(rotulos: Record<string, string>, valor: T | undefined): string {
  if (valor === undefined) return NAO_ROTULADO;
  return rotulos[valor] ?? `rótulo pendente para "${valor}"`;
}
