import { MAPA_DB_NAME, MAPA_DB_VERSION, STORES, type StoreName } from "./schema";

let openPromise: Promise<IDBDatabase> | undefined;

function createSchema(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(STORES.meta)) db.createObjectStore(STORES.meta, { keyPath: "id" });
  if (!db.objectStoreNames.contains(STORES.records)) {
    const store = db.createObjectStore(STORES.records, { keyPath: "id" });
    store.createIndex("entityType", "entityType", { unique: false });
    store.createIndex("updatedAt", "updatedAt", { unique: false });
  }
  if (!db.objectStoreNames.contains(STORES.drafts)) db.createObjectStore(STORES.drafts, { keyPath: "id" });
  if (!db.objectStoreNames.contains(STORES.events)) {
    const store = db.createObjectStore(STORES.events, { keyPath: "id" });
    store.createIndex("occurredAt", "occurredAt", { unique: false });
    store.createIndex("entityId", "entityId", { unique: false });
  }
  if (!db.objectStoreNames.contains(STORES.security)) db.createObjectStore(STORES.security, { keyPath: "id" });
}

export function openMapaDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB não está disponível."));
  if (openPromise) return openPromise;

  openPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(MAPA_DB_NAME, MAPA_DB_VERSION);
    request.onupgradeneeded = () => createSchema(request.result);
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error("Falha ao abrir o banco local."));
    request.onblocked = () => reject(new Error("Atualização bloqueada por outra aba aberta."));
  });
  return openPromise;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Operação IndexedDB falhou."));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Transação falhou."));
    tx.onabort = () => reject(tx.error ?? new Error("Transação foi cancelada."));
  });
}

export async function putValue<T>(storeName: StoreName, value: T): Promise<void> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readwrite", { durability: "strict" });
  tx.objectStore(storeName).put(value);
  await transactionDone(tx);
}

export async function getValue<T>(storeName: StoreName, id: string): Promise<T | undefined> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readonly");
  const result = await requestResult(tx.objectStore(storeName).get(id));
  await transactionDone(tx);
  return result as T | undefined;
}

export async function getAllValues<T>(storeName: StoreName): Promise<T[]> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readonly");
  const result = await requestResult(tx.objectStore(storeName).getAll());
  await transactionDone(tx);
  return result as T[];
}

export async function deleteValue(storeName: StoreName, id: string): Promise<void> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readwrite", { durability: "strict" });
  tx.objectStore(storeName).delete(id);
  await transactionDone(tx);
}

export async function replaceStore(storeName: StoreName, values: unknown[]): Promise<void> {
  const db = await openMapaDatabase();
  const tx = db.transaction(storeName, "readwrite", { durability: "strict" });
  const store = tx.objectStore(storeName);
  store.clear();
  values.forEach((value) => store.put(value));
  await transactionDone(tx);
}

export async function replaceAllStores(valuesByStore: Record<StoreName, unknown[]>): Promise<void> {
  const db = await openMapaDatabase();
  const names = Object.values(STORES);
  const tx = db.transaction(names, "readwrite", { durability: "strict" });
  for (const name of names) {
    const store = tx.objectStore(name);
    store.clear();
    valuesByStore[name].forEach((value) => store.put(value));
  }
  await transactionDone(tx);
}

export async function clearMapaDatabaseForTests(): Promise<void> {
  const db = await openMapaDatabase();
  const names = Object.values(STORES);
  const tx = db.transaction(names, "readwrite");
  names.forEach((name) => tx.objectStore(name).clear());
  await transactionDone(tx);
}
