import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      email: string;
      name?: string | null;
      image?: string | null;
      phone?: string;
      role?: string;
      googleId?: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    name?: string | null;
    image?: string | null;
    phone?: string;
    role?: string;
    googleId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email: string;
      name?: string | null;
      image?: string | null;
      phone?: string;
      role?: string;
      googleId?: string;
    };
    accessToken?: string;
  }
}
