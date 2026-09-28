import type {DiagramModel} from "@/src/domain/diagram-engine";
const risky=[/\b\d{3}[. -]?\d{3}[. -]?\d{3}[- ]?\d{2}\b/g,/\b\(?\d{2}\)?\s?9?\d{4}[- ]?\d{4}\b/g,/\b[A-ZÀ-Ý][a-zà-ÿ]+\s+[A-ZÀ-Ý][a-zà-ÿ]+\b/g];
export function possibleIdentifiers(text:string):string[]{return risky.flatMap((pattern)=>text.match(pattern)??[])}
export function diagramPrompt(model:DiagramModel):string{const entities=model.nodes.map((n)=>`- ${n.id}: ${n.kind}; rótulo ${n.label}; ${n.subtitle||"sem subtítulo"}`).join("\n");const links=model.edges.map((e)=>`- ${e.id}: ${e.sourceId} -> ${e.targetId}; ${e.label}; qualidade ${e.quality}; direção ${e.direction}; perspectiva ${e.perspective}`).join("\n");return `OBJETIVO
Produzir ${model.kind==="genogram"?"um genograma em camadas":"um ecomapa familiar"} a partir da estrutura abaixo.

REGRAS
- Não inventar pessoas, recursos, vínculos ou diagnósticos.
- Preservar divergências e perspectivas.
- Usar apenas os códigos fornecidos.
- Antes de desenhar, validar por escrito a contagem esperada.
- Se houver ambiguidade, perguntar em vez de completar.

PERSPECTIVA
${model.perspectiveLabel}

PERÍODO
${model.periodLabel}

MANIFESTO
Entidades esperadas: ${model.manifest.expectedNodes}
Vínculos esperados: ${model.manifest.expectedEdges}
Vínculos divergentes: ${model.manifest.divergentEdges}

ENTIDADES
${entities}

VÍNCULOS
${links}`}
