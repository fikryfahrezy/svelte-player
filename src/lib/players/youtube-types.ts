import type { Dispatcher, PlayerUrl } from './types';

export type ParsePlaylistFn = (url: PlayerUrl) =>
	| {
			listType: YTListPlaylistType;
			list: string;
	  }
	| {
			listType: YTListUserUploadsType;
			list: string;
	  }
	| { listType?: undefined; list?: undefined };

export type YouTubeDispatcher = Dispatcher & {
	ready: undefined;
};

export type YouTubeMediaPlayer = YTPlayer; // Make it alias to suppress error on lint

export type YouTubeMediaPlayerOnStateChangeEvent = YTPlayerOnStateChangeEvent; // Make it alias to suppress error on lint

export type YouTubeConfig = {
	playerVars?: Partial<YTPlayerPlayerVars>;
	embedOptions?: Partial<YTPlayerOptions>;
	onUnstarted?: () => void;
};
