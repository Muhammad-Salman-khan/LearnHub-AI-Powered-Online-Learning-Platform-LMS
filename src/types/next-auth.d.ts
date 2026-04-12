import type { Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    picture?: string | null;
  }
}
