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

export type VimeoPlayerBUFFERENDEvent = 'bufferend';
export type VimeoPlayerBUFFERSTARTEvent = 'bufferstart';
export type VimeoPlayerENDEDEvent = 'ended';
export type VimeoPlayerERROREvent = 'error';
export type VimeoPlayerLOADEDEvent = 'loaded';
export type VimeoPlayerPAUSEEvent = 'pause';
export type VimeoPlayerPLAYEvent = 'play';
export type VimeoPlayerPLAYBACKRATECHANGEEvent = 'playbackratechange';
export type VimeoPlayerPROGRESSEvent = 'progress';
export type VimeoPlayerSEEKEDEvent = 'seeked';
export type VimeoPlayerTIMEUPDATEEvent = 'timeupdate';
export type VimeoPlayerVOLUMECHANGEEvent = 'volumechange';
export type VimeoPlayerCHAPTESRCHANGEEvent = 'chapterchange';
export type VimeoPlayerCUECHANGEEvent = 'cuechange';
export type VimeoPlayerCUEPOINTEvent = 'cuepoint';
export type VimeoPlayerTEXTTRACKCHANGEEvent = 'texttrackchange';
export type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEvent = 'interactivehotspotclicked';
export type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEvent = 'interactiveoverlaypanelclicked';

export type VimeoPlayerNoDataEventEvents = VimeoPlayerBUFFERENDEvent | VimeoPlayerBUFFERSTARTEvent;

export type VimeoPlayerProgressEvents =
	| VimeoPlayerENDEDEvent
	| VimeoPlayerPAUSEEvent
	| VimeoPlayerPLAYEvent
	| VimeoPlayerPROGRESSEvent
	| VimeoPlayerSEEKEDEvent
	| VimeoPlayerTIMEUPDATEEvent;

export type VimeoPlayerEvents =
	| VimeoPlayerNoDataEventEvents
	| VimeoPlayerProgressEvents
	| VimeoPlayerERROREvent
	| VimeoPlayerPLAYBACKRATECHANGEEvent
	| VimeoPlayerVOLUMECHANGEEvent
	| VimeoPlayerCHAPTESRCHANGEEvent
	| VimeoPlayerCUECHANGEEvent
	| VimeoPlayerCUEPOINTEvent
	| VimeoPlayerTEXTTRACKCHANGEEvent;

export type VimeoPlayerPROGRESSEventCallbackData = {
	duration: number; // in seconds
	percent: number;
	seconds: number;
};

export type VimeoPlayerERROREventCallbackData = {
	message: string;
	method: string;
	name: string;
};

export type VimeoPlayerLOADEDEventCallbackData = {
	id: VimeoEmbedIDOption['id'];
};

export type VimeoPlayerPLAYBACKRATECHANGEEventCallbackData = {
	playbackRate: number;
};

export type VimeoPlayerVOLUMECHANGEEventCallbackData = {
	volume: number;
};

export type VimeoPlayerChapter = {
	index: number;
	startTime: number;
	title: string;
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

export type CuePointData = Record<string, unknown>;

export type VimeoPlayerCuePoint = {
	time: number;
	data: CuePointData;
	id: string;
};

export type VimeoPlayerTEXTTRACKCHANGEEventCallbackData = {
	label: string;
	language: string;
	kind: string;
};

export type VimeoPlayerTextTrack = VimeoPlayerTEXTTRACKCHANGEEventCallbackData & {
	mode: string;
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

export type VimeoPlayerWithDataEventCallback<T> = (data: T) => void;

export type VimeoPlayerNoDataEventCallback = VimeoPlayerWithDataEventCallback<undefined>;

export type VimeoPlayerPROGRESSEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerPROGRESSEventCallbackData>;

export type VimeoPlayerERROREventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerERROREventCallbackData>;

export type VimeoPlayerLOADEDEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerLOADEDEventCallbackData>;

export type VimeoPlayerPLAYBACKRATECHANGEEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerPLAYBACKRATECHANGEEventCallbackData>;

export type VimeoPlayerVOLUMECHANGEEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerVOLUMECHANGEEventCallbackData>;

export type VimeoPlayerCHAPTERCHANGEEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerChapter>;

export type VimeoPlayerCUECHANGEEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerCUECHANGEEventCallbackData>;

export type VimeoPlayerCUEPOINTEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerCuePoint>;

export type VimeoPlayerTEXTTRACKCHANGEEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerTEXTTRACKCHANGEEventCallbackData>;

export type VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEventCallbackData>;

export type VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEventCallback =
	VimeoPlayerWithDataEventCallback<VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEventCallbackData>;

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
	on(event: VimeoPlayerNoDataEventEvents, callback: VimeoPlayerNoDataEventCallback): void;
	on(event: VimeoPlayerProgressEvents, callback: VimeoPlayerPROGRESSEventCallback): void;
	on(event: VimeoPlayerERROREvent, callback: VimeoPlayerERROREventCallback): void;
	on(event: VimeoPlayerLOADEDEvent, callback: VimeoPlayerLOADEDEventCallback): void;
	on(
		event: VimeoPlayerPLAYBACKRATECHANGEEvent,
		callback: VimeoPlayerPLAYBACKRATECHANGEEventCallback
	): void;
	on(event: VimeoPlayerVOLUMECHANGEEvent, callback: VimeoPlayerVOLUMECHANGEEventCallback): void;
	on(event: VimeoPlayerCHAPTESRCHANGEEvent, callback: VimeoPlayerCHAPTERCHANGEEventCallback): void;
	on(event: VimeoPlayerCUECHANGEEvent, callback: VimeoPlayerCUECHANGEEventCallback): void;
	on(event: VimeoPlayerCUEPOINTEvent, callback: VimeoPlayerCUEPOINTEventCallback): void;
	on(
		event: VimeoPlayerTEXTTRACKCHANGEEvent,
		callback: VimeoPlayerTEXTTRACKCHANGEEventCallback
	): void;
	on(
		event: VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEvent,
		callback: VimeoPlayerINTERACTIVEHOTSPOTCLICKEDEventCallback
	): void;
	on(
		event: VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEvent,
		callback: VimeoPlayerINTERACTIVEOVERPLAYPANELCLICKEDEventCallback
	): void;
	off(event: VimeoPlayerEvents, callback?: AnyFunction): void;
}

export interface VimeoPlayerConstructor {
	new (container: HTMLElement | string, options?: Partial<VimeoEmbedOptions>): VimeoPlayer;
	readonly prototype: VimeoPlayer;
}

export type Vimeo = {
	Player: VimeoPlayerConstructor;
};
