import { SupabaseAdapter } from '@auth/supabase-adapter';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Spotify from 'next-auth/providers/spotify';

const config: NextAuthConfig = {
	providers: [
		Spotify({
			clientId: process.env.AUTH_SPOTIFY_ID!,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET!,
			authorization: {
				params: {
					scope: 'user-read-email user-read-private',
				},
			},
		}),
	],
	adapter: SupabaseAdapter({
		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
	}),
	session: { strategy: 'jwt' },
	callbacks: {
		jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.expiresAt = account.expires_at;
			}
			return token;
		},
		session({ session, token }) {
			session.accessToken = token.accessToken as string;
			session.user.id = token.sub as string;
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
