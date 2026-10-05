# ADR 0023: Diagrama em React Flow sem regras no componente

## Estado
Aceita.

## Contexto
O painel de relações desenhava o genograma e o ecomapa com um SVG próprio, sem teste de
renderização. A migração pedida é de camada de desenho, não de modelo: quem decide quais entidades
existem, quem se relaciona com quem e com que qualidade continua sendo o motor de domínio.

## Decisão
`@xyflow/react` desenha; `src/domain/diagram-engine.ts` continua sendo a única fonte de verdade.
`app/family-relations-flow.tsx` só traduz `DiagramModel` em nós e arestas: preserva ids, posições,
qualidade no estilo da aresta e descarta arestas cujo extremo não existe no modelo. O override
manual de aplicabilidade, o manifesto de contagem, a narrativa e a detecção de identificadores
continuam fora da camada de desenho.

A exportação de vetor usa `html-to-image` sobre o viewport do fluxo, porque o desenho do React Flow
não é um `<svg>` serializável como o anterior.

## Alternativas
- Reescrever o motor junto com a renderização: rejeitada, mudaria o modelo testado.
- Fork do React Flow: rejeitada, sem ganho.
- Manter o SVG antigo em paralelo na interface: rejeitada, duplicaria a fonte visual.

## Consequências
A camada nova tem teste de renderização e o painel inteiro ganhou teste de paridade. A dependência
`html-to-image` entra apenas para preservar a exportação em vetor.

## Impacto
- Privacidade: inalterado; identificadores continuam detectados antes de qualquer cópia de prompt.
- Clínica: inalterado; nenhum cálculo de relação foi movido para o componente.
- Dados: nenhum formato persistido mudou.
- Testes: `tests/family-diagram-flow.test.tsx`, `tests/family-relations-panel.test.tsx`,
  `tests/marco5-diagrams.test.ts` sem alteração.
