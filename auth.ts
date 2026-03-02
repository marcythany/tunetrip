import { SupabaseAdapter } from '@auth/supabase-adapter';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Spotify from 'next-auth/providers/spotify';

// Validação das variáveis de ambiente necessárias
const requiredEnvVars = [
	'AUTH_SPOTIFY_ID',
	'AUTH_SPOTIFY_SECRET',
	'NEXT_PUBLIC_SUPABASE_URL',
	'SUPABASE_SERVICE_ROLE_KEY',
	'AUTH_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Variável de ambiente ${envVar} não definida`);
	}
}

// Após a validação, podemos acessar as variáveis com segurança
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const spotifyId = process.env.AUTH_SPOTIFY_ID as string;
const spotifySecret = process.env.AUTH_SPOTIFY_SECRET as string;

const config = {
	providers: [
		Spotify({
			clientId: spotifyId,
			clientSecret: spotifySecret,
			authorization: {
				params: {
					scope: 'user-read-email user-read-private',
				},
			},
		}),
	],
	adapter: SupabaseAdapter({
		url: supabaseUrl,
		secret: supabaseKey,
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
			session.accessToken = token.accessToken as string | undefined;
			if (token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
