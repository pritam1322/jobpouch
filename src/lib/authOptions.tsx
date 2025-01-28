import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/trpc-server/prisma';
import bcrypt from "bcryptjs";
import { getUserById } from '@/trpc-server/user';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  gmailAccessToken?: string;  // Add the gmail access token field
  gmailRefreshToken?: string;
}



const authOptions : NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: `openid profile email https://www.googleapis.com/auth/gmail.readonly`, // Adding Gmail scope
          access_type: 'offline', 
        },
      },
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
      const currentUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })
      if(!currentUser){
        toast.error(`Please login`);
        return false;
      }
      if (account?.provider !== "credentials"){
        if (account?.provider === 'google') {
          
          const accountExists = await prisma.account.findUnique({
            where: { userId: currentUser.id },
          });
          
          if (accountExists) {
            await prisma.account.update({
              where: { userId: Number(currentUser.id) },
              data: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            });
            await prisma.user.update({
              where: { id: currentUser.id },
              data: {
                gmailAccessToken: account.access_token,
                gmailRefreshToken: account.refresh_token,
              },
            });
          } else {
            await prisma.account.create({
              data: {
                userId: currentUser.id,
                type: 'oauth',
                provider: 'google',
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
            await prisma.user.update({
              where: { id: currentUser.id },
              data: {
                gmailAccessToken: account.access_token,
                gmailRefreshToken: account.refresh_token,
              },
            });
          }
        }
        return true;
      }
      
      await getUserById(currentUser.id);

      return true;
    },
    async jwt({ token, user, account }) {
      // When the user is returned from authorize, store user info in the token
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        }; // Ensure you're spreading the user properties correctly
      }

      if (account && account.access_token) {
        token.access_token = account.access_token; // Store the token here
        token.refresh_token = account.refresh_token; 
      }

      return token;
    },
    async session({ session, token }) {
      // Attach user info from the token to the session
      if (token.user) {
        session.user = token.user as User; // This should now have the correct user object
      }
      // Attach Gmail tokens to the session for API calls
      if (token.access_token) {
        session.user.access_token = token.access_token;
      }
      if (token.refresh_token) {
        session.user.refresh_token = token.refresh_token; // Store the refresh token
      }
      return session;
    },
  },  
  secret: process.env.SECRET, // Add this in your .env.local file
};

export default authOptions;