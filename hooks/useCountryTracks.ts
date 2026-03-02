'use client';

import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		const errorText = await res.text();
		console.error(`[fetcher] Erro ${res.status}`, errorText);
		throw new Error(`Erro ao buscar faixas: ${res.status}`);
	}
	return res.json();
};

export function useCountryTracks(countryCode: string | null) {
	const { data, error, isLoading } = useSWR(
		countryCode ? `/api/lastfm/tracks/${countryCode}` : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			dedupingInterval: 3600000, // 1 hora (respeita rate limit)
		},
	);

	useEffect(() => {
		if (data) {
			console.log(
				`[useCountryTracks] ${countryCode}:`,
				data.tracks?.length,
				'tracks',
			);
		}
		if (error) {
			console.error(`[useCountryTracks] erro para ${countryCode}:`, error);
		}
	}, [data, error, countryCode]);

	return {
		tracks: data?.tracks ?? [],
		isLoading,
		error,
	};
}
