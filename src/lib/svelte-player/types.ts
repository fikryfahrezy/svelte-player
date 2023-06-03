import type { SvelteComponent } from 'svelte';
import type loadScript from 'load-script';

export type GetSDKParams = {
	url: string;
	sdkGlobal: string;
	sdkReady?: string | null;
	fetchScript?: typeof loadScript;
	isLoaded: () => boolean;
};

export type PlayerType = 'YouTube';

export type Player = {
	url: string;
	sdkGlobal: string;
	sdkReady: string;
	isLoaded: () => boolean;
	loadComponent: Promise<{ default: typeof SvelteComponent }>;
};

export type PlayerMap = Record<PlayerType, Player>;

export type YouTubeSDK = { loading: number; loaded: number };
