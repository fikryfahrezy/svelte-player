import type { AnyFunction } from './utility.types';

// https://developer.vimeo.com/player/sdk/reference
export type VimeoEmbedIDOption = {
	id: number;
};

export type VimeoEmbedURLOption = {
	url: string;
};

export type VimeoPlayerOptions = {
	autopause: boolean; // no effect if you've disabled cookies in your browser
	autopip: boolean;
	autoplay: boolean;
	background: boolean;
	byline: boolean;
	color: string; // hexadecimal color
	colors: string[]; // hexadecimal colors
	controls: boolean;
	dnt: string;
	height: number;
	interactive_params: string;
	keyboard: boolean;
	loop: boolean;
	maxheight: number;
	maxwidth: number;
	muted: boolean;
	pip: boolean;
	playsinline: boolean;
	portrait: boolean;
	quality: string;
	responsive: boolean;
	speed: boolean;
	texttrack: string;
	title: boolean;
	transparent: boolean;
	width: number;
};

export type VimeoEmbedOptions = (VimeoEmbedIDOption | VimeoEmbedURLOption) & VimeoPlayerOptions;

export type CuePointData = Record<string, unknown>;

export type VimeoPlayerCuePoint = {
	time: number;
	data: CuePointData;
	id: string;
};

export type VimeoPlayerChapter = {
	index: number;
	startTime: number;
	title: string;
};

export type VimeoPlayerBUFFERENDEvent = 'bufferend';
type VimeoPlayerBUFFERENDListenerFn = () => void;
type VimeoPlayerBUFFERENDListener = {
	[k in VimeoPlayerBUFFERENDEvent]: VimeoPlayerBUFFERENDListenerFn;
};

export type VimeoPlayerBUFFERSTARTEvent = 'bufferstart';
type VimeoPlayerBUFFERSTARTListenerFn = () => void;
type VimeoPlayerBUFFERSTARTListener = {
	[k in VimeoPlayerBUFFERSTARTEvent]: VimeoPlayerBUFFERSTARTListenerFn;
};

export type VimeoPlayerPROGRESSEventCallbackData = {
	duration: number; // in seconds
	percent: number;
	seconds: number;
};
export type VimeoPlayerENDEDEvent = 'ended';
type VimeoPlayerENDEDListenerFn = (data: VimeoPlayerPROGRESSEventCallbackData) => void;
type VimeoPlayerENDEDListener = {
	[k in VimeoPlayerENDEDEvent]: VimeoPlayerENDEDListenerFn;
};

export type VimeoPlayerPAUSEEvent = 'pause';
type VimeoPlayerPAUSEListenerFn = (data: VimeoPlayerPROGRESSEventCallbackData) => void;
type VimeoPlayerPAUSEListener = {
	[k in VimeoPlayerPAUSEEvent]: VimeoPlayerPAUSEListenerFn;
};

export type VimeoPlayerPLAYEvent = 'play';
type VimeoPlayerPLAYListenerFn = (data: VimeoPlayerPROGRESSEventCallbackData) => void;
type VimeoPlayerPLAYListener = {
	[k in VimeoPlayerPLAYEvent]: VimeoPlayerPLAYListenerFn;
};

export type VimeoPlayerPROGRESSEvent = 'progress';
type VimeoPlayerPROGRESSListenerFn = (data: VimeoPlayerPROGRESSEventCallbackData) => void;
type VimeoPlayerPROGRESSListener = {
	[k in VimeoPlayerPROGRESSEvent]: VimeoPlayerPROGRESSListenerFn;
};

export type VimeoPlayerSEEKEDEvent = 'seeked';
type VimeoPlayerSEEKEDListenerFn = (data: VimeoPlayerPROGRESSEventCallbackData) => void;
type VimeoPlayerSEEKEDListener = {
	[k in VimeoPlayerSEEKEDEvent]: VimeoPlayerSEEKEDListenerFn;
};

export type VimeoPlayerTIMEUPDATEEvent = 'timeupdate';
type VimeoPlayerTIMEUPDATEListenerFn = (data: VimeoPlayerPROGRESSEventCallbackData) => void;
type VimeoPlayerTIMEUPDATEListener = {
	[k in VimeoPlayerTIMEUPDATEEvent]: VimeoPlayerTIMEUPDATEListenerFn;
};

export type VimeoPlayerERROREventCallbackData = {
	message: string;
	method: string;
	name: string;
};
export type VimeoPlayerERROREvent = 'error';
type VimeoPlayerERRORListenerFn = (data: VimeoPlayerERROREventCallbackData) => void;
type VimeoPlayerERRORListener = {
	[k in VimeoPlayerERROREvent]: VimeoPlayerERRORListenerFn;
};

export type VimeoPlayerLOADEDEventCallbackData = {
	id: VimeoEmbedIDOption['id'];
};
export type VimeoPlayerLOADEDEvent = 'loaded';
type VimeoPlayerLOADEDListenerFn = (data: VimeoPlayerLOADEDEventCallbackData) => void;
type VimeoPlayerLOADEDListener = {
	[k in VimeoPlayerLOADEDEvent]: VimeoPlayerLOADEDListenerFn;
};

export type VimeoPlayerPLAYBACKRATECHANGEEventCallbackData = {
	playbackRate: number;
};
export type VimeoPlayerPLAYBACKRATECHANGEEvent = 'playbackratechange';
type VimeoPlayerPLAYBACKRATECHANGEListenerFn = (
	data: VimeoPlayerPLAYBACKRATECHANGEEventCallbackData
) => void;
type VimeoPlayerPLAYBACKRATECHANGEListener = {
	[k in VimeoPlayerPLAYBACKRATECHANGEEvent]: VimeoPlayerPLAYBACKRATECHANGEListenerFn;
};

export type VimeoPlayerVOLUMECHANGEEventCallbackData = {
	volume: number;
};
export type VimeoPlayerVOLUMECHANGEEvent = 'volumechange';
type VimeoPlayerVOLUMECHANGEListenerFn = (data: VimeoPlayerVOLUMECHANGEEventCallbackData) => void;
type VimeoPlayerVOLUMECHANGEListener = {
	[k in VimeoPlayerVOLUMECHANGEEvent]: VimeoPlayerVOLUMECHANGEListenerFn;
};

export type VimeoPlayerCHAPTESRCHANGEEvent = 'chapterchange';
type VimeoPlayerCHAPTESRCHANGEListenerFn = (data: VimeoPlayerChapter) => void;
type VimeoPlayerCHAPTESRCHANGEListener = {
	[k in VimeoPlayerCHAPTESRCHANGEEvent]: VimeoPlayerCHAPTESRCHANGEListenerFn;
};

export type VimeoPlayerCUECHANGEEventCallbackCue = {
	html: string;
	text: string;
};
export type VimeoPlayerCUECHANGEEventCallbackData = {
	cues: VimeoPlayerCUECHANGEEventCallbackCue[];
	kind: string;
	label: string;
	language: string;
};
export type VimeoPlayerCUECHANGEEvent = 'cuechange';
type VimeoPlayerCUECHANGEListenerFn = (data: VimeoPlayerCUECHANGEEventCallbackData) => void;
type VimeoPlayerCUECHANGEListener = {
	[k in VimeoPlayerCUECHANGEEvent]: VimeoPlayerCUECHANGEListenerFn;
};

export type VimeoPlayerCUEPOINTEvent = 'cuepoint';
type VimeoPlayerCUEPOINTListenerFn = (data: VimeoPlayerCuePoint) => void;
type VimeoPlayerCUEPOINTListener = {
	[k in VimeoPlayerCUEPOINTEvent]: VimeoPlayerCUEPOINTListenerFn;
};

export type VimeoPlayerTEXTTRACKCHANGEEventCallbackData = {
	label: string;
	language: string;
	kind: string;
};
export type VimeoPlayerTEXTTRACKCHANGEEvent = 'texttrackchange';
type VimeoPlayerTEXTTRACKCHANGEListenerFn = (
	data: VimeoPlayerTEXTTRACKCHANGEEventCallbackData
) => void;
type VimeoPlayerTEXTTRACKCHANGEListener = {
	[k in VimeoPlayerTEXTTRACKCHANGEEvent]: VimeoPlayerTEXTTRACKCHANGEListenerFn;
};

export type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDActionPreference = {
	pauseOnAction: boolean;
	overlayId: number;
	seekTo: number; // in seconds
	url: string;
};
export type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEventCallbackData = {
	action: string;
	actionPreference: VimeoPlayerINTERACTIVEHOTSPOTCLICKEDActionPreference;
	currentTime: number; // in seconds
	customPayloadData: unknown | null;
	hotspotId: number;
};
export type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEvent = 'interactivehotspotclicked';
type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDListenerFn = (
	data: VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEventCallbackData
) => void;
type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDListener = {
	[k in VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEvent]: VimeoPlayerINTERACTIVEHOTSPOTCLICKEDListenerFn;
};

export type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDActionPreference = {
	pauseOnAction: boolean;
	seekTo: number; // in seconds
	url: string;
};
export type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEventCallbackData = {
	action: string;
	actionPreference: VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDActionPreference;
	currentTime: number; // in seconds
	customPayloadData: unknown | null;
	overlayId: number;
	panelId: string;
};
export type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEvent = 'interactiveoverlaypanelclicked';
type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDListenerFn = (
	data: VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEventCallbackData
) => void;
type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDListener = {
	[k in VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEvent]: VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDListenerFn;
};

export type VimeoPlayerListeners = VimeoPlayerBUFFERENDListener &
	VimeoPlayerBUFFERSTARTListener &
	VimeoPlayerENDEDListener &
	VimeoPlayerERRORListener &
	VimeoPlayerLOADEDListener &
	VimeoPlayerPAUSEListener &
	VimeoPlayerPLAYListener &
	VimeoPlayerPLAYBACKRATECHANGEListener &
	VimeoPlayerPROGRESSListener &
	VimeoPlayerSEEKEDListener &
	VimeoPlayerTIMEUPDATEListener &
	VimeoPlayerVOLUMECHANGEListener &
	VimeoPlayerCHAPTESRCHANGEListener &
	VimeoPlayerCUECHANGEListener &
	VimeoPlayerCUEPOINTListener &
	VimeoPlayerTEXTTRACKCHANGEListener &
	VimeoPlayerINTERACTIVEHOTSPOTCLICKEDListener &
	VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDListener;

export type VimeoPlayerTextTrack = VimeoPlayerTEXTTRACKCHANGEEventCallbackData & {
	mode: string;
};

export type VimeoPlayerSetAutopauseParams<T extends VimeoEmbedOptions['autopause']> = {
	autopause: T;
};

export interface VimeoPlayer {
	getAutopause(): Promise<VimeoEmbedOptions['autopause']>;
	getCurrentTime(): Promise<number>;
	getDuration(): Promise<number>;
	getEnded(): Promise<boolean>;
	getLoop(): Promise<VimeoEmbedOptions['loop']>;
	getPaused(): Promise<boolean>;
	getPlaybackRate(): Promise<number>;
	getVolume(): Promise<number>;
	pause(): Promise<void>;
	play(): Promise<void>;
	setAutopause<T extends VimeoEmbedOptions['autopause']>(
		params: VimeoPlayerSetAutopauseParams<T>
	): T;
	setCurrentTime<T extends number>(seconds: T): Promise<T>;
	setLoop<T extends VimeoEmbedOptions['loop']>(loop: T): Promise<T>;
	setPlaybackRate<T extends number>(playbackRate: T): Promise<T>;
	setVolume<T extends number>(volume: T): Promise<T>;
	getChapters(): Promise<VimeoPlayerChapter[]>;
	getCurrentChapter(): Promise<VimeoPlayerChapter>;
	addCuePoint(time: number, data: CuePointData): Promise<string>;
	getCuePoints(): Promise<VimeoPlayerCuePoint[]>;
	removeCuePoint<T extends string>(id: T): Promise<T>;
	disableTextTrack(): Promise<void>;
	enableTextTrack(language: string, kind?: string): Promise<VimeoPlayerTextTrack>;
	getTextTracks(): Promise<VimeoPlayerTextTrack[]>;
	destroy(): Promise<void>;
	getColor(): Promise<VimeoPlayerOptions['color']>;
	getColors(): Promise<VimeoPlayerOptions['colors']>;
	getVideoEmbedCode(): Promise<string>; // `embedCode` indicates the <iframe> embed code
	getVideoHeight(): Promise<VimeoPlayerOptions['height']>;
	getVideoId(): Promise<VimeoEmbedIDOption['id']>;
	getVideoTitle(): Promise<string>;
	getVideoUrl(): Promise<VimeoEmbedURLOption['url']>;
	getVideoWidth(): Promise<VimeoPlayerOptions['width']>;
	ready(): Promise<void>;
	setColor<T extends VimeoPlayerOptions['color']>(color: T): T;
	setColors<T extends VimeoPlayerOptions['colors']>(colors: T): T;
	unload(): void;
	loadVideo(
		idOrUrl: VimeoEmbedIDOption['id'] | VimeoEmbedURLOption['url']
	): Promise<VimeoEmbedIDOption['id']>;
	on<E extends keyof VimeoPlayerListeners>(event: E, listener: VimeoPlayerListeners[E]): void;
	off(event: keyof VimeoPlayerListeners, callback?: AnyFunction): void;
}

export interface VimeoPlayerConstructor {
	new (container: HTMLElement | string, options?: Partial<VimeoEmbedOptions>): VimeoPlayer;
}

export type Vimeo = {
	Player: VimeoPlayerConstructor;
};
