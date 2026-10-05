"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  BaseEdge,
  getNodesBounds,
  getSmoothStepPath,
  getViewportForBounds,
  MarkerType,
  Panel,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeChange,
  type NodeProps,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { qualityStyle, type DiagramEdge, type DiagramModel, type DiagramNode } from "@/src/domain/diagram-engine";
import { flowAriaLabels, qualityLegend } from "@/src/domain/diagram-labels";
import { mergePositions, positionsFromNodes, type LayoutScope, type PositionMap } from "@/src/domain/diagram-layout";
import { clearPositions, loadPositions, savePositions } from "@/src/domain/diagram-layout-store";

/**
 * Traducao de formato, nada mais: quem decide quem se relaciona com quem, quais nos existem e
 * com que qualidade continua sendo o motor de dominio. Aqui so convertemos para o formato de
 * nos e arestas do React Flow.
 */


export interface FlowExportHandle {
  /** Enquadra todos os nos e devolve o SVG do grafo inteiro, ja no tamanho final. */
  exportAllNodes: () => Promise<string | undefined>;
}

export const FlowExportContext = createContext<FlowExportHandle | undefined>(undefined);

/** Usado pelo painel para exportar o diagrama inteiro, e nao apenas a fatia visivel. */
export function useFlowExport(): FlowExportHandle | undefined {
  return useContext(FlowExportContext);
}

export interface FamilyFlowProps {
  model: DiagramModel;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string;
  /** Aviso da biblioteca; quem recebe decide como mostrar na interface. */
  onFlowError?: (code: string, message: string) => void;
  /** Legenda das cores de vinculo; so aparece quando o diagrama tem vinculos. */
  showLegend?: boolean;
  /** Escopo do desenho salvo: familia, tipo, perspectiva e camada. */
  scope?: LayoutScope;
  /** Avisa quando o usuario arrasta nos, para o painel persistir. */
  onPositionsChange?: (positions: PositionMap) => void;
  /** true quando ha posicoes salvas diferentes do desenho calculado. */
  hasSavedLayout?: boolean;
  onResetLayout?: () => void;
}

export interface FamilyNodeData extends Record<string, unknown> {
  label: string;
  subtitle: string;
  kind: DiagramNode["kind"];
  state?: string;
}

export interface FamilyEdgeData extends Record<string, unknown> {
  label: string;
  quality: DiagramEdge["quality"];
  direction: DiagramEdge["direction"];
  perspective: string;
}

/** Altura do container do diagrama em pixels. O React Flow mede este elemento; um valor em
 *  px nao depende de um pai com altura resolvida, ao contrario de porcentagem. */
export const FLOW_HEIGHT_PX = 520;

const kindClass: Record<DiagramNode["kind"], string> = {
  person: "person",
  family: "family",
  resource: "resource",
  household: "household",
};

export function toFlowNodes(model: DiagramModel, selectedNodeId?: string, positions?: PositionMap): Node[] {
  return model.nodes.map((node) => ({
    id: node.id,
    position: positions?.[node.id] ?? { x: node.x, y: node.y },
    type: "familyNode",
    selected: selectedNodeId === node.id,
    data: {
      label: node.label,
      subtitle: node.subtitle ?? node.kind,
      kind: node.kind,
      ...(node.state ? { state: node.state } : {}),
    } satisfies FamilyNodeData,
  }));
}

export function toFlowEdges(model: DiagramModel): Edge[] {
  const known = new Set(model.nodes.map((node) => node.id));
  return model.edges
    .filter((edge) => known.has(edge.sourceId) && known.has(edge.targetId))
    .map((edge) => {
      const style = qualityStyle(edge.quality);
      return {
        id: edge.id,
        source: edge.sourceId,
        target: edge.targetId,
        type: "familyEdge",
        ...(edge.direction === "mutual" || edge.direction === "none" ? {} : { markerEnd: { type: MarkerType.ArrowClosed } }),
        style: {
          stroke: style.stroke,
          strokeWidth: style.width,
          strokeDasharray: style.dash || undefined,
        },
        data: {
          label: edge.label,
          quality: edge.quality,
          direction: edge.direction,
          perspective: edge.perspective,
        } satisfies FamilyEdgeData,
      };
    });
}

function FamilyNode({ data, selected }: NodeProps<Node<FamilyNodeData>>) {
  const value = data as FamilyNodeData;
  return (
    <div className={`flow-node ${kindClass[value.kind]} ${selected ? "selected" : ""}`} data-testid={`flow-node-${value.kind}`}>
      <Handle type="target" position={Position.Top} />
      <strong className="flow-node-label">{value.label}</strong>
      <small className="flow-node-subtitle">{value.subtitle}</small>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function FamilyEdge({ id, data, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd }: EdgeProps) {
  const value = data as FamilyEdgeData;
  const [path, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  return (
    <>
      {/* BaseEdge aplica o estilo recebido da aresta, incluindo a cor por qualidade de vinculo. */}
      <BaseEdge id={id} path={path} {...(style ? { style } : {})} {...(markerEnd ? { markerEnd } : {})} />
      <text className="flow-edge-label" x={labelX} y={labelY - 6}>{value.label}</text>
    </>
  );
}

const nodeTypes = { familyNode: FamilyNode };
const edgeTypes = { familyEdge: FamilyEdge };

function RelationshipLegend() {
  return (
    <Panel position="top-right" className="flow-legend">
      <strong>Qualidade do vinculo</strong>
      <ul>
        {qualityLegend.map((item) => (
          <li key={item.quality}>
            <span className="flow-legend-line" style={qualityStyle(item.quality as never)} aria-hidden="true" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

type InternalFlowProps = FamilyFlowProps & { containerRef: RefObjectLike };
type RefObjectLike = { current: HTMLDivElement | null };

function FamilyDiagram({ model, onSelectNode, selectedNodeId, containerRef, onFlowError, showLegend, scope, onPositionsChange, hasSavedLayout, onResetLayout }: InternalFlowProps) {
  const [saved, setSaved] = useState<PositionMap | undefined>(undefined);
  const positions = useMemo(
    () => mergePositions(model.nodes, saved),
    [model.nodes, saved],
  );
  const nodes = useMemo(() => toFlowNodes(model, selectedNodeId, positions), [model, selectedNodeId, positions]);
  const edges = useMemo(() => toFlowEdges(model), [model]);
  const onNodeClick = useCallback((_: unknown, node: Node) => { onSelectNode?.(node.id); }, [onSelectNode]);
  const { fitView } = useReactFlow();
  const scopeKey = scope ? `${scope.familyId}|${scope.kind}|${scope.perspectivePersonId ?? ""}|${scope.layer ?? ""}` : "";
  useEffect(() => {
    if (!scope) { setSaved(undefined); return; }
    let active = true;
    void loadPositions(scope).then((loaded) => { if (active) setSaved(loaded); }).catch(() => { if (active) setSaved(undefined); });
    return () => { active = false; };
  }, [scopeKey, scope]);
  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    const moved = changes.filter((change) => "position" in change && change.position) as { id: string; position: { x: number; y: number } }[];
    if (!moved.length) return;
    setSaved((current) => ({ ...(current ?? {}), ...Object.fromEntries(moved.map((change) => [change.id, change.position])) }));
  }, []);
  // A persistencia acontece depois que o grafo assenta, para gravar a posicao final do arrasto.
  useEffect(() => {
    if (!saved || !onPositionsChange) return;
    onPositionsChange(positionsFromNodes(nodes));
  }, [saved, nodes, onPositionsChange]);
  // Trocar de familia, perspectiva ou camada precisa reenquadrar; senao a visao anterior fica.
  const signature = `${model.kind}|${model.perspectiveLabel}|${model.nodes.map((node) => node.id).join(",")}|${model.edges.length}`;
  useEffect(() => { fitView({ padding: 0.2, duration: 300 }); }, [signature, fitView]);

  return (
    <div
      className="family-diagram family-diagram-flow"
      data-testid="family-diagram-flow"
      ref={containerRef}
      style={{ height: FLOW_HEIGHT_PX, width: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        nodesDraggable
        onNodesChange={onNodesChange}
        nodesConnectable={false}
        elementsSelectable
        fitView
        ariaLabelConfig={{ ...flowAriaLabels }}
        {...(onFlowError ? { onError: onFlowError } : {})}
        aria-label={`${model.kind === "genogram" ? "Genograma" : "Ecomapa"} da família`}
      >
        <Background />
        <MiniMap pannable zoomable />
        <Controls />
        {showLegend && model.edges.length > 0 && <RelationshipLegend />}
        {onResetLayout && hasSavedLayout && <Panel position="top-left" className="flow-legend">
          <button type="button" className="flow-layout-reset" onClick={onResetLayout}>Voltar ao desenho original</button>
        </Panel>}
      </ReactFlow>
    </div>
  );
}

function FlowWithExport(props: FamilyFlowProps) {
  const { fitView, getViewport, setViewport, getNodes } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  const exportAllNodes = useCallback(async () => {
    const viewport = containerRef?.current?.querySelector<HTMLElement>(".react-flow__viewport");
    const surface = containerRef?.current;
    if (!viewport || !surface) return undefined;
    const internal = getNodes();
    if (!internal.length) return undefined;
    const width = viewport.offsetWidth;
    const height = viewport.offsetHeight;
    const previous = getViewport();
    const bounds = getNodesBounds(internal);
    const next = getViewportForBounds(bounds, width, height, 0.12, 2, 0.1);
    setViewport(next);
    // A viewport so assenta no proximo quadro; sem essa espera o SVG sairia com o enquadramento velho.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      const styles = getComputedStyle(surface);
      const backgroundColor = styles.backgroundColor.includes("rgba(0, 0, 0, 0)") || styles.backgroundColor === "transparent" ? getComputedStyle(document.body).backgroundColor : styles.backgroundColor;
      const { toSvg } = await import("html-to-image");
      return await toSvg(viewport, { backgroundColor, width, height, cacheBust: true, style: { width: `${width}px`, height: `${height}px` } });
    } finally {
      setViewport(previous);
      fitView({ padding: 0.2, duration: 200 });
    }
  }, [containerRef, fitView, getViewport, setViewport, getNodes]);

  const handle = useMemo(() => ({ exportAllNodes }), [exportAllNodes]);
  return (
    <FlowExportContext.Provider value={handle}>
      <FamilyDiagram {...props} containerRef={containerRef} />
    </FlowExportContext.Provider>
  );
}

export function FamilyDiagramFlow(props: FamilyFlowProps) {
  return (
    <ReactFlowProvider>
      <FlowWithExport {...props} />
    </ReactFlowProvider>
  );
}
