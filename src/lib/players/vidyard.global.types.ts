import type { AnyFunction } from './utility.types';

// https://developer.vidyard.com/responsive-player-embed-api.html
// https://knowledge.vidyard.com/hc/en-us/articles/360019034753-Using-the-Vidyard-Player-API

// TODO: fix type
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
	list_options: null | unknown; // TODO: fix this
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
export type VidyardPlayerPLAYEvent = 'play';
export type VidyardPlayerPAUSEEvent = 'pause';
export type VidyardPlayerBEFORESEEKEvent = 'beforeSeek';
export type VidyardPlayerSEEKEvent = 'seek';
export type VidyardPlayerPLAYERCOMPLETEEvent = 'playerComplete';
export type VidyardPlayerVIDEOCOMPLETEEvent = 'videoComplete';
export type VidyardPlayerTIMEUPDATEEvent = 'timeupdate';
export type VidyardPlayerVOLUMECHANGEEvent = 'volumeChange';
export type VidyardPlayerLIGHTBOXCLOSEEvent = 'lightboxClose';
export type VidyardPlayerMETADATAEvent = 'metadata';

export type VidyardPlayerNoDataEvents =
	| VidyardPlayerREADYEvent
	| VidyardPlayerPAUSEEvent
	| VidyardPlayerPLAYERCOMPLETEEvent
	| VidyardPlayerLIGHTBOXCLOSEEvent;

export type VidyardPlayerEvents =
	| VidyardPlayerNoDataEvents
	| VidyardPlayerPLAYEvent
	| VidyardPlayerBEFORESEEKEvent
	| VidyardPlayerSEEKEvent
	| VidyardPlayerVIDEOCOMPLETEEvent
	| VidyardPlayerTIMEUPDATEEvent
	| VidyardPlayerVOLUMECHANGEEvent
	| VidyardPlayerMETADATAEvent;

export type VidyardPlayerDataEventCallback<T> = (data: T) => void;

export type VidyardPlayerPLAYEventCallback = VidyardPlayerDataEventCallback<number>; // in seconds

export type VidyardPlayerBEFORESEEKEventCallbackData = {
	start: number; // in seconds
};

export type VidyardPlayerBEFORESEEKEventCallback =
	VidyardPlayerDataEventCallback<VidyardPlayerBEFORESEEKEventCallbackData>;

export type VidyardPlayerSEEKEventCallbackData = [number, number]; // seeking from and seeking to in seconds

export type VidyardPlayerSEEKEventCallback =
	VidyardPlayerDataEventCallback<VidyardPlayerSEEKEventCallbackData>;

export type VidyardPlayerVIDEOCOMPLETEEventCallback = VidyardPlayerDataEventCallback<number>; // index, start from 0

export type VidyardPlayerTIMEUPDATEEventCallback = VidyardPlayerDataEventCallback<number>; // in seconds

export type VidyardPlayerVOLUMECHANGEEventCallback = VidyardPlayerDataEventCallback<number>; // range between 0-1

export type VidyardPlayerMETADATAEventCallback = VidyardPlayerDataEventCallback<
	VidyardPlayerMetadata[]
>;

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

export type VidyardPlayerSetPlaybackSpeedValues = 2 | 1.5 | 1.25 | 1 | 0.5;

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
	on(event: VidyardPlayerNoDataEvents, callback: AnyFunction): void;
	on(event: VidyardPlayerPLAYEvent, callback: VidyardPlayerPLAYEventCallback): void;
	on(event: VidyardPlayerBEFORESEEKEvent, callback: VidyardPlayerBEFORESEEKEventCallback): void;
	on(event: VidyardPlayerSEEKEvent, callback: VidyardPlayerSEEKEventCallback): void;
	on(
		event: VidyardPlayerVIDEOCOMPLETEEvent,
		callback: VidyardPlayerVIDEOCOMPLETEEventCallback
	): void;
	on(event: VidyardPlayerTIMEUPDATEEvent, callback: VidyardPlayerTIMEUPDATEEventCallback): void;
	on(event: VidyardPlayerVOLUMECHANGEEvent, callback: VidyardPlayerVOLUMECHANGEEventCallback): void;
	on(event: VidyardPlayerMETADATAEvent, callback: VidyardPlayerMETADATAEventCallback): void;
};

export type VidyardGDPRHasConsentOnReadyCallback = (consent: boolean) => void;

export type VidyardGDPR = {
	consent(consent: boolean): void;
	hasConsentOnReady(callback: VidyardGDPRHasConsentOnReadyCallback): void;
};

// TODO: fix `unknown` type
export type VidyardAPIAddReadyListenerCallback = (data: unknown, player: VidyardPlayer) => void;

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
	players: VidyardPlayer[];
	metadata: VidyardPlayerMetadata;
};

export type Vidyard = {
	api: VidyardAPI;
};

export type VidyardSDKReady = 'onVidyardAPI';
