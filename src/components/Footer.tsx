import { MessageCircle, CreditCard, Landmark, Wallet, ReceiptText } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const insta = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "emily_creaciones9122";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59897866568";

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Marca */}
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Image src="/logo.png" alt="Emily Creaciones" width={32} height={32} className="object-contain bg-white rounded-full p-1" /> Emily Creaciones
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Muebles y juegos infantiles artesanales en madera. Diseños únicos hechos con amor en Uruguay.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${insta}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-400 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg> @{insta}
              </a>
            </li>
          </ul>
        </div>

        {/* Pagos */}
        <div>
          <h4 className="text-white font-semibold mb-3">Medios de pago</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 mt-0.5 text-brand-pink flex-shrink-0" />
              <span>Aceptamos Mercado Pago hasta en 12 cuotas sin recargo</span>
            </li>
            <li className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-pink flex-shrink-0" />
              <span>Transferencia</span>
            </li>
            <li className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-brand-pink flex-shrink-0" />
              <span>Mi dinero</span>
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-pink flex-shrink-0" />
              <span>Prex</span>
            </li>
            <li className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-brand-pink flex-shrink-0" />
              <span>Giros o depósitos!</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Emily Creaciones. Todos los derechos reservados.
      </div>
    </footer>
  );
}
