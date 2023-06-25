import type { SvelteComponent } from 'svelte';
import type loadScript from 'load-script';
import type { YT, YTPlayer, YTPlayerOnPlaybackQualityChangeEvent } from './global-types';

export type GlobalSDK = {
	YT: YT;
};

export type GlobalSDKType = keyof GlobalSDK;

export type GlobalSDKObject = YTPlayer;

export type GlobalSDKReady = 'onYouTubeIframeAPIReady';

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
	getPlayer?(): GlobalSDKObject | null;
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
	hlsInstance?: unknown;
	hlsGlobal?: unknown;
};

export type Dispatcher = {
	mount: undefined;
	start: undefined;
	play: undefined;
	progress: OnProgressProps;
	duration: number;
	pause: undefined;
	buffer: undefined;
	bufferEnd: undefined;
	seek: number;
	ended: undefined;
	error: OnErrorProps;
	clickPreview: unknown; // TODO: to implement corrent type
	enablePIP: undefined;
	disablePIP: undefined;
	playbackRateChange: number;
	playbackQualityChange: YTPlayerOnPlaybackQualityChangeEvent;
	loaded: undefined;
};

export type PlayerMediaRef = PlayerMedia & PlayerProps;

export type InternalPlayerKey = 'player' | 'hls' | 'dash';

export type FileMediaUrl = { src: string; type: string };

export type FilePlayerUrl = PlayerUrl | FileMediaUrl[];
