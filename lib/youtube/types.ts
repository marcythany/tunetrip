export interface YouTubeVideoItem {
	type: 'video';
	id: string;
	name: string;
	url: string;
	duration: string | null;
	views: number;
	uploadedAt: string;
	isLive: boolean;
	author: {
		name: string;
		channelID: string;
		url: string;
		verified: boolean;
	};
}

export interface YouTubeSearchResponse {
	query: string;
	items: YouTubeVideoItem[];
}
