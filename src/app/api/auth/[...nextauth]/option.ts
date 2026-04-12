import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import FindUser from "@/services/FindEmail";
import { prisma } from "@/lib/prisma";

const DEFAULT_ROLE = Role.STUDENT;

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" } satisfies CredentialInput,
        password: {
          label: "password",
          type: "password",
        } satisfies CredentialInput,
      },
      async authorize(
        credentials: { email: string; password: string } | undefined,
      ) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await FindUser(normalizeEmail(credentials.email));

          if (!user?.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      try {
        const normalizedEmail = normalizeEmail(user.email);
        const existingAccount = await FindUser(normalizedEmail);

        if (!existingAccount) {
          await prisma.user.create({
            data: {
              name: user.name ?? "Google User",
              email: normalizedEmail,
              image: user.image ?? null,
              password: "",
              role: DEFAULT_ROLE,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Google sign-in database error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      const emailToLookup =
        typeof user?.email === "string"
          ? normalizeEmail(user.email)
          : typeof token.email === "string"
            ? normalizeEmail(token.email)
            : null;

      if (emailToLookup) {
        try {
          const existingUser = await FindUser(emailToLookup);

          if (existingUser) {
            token.id = existingUser.id;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.picture = existingUser.image;
            return token;
          }
        } catch (error) {
          console.error("JWT callback user lookup error:", error);
        }
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ?? DEFAULT_ROLE;
        token.picture = user.image ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.email = typeof token.email === "string" ? token.email : null;
      session.user.name = typeof token.name === "string" ? token.name : null;
      session.user.role = token.role ?? DEFAULT_ROLE;
      session.user.image =
        typeof token.picture === "string" ? token.picture : null;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
