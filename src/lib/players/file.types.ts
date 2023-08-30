import type {
	HTMLVideoAttributes,
	HTMLAudioAttributes,
	HTMLTrackAttributes
} from 'svelte/elements';
import type { FilePlayerUrl } from './types';

import type { HlsConfig } from './hls.types';

export type FileConfigAttributes = Omit<HTMLVideoAttributes | HTMLAudioAttributes, `on:${string}`>;

export type FileConfig = {
	attributes: Partial<FileConfigAttributes>;
	tracks: Omit<HTMLTrackAttributes, `on:${string}`>[];
	forceVideo: boolean;
	forceAudio: boolean;
	forceHLS: boolean;
	forceDASH: boolean;
	forceFLV: boolean;
	hlsOptions: Partial<HlsConfig>;
	hlsVersion: string;
	dashVersion: string;
	flvVersion: string;
	forceDisableHls: boolean;
	forceSafariHLS?: boolean;
};

export type ShouldUseAudioParams = {
	url: FilePlayerUrl;
	config: FileConfig;
};
