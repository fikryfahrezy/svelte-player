import type {
	HTMLVideoAttributes,
	HTMLAudioAttributes,
	HTMLTrackAttributes
} from 'svelte/elements';
import type { FilePlayerUrl } from './types';

export type FileConfiAttributes = Omit<HTMLVideoAttributes | HTMLAudioAttributes, `on:${string}`>;

export type FileConfiHlsOptions = Record<string, never>;

export type FileConfig = {
	attributes: Partial<FileConfiAttributes>;
	tracks: Omit<HTMLTrackAttributes, `on:${string}`>[];
	forceVideo: boolean;
	forceAudio: boolean;
	forceHLS: boolean;
	forceDASH: boolean;
	forceFLV: boolean;
	hlsOptions: FileConfiHlsOptions;
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
