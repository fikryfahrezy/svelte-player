import type {
	HTMLVideoAttributes,
	HTMLAudioAttributes,
	HTMLTrackAttributes
} from 'svelte/elements';

import type { GlobalSDKFLV, GlobalSDKHLS } from './global.types';
import type { HlsConfig, HLSClass, ErrorData } from './hls.types';
import type { MediaPlayerClass } from './dash.types';
import type { Player } from './flv.types';

export type { HLSClass } from './hls.types';

export type DashJSMediaPlayerClass = MediaPlayerClass;
export type FlvJSPlayer = Player;

export type FileMedia = { src: string; type: string };

export type FileUrl = string | string[] | FileMedia[] | MediaStream;

export type FileConfigAttributes =
	| Omit<HTMLVideoAttributes, `on:${string}`>
	| Omit<HTMLAudioAttributes, `on:${string}`>;

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

export type FilePlayerElement = HTMLAudioElement | HTMLVideoElement;

export type FilePlayer = FilePlayerElement;

export type FileInternalPlayer = {
	hls: HLSClass;
	dash: DashJSMediaPlayerClass;
	flv: FlvJSPlayer;
	player: FilePlayer;
};

export type FileInternalPlayerKey = keyof FileInternalPlayer;

export type FileErrorData = ErrorData;

export type FileErrorSDKInstance = HLSClass | FlvJSPlayer;

export type FileErrorSDKGlobal = GlobalSDKFLV | GlobalSDKHLS;

export type AddListenersFn = (playerParams: FilePlayerElement) => void;

export type RemoveListenersFn = (playerParams: FilePlayerElement, urlParams?: FileUrl) => void;

export type PlayerElementRef = {
	getPlayer(): FilePlayerElement;
};
