import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Acceso Admin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const allowedEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        
        if (allowedEmails.includes(email) && password === "emily2026") {
          return { id: "1", email: email, name: "Administrador" };
        }
        return null;
      }
    })
  ],
  trustHost: true,
})
