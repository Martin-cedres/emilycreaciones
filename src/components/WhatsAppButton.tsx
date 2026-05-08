"use client";

import { MessageCircle } from "lucide-react";
export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59897071052";

  return (
    <div className="fixed bottom-6 right-6 z-50 group flex flex-col items-end gap-2">
      {/* Tooltip con estilo burbuja de chat */}
      <div className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none border border-gray-100 whitespace-nowrap mb-1">
        ¿Necesitas ayuda? Chatea con nosotros
      </div>
      
      <a
        href={`https://wa.me/${phone}?text=${encodeURIComponent("Hola! Quisiera hacer una consulta.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-[#25D366] text-white rounded-full p-3.5 shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        {/* Efecto de onda sutil */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        
        {/* Logo oficial de WhatsApp */}
        <div className="relative z-10">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.014 12.032c0 2.12.54 4.189 1.577 6.06L0 24l6.105-1.602a11.83 11.83 0 005.937 1.606h.005c6.637 0 12.032-5.396 12.036-12.032a11.791 11.791 0 00-3.525-8.484" />
          </svg>
        </div>
      </a>
    </div>
  );
}
