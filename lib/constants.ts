// lib/constants.ts

/**
 * Constantes globais do TuneTrip
 * - Países suportados (ISO 3166-1 alpha-2)
 * - Provedores de tiles para Leaflet
 * - Configurações de tema e API
 */

// ------------------------------------------------------------
// Países
// ------------------------------------------------------------

export interface Country {
	code: string; // ISO 3166-1 alpha-2 (ex: 'BR', 'US')
	name: string; // Nome em português (ou inglês, conforme preferir)
	lat: number; // Latitude aproximada (centro do país)
	lng: number; // Longitude aproximada
	zoom: number; // Nível de zoom recomendado ao centralizar
	flag?: string; // Emoji da bandeira (opcional, pode ser usado em UI)
}

export const COUNTRIES: Country[] = [
	{
		code: 'BR',
		name: 'Brasil',
		lat: -14.235,
		lng: -51.925,
		zoom: 4,
		flag: '🇧🇷',
	},
	{
		code: 'US',
		name: 'Estados Unidos',
		lat: 37.09,
		lng: -95.712,
		zoom: 4,
		flag: '🇺🇸',
	},
	{
		code: 'GB',
		name: 'Reino Unido',
		lat: 55.378,
		lng: -3.436,
		zoom: 5,
		flag: '🇬🇧',
	},
	{ code: 'FR', name: 'França', lat: 46.227, lng: 2.213, zoom: 5, flag: '🇫🇷' },
	{
		code: 'DE',
		name: 'Alemanha',
		lat: 51.165,
		lng: 10.451,
		zoom: 5,
		flag: '🇩🇪',
	},
	{ code: 'JP', name: 'Japão', lat: 36.204, lng: 138.252, zoom: 5, flag: '🇯🇵' },
	{
		code: 'KR',
		name: 'Coreia do Sul',
		lat: 35.907,
		lng: 127.766,
		zoom: 6,
		flag: '🇰🇷',
	},
	{ code: 'IN', name: 'Índia', lat: 20.593, lng: 78.962, zoom: 4, flag: '🇮🇳' },
	{
		code: 'MX',
		name: 'México',
		lat: 23.634,
		lng: -102.552,
		zoom: 5,
		flag: '🇲🇽',
	},
	{
		code: 'CA',
		name: 'Canadá',
		lat: 56.13,
		lng: -106.346,
		zoom: 3,
		flag: '🇨🇦',
	},
	{
		code: 'AU',
		name: 'Austrália',
		lat: -25.274,
		lng: 133.775,
		zoom: 4,
		flag: '🇦🇺',
	},
	{ code: 'IT', name: 'Itália', lat: 41.871, lng: 12.567, zoom: 5, flag: '🇮🇹' },
	{
		code: 'ES',
		name: 'Espanha',
		lat: 40.463,
		lng: -3.749,
		zoom: 5,
		flag: '🇪🇸',
	},
	{
		code: 'PT',
		name: 'Portugal',
		lat: 39.399,
		lng: -8.224,
		zoom: 6,
		flag: '🇵🇹',
	},
	{
		code: 'AR',
		name: 'Argentina',
		lat: -38.416,
		lng: -63.616,
		zoom: 4,
		flag: '🇦🇷',
	},
	{
		code: 'CO',
		name: 'Colômbia',
		lat: 4.57,
		lng: -74.297,
		zoom: 5,
		flag: '🇨🇴',
	},
	{
		code: 'ZA',
		name: 'África do Sul',
		lat: -30.559,
		lng: 22.937,
		zoom: 5,
		flag: '🇿🇦',
	},
	{ code: 'EG', name: 'Egito', lat: 26.82, lng: 30.802, zoom: 5, flag: '🇪🇬' },
	{ code: 'NG', name: 'Nigéria', lat: 9.081, lng: 8.675, zoom: 5, flag: '🇳🇬' },
	{
		code: 'RU',
		name: 'Rússia',
		lat: 61.524,
		lng: 105.318,
		zoom: 3,
		flag: '🇷🇺',
	},
	{ code: 'CN', name: 'China', lat: 35.861, lng: 104.195, zoom: 4, flag: '🇨🇳' },
	{
		code: 'ID',
		name: 'Indonésia',
		lat: -0.789,
		lng: 113.921,
		zoom: 4,
		flag: '🇮🇩',
	},
	{
		code: 'TR',
		name: 'Turquia',
		lat: 38.963,
		lng: 35.243,
		zoom: 5,
		flag: '🇹🇷',
	},
	{
		code: 'SA',
		name: 'Arábia Saudita',
		lat: 23.885,
		lng: 45.079,
		zoom: 5,
		flag: '🇸🇦',
	},
] as const;

// Mapa para acesso rápido por código
export const COUNTRY_BY_CODE = Object.fromEntries(
	COUNTRIES.map((country) => [country.code, country]),
) as Record<string, Country>;

// ------------------------------------------------------------
// Provedores de tiles para Leaflet
// ------------------------------------------------------------

export interface TileProvider {
	name: string;
	url: string;
	attribution: string;
	maxZoom?: number;
	minZoom?: number;
	className?: string; // Para estilização adicional (ex: filtros CSS)
}

export const TILE_PROVIDERS: TileProvider[] = [
	{
		name: 'OpenStreetMap',
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 19,
	},
	{
		name: 'CartoDB Voyager (sem rótulos)',
		url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; CartoDB',
		maxZoom: 19,
	},
	{
		name: 'CartoDB Dark Matter',
		url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; CartoDB',
		maxZoom: 19,
	},
	{
		name: 'Esri World Imagery',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attribution:
			'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
		maxZoom: 18,
	},
] as const;

// Provedor padrão (usaremos o Dark Matter para combinar com tema escuro)
export const DEFAULT_TILE_PROVIDER =
	TILE_PROVIDERS.find((p) => p.name === 'CartoDB Dark Matter') ||
	TILE_PROVIDERS[0];

// ------------------------------------------------------------
// Configurações do player Spotify
// ------------------------------------------------------------

export const SPOTIFY_PREVIEW_DURATION = 30000; // 30 segundos em ms

// ------------------------------------------------------------
// Cores do tema (em formato CSS custom properties, para uso em estilos inline se necessário)
// ------------------------------------------------------------

export const THEME_COLORS = {
	primary: 'teal',
	primaryDark: '#0d3d3d',
	primaryLight: '#2dd4bf',
	background: '#0a0a0a',
	surface: '#1a1a1a',
	surfaceLight: '#2a2a2a',
	textPrimary: '#f5f5f5',
	textSecondary: '#a3a3a3',
	border: '#333333',
	glass: 'rgba(255, 255, 255, 0.05)',
} as const;

// ------------------------------------------------------------
// Configurações de cache da API Spotify
// ------------------------------------------------------------

export const SPOTIFY_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 horas
export const SPOTIFY_STALE_WHILE_REVALIDATE = 60 * 60; // 1 hora (para SWR)
