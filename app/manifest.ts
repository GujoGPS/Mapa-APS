import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mapa: Clínica, família e território",
    short_name: "Mapa",
    description: "Guia clínico, familiar e territorial para apoio na APS.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f6",
    theme_color: "#0f5f52",
    lang: "pt-BR",
    categories: ["medical", "education", "productivity"],
  };
}
