import { checksumOf } from "@/src/storage/hash";
import { getValue, putValue } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { auditFields, newId, updatedAudit } from "@/src/domain/entity";
import type { DiagramLayout } from "@/src/contracts/relations";
import { getDemoSession } from "@/src/domain/demo-session";
import { isLayoutForScope, type LayoutScope, type PositionMap } from "./diagram-layout";

export const LAYOUT_ENTITY_TYPE = ENTITY_TYPES.diagramLayout;

async function write(layout: DiagramLayout): Promise<DiagramLayout> {
  const envelope: StoredEnvelope<DiagramLayout> = {
    id: layout.id,
    entityType: LAYOUT_ENTITY_TYPE,
    payload: layout,
    createdAt: layout.createdAt,
    updatedAt: layout.updatedAt,
    recordVersion: layout.recordVersion,
    checksum: await checksumOf(layout),
  };
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<DiagramLayout>>(STORES.records, layout.id);
  if (!readBack || readBack.checksum !== envelope.checksum) throw new Error("O desenho nao passou pela verificacao de integridade.");
  return layout;
}

async function readAll(): Promise<DiagramLayout[]> {
  const { getAllValues } = await import("@/src/storage/idb");
  const records = await getAllValues(STORES.records);
  return records
    .filter((record): record is StoredEnvelope<DiagramLayout> => (record as { entityType?: string }).entityType === LAYOUT_ENTITY_TYPE)
    .map((record) => record.payload);
}

export async function loadPositions(scope: LayoutScope): Promise<PositionMap | undefined> {
  const layouts = (await readAll()).filter((layout) => isLayoutForScope(layout, scope));
  if (!layouts.length) return undefined;
  const latest = layouts.sort((left, right) => left.updatedAt.localeCompare(right.updatedAt)).at(-1)!;
  return latest.positions;
}

export async function savePositions(scope: LayoutScope, positions: PositionMap, periodLabel: string): Promise<DiagramLayout> {
  const session = await getDemoSession();
  const layouts = (await readAll()).filter((layout) => isLayoutForScope(layout, scope));
  const previous = layouts.sort((left, right) => left.updatedAt.localeCompare(right.updatedAt)).at(-1);
  const base = {
    kind: scope.kind,
    periodLabel,
    positions,
    ...(scope.perspectivePersonId ? { perspectivePersonId: scope.perspectivePersonId } : {}),
    ...(scope.layer ? { layer: scope.layer as DiagramLayout["layer"] } : {}),
  };
  const layout: DiagramLayout = previous
    ? { ...previous, ...base, ...updatedAudit(previous), ...(session ? { dataOrigin: "synthetic-demo" as const } : previous.dataOrigin ? { dataOrigin: previous.dataOrigin } : {}) }
    : { ...auditFields(newId("layout")), familyId: scope.familyId, ...base, dataOrigin: session ? "synthetic-demo" : "normal" } as DiagramLayout;
  return write(layout);
}

export async function clearPositions(scope: LayoutScope): Promise<number> {
  const { deleteValue } = await import("@/src/storage/idb");
  const targets = (await readAll()).filter((layout) => isLayoutForScope(layout, scope));
  for (const layout of targets) await deleteValue(STORES.records, layout.id);
  return targets.length;
}
