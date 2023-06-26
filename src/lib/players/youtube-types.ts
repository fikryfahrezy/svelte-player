import type { Dispatcher, PlayerUrl } from './types';

import type {
	YTListUserUploadsType,
	YTListPlaylistType,
	YTPlayerPlayerVars,
	YTPlayerOptions
} from './global-types';

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

export type YouTubeConfig = {
	playerVars: Partial<YTPlayerPlayerVars>;
	embedOptions: Partial<YTPlayerOptions>;
	onUnstarted: () => void;
};
