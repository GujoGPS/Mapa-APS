export interface TabMessage {
  type: "hello" | "heartbeat" | "editing" | "released" | "data-changed";
  tabId: string;
  entityId?: string;
  at: number;
}

export class MultiTabCoordinator {
  readonly tabId = crypto.randomUUID();
  private channel: BroadcastChannel | undefined;
  private heartbeat: ReturnType<typeof setInterval> | undefined;
  private listeners = new Set<(message: TabMessage) => void>();

  start(): void {
    if (typeof BroadcastChannel === "undefined") return;
    this.channel = new BroadcastChannel("mapa-coordination-v1");
    this.channel.onmessage = (event: MessageEvent<TabMessage>) => {
      if (event.data.tabId !== this.tabId) this.listeners.forEach((listener) => listener(event.data));
    };
    this.send({ type: "hello", tabId: this.tabId, at: Date.now() });
    this.heartbeat = setInterval(() => this.send({ type: "heartbeat", tabId: this.tabId, at: Date.now() }), 10_000);
  }

  onMessage(listener: (message: TabMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  editing(entityId: string): void { this.send({ type: "editing", tabId: this.tabId, entityId, at: Date.now() }); }
  released(entityId: string): void { this.send({ type: "released", tabId: this.tabId, entityId, at: Date.now() }); }
  changed(entityId: string): void { this.send({ type: "data-changed", tabId: this.tabId, entityId, at: Date.now() }); }

  stop(): void {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.channel?.close();
  }

  private send(message: TabMessage): void { this.channel?.postMessage(message); }
}
