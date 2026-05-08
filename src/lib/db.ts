import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('La variable de entorno DATABASE_URL no está configurada.');
}

// Conexión principal para consultas
export const sql = neon(process.env.DATABASE_URL);

// Función de inicialización de la base de datos (se ejecuta solo si es necesario)
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
