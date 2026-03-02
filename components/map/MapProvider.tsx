'use client';

import { DEFAULT_TILE_PROVIDER } from '@/lib/constants';
import type {
	CountryFeature,
	MapContextType,
	MapViewport,
	TileProviderConfig,
} from '@/types/map';
import type { Map as LeafletMap } from 'leaflet';
import React, { createContext, useContext, useRef, useState } from 'react';

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
	const mapRef = useRef<LeafletMap | null>(null);
	const [viewport, setViewport] = useState<MapViewport>({
		center: [0, 0],
		zoom: 2,
	});
	const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(
		null,
	);
	const [currentTileProvider, setCurrentTileProvider] =
		useState<TileProviderConfig>(DEFAULT_TILE_PROVIDER);

	// Log quando um país é selecionado
	const selectCountry = (feature: CountryFeature | null) => {
		console.log(
			'[MapProvider] selectCountry:',
			feature?.properties?.name || 'null',
		);
		setSelectedCountry(feature);
	};

	const value: MapContextType = {
		mapRef,
		viewport,
		setViewport,
		selectedCountry,
		selectCountry,
		currentTileProvider,
		setTileProvider: setCurrentTileProvider,
	};

	return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
	const context = useContext(MapContext);
	if (context === undefined) {
		throw new Error('useMap must be used within a MapProvider');
	}
	return context;
}
