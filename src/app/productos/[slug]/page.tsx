import Image from "next/image";
import { notFound } from "next/navigation";
import { sql, initDb } from "@/lib/db";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { generateProductMetadata } from "@/lib/seo";
import type { Producto } from "@/lib/types";
import type { Metadata } from "next";
import { MessageCircle, ArrowLeft, CreditCard, Landmark, Wallet, ReceiptText } from "lucide-react";
import Link from "next/link";

import ProductGallery from "@/components/ProductGallery";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProducto(slug: string): Promise<Producto | null> {
  try {
    await initDb();
    const rows = await sql`SELECT * FROM productos WHERE slug = ${slug} LIMIT 1`;
    return (rows[0] as Producto) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProducto(slug);
  if (!p) return { title: "Producto no encontrado" };
  const imgs: string[] = JSON.parse(p.imagenes_json || "[]");
  return generateProductMetadata(p.nombre, p.descripcion, imgs[0]);
}

export default async function ProductoDetalle({ params }: Props) {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) notFound();

  const imagenes: string[] = JSON.parse(producto.imagenes_json || "[]");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const productUrl = `${baseUrl}/productos/${producto.slug}`;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/productos"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-pink mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Galería Animada */}
        <ProductGallery imagenes={imagenes} nombre={producto.nombre} />

        {/* Info */}
        <div className="flex flex-col">
          {producto.destacado && (
            <span className="bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
              ⭐ Producto Destacado
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>

          {producto.precio && (
            <p className="text-3xl font-extrabold text-brand-pink mt-3">
              {formatPrice(producto.precio)}
            </p>
          )}

          <p className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
            {producto.descripcion}
          </p>

          <div className="mt-6 p-4 bg-brand-beige/30 border border-pink-100 rounded-xl flex items-start gap-3">
            <span className="text-2xl drop-shadow-sm">🔨</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Producto artesanal a pedido</p>
              <p className="text-sm text-gray-600">Fabricamos tu pedido a mano. Consulta por disponibilidad de tiempos y colores por WhatsApp.</p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink(producto.nombre, productUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 px-6 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            Reservar / Agendar Pedido
          </a>

          {/* Medios de pago */}
          <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">💳</span> Medios de pago
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2"><CreditCard className="w-4 h-4 mt-0.5 text-brand-pink flex-shrink-0" /> Aceptamos Mercado Pago hasta en 12 cuotas sin recargo</li>
              <li className="flex items-center gap-2"><Landmark className="w-4 h-4 text-brand-pink flex-shrink-0" /> Transferencia</li>
              <li className="flex items-center gap-2"><Wallet className="w-4 h-4 text-brand-pink flex-shrink-0" /> Mi dinero</li>
              <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-brand-pink flex-shrink-0" /> Prex</li>
              <li className="flex items-center gap-2"><ReceiptText className="w-4 h-4 text-brand-pink flex-shrink-0" /> Giros o depósitos!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* JSON-LD Schema para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: producto.nombre,
            description: producto.descripcion,
            image: imagenes,
            ...(producto.precio && {
              offers: {
                "@type": "Offer",
                price: producto.precio,
                priceCurrency: "UYU",
                availability: "https://schema.org/InStock",
              },
            }),
          }),
        }}
      />
    </section>
  );
}
