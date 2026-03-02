'use client';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from './MapProvider';

export default function TileLayer() {
	const { mapRef, currentTileProvider } = useMap();
	const layerRef = useRef<L.TileLayer | null>(null);
	const previousProviderRef = useRef(currentTileProvider);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) {
			console.warn('[TileLayer] mapa não disponível');
			return;
		}

		if (
			layerRef.current &&
			previousProviderRef.current === currentTileProvider
		) {
			return;
		}

		if (layerRef.current) {
			map.removeLayer(layerRef.current);
			layerRef.current = null;
		}

		try {
			console.log('[TileLayer] adicionando camada:', currentTileProvider.name);
			const layer = L.tileLayer(currentTileProvider.url, {
				attribution: currentTileProvider.attribution,
				maxZoom: currentTileProvider.maxZoom || 19,
				minZoom: currentTileProvider.minZoom || 1,
				className: currentTileProvider.className,
			}).addTo(map);

			layerRef.current = layer;
			previousProviderRef.current = currentTileProvider;
		} catch (error) {
			console.error('[TileLayer] erro ao adicionar camada:', error);
		}

		return () => {
			if (layerRef.current && map) {
				map.removeLayer(layerRef.current);
				layerRef.current = null;
			}
		};
	}, [mapRef, currentTileProvider]);

	return null;
}
