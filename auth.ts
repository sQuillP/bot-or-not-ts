import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase";
import jwt from 'jsonwebtoken';
import { JWTPayload } from "./types/server.types";


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, profile, account }) {

      if (!user.id || !user.email) return false;
      // console.log({user, account, profile});

      const { error } = await supabaseAdmin
        .from('users')
        .upsert({
          id: profile?.sub?.toString(),
          email: user.email,
          name: user.name,
          provider: account?.provider
        }, { onConflict: 'id' })


        console.log(error);
      return !error;
    },

    // 1. Create the JWT payload
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = profile?.sub;
      }
      return token;
    },

    // 2. Sign the Supabase token so it's available in the frontend/actions
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload:JWTPayload = {
          aud: "authenticated",
          role: "authenticated",
          email: token.email as string,
          sub: token.id as string, 
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        };

        //@ts-expect-error - not a real error...
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
  }
});