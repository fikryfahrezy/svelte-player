import type { GlobalSDKObject } from './players/global-types';
import type { InternalPlayerKey, Dispatcher, PlayerUrl } from './players/types';
import type { YouTubeConfig } from './players/youtube-types';
import type { FileConfig } from './players/file-types';
import type { NotImplementedConfig } from './players/not-implemented-types';

export type SeekToType = 'seconds' | 'fraction';

export type PlayerDispatcher = Dispatcher & {
	ready: undefined;
};

export type PlayerRef = {
	getDuration(): number | null;
	getCurrentTime(): number | null;
	getSecondsLoaded(): number | null;
	getInternalPlayer(key?: InternalPlayerKey): GlobalSDKObject | null;
	seekTo(amount: number, type?: SeekToType, keepPlaying?: boolean): void;
};

export type SveltePlayerDispatcher = Omit<Dispatcher, 'ready'> & {
	ready: PlayerRef;
	onClickPreview: null;
};

export type SveltePlayerRef = PlayerRef & {
	canEnablePIP(url: PlayerUrl): boolean;
	showPreview(): void;
};

export type Config = {
	youtube: YouTubeConfig;
	file: FileConfig;
	'not-implemented': NotImplementedConfig;
};

export type PlayerKey = keyof Config;
export type PlayerConfig = Config[keyof Config];
