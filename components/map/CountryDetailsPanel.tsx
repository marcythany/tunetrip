'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountryTracks } from '@/hooks/useCountryTracks';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useMap } from './MapProvider';
import PlayerPreview from './PlayerPreview';

export default function CountryDetailsPanel() {
	const { selectedCountry, selectCountry } = useMap();
	const countryCode =
		selectedCountry?.properties?.code ??
		selectedCountry?.properties?.ADM0_A3 ??
		null;
	const { tracks, isLoading, error } = useCountryTracks(countryCode);

	useEffect(() => {
		if (selectedCountry) {
			console.log(
				'[CountryDetailsPanel] país selecionado:',
				selectedCountry.properties?.name,
				'código:',
				countryCode,
			);
		}
	}, [selectedCountry, countryCode]);

	if (!selectedCountry) return null;

	const countryName = selectedCountry.properties?.name || 'País';

	return (
		<div className='absolute right-4 top-20 z-10 w-80'>
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
						<h3 className='mb-2 text-sm font-medium'>Top Track</h3>
						{isLoading ?
							<div className='space-y-2'>
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-3 w-1/2' />
								<Skeleton className='h-10 w-full' />
							</div>
						: error ?
							<p className='text-sm text-red-400'>Erro ao carregar faixa</p>
						: tracks && tracks.length > 0 && countryCode ?
							<PlayerPreview track={tracks[0]} countryCode={countryCode} />
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
