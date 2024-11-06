import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/trpc-server/prisma';
import bcrypt from "bcryptjs";
import { getUserById } from '@/trpc-server/user';

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

const authOptions : NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }
        const password = credentials?.password;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error("No user found with the given email.");
          return null;
        }

        const isvalid = user.password && bcrypt.compareSync(password, user.password);

        // Directly compare the plaintext passwords
        if (!isvalid) {
          console.error("Incorrect password.");
          return null;
        }

        return { id: String(user.id), email: user.email, name: user.name  }; // Ensure the ID is returned as a string
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Make sure the strategy is correctly set (default is 'jwt')
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      await getUserById(Number(user.id));

      return true;
    },
    async jwt({ token, user }) {
      // When the user is returned from authorize, store user info in the token
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        }; // Ensure you're spreading the user properties correctly
      }
      return token;
    },
    async session({ session, token }) {
      // Attach user info from the token to the session
      if (token.user) {
        session.user = token.user as User; // This should now have the correct user object
      }
      return session;
    },
  },  
  secret: process.env.SECRET, // Add this in your .env.local file
};

export default authOptions;