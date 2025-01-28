// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
     // Add the access_token to the session
    user: {
      id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      access_token?: string;
      refresh_token?: string; // Add the refresh_token to the JWT
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string; // Add the access_token to the JWT
    refresh_token?: string; 
  }
}
