import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Solo se permiten imágenes (JPG, PNG, WebP)" }, { status: 400 });
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no debe superar 5MB" }, { status: 400 });
    }

    const hasToken = process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== "tu-token-aqui";

    if (hasToken) {
      // Subir a Vercel Blob (Producción)
      const blob = await put(`productos/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      return NextResponse.json({ url: blob.url });
    } else {
      // Fallback a almacenamiento local (Desarrollo)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try { await fs.mkdir(uploadDir, { recursive: true }); } catch (e) { /* ignore if exists */ }
      
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      
      return NextResponse.json({ url: `/uploads/${filename}` });
    }

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
