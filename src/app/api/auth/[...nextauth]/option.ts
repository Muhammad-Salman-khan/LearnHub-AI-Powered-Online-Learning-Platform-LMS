import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import FindUser from "@/services/FindEmail";
const GENERIC_ERROR = "Invalid email or password.";
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
            throw new Error(GENERIC_ERROR);
          }
          // if not worked use credentials?.identifier
          const user = await FindUser(credentials?.email);
          if (!user) {
            throw new Error(`no user found with this email && password`);
          }
          const isValid = await bcrypt.compare(
            credentials?.password,
            user?.password,
          );
          if (!isValid) {
            throw new Error(GENERIC_ERROR);
          }
          return user;
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user?.role;
        token.picture = user?.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // pages: {
  //   signIn: "/sign-in",
  // },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: true,
};
