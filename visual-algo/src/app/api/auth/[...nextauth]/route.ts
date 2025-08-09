import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add your own authentication logic here
        // For now, we'll just accept any user with any password
        if (credentials) {
          return { id: "1", name: "Test User", email: credentials.email }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
