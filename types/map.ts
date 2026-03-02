import type { Feature, FeatureCollection } from 'geojson';
import type {
	LatLngExpression,
	Map as LeafletMap,
	LeafletMouseEvent,
} from 'leaflet';
import type { RefObject } from 'react';

// ------------------------------------------------------------
// Tipos para países e features do GeoJSON
// ------------------------------------------------------------

/**
 * Propriedades de um país no GeoJSON.
 * Compatível com o arquivo countries.geo.json esperado.
 */
export interface CountryProperties {
	ADM0_A3: string;
	/** Código do país ISO 3166-1 alpha-2 (ex: 'BR', 'US') */
	code: string;
	/** Nome do país em português (ou inglês) */
	name: string;
	/** Região ou continente (opcional) */
	region?: string;
	/** População aproximada (opcional) */
	population?: number;
}

/**
 * Feature GeoJSON representando um país.
 */
export type CountryFeature = Feature<
	GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon,
	CountryProperties
>;

/**
 * Coleção de features GeoJSON (todo o mapa).
 */
export type CountryFeatureCollection = FeatureCollection<
	GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon,
	CountryProperties
>;

// ------------------------------------------------------------
// Tipos para eventos de clique no mapa/país
// ------------------------------------------------------------

/**
 * Evento disparado ao clicar em um país no mapa.
 * Contém a feature do país e o evento Leaflet original.
 */
export interface CountryClickEvent {
	/** Feature do país clicado */
	feature: CountryFeature;
	/** Evento Leaflet original (com coordenadas, etc.) */
	leafletEvent: LeafletMouseEvent;
}

// ------------------------------------------------------------
// Tipos para viewport e estado do mapa
// ------------------------------------------------------------

/**
 * Representa o estado atual do viewport (centro e zoom).
 */
export interface MapViewport {
	/** Centro do mapa [latitude, longitude] */
	center: LatLngExpression;
	/** Nível de zoom */
	zoom: number;
	/** Limites do mapa (opcional) */
	bounds?: {
		_southWest: LatLngExpression;
		_northEast: LatLngExpression;
	};
}

// ------------------------------------------------------------
// Tipos para provedores de tiles
// ------------------------------------------------------------

/**
 * Configuração de um provedor de tiles.
 * Baseado no tipo definido em lib/constants.ts.
 */
export interface TileProviderConfig {
	/** Nome amigável do provedor */
	name: string;
	/** URL do template do tile (ex: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') */
	url: string;
	/** Atribuição a ser exibida no mapa */
	attribution: string;
	/** Zoom máximo suportado (padrão: 19) */
	maxZoom?: number;
	/** Zoom mínimo suportado (padrão: 1) */
	minZoom?: number;
	/** Classe CSS extra para a camada (ex: para filtros) */
	className?: string;
}

// ------------------------------------------------------------
// Tipos para referência ao mapa (useMap hook)
// ------------------------------------------------------------

import type { Map } from 'leaflet';

/**
 * Referência para a instância do mapa Leaflet.
 * Útil para acessar métodos imperativos.
 */
export type MapRef = Map | null;

// ------------------------------------------------------------
// Tipos para o contexto do mapa (caso use React Context)
// ------------------------------------------------------------

/**
 * Contexto compartilhado do mapa.
 */
export interface MapContextType {
	/** Ref para a instância do mapa Leaflet (mutável) */
	mapRef: RefObject<LeafletMap | null>;
	/** Viewport atual */
	viewport: MapViewport;
	/** Atualiza o viewport (ex: ao mover o mapa) */
	setViewport: (viewport: MapViewport) => void;
	/** País atualmente selecionado (ou null) */
	selectedCountry: CountryFeature | null;
	/** Função para selecionar um país */
	selectCountry: (feature: CountryFeature | null) => void;
	/** Provedor de tiles atual */
	currentTileProvider: TileProviderConfig;
	/** Alterna o provedor de tiles */
	setTileProvider: (provider: TileProviderConfig) => void;
}

// ------------------------------------------------------------
// Tipos para as props dos componentes de mapa (opcional)
// ------------------------------------------------------------

/**
 * Props para o componente principal do mapa.
 */
export interface MapComponentProps {
	/** Centro inicial do mapa */
	initialCenter?: LatLngExpression;
	/** Zoom inicial */
	initialZoom?: number;
	/** Callback ao clicar em um país */
	onCountryClick?: (event: CountryClickEvent) => void;
	/** Callback ao carregar o mapa */
	onMapReady?: (map: Map) => void;
	/** Provedor de tiles inicial (padrão: Dark Matter) */
	tileProvider?: TileProviderConfig;
	/** Classes CSS adicionais para o container do mapa */
	className?: string;
}

// ------------------------------------------------------------
// Utilitários de tipo para coordenadas
// ------------------------------------------------------------

/**
 * Tupla [latitude, longitude] ou objeto {lat, lng}.
 */
export type Coordinates = LatLngExpression;
