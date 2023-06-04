import type { SvelteComponent } from 'svelte';
import type loadScript from 'load-script';

export type GlobalSDK = {
	YT: YT;
};

export type GlobalSDKType = keyof GlobalSDK;

export type GlobalSDKReady = 'onYouTubeIframeAPIReady';

export type SDKBase<T extends keyof GlobalSDK> = {
	url: string;
	sdkGlobal: T;
	sdkReady?: GlobalSDKReady | null;
};

export type PlayerType = 'YouTube';

export type Player = {
	canPlay: (url: string | string[]) => boolean;
	loadComponent: Promise<{ default: typeof SvelteComponent }>;
};

export type GetSDKParams<T extends keyof GlobalSDK = GlobalSDKType> = SDKBase<T> & {
	isLoaded: (sdk: GlobalSDK[T]) => boolean;
	fetchScript?: typeof loadScript;
};
