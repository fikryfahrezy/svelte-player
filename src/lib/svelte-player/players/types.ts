import type { SvelteComponent } from 'svelte';
import type loadScript from 'load-script';

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
	loadComponent: () => Promise<{ default: typeof SvelteComponent }>;
};

export type GetSDKParams<T extends keyof GlobalSDK = GlobalSDKType> = SDKBase<T> & {
	isLoaded: (sdk: GlobalSDK[T]) => boolean;
	fetchScript?: typeof loadScript;
};

export type PlayerProps = {
	playing?: boolean;
	controls?: boolean;
	playsinline?: boolean;
	loop?: boolean;
};

export type YouTubePlayerMedia = {
	playerVars?: Partial<YTPlayerPlayerVars>;
	embedOptions?: Partial<YTPlayerOptions>;
	onUnstarted?: () => void;
};

export type PlayerMedia = {
	mute(): void;
	unmute(): void;
};

export type OnProgressProps = {
	played: number;
	playedSeconds: number;
	loaded: number;
	loadedSeconds: number;
};

// TODO: to implement corrent type
export type OnErrorProps = {
	error: unknown;
	data?: unknown;
	hlsInstance?: unknown;
	hlsGlobal?: unknown;
};

export type Dispatcher = {
	mount: PlayerMedia;
	onReady: (player: PlayerMedia) => void;
	onStart: void;
	onPlay: void;
	onProgress: OnProgressProps;
	onDuration: number;
	onPause: void;
	onBuffer: void;
	onBufferEnd: void;
	onSeek: number;
	onEnded: void;
	onError: OnErrorProps;
	onClickPreview: unknown; // TODO: to implement corrent type
	onEnablePIP: void;
	onDisablePIP: void;
};

export type YouTubeDispatcher = Dispatcher & {
	onPlaybackRateChange: number;
	onPlaybackQualityChange: YTPlayerOnPlaybackQualityChangeEvent;
};
