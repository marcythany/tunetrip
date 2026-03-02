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
		console.log(
			'[TileLayer] useEffect, map:',
			!!map,
			'provider:',
			currentTileProvider.name,
		);

		if (!map) {
			console.warn('[TileLayer] mapa não disponível');
			return;
		}

		// Se a camada já existe e o provedor não mudou, não faz nada
		if (
			layerRef.current &&
			previousProviderRef.current === currentTileProvider
		) {
			console.log('[TileLayer] provedor igual, mantendo camada');
			return;
		}

		// Remove camada anterior se existir
		if (layerRef.current) {
			console.log('[TileLayer] removendo camada anterior');
			map.removeLayer(layerRef.current);
			layerRef.current = null;
		}

		try {
			console.log(
				'[TileLayer] adicionando nova camada',
				currentTileProvider.url,
			);
			const layer = L.tileLayer(currentTileProvider.url, {
				attribution: currentTileProvider.attribution,
				maxZoom: currentTileProvider.maxZoom || 19,
				minZoom: currentTileProvider.minZoom || 1,
				className: currentTileProvider.className,
			}).addTo(map);

			layerRef.current = layer;
			previousProviderRef.current = currentTileProvider;
			console.log('[TileLayer] camada adicionada com sucesso');
		} catch (error) {
			console.error('[TileLayer] erro ao adicionar camada:', error);
		}

		return () => {
			if (layerRef.current && map) {
				console.log('[TileLayer] cleanup removendo camada');
				map.removeLayer(layerRef.current);
				layerRef.current = null;
			}
		};
	}, [mapRef, currentTileProvider]);

	return null;
}
