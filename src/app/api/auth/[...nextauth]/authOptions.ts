import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions = {
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
                const user = await prisma.user.findUnique({where: {email: credentials?.email}});
                if(!user)
                {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials?.password as string, user.password);

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
}