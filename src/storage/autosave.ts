import { putValue } from "./idb";
import { STORES, type DraftRecord } from "./schema";

export type SavePhase = "idle" | "saving" | "saved" | "error";

export class DraftAutosave {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private revision = 0;

  schedule(id: string, scope: string, payload: unknown, delayMs = 500): Promise<DraftRecord> {
    this.cancel();
    const revision = ++this.revision;
    return new Promise((resolve, reject) => {
      this.timer = setTimeout(async () => {
        const record: DraftRecord = { id, scope, payload, updatedAt: new Date().toISOString() };
        try {
          await putValue(STORES.drafts, record);
          if (revision === this.revision) resolve(record);
        } catch (error) {
          reject(error);
        }
      }, delayMs);
    });
  }

  cancel(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
