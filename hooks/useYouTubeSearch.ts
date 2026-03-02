// hooks/useYouTubeSearch.ts
'use client';

import { useEffect, useState } from 'react';

interface YouTubeSearchResult {
	videoId: string;
	title: string;
	duration: string;
	uploaderName: string;
}

export function useYouTubeSearch(query: string | null) {
	const [videoId, setVideoId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<YouTubeSearchResult | null>(null);

	useEffect(() => {
		if (!query) {
			setVideoId(null);
			setResult(null);
			setIsLoading(false);
			setError(null);
			return;
		}

		const controller = new AbortController();

		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await fetch(
					`/api/youtube/search?q=${encodeURIComponent(query)}`,
					{
						signal: controller.signal,
					},
				);
				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.error || `Erro ${res.status}`);
				}
				const data: YouTubeSearchResult = await res.json();
				setVideoId(data.videoId);
				setResult(data);
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError') {
					setError(err.message);
					setVideoId(null);
					setResult(null);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();

		return () => controller.abort();
	}, [query]);

	return { videoId, result, isLoading, error };
}
