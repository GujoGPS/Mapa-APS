import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./styles.css";
import { ClientBootstrap } from "./client-bootstrap";
import { SecurityGate } from "./security-gate";

export const metadata: Metadata = {
  title: "Mapa | Clínica, família e território",
  description: "Fundação do Mapa, guia clínico e familiar para a APS.",
  applicationName: "Mapa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#071512" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <ClientBootstrap />
        <SecurityGate>{children}</SecurityGate>
      </body>
    </html>
  );
}
