/** Genera un slug URL-friendly a partir de un texto */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Formatea precio en pesos uruguayos */
export function formatPrice(price: number | null): string {
  if (!price) return "";
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 0,
  }).format(price);
}

export function whatsappLink(productName?: string, productUrl?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59897071052";
  const baseMsg = productName
    ? `Hola, me interesa encargar: ${productName}${productUrl ? ` (${productUrl})` : ""}. ¿Tienen disponibilidad de agenda/colores?`
    : "Hola! Quisiera hacer una consulta para agendar un pedido.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(baseMsg)}`;
}
