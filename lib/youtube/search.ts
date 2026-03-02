import yts from 'yt-search';

export interface YouTubeSearchResult {
	videoId: string;
	title: string;
	duration: string;
	uploaderName: string;
}

export async function searchYouTubeVideo(
	query: string,
): Promise<YouTubeSearchResult | null> {
	try {
		const result = await yts(query);
		const videos = result.videos;
		if (!videos || videos.length === 0) return null;

		const first = videos[0];
		return {
			videoId: first.videoId,
			title: first.title,
			duration: first.duration.toString(),
			uploaderName: first.author.name,
		};
	} catch (error) {
		console.error('[YouTube Search] Erro na busca:', error);
		return null;
	}
}
