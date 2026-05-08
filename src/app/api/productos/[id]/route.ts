import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/auth";

interface Params {
  params: Promise<{ id: string }>;
}

// DELETE: Elimina un producto (requiere auth)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await sql`DELETE FROM productos WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT: Actualiza un producto (requiere auth)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { nombre, descripcion, precio, destacado, imagenes, categoria } = body;

    const precioVal = precio ? parseFloat(precio) : null;
    const imagenesJson = JSON.stringify(imagenes || []);
    const catVal = categoria || "General";

    await sql`
      UPDATE productos SET
        nombre = ${nombre},
        descripcion = ${descripcion},
        precio = ${precioVal},
        destacado = ${!!destacado},
        imagenes_json = ${imagenesJson},
        categoria = ${catVal}
      WHERE id = ${parseInt(id)}
    `;

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
