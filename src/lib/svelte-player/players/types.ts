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
	loadComponent: Promise<{ default: typeof SvelteComponent }>;
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

export type YouTubePlayerMedia = PlayerProps & {
	playerVars: YTPlayerPlayerVars;
};

export type PlayerMedia = {
	mute(): void;
	unmute(): void;
};

export type Dispatcher = {
	mount: PlayerMedia;
	onPlay: undefined;
	onBufferEnd: undefined;
	onPause: undefined;
	onBuffer: undefined;
	onEnded: undefined;
	onReady: undefined;
};
