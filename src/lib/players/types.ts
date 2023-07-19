import type { SvelteComponent } from 'svelte';

import type loadScript from 'load-script';
import type { GlobalSDK, GlobalSDKReady, GlobalSDKType } from './global.types';
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

export type PlayerInstance =
	| YTPlayer
	| TwitchPlayer
	| HTMLAudioElement
	| HTMLVideoElement
	| NotImplementedPlayer
	| SoundCloudPlayer
	| DailyMotionPlayer
	| MixcloudWidget
	| FacebookPlayer
	| VimeoPlayer
	| PlayerJSPlayer
	| WistiaPlayer
	| VidyardPlayer;

export type SDKBase<T extends keyof GlobalSDK> = {
	url: string;
	sdkGlobal: T;
	sdkReady?: GlobalSDKReady | null;
};

export type PlayerType = 'YouTube';

export type PlayerUrl = string | string[];

export type Player = {
	canPlay: (url: PlayerUrl) => boolean;
	loadComponent: () => Promise<{ default: typeof SvelteComponent<any> }>;
	loopOnEnded?: boolean;
	forceLoad?: boolean;
};

export type GetSDKParams<T extends keyof GlobalSDK = GlobalSDKType> = SDKBase<T> & {
	isLoaded?: (sdk: GlobalSDK[T]) => boolean;
	fetchScript?: typeof loadScript;
};

export type PlayerProps = {
	playing?: boolean;
	controls?: boolean;
	playsinline?: boolean;
	loop?: boolean;
};

export type GetPlayerReturn = PlayerInstance | null;

export type PlayerMedia = {
	load(url: FilePlayerUrl, isReady?: boolean): void;
	stop(): void;
	play(): void;
	pause(): void;
	setVolume(fraction: number): void;
	mute(): void;
	unmute(): void;
	getDuration(): number;
	getCurrentTime(): number;
	getSecondsLoaded(): number;
	seekTo(amount: number, keepPlaying?: boolean): void;
	setPlaybackRate?(rate: number): void;
	setLoop?(loop: boolean): void;
	enablePIP?(): void;
	disablePIP?(): void;
	getPlayer?(): GetPlayerReturn;
};

export type OnProgressProps = {
	played: number;
	playedSeconds: number;
	loaded?: number;
	loadedSeconds?: number;
};

// TODO: to implement corrent type
export type OnErrorProps = {
	error: unknown;
	data?: unknown;
	sdkInstance?: unknown;
	sdkGlobal?: unknown;
};

export type Dispatcher = {
	ready: undefined | Event;
	mount: undefined;
	start: undefined;
	play: undefined | Event;
	progress: OnProgressProps;
	duration: number;
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

export type PlayerMediaRef = PlayerMedia & PlayerProps;

export type InternalPlayerKey = 'player' | 'hls' | 'dash';

export type FileMediaUrl = { src: string; type: string };

export type FilePlayerUrl = PlayerUrl | FileMediaUrl[];
