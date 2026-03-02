'use client';

import PlayerPreview from '@/components/map/PlayerPreview';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountryTracks } from '@/hooks/useCountryTracks';
import { useMap } from './MapProvider';

export default function MobileDrawer() {
	const { selectedCountry, selectCountry } = useMap();
	const countryCode = selectedCountry?.properties?.code ?? null;
	const { tracks, isLoading } = useCountryTracks(countryCode);

	const open = !!selectedCountry;

	return (
		<Drawer open={open} onOpenChange={(open) => !open && selectCountry(null)}>
			<DrawerContent className='border-t-teal-800/30 bg-background/95 backdrop-blur-xl'>
				<DrawerHeader>
					<DrawerTitle className='text-center'>
						{selectedCountry?.properties?.name || 'País'}
					</DrawerTitle>
				</DrawerHeader>
				<div className='px-4 pb-6'>
					{isLoading ?
						<Skeleton className='h-20 w-full' />
					: tracks && tracks.length > 0 && countryCode ?
						<PlayerPreview track={tracks[0]} countryCode={countryCode} />
					:	<p className='text-center text-sm text-muted-foreground'>
							Nenhuma faixa disponível
						</p>
					}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
