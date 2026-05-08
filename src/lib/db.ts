import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Fallback que arroja error solo cuando se intenta ejecutar una consulta.
 * Esto permite que Next.js importe el módulo durante el build sin fallar.
 */
const sqlFallback = ((..._args: any[]) => {
  throw new Error('La variable de entorno DATABASE_URL no está configurada. Verifica los secretos en Vercel.');
}) as unknown as NeonQueryFunction<false, false>;

// Exportamos la conexión real o el fallback según la disponibilidad de la URL
// Vercel Postgres suele usar POSTGRES_URL por defecto
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const sql = connectionString 
  ? neon(connectionString) 
  : sqlFallback;

// Función de inicialización de la base de datos
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      precio DECIMAL(10,2),
      categoria VARCHAR(50) DEFAULT 'General',
      destacado BOOLEAN DEFAULT false,
      imagenes_json TEXT NOT NULL DEFAULT '[]',
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}
