import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { apiClient } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in your system
          const existingUser = await apiClient.checkGoogleUser(user.email!);
          
          if (!existingUser) {
            // Create new user in your system
            await apiClient.createGoogleUser({
              email: user.email!,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              googleId: user.id,
              profilePicture: user.image,
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        try {
          // Get user data from your API
          const userData = await apiClient.getGoogleUser(user.email!);
          token.user = userData;
          token.accessToken = userData.token;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
