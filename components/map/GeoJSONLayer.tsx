'use client';

import type { CountryFeature, CountryFeatureCollection } from '@/types/map';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from './MapProvider';

interface GeoJSONLayerProps {
	data: CountryFeatureCollection;
	onCountryClick?: (feature: CountryFeature) => void;
}

export default function GeoJSONLayer({
	data,
	onCountryClick,
}: GeoJSONLayerProps) {
	const { mapRef, selectCountry } = useMap();
	const layerRef = useRef<L.GeoJSON | null>(null);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) {
			console.warn('[GeoJSONLayer] mapa não disponível');
			return;
		}
		if (!data || !data.features) {
			console.warn('[GeoJSONLayer] dados GeoJSON inválidos');
			return;
		}

		console.log(`[GeoJSONLayer] número de features: ${data.features.length}`);

		// Remove camada anterior
		if (layerRef.current) {
			map.removeLayer(layerRef.current);
			layerRef.current = null;
		}

		try {
			const layer = L.geoJSON(data, {
				style: {
					weight: 1,
					color: '#2dd4bf',
					opacity: 0.8,
					fillColor: '#115e59',
					fillOpacity: 0.4,
				},
				onEachFeature: (feature, layer) => {
					const countryName =
						feature.properties?.name ||
						feature.properties?.ADM0_A3 ||
						'desconhecido';

					layer.bindTooltip(feature.properties?.name || '', {
						permanent: false,
						direction: 'center',
					});

					layer.on({
						click: (e) => {
							console.log('[GeoJSONLayer] clique em:', countryName);
							try {
								// Resetar estilo de todos
								layerRef.current?.eachLayer((l) => {
									if (l instanceof L.Path) {
										l.setStyle({
											weight: 1,
											color: '#2dd4bf',
											fillOpacity: 0.4,
										});
									}
								});

								// Destacar o selecionado
								if (layer instanceof L.Path) {
									layer.setStyle({
										weight: 3,
										color: '#fbbf24',
										fillOpacity: 0.7,
									});
								}

								selectCountry(feature as CountryFeature);
								onCountryClick?.(feature as CountryFeature);
							} catch (error) {
								console.error('[GeoJSONLayer] erro no clique:', error);
							}
						},
					});
				},
			}).addTo(map);

			layerRef.current = layer;
			console.log('[GeoJSONLayer] camada adicionada com sucesso');
		} catch (error) {
			console.error('[GeoJSONLayer] erro ao criar camada:', error);
		}

		return () => {
			if (layerRef.current && map) {
				map.removeLayer(layerRef.current);
				layerRef.current = null;
			}
		};
	}, [mapRef, data, onCountryClick, selectCountry]);

	return null;
}
