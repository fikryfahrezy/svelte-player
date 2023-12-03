import type { AnyFunction } from './utility.types';

// https://developer.vidyard.com/responsive-player-embed-api.html
// https://knowledge.vidyard.com/hc/en-us/articles/360019034753-Using-the-Vidyard-Player-API

export type ThumbnailUrls = Record<string, never>;

export type Caption = {
	name: string;
	language: string;
	is_default: boolean;
	vtt_url: string;
};

export type VideoAttributes = {
	description: null;
	name: string;
	tags: string[];
	thumbnail_urls: ThumbnailUrls;
	captions: Caption[];
};

export type ChaptersAttribute = {
	video_attributes: VideoAttributes;
};

export type CustomAttributeString = {
	attribute_type: 'String';
	value: string;
};

export type CustomAttributeNumber = {
	attribute_type: 'Number';
	value: number;
};

export type CustomAttribute = (CustomAttributeString | CustomAttributeNumber) & {
	is_public: boolean;
	list_options: null | unknown;
	name: string;
};

export type VidyardPlayerMetadata = {
	chapters_attributes: ChaptersAttribute[];
	custom_attributes: CustomAttribute[];
	description: string;
	height: number;
	length_in_seconds: number;
	name: string;
	tags: string[];
	visitorID: string;
	width: number;
};

export type VidyardPlayerREADYEvent = 'ready';
type VidyardPlayerREADYLitenerFn = AnyFunction;
type VidyardPlayerREADYLitener = {
	[k in VidyardPlayerREADYEvent]: VidyardPlayerREADYLitenerFn;
};

export type VidyardPlayerPLAYEvent = 'play';
type VidyardPlayerPLAYLitenerFn = (data: number) => void; // in seconds
type VidyardPlayerPLAYLitener = {
	[k in VidyardPlayerPLAYEvent]: VidyardPlayerPLAYLitenerFn;
};

export type VidyardPlayerPAUSEEvent = 'pause';
type VidyardPlayerPAUSELitenerFn = AnyFunction;
type VidyardPlayerPAUSELitener = {
	[k in VidyardPlayerPAUSEEvent]: VidyardPlayerPAUSELitenerFn;
};

export type VidyardPlayerBEFORESEEKEvent = 'beforeSeek';
export type VidyardPlayerBEFORESEEKEventCallbackData = {
	start: number; // in seconds
};
type VidyardPlayerBEFORESEEKLitenerFn = (data: VidyardPlayerBEFORESEEKEventCallbackData) => void;
type VidyardPlayerBEFORESEEKLitener = {
	[k in VidyardPlayerBEFORESEEKEvent]: VidyardPlayerBEFORESEEKLitenerFn;
};

export type VidyardPlayerSEEKEvent = 'seek';
export type VidyardPlayerSEEKEventCallbackData = [number, number]; // seeking from and seeking to in seconds
type VidyardPlayerSEEKLitenerFn = (data: VidyardPlayerSEEKEventCallbackData) => void;
type VidyardPlayerSEEKLitener = {
	[k in VidyardPlayerSEEKEvent]: VidyardPlayerSEEKLitenerFn;
};

export type VidyardPlayerPLAYERCOMPLETEEvent = 'playerComplete';
type VidyardPlayerPLAYERCOMPLETELitenerFn = AnyFunction;
type VidyardPlayerPLAYERCOMPLETELitener = {
	[k in VidyardPlayerPLAYERCOMPLETEEvent]: VidyardPlayerPLAYERCOMPLETELitenerFn;
};

export type VidyardPlayerVIDEOCOMPLETEEvent = 'videoComplete';
type VidyardPlayerVIDEOCOMPLETELitenerFn = (data: number) => void; // index, start from 0
type VidyardPlayerVIDEOCOMPLETELitener = {
	[k in VidyardPlayerVIDEOCOMPLETEEvent]: VidyardPlayerVIDEOCOMPLETELitenerFn;
};

export type VidyardPlayerTIMEUPDATEEvent = 'timeupdate';
type VidyardPlayerTIMEUPDATELitenerFn = (data: number) => void; // in seconds
type VidyardPlayerTIMEUPDATELitener = {
	[k in VidyardPlayerTIMEUPDATEEvent]: VidyardPlayerTIMEUPDATELitenerFn;
};

export type VidyardPlayerVOLUMECHANGEEvent = 'volumeChange';
type VidyardPlayerVOLUMECHANGELitenerFn = (data: number) => void; // range between 0-1
type VidyardPlayerVOLUMECHANGELitener = {
	[k in VidyardPlayerVOLUMECHANGEEvent]: VidyardPlayerVOLUMECHANGELitenerFn;
};

export type VidyardPlayerLIGHTBOXCLOSEEvent = 'lightboxClose';
type VidyardPlayerLIGHTBOXCLOSELitenerFn = AnyFunction;
type VidyardPlayerLIGHTBOXCLOSELitener = {
	[k in VidyardPlayerLIGHTBOXCLOSEEvent]: VidyardPlayerLIGHTBOXCLOSELitenerFn;
};

export type VidyardPlayerMETADATAEvent = 'metadata';
type VidyardPlayerMETADATALitenerFn = (data: VidyardPlayerMetadata[]) => void;
type VidyardPlayerMETADATALitener = {
	[k in VidyardPlayerMETADATAEvent]: VidyardPlayerMETADATALitenerFn;
};

type VidyardLiteners = VidyardPlayerREADYLitener &
	VidyardPlayerPLAYLitener &
	VidyardPlayerPAUSELitener &
	VidyardPlayerBEFORESEEKLitener &
	VidyardPlayerSEEKLitener &
	VidyardPlayerPLAYERCOMPLETELitener &
	VidyardPlayerVIDEOCOMPLETELitener &
	VidyardPlayerTIMEUPDATELitener &
	VidyardPlayerVOLUMECHANGELitener &
	VidyardPlayerLIGHTBOXCLOSELitener &
	VidyardPlayerMETADATALitener;

export type VidyardPlayerAddEventOptionalOptions = {
	duration: number;
	videoIndex: number;
};
export type VidyardPlayerAddEventRequiredOptions = {
	eventId: number;
	start: number;
};
export type VidyardPlayerAddEventOptions = VidyardPlayerAddEventRequiredOptions &
	Partial<VidyardPlayerAddEventOptionalOptions>;

export type VidyardPlayerSetPlaybackSpeedValues = number; // 2 | 1.5 | 1.25 | 1 | 0.5;

export type VidyardPlayer = {
	play(): void;
	pause(): void;
	resume(): void; // alias for play
	seek(position: number /* in seconds */): void;
	scrubbing(): boolean;
	setVolume(volume: number /* range in 0-1 */): void;
	toggleFullscreen(): void;
	playVideoAtIndex(index: number /* start from 0 */): void;
	getCurrentVideoIndex(): number; // start from 0
	enableCaption(language?: string, code?: string): void;
	disableCaption(language?: string, code?: string): void;
	currentTime(): number; // in seconds
	setAudioTrack(audioTrackIndex: number): void;
	addEvent(objectOptions: VidyardPlayerAddEventOptions): void;
	setPlaybackSpeed(rate: VidyardPlayerSetPlaybackSpeedValues): void;
	showLightbox(): void;
	hideLightbox(): void;
	on<E extends keyof VidyardLiteners>(event: E, listener: VidyardLiteners[E]): void;
	metadata: VidyardPlayerMetadata | null;
};

export type VidyardGDPRHasConsentOnReadyCallback = (consent: boolean) => void;

export type VidyardGDPR = {
	consent(consent: boolean): void;
	hasConsentOnReady(callback: VidyardGDPRHasConsentOnReadyCallback): void;
};

export type VidyardAPIAddReadyListenerCallback = (data: undefined, player: VidyardPlayer) => void;

export type VidyardAPIGetPlayersByUUIDCallbackData = {
	player: VidyardPlayer;
	chapter: number;
	event: number;
};

export type VidyardAPIGetPlayersByUUIDCallback = (
	result: VidyardAPIGetPlayersByUUIDCallbackData
) => void;

export type VidyardAPIRenderPlayerOptionalOptions = {
	type: string;
	aspect: string;
	vydata: string;
	autoplay: number; // can't find on API reference page, but there is
};

export type VidyardAPIRenderPlayerRequiredOptions = {
	uuid: string;
	container: HTMLElement;
};

export type VidyardAPIRenderPlayerOptions = VidyardAPIRenderPlayerRequiredOptions &
	Partial<VidyardAPIRenderPlayerOptionalOptions> &
	Record<string, unknown>;

export type VidyardAPI = {
	GDPR: VidyardGDPR;
	addReadyListener(callback: VidyardAPIAddReadyListenerCallback, uuid?: string): void;
	getPlayersByUUID(uuid: string): VidyardPlayer[];
	progressEvents(callback: VidyardAPIGetPlayersByUUIDCallback, milestones: number[]): void;
	renderDOMPlayers(container?: HTMLElement): void;
	renderPlayer(options: HTMLElement | VidyardAPIRenderPlayerOptions): void;
	destroyPlayer(player: VidyardPlayer): void;
	getPlayerMetadata(): Promise<VidyardPlayerMetadata>; // can't find on API reference page, but there is
	players: VidyardPlayer[];
};

export type Vidyard = {
	api: VidyardAPI;
};

export type VidyardSDKReady = 'onVidyardAPI';
