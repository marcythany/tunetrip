// lib/lastfm/client.ts
import { COUNTRY_NAMES } from './country-names';

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = process.env.LASTFM_API_KEY!;

export interface LastFmTrack {
	name: string;
	artist: {
		name: string;
		url: string;
	};
	url: string;
	listeners: string;
	image: Array<{ '#text': string; size: string }>;
}

interface LastFmResponse {
	tracks: {
		track: LastFmTrack[];
		'@attr'?: {
			country: string;
			page: string;
			perPage: string;
			totalPages: string;
			total: string;
		};
	};
}

export async function getTopTracksByCountry(
	countryCode: string,
	limit = 10,
): Promise<LastFmTrack[]> {
	// Converte código ISO para nome do país
	const countryName = COUNTRY_NAMES[countryCode.toUpperCase()];

	if (!countryName) {
		console.warn(`[Last.fm] País não suportado: ${countryCode}`);
		return [];
	}

	console.log(
		`[Last.fm] Buscando top tracks para: ${countryName} (${countryCode})`,
	);

	const url = new URL(LASTFM_API_URL);
	url.searchParams.append('method', 'geo.getTopTracks');
	url.searchParams.append('country', countryName);
	url.searchParams.append('limit', limit.toString());
	url.searchParams.append('api_key', API_KEY);
	url.searchParams.append('format', 'json');

	try {
		const response = await fetch(url.toString());

		if (!response.ok) {
			console.error(
				`[Last.fm] Erro HTTP ${response.status}: ${response.statusText}`,
			);
			return [];
		}

		const data: LastFmResponse = await response.json();

		// Log detalhado para debug
		console.log(`[Last.fm] Resposta para ${countryCode}:`, {
			total: data.tracks?.['@attr']?.total || 0,
			tracksCount: data.tracks?.track?.length || 0,
		});

		return data.tracks?.track || [];
	} catch (error) {
		console.error('[Last.fm] Erro na requisição:', error);
		return [];
	}
}
