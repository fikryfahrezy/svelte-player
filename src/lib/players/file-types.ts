import type { FileConfiAttributes } from './global-types';
import type { FilePlayerUrl } from './types';

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
