'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { SpotifyTrack } from '@/types/spotify';
import { Heart, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PlayerPreviewProps {
	track: SpotifyTrack;
	countryCode: string;
}

export default function PlayerPreview({
	track,
	countryCode,
}: PlayerPreviewProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const progressInterval = useRef<NodeJS.Timeout | null>(null);

	const previewUrl = track.preview_url;

	// Gerencia o áudio quando a previewUrl muda
	useEffect(() => {
		if (!previewUrl) return;

		// Limpa instância anterior
		if (audioRef.current) {
			audioRef.current.pause();
			if (progressInterval.current) {
				clearInterval(progressInterval.current);
				progressInterval.current = null;
			}
		}

		// Cria novo áudio
		audioRef.current = new Audio(previewUrl);

		const handleEnded = () => {
			setIsPlaying(false);
			setProgress(0);
			if (progressInterval.current) {
				clearInterval(progressInterval.current);
				progressInterval.current = null;
			}
		};

		audioRef.current.addEventListener('ended', handleEnded);

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.removeEventListener('ended', handleEnded);
				audioRef.current = null;
			}
			if (progressInterval.current) {
				clearInterval(progressInterval.current);
				progressInterval.current = null;
			}
		};
	}, [previewUrl]);

	const togglePlay = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
			if (progressInterval.current) {
				clearInterval(progressInterval.current);
				progressInterval.current = null;
			}
		} else {
			audioRef.current.play();
			progressInterval.current = setInterval(() => {
				if (audioRef.current) {
					const currentTime = audioRef.current.currentTime;
					const newProgress = (currentTime / 30) * 100;
					setProgress(newProgress);
					if (currentTime >= 30) {
						audioRef.current.pause();
						setIsPlaying(false);
						setProgress(0);
						if (progressInterval.current) {
							clearInterval(progressInterval.current);
							progressInterval.current = null;
						}
					}
				}
			}, 100);
		}
		setIsPlaying(!isPlaying);
	};

	const handleLike = async () => {
		try {
			const { addFavorite } = await import('@/app/(main)/actions');
			await addFavorite(track, countryCode);
			setIsLiked(true);
			toast.success('Adicionado aos favoritos');
		} catch {
			toast.error('Erro ao favoritar');
		}
	};

	if (!previewUrl) {
		return (
			<div className='text-sm text-muted-foreground'>
				Preview não disponível
			</div>
		);
	}

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between'>
				<div className='min-w-0 flex-1'>
					<p className='truncate text-sm font-medium'>{track.name}</p>
					<p className='truncate text-xs text-muted-foreground'>
						{track.artists.map((a) => a.name).join(', ')}
					</p>
				</div>
				<div className='flex gap-1'>
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8'
						onClick={togglePlay}
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
			</div>
			<Progress value={progress} max={100} className='h-1' />
		</div>
	);
}
