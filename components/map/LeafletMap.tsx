'use client';

import type { MapComponentProps } from '@/types/map';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import { useMap } from './MapProvider';

type IconDefaultWithGetIconUrl = L.Icon.Default & { _getIconUrl?: string };
delete (L.Icon.Default.prototype as IconDefaultWithGetIconUrl)._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function LeafletMap({
	initialCenter: initialCenterProp = [20, 0],
	initialZoom: initialZoomProp = 2,
	onMapReady,
	className = 'h-full w-full',
}: MapComponentProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const { mapRef, setViewport } = useMap();

	const initialCenter = useMemo(() => initialCenterProp, []);
	const initialZoom = useMemo(() => initialZoomProp, []);

	useEffect(() => {
		if (!mapContainer.current) {
			console.warn('[LeafletMap] mapContainer.current é null');
			return;
		}
		if (mapRef.current) {
			console.log('[LeafletMap] mapa já existe, ignorando');
			return;
		}

		try {
			const instance = L.map(mapContainer.current, {
				center: initialCenter as L.LatLngExpression,
				zoom: initialZoom,
				zoomControl: false,
				attributionControl: false,
			});
			console.log('[LeafletMap] instância criada', instance);

			mapRef.current = instance;

			const bounds = instance.getBounds();
			setViewport({
				center: initialCenter as [number, number],
				zoom: initialZoom,
				bounds: {
					_southWest: bounds.getSouthWest(),
					_northEast: bounds.getNorthEast(),
				},
			});

			const handleMoveEnd = () => {
				const center = instance.getCenter();
				const zoom = instance.getZoom();
				const bounds = instance.getBounds();
				setViewport({
					center: [center.lat, center.lng],
					zoom,
					bounds: {
						_southWest: bounds.getSouthWest(),
						_northEast: bounds.getNorthEast(),
					},
				});
			};

			instance.on('moveend', handleMoveEnd);

			if (onMapReady) {
				onMapReady(instance);
			}
		} catch (error) {
			console.error('[LeafletMap] erro na criação:', error);
		}

		return () => {
			console.log('[LeafletMap] cleanup');
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [initialCenter, initialZoom, mapRef, onMapReady, setViewport]);

	return <div ref={mapContainer} className={className} />;
}
