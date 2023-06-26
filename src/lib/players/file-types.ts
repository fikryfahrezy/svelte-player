import type { HTMLVideoAttributes, HTMLAudioAttributes } from 'svelte/elements';
import type { FilePlayerUrl } from './types';

export type FileConfiAttributes = Omit<HTMLVideoAttributes | HTMLAudioAttributes, `on:${string}`>;

export type FileConfiHlsOptions = Record<string, never>;

export type FileConfig = {
	attributes: Partial<FileConfiAttributes>;
	tracks: never[];
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
