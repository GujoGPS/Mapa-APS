import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mapa: Clínica, família e território",
    short_name: "Mapa",
    description: "Guia clínico, familiar e territorial para apoio na APS.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1020",
    theme_color: "#0a1020",
    lang: "pt-BR",
    categories: ["medical", "education", "productivity"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
