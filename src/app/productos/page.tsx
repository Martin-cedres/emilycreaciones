import ProductCard from "@/components/ProductCard";
import { sql } from "@/lib/db";
import type { Producto } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

const CATEGORIAS = ["Todos", "Muebles", "Juegos", "Decoración", "Dormitorio"];
const ITEMS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora nuestra colección de muebles y juegos infantiles artesanales en madera.",
};

async function getProductos(categoria?: string, page: number = 1): Promise<{ productos: Producto[]; total: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  try {
    if (categoria && categoria !== "Todos") {
      const rows = await sql`SELECT * FROM productos WHERE categoria = ${categoria} ORDER BY creado_en DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
      const countRes = await sql`SELECT count(*) FROM productos WHERE categoria = ${categoria}`;
      return { productos: rows as Producto[], total: Number(countRes[0].count) };
    }
    const rows = await sql`SELECT * FROM productos ORDER BY creado_en DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    const countRes = await sql`SELECT count(*) FROM productos`;
    return { productos: rows as Producto[], total: Number(countRes[0].count) };
  } catch {
    return { productos: [], total: 0 };
  }
}

interface Props {
  searchParams: Promise<{ cat?: string; page?: string }>;
}

export default async function ProductosPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentCat = resolvedParams.cat || "Todos";
  const currentPage = Number(resolvedParams.page) || 1;
  
  const { productos, total } = await getProductos(currentCat, currentPage);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Nuestra Colección</h1>
      <p className="text-gray-500 mb-10 text-lg">
        Piezas artesanales únicas, creadas para acompañar el crecimiento de los más pequeños.
      </p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIAS.map((c) => (
          <Link
            key={c}
            href={c === "Todos" ? "/productos" : `/productos?cat=${c}`}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              currentCat === c
                ? "bg-brand-pink text-white shadow-lg shadow-pink-100 scale-105"
                : "bg-white text-gray-500 border border-gray-100 hover:border-brand-pink hover:text-brand-pink"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {productos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const searchParamsObj = new URLSearchParams();
                if (currentCat !== "Todos") searchParamsObj.set("cat", currentCat);
                if (pageNum > 1) searchParamsObj.set("page", pageNum.toString());
                
                const href = `/productos?${searchParamsObj.toString()}`;

                return (
                  <Link
                    key={pageNum}
                    href={href}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                      currentPage === pageNum
                        ? "bg-brand-pink text-white shadow-md shadow-pink-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-brand-beige/30 rounded-[3rem] border-2 border-dashed border-pink-100">
          <span className="text-6xl block mb-4">🪵</span>
          <p className="text-gray-500 text-lg font-medium">No encontramos productos en esta categoría.</p>
          <Link href="/productos" className="text-brand-pink font-bold mt-4 inline-block hover:underline">
            Ver todo el catálogo
          </Link>
        </div>
      )}
    </section>
  );
}
