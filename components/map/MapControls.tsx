'use client';

import { Button } from '@/components/ui/button';
import { Fullscreen, LocateFixed, ZoomIn, ZoomOut } from 'lucide-react';
import { useMap } from './MapProvider';

export default function MapControls() {
	const { mapRef } = useMap();

	const handleZoomIn = () => {
		if (mapRef.current) mapRef.current.zoomIn();
	};

	const handleZoomOut = () => {
		if (mapRef.current) mapRef.current.zoomOut();
	};

	const handleLocate = () => {
		if (mapRef.current) {
			mapRef.current.locate({ setView: true, maxZoom: 10 });
		}
	};

	const handleFullscreen = () => {
		const elem = mapRef.current?.getContainer();
		if (elem?.requestFullscreen) {
			elem.requestFullscreen();
		}
	};

	return (
		<div className='absolute right-4 top-20 z-10 flex flex-col gap-2 pointer-events-auto'>
			<Button
				variant='secondary'
				size='icon'
				onClick={handleZoomIn}
				className='h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm cursor-pointer'
			>
				<ZoomIn className='h-4 w-4' />
			</Button>
			<Button
				variant='secondary'
				size='icon'
				onClick={handleZoomOut}
				className='h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm cursor-pointer'
			>
				<ZoomOut className='h-4 w-4' />
			</Button>
			<Button
				variant='secondary'
				size='icon'
				onClick={handleLocate}
				className='h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm cursor-pointer'
			>
				<LocateFixed className='h-4 w-4' />
			</Button>
			<Button
				variant='secondary'
				size='icon'
				onClick={handleFullscreen}
				className='h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm cursor-pointer'
			>
				<Fullscreen className='h-4 w-4' />
			</Button>
		</div>
	);
}
