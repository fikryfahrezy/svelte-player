import type { PlayerMedia, Dispatcher } from './types';

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

export type YouTubeDispatcher = Dispatcher & {
	ready: PlayerMedia;
};

export type YouTubeMediaPlayer = YTPlayer; // Make it alias to suppress error on lint

export type YouTubeMediaPlayerOnStateChangeEvent = YTPlayerOnStateChangeEvent; // Make it alias to suppress error on lint
