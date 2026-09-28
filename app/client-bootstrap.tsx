"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/src/pwa/register";

export function ClientBootstrap() {
  useEffect(() => { void registerServiceWorker(); }, []);
  return null;
}
