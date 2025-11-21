import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers:
  [
    CredentialsProvider({
      name: "Credentials",

      credentials:
      {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials)
      {
        const user = await prisma.user.findUnique({where: {email: credentials?.email}});		//Recherche user d'après email
        if(!user)
        {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials?.password as string, user.password);		//Contrôle mot de passe
  
        if(!isPasswordValid)
        {
          return null;
        }

        return {...user};
      }
    })
  ],

  callbacks:
  {
    async jwt({ token, user })
    {
      if (user)
      {
          token.id = user.id;
          token.role = (user as any).role;
      }
      return token;
    },
    
    async session({ session, token })
    {
      if (token)
      {
          session.user.id = token.id;
          session.user.role = token.role;
      }
      return session;
    }
  },

  session:
  {
    strategy: "jwt",
  },

  pages:
  {
    signIn: "/login",
  }
})

export { handler as GET, handler as POST };
