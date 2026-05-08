export interface Producto {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoria: string;
  destacado: boolean;
  imagenes_json: string; // JSON stringified array of URLs
  creado_en: string;
}

export interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  destacado: boolean;
}
