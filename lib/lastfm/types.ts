export interface LastFmImage {
	'#text': string;
	size: 'small' | 'medium' | 'large' | 'extralarge';
}

export interface LastFmTrack {
	name: string;
	artist: {
		name: string;
		url: string;
	};
	url: string;
	listeners: string;
	image: LastFmImage[];
}

export interface LastFmTopTracksResponse {
	tracks: {
		track: LastFmTrack[];
	};
}
