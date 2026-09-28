export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return undefined;
  if (process.env.NODE_ENV !== "production") return undefined;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}
