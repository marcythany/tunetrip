'use client';

import { useEffect, useState } from 'react';

interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export function useSpotifyToken() {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const response = await fetch('/api/spotify/token');
				if (!response.ok) {
					throw new Error('Falha ao obter token do Spotify');
				}
				const data: TokenResponse = await response.json();
				setToken(data.access_token);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Erro desconhecido');
			} finally {
				setLoading(false);
			}
		};

		fetchToken();
	}, []);

	return { token, loading, error };
}
