import { Metadata } from "next";

const SITE_NAME = "Emily Creaciones";
const SITE_DESCRIPTION = "Muebles y juegos infantiles artesanales en madera. Diseños únicos hechos con amor en Uruguay.";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://emilycreaciones.com";

/** Metadata global por defecto */
export const defaultMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Muebles y Juegos Infantiles en Madera`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  keywords: [
    "muebles infantiles",
    "juegos de madera",
    "muebles artesanales Uruguay",
    "juguetes de madera",
    "Emily Creaciones",
    "muebles niños Uruguay",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Muebles y Juegos Infantiles en Madera`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Extrae palabras clave relevantes del título y descripción */
function extractKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const words = text.match(/\b[a-záéíóúüñ]+\b/g) || [];
  const stopWords = new Set([
    "el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o", "de", "del", "al", "a", "en", "por", "para", "con", "sin", "su", "sus", "tu", "tus", "mi", "mis", "es", "son", "se", "lo", "qué", "que", "como", "más", "mas", "muy", "este", "esta", "estos", "estas"
  ]);
  
  const keywords = words
    .filter(w => w.length > 3 && !stopWords.has(w))
    .filter((v, i, a) => a.indexOf(v) === i) // eliminar duplicados
    .slice(0, 15); // Top 15 palabras más relevantes

  return [...keywords, "emily creaciones", "artesanal", "uruguay"];
}

/** Genera metadata SEO dinámica para cada producto */
export function generateProductMetadata(
  nombre: string,
  descripcion: string,
  imagen?: string
): Metadata {
  const title = `${nombre} — ${SITE_NAME}`;
  const desc = descripcion.length > 155 ? descripcion.slice(0, 152) + "..." : descripcion;
  const autoKeywords = extractKeywords(nombre, descripcion);

  return {
    title: nombre,
    description: desc,
    keywords: autoKeywords,
    openGraph: {
      title,
      description: desc,
      type: "article",
      ...(imagen && { images: [{ url: imagen, width: 800, height: 600, alt: nombre }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(imagen && { images: [imagen] }),
    },
  };
}
