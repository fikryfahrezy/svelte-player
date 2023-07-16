import type {
	HTMLVideoAttributes,
	HTMLAudioAttributes,
	HTMLTrackAttributes
} from 'svelte/elements';
import type { FilePlayerUrl } from './types';

export type FileConfigAttributes = Omit<HTMLVideoAttributes | HTMLAudioAttributes, `on:${string}`>;

export type FileConfigHlsOptions = Record<string, never>;

export type FileConfig = {
	attributes: Partial<FileConfigAttributes>;
	tracks: Omit<HTMLTrackAttributes, `on:${string}`>[];
	forceVideo: boolean;
	forceAudio: boolean;
	forceHLS: boolean;
	forceDASH: boolean;
	forceFLV: boolean;
	hlsOptions: FileConfigHlsOptions;
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
