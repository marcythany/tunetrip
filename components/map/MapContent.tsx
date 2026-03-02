'use client';

import countriesGeo from '@/data/countries.geo.json';
import type { CountryFeatureCollection } from '@/types/map';
import dynamic from 'next/dynamic';

const geoJsonData = countriesGeo as unknown as CountryFeatureCollection;

console.log(
	'[MapContent] GeoJSON carregado. Features:',
	geoJsonData.features?.length,
);
const first = geoJsonData.features?.[0];
if (first) {
	console.log('[MapContent] Exemplo de propriedades:', first.properties);
}

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
	ssr: false,
});
const TileLayer = dynamic(() => import('@/components/map/TileLayer'), {
	ssr: false,
});
const GeoJSONLayer = dynamic(() => import('@/components/map/GeoJSONLayer'), {
	ssr: false,
});
const MapControls = dynamic(() => import('@/components/map/MapControls'), {
	ssr: false,
});
const SearchBar = dynamic(() => import('@/components/map/SearchBar'), {
	ssr: false,
});
const CountryDetailsPanel = dynamic(
	() => import('@/components/map/CountryDetailsPanel'),
	{ ssr: false },
);

export default function MapContent() {
	return (
		<div className='relative h-screen w-full overflow-hidden'>
			<LeafletMap className='h-full w-full z-0' />
			<TileLayer />
			<GeoJSONLayer data={geoJsonData} />
			<div className='absolute inset-0 pointer-events-none z-50'>
				<div className='relative h-full w-full'>
					<MapControls />
					<SearchBar />
				</div>
			</div>
			<CountryDetailsPanel />
		</div>
	);
}
