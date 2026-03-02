// hooks/useAudioSource.ts
'use client';

import type { LastFmTrack } from '@/lib/lastfm/types';
import { useEffect, useReducer } from 'react';
import { useYouTubeSearch } from './useYouTubeSearch';

interface AudioSource {
	type: 'youtube' | 'none';
	videoId?: string;
}

interface State {
	source: AudioSource;
	loading: boolean;
}

type Action =
	| { type: 'YOUTUBE'; videoId: string }
	| { type: 'NONE' }
	| { type: 'LOADING' };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'YOUTUBE':
			return {
				source: { type: 'youtube', videoId: action.videoId },
				loading: false,
			};
		case 'NONE':
			return { source: { type: 'none' }, loading: false };
		case 'LOADING':
			return { ...state, loading: true };
		default:
			return state;
	}
}

export function useAudioSource(track: LastFmTrack) {
	const initialState: State = {
		source: { type: 'none' },
		loading: true,
	};
	const [state, dispatch] = useReducer(reducer, initialState);

	const searchQuery = `${track.name} ${track.artist.name} audio`;
	const {
		videoId,
		isLoading: youtubeLoading,
		error,
	} = useYouTubeSearch(searchQuery);

	useEffect(() => {
		if (error) {
			console.warn('[useAudioSource] YouTube search error:', error);
		}
		if (videoId) {
			console.log('[useAudioSource] YouTube video encontrado:', videoId);
		}
	}, [error, videoId]);

	useEffect(() => {
		if (youtubeLoading) {
			dispatch({ type: 'LOADING' });
		} else {
			if (videoId) {
				dispatch({ type: 'YOUTUBE', videoId });
			} else {
				dispatch({ type: 'NONE' });
			}
		}
	}, [youtubeLoading, videoId]);

	return { source: state.source, loading: state.loading };
}
