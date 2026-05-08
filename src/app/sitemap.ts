import { MetadataRoute } from 'next';
import { sql } from '@/lib/db';
import type { Producto } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://emilycreaciones.com';

  // Obtener todos los productos para el sitemap
  let productos: Producto[] = [];
  try {
    const rows = await sql`SELECT slug, creado_en FROM productos`;
    productos = rows as Producto[];
  } catch (e) {
    console.error("Error generating sitemap:", e);
  }

  const productEntries: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${baseUrl}/productos/${p.slug}`,
    lastModified: new Date(p.creado_en),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...productEntries,
  ];
}
