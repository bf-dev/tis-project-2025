import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserEmail } from "@/lib/types";
import type { NextAuthConfig } from "next-auth";
import type { User } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailAddresses: UserEmail[];
    }
  }
}

// Development environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// Configuration for NextAuth
export const config = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || 'common'}/v2.0`,
      authorization: {
        params: {
          scope: 'openid profile email User.Read',
          prompt: 'select_account'
        }
      }
    }),
    // Debug credentials provider (only available in development)
    ...(isDevelopment ? [
      CredentialsProvider({
        name: "Debug Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          name: { label: "Name", type: "text" },
          role: { 
            label: "Role", 
            type: "select", 
            options: [
              { label: "Student", value: "student" },
              { label: "Teacher", value: "teacher" },
              { label: "Admin", value: "admin" }
            ]
          }
        },
        async authorize(credentials) {
          if (!credentials?.email) return null;
          
          const email = credentials.email as string;
          const name = credentials.name as string;
          const role = credentials.role as string;
          
          // Create appropriate email based on role
          let userEmail = email;
          if (role === "student" && !email.endsWith("@students.tiseagles.com")) {
            userEmail = `${email.split('@')[0]}@students.tiseagles.com`;
          } else if ((role === "teacher" || role === "admin") && !email.endsWith("@tiseagles.com")) {
            userEmail = `${email.split('@')[0]}@tiseagles.com`;
          }
          
          // Return user object
          return {
            id: `debug-${Date.now()}`,
            name: name || userEmail.split('@')[0],
            email: userEmail,
            image: null
          } as User;
        }
      })
    ] : [])
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
        
        // Create email address array to match our User type
        if (session.user.email) {
          const emailAddresses: UserEmail[] = [{
            emailAddress: session.user.email,
            verified: true // Assume emails from Entra ID are verified
          }];
          session.user.emailAddresses = emailAddresses;
        } else {
          session.user.emailAddresses = [];
        }
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
} satisfies NextAuthConfig;

// Create and export the auth functions
const { auth, signIn, signOut } = NextAuth(config);
export { auth, signIn, signOut }; 