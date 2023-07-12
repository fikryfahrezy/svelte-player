import type { InternalPlayerKey, Dispatcher, PlayerUrl, PlayerInstance } from './players/types';
import type { YouTubeConfig } from './players/youtube-types';
import type { SoundCloudConfig } from './players/soundcloud-types';
import type { ViemoConfig } from './players/vimeo-types';
import type { FacebookConfig } from './players/facebook-types';
import type { TwitchConfig } from './players/twitch-types';
import type { DailyMotionConfig } from './players/dailymotion-types';
import type { MixcloudConfig } from './players/mixcloud-types';
import type { FileConfig } from './players/file-types';
import type { NotImplementedConfig } from './players/notimplemented-types';

// Recursive Partial<T> in TypeScript
// https://stackoverflow.com/a/51365037/12976234
export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
		? RecursivePartial<T[P]>
		: T[P];
};

export type SeekToType = 'seconds' | 'fraction';

export type PlayerDispatcher = Dispatcher & {
	ready: undefined;
};

export type PlayerRef = {
	getDuration(): number | null;
	getCurrentTime(): number | null;
	getSecondsLoaded(): number | null;
	getInternalPlayer(key?: InternalPlayerKey): PlayerInstance | null;
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
	soundcloud: SoundCloudConfig;
	vimeo: ViemoConfig;
	facebook: FacebookConfig;
	streamable: undefined;
	twitch: TwitchConfig;
	dailymotion: DailyMotionConfig;
	mixcloud: MixcloudConfig;
	file: FileConfig;
	'not-implemented': NotImplementedConfig;
};

export type PlayerKey = keyof Config;
export type PlayerConfig = Config[keyof Config];
