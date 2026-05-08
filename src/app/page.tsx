import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { sql, initDb } from "@/lib/db";
import type { Producto } from "@/lib/types";
import * as motion from "framer-motion/client";

export const revalidate = 60; // ISR: regenera cada 60 segundos

async function getDestacados(): Promise<Producto[]> {
  try {
    await initDb();
    const rows = await sql`
      SELECT * FROM productos WHERE destacado = true ORDER BY creado_en DESC LIMIT 6
    `;
    return rows as Producto[];
  } catch {
    return [];
  }
}

async function getRecientes(): Promise<Producto[]> {
  try {
    await initDb();
    const rows = await sql`
      SELECT * FROM productos ORDER BY creado_en DESC LIMIT 8
    `;
    return rows as Producto[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const destacados = await getDestacados();
  const recientes = await getRecientes();

  return (
    <>
      {/* HERO */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-pink-50 via-white to-brand-beige py-24 px-4 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-8 left-4 md:top-10 md:left-10 text-3xl md:text-4xl animate-bounce delay-100">🧸</div>
          <div className="absolute top-12 right-4 md:top-auto md:bottom-20 md:right-20 text-3xl md:text-4xl animate-bounce delay-300">🎠</div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <Image src="/logo.png" alt="Emily Creaciones Logo" width={200} height={200} className="mb-6 drop-shadow-md" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Muebles y juegos
            <span className="text-brand-pink block mt-2">hechos con amor</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Diseños artesanales en madera que transforman el cuarto de los niños en un mundo de aventuras. 
            Calidad uruguaya pensada para durar generaciones.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="px-10 py-4 bg-brand-pink text-white font-bold rounded-full hover:bg-pink-600 transition-all shadow-xl hover:shadow-pink-200 hover:scale-105"
            >
              Explorar Tienda
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59897866568"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#1DA851] transition-all shadow-xl hover:shadow-green-100 hover:scale-105 flex items-center justify-center gap-2"
            >
              💬 Consultar por WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 font-medium px-4">
            <span className="flex items-center gap-1">✨ Artesanal</span>
            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1">🇺🇾 Uruguay</span>
            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1">💳 Múltiples pagos</span>
          </div>
        </div>
      </motion.section>

      {/* DESTACADOS */}
      {destacados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
            <span className="bg-brand-pink/10 p-2 rounded-xl text-brand-pink text-xl">⭐</span>
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}

      {/* RECIENTES */}
      {recientes.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Nuevos Ingresos</h2>
            <Link
              href="/productos"
              className="text-sm font-bold text-brand-pink hover:text-pink-600 transition-colors flex items-center gap-1 bg-pink-50 px-4 py-2 rounded-full"
            >
              Ver todo el catálogo →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recientes.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}

    </>
  );
}

