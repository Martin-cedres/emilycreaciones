import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Producto } from "@/lib/types";

interface Props {
  producto: Producto;
}

export default function ProductCard({ producto }: Props) {
  const imagenes: string[] = JSON.parse(producto.imagenes_json || "[]");
  const img = imagenes[0] || "/placeholder.svg";

  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-pink-50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-brand-beige">
        <Image
          src={img}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {producto.destacado && (
          <span className="absolute top-3 left-3 bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            ⭐ Destacado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
          {producto.categoria || "General"}
        </span>
        <h3 className="font-semibold text-gray-800 group-hover:text-brand-pink transition-colors line-clamp-2">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {producto.descripcion}
        </p>
        {producto.precio && (
          <p className="mt-3 text-lg font-bold text-brand-pink">
            {formatPrice(producto.precio)}
          </p>
        )}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-wood font-medium bg-brand-beige/50 px-2 py-1.5 rounded-lg w-fit border border-pink-50">
          <span>🔨</span> Hecho a mano
        </div>
      </div>
    </Link>
  );
}
