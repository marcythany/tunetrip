'use client';

import { Button } from '@/components/ui/button';
import { useAudioSource } from '@/hooks/useAudioSource';
import type { LastFmTrack } from '@/lib/lastfm/types';
import { cn } from '@/lib/utils';
import { Heart, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { toast } from 'sonner';

interface PlayerPreviewProps {
	track: LastFmTrack;
	countryCode: string;
	isPlaying: boolean;
	onPlayPause: () => void;
}

export default function PlayerPreview({
	track,
	countryCode,
	isPlaying,
	onPlayPause,
}: PlayerPreviewProps) {
	const [isLiked, setIsLiked] = useState(false);
	const { source, loading: sourceLoading } = useAudioSource(track);

	useEffect(() => {
		console.log('[PlayerPreview] source:', source, 'loading:', sourceLoading);
	}, [source, sourceLoading]);

	const handleLike = async () => {
		try {
			const { addFavorite } = await import('@/app/(main)/actions');
			const favoriteTrack = {
				id: `${track.name}-${track.artist.name}`,
				name: track.name,
				artistName: track.artist.name,
				preview_url: null,
			};
			await addFavorite(favoriteTrack, countryCode);
			setIsLiked(true);
			toast.success('Adicionado aos favoritos');
		} catch {
			toast.error('Erro ao favoritar');
		}
	};

	if (sourceLoading) {
		return (
			<div className='text-sm text-muted-foreground'>
				Carregando fonte de áudio...
			</div>
		);
	}

	if (source.type === 'none') {
		return (
			<div className='text-sm text-muted-foreground'>Áudio não disponível</div>
		);
	}

	return (
		<div className='flex items-center justify-between py-2'>
			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-medium'>{track.name}</p>
				<p className='truncate text-xs text-muted-foreground'>
					{track.artist.name}
				</p>
			</div>
			<div className='flex gap-1'>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					onClick={onPlayPause}
				>
					{isPlaying ?
						<Pause className='h-4 w-4' />
					:	<Play className='h-4 w-4' />}
				</Button>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					onClick={handleLike}
					disabled={isLiked}
				>
					<Heart
						className={cn('h-4 w-4', isLiked && 'fill-red-500 text-red-500')}
					/>
				</Button>
			</div>
			{source.type === 'youtube' && source.videoId && isPlaying && (
				<div className='hidden'>
					<ReactPlayer
						src={`https://www.youtube.com/watch?v=${source.videoId}`}
						playing={true}
						controls={false}
						width='0'
						height='0'
					/>
				</div>
			)}
		</div>
	);
}
