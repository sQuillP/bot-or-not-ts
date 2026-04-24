import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase";
import jwt from 'jsonwebtoken';


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {

      if (!user.id || !user.email) return false;
      
      const { error } = await supabaseAdmin
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: user.name,
        }, { onConflict: 'id' })

        console.log(error);

      return !error;
    },

    // 1. Create the JWT payload
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // 2. Sign the Supabase token so it's available in the frontend/actions
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          role: "authenticated",
          email: token.email,
          sub: token.id, 
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        };

        //@ts-expect-error - not a real error...
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
  }
});