import type { SvelteComponent } from 'svelte';

import type { RecursivePartial, Constructor } from './utility.types';
import type { NotImplementedPlayer } from './notimplemented.global.types';
import type { YTPlayerOnPlaybackQualityChangeEvent, YTPlayer } from './youtube.global.types';
import type { TwitchPlayer } from './twitch.global.types';
import type { SoundCloudPlayer } from './soundcloud.global.types';
import type { MixcloudWidget } from './mixcloud.global.types';
import type { DailyMotionPlayer } from './dailymotion.global.types';
import type { FacebookPlayer } from './facebook.global.types';
import type { VimeoPlayer } from './vimeo.global.types';
import type { PlayerJSPlayer } from './playerjs.global.types';
import type { WistiaPlayer } from './wistia.global.types';
import type { VidyardPlayer } from './vidyard.global.types';
import type { YouTubeConfig, YouTubeUrl } from './youtube.types';
import type { SoundCloudConfig } from './soundcloud.types';
import type { ViemoConfig } from './vimeo.types';
import type { FacebookConfig } from './facebook.types';
import type { WistiaConfig } from './wistia.types';
import type { TwitchConfig } from './twitch.types';
import type { DailyMotionConfig } from './dailymotion.types';
import type { MixcloudConfig } from './mixcloud.types';
import type { VidyardConfig } from './vidyard.types';
import type {
	FileConfig,
	FileUrl,
	FilePlayer,
	FileErrorData,
	FileErrorSDKInstance,
	FileErrorSDKGlobal,
	FileInternalPlayer
} from './file.types';
import type { NotImplementedConfig } from './notimplemented.types';

export type PlayerInstance =
	| YTPlayer
	| TwitchPlayer
	| FilePlayer
	| NotImplementedPlayer
	| SoundCloudPlayer
	| DailyMotionPlayer
	| MixcloudWidget
	| FacebookPlayer
	| VimeoPlayer
	| PlayerJSPlayer
	| WistiaPlayer
	| VidyardPlayer;

export type PlayerInternalPlayer = Omit<FileInternalPlayer, 'player'> & {
	player: FileInternalPlayer['player'] | PlayerInstance;
};

export type PlayerGetPlayerKey = keyof PlayerInternalPlayer;

export type PlayerKey =
	| 'youtube'
	| 'soundcloud'
	| 'vimeo'
	| 'facebook'
	| 'streamable'
	| 'wistia'
	| 'twitch'
	| 'dailymotion'
	| 'mixcloud'
	| 'vidyard'
	| 'kaltura'
	| 'file'
	| 'not-implemented';

export type PlayerUrl = string | YouTubeUrl | FileUrl;

export type OnProgressProps = {
	played: number;
	playedSeconds: number;
	loaded?: number;
	loadedSeconds?: number;
};

export type ErrorData = FileErrorData;

export type ErrorSDKInstance = FileErrorSDKInstance;

export type ErrorSDKGlobal = FileErrorSDKGlobal;

// TODO: to implement corrent type
export type OnErrorProps = {
	error: unknown;
	data?: ErrorData | unknown;
	sdkInstance?: ErrorSDKInstance;
	sdkGlobal?: ErrorSDKGlobal;
};

export type PlayerDispatcher = {
	ready: undefined | Event;
	mount: undefined;
	start: undefined;
	play: undefined | Event;
	progress: OnProgressProps;
	duration: number | null;
	pause: undefined | Event;
	buffer: undefined | Event;
	bufferEnd: undefined | Event;
	seek: number | [number, number];
	ended: undefined | Event;
	error: OnErrorProps;
	clickPreview: unknown; // TODO: to implement corrent type
	enablePIP: Event;
	disablePIP: Event;
	playbackRateChange: number;
	playbackQualityChange: YTPlayerOnPlaybackQualityChangeEvent;
	loaded: undefined;
};

export type PlayerConfig = {
	youtube: YouTubeConfig;
	soundcloud: SoundCloudConfig;
	vimeo: ViemoConfig;
	facebook: FacebookConfig;
	streamable: undefined;
	wistia: WistiaConfig;
	twitch: TwitchConfig;
	dailymotion: DailyMotionConfig;
	mixcloud: MixcloudConfig;
	vidyard: VidyardConfig;
	kaltura: undefined;
	file: FileConfig;
	'not-implemented': NotImplementedConfig;
};

export type PlayerConfigKey = keyof PlayerConfig;

export type PlayerConfigObject = PlayerConfig[PlayerConfigKey];

export type PlayerProps = {
	url: PlayerUrl;
	playing: boolean;
	loop: boolean;
	controls: boolean;
	light: boolean | string;
	volume: number | null;
	muted: boolean;
	playbackRate: number;
	width: string;
	height: string;
	progressInterval: number;
	playsinline: boolean;
	pip: boolean;
	stopOnUnmount: boolean;
	previewTabIndex: number;
	config: RecursivePartial<PlayerConfigObject>;
	oEmbedUrl: string;
	display: string;
};

export type PlayerRef = {
	load(url: PlayerUrl, isReady?: boolean): void;
	stop(): void;
	play(): void;
	pause(): void;
	setVolume(fraction: number): void;
	mute(): void;
	unmute(): void;
	getDuration(): number | null;
	getCurrentTime(): number | null;
	getSecondsLoaded(): number | null;
	seekTo(amount: number, keepPlaying?: boolean): void;
	setPlaybackRate?(rate: number): void;
	setLoop?(loop: boolean): void;
	enablePIP?(): void;
	disablePIP?(): void;
	getPlayer(key?: 'player'): PlayerInternalPlayer['player'] | null;
	getPlayer<TKey extends PlayerGetPlayerKey>(key?: TKey): PlayerInternalPlayer[TKey] | null;
};

export type PlayerComponent = Constructor<SvelteComponent<Partial<PlayerProps>> & PlayerRef>;

export type Player = {
	key: PlayerKey;
	loopOnEnded?: boolean;
	forceLoad?: boolean;
	canPlay(url: PlayerUrl): boolean;
	canEnablePIP?(url: PlayerUrl): boolean;
	loadComponent(): Promise<{
		default: PlayerComponent;
	}>;
};
