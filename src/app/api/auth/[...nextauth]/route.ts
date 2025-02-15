/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import NextAuth, { Session, User, NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User;
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: any;
    }) {
      if (user) {
        Object.assign(token, {
          id: user.id,
          pseudo: user.pseudo,
          role: user.role,
        });
      }
      if (trigger === 'update' && session) {
        Object.assign<Partial<JWT>, Partial<User>>(token, {
          name: session.name || token.name,
          email: session.email || token.email,
          pseudo: session.pseudo || token.pseudo,
          image: session.image || token.image,
          role: session.role || token.role,
        });
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.pseudo = token.pseudo;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req): Promise<User | null> {
        const prisma = new PrismaClient();

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        try {
          const userProfile = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });

          if (!userProfile) throw new Error('Email or password is incorrect');

          const { id, name, pseudo, email, profile_img, password, role, is_active } = userProfile;

          const isCorrectPassword = await bcrypt.compare(credentials.password, password);

          if (isCorrectPassword) {
            if (!is_active) throw new Error('Account is not active');

            return { name, pseudo, email, image: profile_img, id, role };
          }

          throw new Error('Email or password is incorrect');
        } catch (error: Error | unknown) {
          console.error('An error occurred:', error);
          throw new Error(error as string);
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
