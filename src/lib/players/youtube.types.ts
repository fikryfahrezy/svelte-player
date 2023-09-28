import type {
	YTListUserUploadsType,
	YTListPlaylistType,
	YTPlayerPlayerVars,
	YTPlayerOptions
} from './youtube.global.types';

export type ParsePlaylistFn = (url: string | string[]) =>
	| {
			listType: YTListPlaylistType;
			list: string;
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
