export type PersistenceState = "persistent" | "best-effort" | "unsupported" | "error";

export interface StorageStatus {
  persistence: PersistenceState;
  usage?: number;
  quota?: number;
  usageRatio?: number;
}

export async function readStorageStatus(): Promise<StorageStatus> {
  if (typeof navigator === "undefined" || !navigator.storage) return { persistence: "unsupported" };
  try {
    const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const estimate = navigator.storage.estimate ? await navigator.storage.estimate() : {};
    const usage = estimate.usage;
    const quota = estimate.quota;
    return {
      persistence: persisted ? "persistent" : "best-effort",
      ...(usage !== undefined ? { usage } : {}),
      ...(quota !== undefined ? { quota } : {}),
      ...(usage !== undefined && quota ? { usageRatio: usage / quota } : {}),
    };
  } catch {
    return { persistence: "error" };
  }
}

export async function requestPersistentStorage(): Promise<StorageStatus> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return readStorageStatus();
  try { await navigator.storage.persist(); } catch { /* status reports the failure */ }
  return readStorageStatus();
}
