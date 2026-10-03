import type { Person } from "@/src/contracts/family";
import type { ExternalResource, ResourceType } from "@/src/contracts/relations";

/**
 * Rotulos do diagrama em portugues. O motor de dominio entrega os valores brutos dos enums; aqui
 * eles viram texto legivel, em um unico lugar, para que grafo e descricao nunca discordem.
 */

export const resourceTypeLabels: Record<ResourceType, string> = {
  health: "saude",
  education: "educacao",
  work: "trabalho",
  community: "comunidade",
  religion: "religiao",
  "extended-family": "familia extensa",
  "social-assistance": "assistencia social",
  leisure: "lazer",
  justice: "justica",
  other: "outro",
};

export const resourceStateLabels: Record<ExternalResource["state"], string> = {
  potential: "potencial",
  active: "ativo",
  inactive: "inativo",
  closed: "encerrado",
};

export const lifeStageLabels: Record<NonNullable<Person["lifeStage"]>, string> = {
  child: "crianca",
  adolescent: "adolescente",
  adult: "adulta",
  "older-adult": "pessoa idosa",
  unknown: "faixa etaria nao informada",
};

export function resourceSubtitle(resource: { type: ResourceType; state: ExternalResource["state"] }): string {
  return `${resourceTypeLabels[resource.type] ?? resource.type} · ${resourceStateLabels[resource.state] ?? resource.state}`;
}

export function lifeStageSubtitle(lifeStage: Person["lifeStage"]): string {
  return lifeStage ? lifeStageLabels[lifeStage] ?? lifeStage : "faixa etaria nao informada";
}

/** Rotulos de acessibilidade da biblioteca de diagrama, traduzidos para a interface. */
export const flowAriaLabels = {
  "controls.ariaLabel": "Controles do diagrama",
  "controls.zoomIn.ariaLabel": "Aproximar",
  "controls.zoomOut.ariaLabel": "Afastar",
  "controls.fitView.ariaLabel": "Ajustar o diagrama à tela",
  "controls.interactive.ariaLabel": "Alternar interação",
  "minimap.ariaLabel": "Mapa geral do diagrama",
  "handle.ariaLabel": "Ponto de ligação",
  "node.a11yDescription.default": "Pressione enter ou espaço para selecionar um nó. Pressione delete para removê-lo e escape para cancelar.",
  "node.a11yDescription.keyboardDisabled": "Pressione enter ou espaço para selecionar um nó. Depois use as setas para movê-lo. Pressione delete para removê-lo e escape para cancelar.",
  "edge.a11yDescription.default": "Pressione enter ou espaço para selecionar um vínculo. Depois pressione delete para removê-lo ou escape para cancelar.",
} as const;

/** Mensagens do codigo da biblioteca que fazem sentido para quem usa o aplicativo. */
export function translateFlowError(code: string, message: string): string {
  if (code === "004") return "O diagrama precisa de um container com largura e altura. Recarregue a pagina.";
  if (code === "002") return "Falta um tipo de no reconhecido; um no foi desenhado com o formato padrao.";
  return message;
}

export const qualityLegend: { quality: string; label: string }[] = [
  { quality: "strong", label: "forte" },
  { quality: "adequate", label: "adequado" },
  { quality: "weak", label: "fraco" },
  { quality: "conflict", label: "conflituoso" },
  { quality: "ruptured", label: "rompido" },
  { quality: "divergent", label: "divergente" },
  { quality: "unknown", label: "desconhecido" },
];
