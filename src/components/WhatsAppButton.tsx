"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59897866568";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent("Hola! Quisiera hacer una consulta.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
    </a>
  );
}
