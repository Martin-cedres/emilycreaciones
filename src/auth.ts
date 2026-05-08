import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Acceso Admin",
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "admin" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;
        
        if (username === "admin" && password === "emily2026") {
          return { id: "1", name: "Administrador", email: "admin@emilycreaciones.com" };
        }
        return null;
      }
    })
  ],
  trustHost: true,
})
