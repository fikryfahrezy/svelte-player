// https://dev.twitch.tv/docs/embed/video-and-clips/#interactive-frames-for-live-streams-and-vods
export type TwitchPlayerChannelOption = {
	channel: string;
	video: undefined;
	collection: undefined;
};

export type TwitchPlayerVideoOption = {
	channel: undefined;
	video: string;
	collection: undefined;
};

export type TwitchPlayerCollectionOption = {
	channel: undefined;
	video: undefined;
	collection: string;
};

export type TwitchPlayerLinkOption =
	| TwitchPlayerChannelOption
	| TwitchPlayerVideoOption
	| TwitchPlayerCollectionOption;

export type TwitchPlayerRequiredOptions = TwitchPlayerLinkOption & {
	height: number | string;
	width: number | string;
	parent?: string[];
};

export type TwitchPlayerOptionalOptions = {
	autoplay: boolean;
	muted: boolean;
	time: string;

	// These options are not documented in Twitch Doc
	// But actually can passed these options
	playsinline: boolean;
	controls: boolean;
};

export type TwitchPlayerOptions = TwitchPlayerRequiredOptions &
	Partial<TwitchPlayerOptionalOptions>;

export type TwitchPlaybackStats = {
	backendVersion: string;
	bufferSize: number;
	codecs: string;
	displayResolution: string;
	fps: string;
	hlsLatencyBroadcaster: number;
	playbackRate: number;
	skippedFrames: number;
	videoResolution: string;
};

export type TwitchPlayerCAPTIONSEvent = 'captions';
type TwitchPlayerCAPTIONSListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerCAPTIONSListener = {
	[k in TwitchPlayerCAPTIONSEvent]: TwitchPlayerCAPTIONSListenerFn;
};

export type TwitchPlayerENDEDEvent = 'ended';
type TwitchPlayerENDEDListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerENDEDListener = {
	[k in TwitchPlayerENDEDEvent]: TwitchPlayerENDEDListenerFn;
};

export type TwitchPlayerPAUSEEvent = 'pause';
type TwitchPlayerPAUSEListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerPAUSEListener = {
	[k in TwitchPlayerPAUSEEvent]: TwitchPlayerPAUSEListenerFn;
};

export type TwitchPlayerPLAYEvent = 'play';
type TwitchPlayerPLAYListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerPLAYListener = {
	[k in TwitchPlayerPLAYEvent]: TwitchPlayerPLAYListenerFn;
};

export type TwitchPlayerPLAYBACK_BLOCKEDEvent = 'playbackBlocked';
type TwitchPlayerPLAYBACK_BLOCKEDListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerPLAYBACK_BLOCKEDListener = {
	[k in TwitchPlayerPLAYBACK_BLOCKEDEvent]: TwitchPlayerPLAYBACK_BLOCKEDListenerFn;
};

export type TwitchPlayerPLAYINGEvent = 'playing';
type TwitchPlayerPLAYINGListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerPLAYINGListener = {
	[k in TwitchPlayerPLAYINGEvent]: TwitchPlayerPLAYINGListenerFn;
};

export type TwitchPlayerOFFLINEEvent = 'offline';
type TwitchPlayerOFFLINEListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerOFFLINEListener = {
	[k in TwitchPlayerOFFLINEEvent]: TwitchPlayerOFFLINEListenerFn;
};

export type TwitchPlayerONLINEEvent = 'online';
type TwitchPlayerONLINEListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerONLINEListener = {
	[k in TwitchPlayerONLINEEvent]: TwitchPlayerONLINEListenerFn;
};

export type TwitchPlayerREADYEvent = 'ready';
type TwitchPlayerREADYListenerFn = (params: Record<string, never>) => void;
type TwitchPlayerREADYListener = {
	[k in TwitchPlayerREADYEvent]: TwitchPlayerREADYListenerFn;
};

export type TwitchPlayerSEEKEVENTCallbackParams = { position: number };
export type TwitchPlayerSEEKEvent = 'seek';
type TwitchPlayerSEEKListenerFn = (params: TwitchPlayerSEEKEVENTCallbackParams) => void;
type TwitchPlayerSEEKListener = {
	[k in TwitchPlayerSEEKEvent]: TwitchPlayerSEEKListenerFn;
};

export type TwitchListeners = TwitchPlayerCAPTIONSListener &
	TwitchPlayerENDEDListener &
	TwitchPlayerPAUSEListener &
	TwitchPlayerPLAYListener &
	TwitchPlayerPLAYBACK_BLOCKEDListener &
	TwitchPlayerPLAYINGListener &
	TwitchPlayerOFFLINEListener &
	TwitchPlayerONLINEListener &
	TwitchPlayerREADYListener &
	TwitchPlayerSEEKListener;

export interface TwitchPlayer {
	disableCaptions(): void;
	enableCaptions(): void;
	pause(): void;
	play(): void;
	seek(timestamp: number /* Float */): void;
	setChannel(channel: string): void;
	setCollection(collectionID: string, videoID: string): void;
	setQuality(quality: string): void;
	setVideo(videoID: string, timestamp: number): void;
	getMuted(): boolean;
	setMuted(muted: boolean): void;
	getVolume(): number /* Float, between 0.0 - 1.0 */;
	setVolume(volumelevel: number /* Float, between 0.0 - 1.0 */): void;
	getPlaybackStats(): TwitchPlaybackStats;
	getChannel(): string;
	getCurrentTime(): number /* Float */;
	getDuration(): number /* Float */;
	getEnded(): boolean;
	getQualities(): string[];
	getQuality(): string;
	getVideo(): string;
	isPaused(): boolean;
	addEventListener<E extends keyof TwitchListeners>(event: E, listener: TwitchListeners[E]): void;
}

export interface TwitchPlayerConstructor {
	new (container: string, options: Partial<TwitchPlayerOptions>): TwitchPlayer;
	CAPTIONS: TwitchPlayerCAPTIONSEvent;
	ENDED: TwitchPlayerENDEDEvent;
	PAUSE: TwitchPlayerPAUSEEvent;
	PLAY: TwitchPlayerPLAYEvent;
	PLAYBACK_BLOCKED: TwitchPlayerPLAYBACK_BLOCKEDEvent;
	PLAYING: TwitchPlayerPLAYINGEvent;
	OFFLINE: TwitchPlayerOFFLINEEvent;
	ONLINE: TwitchPlayerONLINEEvent;
	READY: TwitchPlayerREADYEvent;
	SEEK: TwitchPlayerSEEKEvent;
}

export type Twitch = {
	Player: TwitchPlayerConstructor;
};
