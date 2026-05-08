"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Star, LogOut, Loader2, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { compressImage } from "@/lib/image-utils";

interface ProductoAdmin {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  destacado: boolean;
  imagenes_json: string;
  creado_en: string;
}

const CATEGORIAS = ["General", "Muebles", "Juegos", "Decoración", "Dormitorio"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [destacado, setDestacado] = useState(false);
  const [imagenes, setImagenes] = useState<string[]>([]);

  // Cargar productos
  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos");
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    } catch { /* silencioso */ }
  };

  useEffect(() => {
    if (session) fetchProductos();
  }, [session]);

  // Editar producto (precargar form)
  const handleEdit = (p: ProductoAdmin & { categoria?: string }) => {
    setEditingId(p.id);
    setNombre(p.nombre);
    setDescripcion(p.descripcion);
    setPrecio(p.precio?.toString() || "");
    setCategoria(p.categoria || "General");
    setDestacado(p.destacado);
    setImagenes(JSON.parse(p.imagenes_json || "[]"));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("General");
    setDestacado(false);
    setImagenes([]);
    setShowForm(false);
  };

  // Subir imagen
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        // Comprimir antes de subir
        const compressedFile = await compressImage(file);
        
        const formData = new FormData();
        formData.append("file", compressedFile);
        
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setImagenes(prev => [...prev, data.url]);
        } else {
          const err = await res.json();
          alert(err.error || "Error al subir imagen");
        }
      } catch (error) {
        console.error(error);
        alert("Error al procesar o subir la imagen");
      }
    }
    setUploading(false);
  };

  // Quitar imagen de la lista
  const removeImage = (idx: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== idx));
  };

  // Publicar o Actualizar producto
  const handleSave = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      alert("Nombre y descripción son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const url = editingId ? `/api/productos/${editingId}` : "/api/productos";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio, destacado, imagenes, categoria }),
      });

      if (res.ok) {
        resetForm();
        fetchProductos();
      } else {
        const err = await res.json();
        alert(err.error || "Error al guardar");
      }
    } catch {
      alert("Error de conexión");
    }
    setLoading(false);
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await fetch(`/api/productos/${id}`, { method: "DELETE" });
      fetchProductos();
    } catch {
      alert("Error al eliminar");
    }
  };

  // Si no está logueado
  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center border border-pink-100">
          <span className="text-5xl block mb-4">🔒</span>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mb-6">
            Inicia sesión con tu correo autorizado y contraseña.
          </p>
          <button
            onClick={() => signIn()}
            className="w-full py-3 bg-brand-pink text-white font-semibold rounded-full hover:bg-pink-600 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Admin */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-sm text-gray-500">{session.user?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="p-2.5 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Botón Nuevo Producto */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-brand-pink text-white font-semibold rounded-2xl hover:bg-pink-600 transition-colors shadow-lg flex items-center justify-center gap-2 text-lg mb-8"
        >
          <Plus className="w-6 h-6" /> Nuevo Producto
        </button>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-pink-100 shadow-lg p-6 mb-8 animate-fade-in space-y-4">
          <h2 className="font-bold text-lg text-gray-900">
            {editingId ? "Editar producto" : "Publicar producto"}
          </h2>

          <input
            type="text"
            placeholder="Nombre del producto *"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-colors text-gray-800"
          />

          <textarea
            placeholder="Descripción *"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-colors text-gray-800 resize-none"
          />

          <input
            type="number"
            placeholder="Precio (opcional, en pesos)"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-colors text-gray-800"
          />

          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-colors text-gray-800 bg-white"
          >
            {CATEGORIAS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Toggle Destacado */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={destacado}
              onChange={e => setDestacado(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${destacado ? "bg-brand-pink" : "bg-gray-200"}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${destacado ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <Star className="w-4 h-4" /> Producto destacado
            </span>
          </label>

          {/* Imágenes subidas */}
          {imagenes.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imagenes.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image src={url} alt={`Img ${i + 1}`} fill className="object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Subir imagen */}
          <label className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-pink transition-colors text-gray-500 hover:text-brand-pink">
            {uploading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Subiendo...</>
            ) : (
              <><Upload className="w-5 h-5" /> Subir imágenes</>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 bg-brand-pink text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              {editingId ? "Guardar cambios" : "Publicar"}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Productos */}
      <h2 className="font-bold text-lg text-gray-900 mb-4">
        Productos publicados ({productos.length})
      </h2>

      {productos.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No hay productos publicados aún.</p>
      ) : (
        <div className="space-y-3">
          {productos.map(p => {
            const imgs: string[] = JSON.parse(p.imagenes_json || "[]");
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-beige flex-shrink-0 relative">
                  {imgs[0] ? (
                    <Image src={imgs[0]} alt={p.nombre} fill className="object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-2xl">🪵</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-800 truncate flex items-center gap-1.5">
                      {p.destacado && <Star className="w-3.5 h-3.5 text-brand-pink flex-shrink-0" />}
                      {p.nombre}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium uppercase tracking-wider">
                      {(p as any).categoria || "General"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{p.descripcion}</p>
                </div>

                {/* Acciones Item */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2.5 rounded-lg text-gray-400 hover:bg-pink-50 hover:text-brand-pink transition-colors flex-shrink-0"
                    title="Editar"
                  >
                    <Plus className="w-5 h-5 rotate-45" /> {/* Simbolizando un lapiz o edit */}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
