import { NextRequest, NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { auth } from "@/auth";

// GET: Lista todos los productos
export async function GET() {
  try {
    await initDb();
    const rows = await sql`SELECT * FROM productos ORDER BY creado_en DESC`;
    return NextResponse.json(rows);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Crea un nuevo producto (requiere auth)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await initDb();
    const body = await req.json();
    const { nombre, descripcion, precio, destacado, imagenes, categoria } = body;

    if (!nombre || !descripcion) {
      return NextResponse.json({ error: "Nombre y descripción son obligatorios." }, { status: 400 });
    }

    // Generar slug amigable (ej: "mesa-infantil", "mesa-infantil-2", etc.)
    let baseSlug = slugify(nombre);
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar si ya existe un producto con ese slug
    while (true) {
      const existing = await sql`SELECT id FROM productos WHERE slug = ${slug} LIMIT 1`;
      if (existing.length === 0) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
    const precioVal = precio ? parseFloat(precio) : null;
    const imagenesJson = JSON.stringify(imagenes || []);
    const catVal = categoria || "General";

    const rows = await sql`
      INSERT INTO productos (slug, nombre, descripcion, precio, destacado, imagenes_json, categoria)
      VALUES (${slug}, ${nombre}, ${descripcion}, ${precioVal}, ${!!destacado}, ${imagenesJson}, ${catVal})
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
