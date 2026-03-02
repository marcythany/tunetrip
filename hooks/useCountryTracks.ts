'use client';

import type { SpotifyTrack } from '@/types/spotify';
import useSWR from 'swr';

interface TracksResponse {
	tracks: SpotifyTrack[];
}

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		const error = new Error('Erro ao buscar faixas');
		throw error;
	}
	return res.json();
};

export function useCountryTracks(countryCode: string | null) {
	const { data, error, isLoading } = useSWR<TracksResponse>(
		countryCode ? `/api/spotify/tracks/${countryCode}` : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			dedupingInterval: 60000, // 1 minuto
		},
	);

	return {
		tracks: data?.tracks ?? [],
		isLoading,
		error,
	};
}
