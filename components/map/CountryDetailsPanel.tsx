'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountryTracks } from '@/hooks/useCountryTracks';
import type { LastFmTrack } from '@/lib/lastfm/types';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMap } from './MapProvider';
import PlayerPreview from './PlayerPreview';

export default function CountryDetailsPanel() {
	const { selectedCountry, selectCountry } = useMap();
	const countryCode =
		selectedCountry?.properties?.iso_a2 ??
		selectedCountry?.properties?.code ??
		selectedCountry?.properties?.ADM0_A3 ??
		null;
	const { tracks, isLoading, error } = useCountryTracks(countryCode);
	const [playingIndex, setPlayingIndex] = useState<number | null>(null);

	useEffect(() => {
		if (selectedCountry) {
			console.log(
				'[CountryDetailsPanel] país selecionado:',
				selectedCountry.properties?.name,
				'código:',
				countryCode,
			);
		}
		if (tracks.length > 0) {
			console.log('[CountryDetailsPanel] tracks carregadas:', tracks.length);
		}
		if (error) {
			console.error('[CountryDetailsPanel] erro ao carregar tracks:', error);
		}
	}, [selectedCountry, countryCode, tracks, error]);

	// Reseta o playingIndex quando o país muda
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPlayingIndex(null);
	}, [countryCode]);

	if (!selectedCountry) return null;

	const countryName = selectedCountry.properties?.name || 'País';

	const handlePlayPause = (index: number) => {
		setPlayingIndex(playingIndex === index ? null : index);
	};

	return (
		<div className='absolute right-4 top-20 z-50 w-80'>
			<Card className='border-teal-800/30 bg-background/80 backdrop-blur-xl'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-lg font-semibold'>{countryName}</CardTitle>
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8'
						onClick={() => {
							console.log('[CountryDetailsPanel] fechando painel');
							selectCountry(null);
						}}
					>
						<X className='h-4 w-4' />
					</Button>
				</CardHeader>
				<CardContent>
					<p className='mb-2 text-xs text-muted-foreground'>
						Código:{' '}
						{selectedCountry.properties?.code ||
							selectedCountry.properties?.ADM0_A3}
					</p>
					<Separator className='my-2 bg-teal-800/30' />
					<div className='mt-4'>
						<h3 className='mb-2 text-sm font-medium'>Top 10 Músicas</h3>
						{isLoading ?
							<div className='space-y-2'>
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className='h-12 w-full' />
								))}
							</div>
						: error ?
							<p className='text-sm text-red-400'>Erro ao carregar faixas</p>
						: tracks.length > 0 ?
							<div className='max-h-96 space-y-2 overflow-y-auto'>
								{tracks.map((track: LastFmTrack, index: number) => (
									<PlayerPreview
										key={`${track.name}-${track.artist.name}`}
										track={track}
										countryCode={countryCode!}
										isPlaying={playingIndex === index}
										onPlayPause={() => handlePlayPause(index)}
									/>
								))}
							</div>
						:	<p className='text-sm text-muted-foreground'>
								Nenhuma faixa encontrada
							</p>
						}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
