export const DEMO_SESSION_META_ID = "active-demo-session";
export const DEMO_SESSION_SCHEMA_VERSION = 2;
export const DEMO_SAMPLE_SEMESTER_ID = "sem_demo_2026_2";
export const DEMO_SAMPLE_FAMILY_IDS = ["family_demo_horizonte", "family_demo_travessia"] as const;
export const DEMO_SAMPLE_LEGACY_IDS = [
  DEMO_SAMPLE_SEMESTER_ID,
  ...DEMO_SAMPLE_FAMILY_IDS,
  ...DEMO_SAMPLE_FAMILY_IDS.map((id) => `link_${id}`),
] as const;

export type DataOrigin = "synthetic-demo";

export interface DemoSessionSnapshot {
  state: "active";
  schemaVersion: typeof DEMO_SESSION_SCHEMA_VERSION;
  startedAt: string;
  snapshotRecords: unknown[];
  snapshotDrafts: unknown[];
  snapshotEvents: unknown[];
}

export interface DemoSessionMetaRecord {
  id: typeof DEMO_SESSION_META_ID;
  value: DemoSessionSnapshot;
  updatedAt: string;
}

export function isLegacyDemoEntityId(id: string): boolean {
  return (DEMO_SAMPLE_LEGACY_IDS as readonly string[]).includes(id);
}

export function isSyntheticDemoFamily(value: { id: string; dataOrigin?: DataOrigin }): boolean {
  return value.dataOrigin === "synthetic-demo" || (DEMO_SAMPLE_FAMILY_IDS as readonly string[]).includes(value.id);
}
