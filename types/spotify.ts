// Tipos baseados na API do Spotify (Web API)
// Referência: https://developer.spotify.com/documentation/web-api/reference/

// Objeto de imagem (capa de álbum, etc.)
export interface SpotifyImage {
	url: string;
	height: number;
	width: number;
}

// Artista simplificado (usado em faixas)
export interface SpotifyArtistSimplified {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: 'artist';
	uri: string;
}

// Álbum simplificado (usado em faixas)
export interface SpotifyAlbumSimplified {
	album_type: string;
	total_tracks: number;
	available_markets: string[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: SpotifyImage[];
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions?: {
		reason: string;
	};
	type: 'album';
	uri: string;
	artists: SpotifyArtistSimplified[];
}

// Faixa completa (Track Object)
export interface SpotifyTrack {
	album: SpotifyAlbumSimplified;
	artists: SpotifyArtistSimplified[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc?: string;
		ean?: string;
		upc?: string;
	};
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	is_playable?: boolean;
	linked_from?: {
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		type: 'track';
		uri: string;
	};
	restrictions?: {
		reason: string;
	};
	name: string;
	popularity: number;
	preview_url: string | null; // Importante para o preview de 30s
	track_number: number;
	type: 'track';
	uri: string;
	is_local: boolean;
}

// Resposta de busca de faixas (Search endpoint)
export interface SpotifySearchResponse {
	tracks?: {
		href: string;
		items: SpotifyTrack[];
		limit: number;
		next: string | null;
		offset: number;
		previous: string | null;
		total: number;
	};
	// outros tipos (artists, albums, playlists) podem ser adicionados se necessário
}

// Parâmetros de busca para faixas por país
export interface SpotifySearchParams {
	q: string; // query de busca (ex: "country:BR" ou nome da faixa)
	type: 'track' | 'album' | 'artist' | 'playlist' | 'show' | 'episode' | string;
	market?: string; // código do país (ISO 3166-1 alpha-2)
	limit?: number;
	offset?: number;
	include_external?: 'audio';
}

// Resposta de recomendações (caso use)
export interface SpotifyRecommendationsResponse {
	tracks: SpotifyTrack[];
	seeds: {
		afterFilteringSize: number;
		afterRelinkingSize: number;
		href: string;
		id: string;
		initialPoolSize: number;
		type: string;
	}[];
}

// Para token (client credentials)
export interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

// Para erros da API
export interface SpotifyErrorResponse {
	error: {
		status: number;
		message: string;
	};
}

// Se for usar o endpoint de "top tracks" de um artista (que pode ser associado a um país)
export interface SpotifyArtistsTopTracksResponse {
	tracks: SpotifyTrack[];
}

// Para o endpoint de busca por país, podemos usar o parâmetro market
// A busca de faixas populares por país pode ser feita com:
// GET /search?q=year:2023&type=track&market=BR&limit=10
// ou usar as playlists do Spotify (endpoint de playlists por país)
// Para simplificar, usaremos o search com market e ordenação por popularidade (não direto)

// Se quiser usar playlists de top 50 de cada país:
export interface SpotifyPlaylistTrack {
	added_at: string;
	added_by: {
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		type: string;
		uri: string;
	};
	is_local: boolean;
	track: SpotifyTrack;
}

export interface SpotifyPlaylistResponse {
	href: string;
	items: {
		added_at: string;
		added_by: {
			external_urls: {
				spotify: string;
			};
			href: string;
			id: string;
			type: string;
			uri: string;
		};
		is_local: boolean;
		track: SpotifyTrack;
	}[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
}
