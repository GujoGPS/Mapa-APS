import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./styles.css";
import { ClientBootstrap } from "./client-bootstrap";
import { SecurityGate } from "./security-gate";
import { ToastProvider } from "./toast";

export const metadata: Metadata = {
  title: "Mapa | Clínica, família e território",
  description: "Fundação do Mapa, guia clínico e familiar para a APS.",
  applicationName: "Mapa",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1020",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <ClientBootstrap />
        <SecurityGate>
          <ToastProvider>{children}</ToastProvider>
        </SecurityGate>
      </body>
    </html>
  );
}
