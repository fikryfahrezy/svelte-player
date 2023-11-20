import type {
	YTListUserUploadsType,
	YTListPlaylistType,
	YTPlayerPlayerVars,
	YTPlayerOptions
} from './youtube.global.types';

export type YouTubeUrl = string | string[];

export type ParsePlaylistFn = (url: YouTubeUrl) =>
	| {
			listType: YTListPlaylistType;
			list: string;
			playlist?: undefined;
	  }
	| {
			listType: YTListPlaylistType;
			list?: undefined;
			playlist: string;
	  }
	| {
			listType: YTListUserUploadsType;
			list: string;
	  }
	| { listType?: undefined; list?: undefined };

export type YouTubeConfig = {
	playerVars: Partial<YTPlayerPlayerVars>;
	embedOptions: Partial<YTPlayerOptions>;
	onUnstarted: () => void;
};
