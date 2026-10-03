"use client";

import { useCallback, useMemo, type RefObject } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  BaseEdge,
  getSmoothStepPath,
  MarkerType,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { qualityStyle, type DiagramEdge, type DiagramModel, type DiagramNode } from "@/src/domain/diagram-engine";
import { flowAriaLabels } from "@/src/domain/diagram-labels";

/**
 * Traducao de formato, nada mais: quem decide quem se relaciona com quem, quais nos existem e
 * com que qualidade continua sendo o motor de dominio. Aqui so convertemos para o formato de
 * nos e arestas do React Flow.
 */

export interface FamilyFlowProps {
  model: DiagramModel;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string;
  /** Permite exportar o desenho sem conhecer a estrutura interna do React Flow. */
  containerRef?: RefObject<HTMLDivElement | null>;
  /** Aviso da biblioteca; quem recebe decide como mostrar na interface. */
  onFlowError?: (code: string, message: string) => void;
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

export function toFlowNodes(model: DiagramModel, selectedNodeId?: string): Node[] {
  return model.nodes.map((node) => ({
    id: node.id,
    position: { x: node.x, y: node.y },
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

function FamilyDiagram({ model, onSelectNode, selectedNodeId, containerRef, onFlowError }: FamilyFlowProps) {
  const nodes = useMemo(() => toFlowNodes(model, selectedNodeId), [model, selectedNodeId]);
  const edges = useMemo(() => toFlowEdges(model), [model]);
  const onNodeClick = useCallback((_: unknown, node: Node) => { onSelectNode?.(node.id); }, [onSelectNode]);

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
      </ReactFlow>
    </div>
  );
}

export function FamilyDiagramFlow(props: FamilyFlowProps) {
  return (
    <ReactFlowProvider>
      <FamilyDiagram {...props} />
    </ReactFlowProvider>
  );
}
