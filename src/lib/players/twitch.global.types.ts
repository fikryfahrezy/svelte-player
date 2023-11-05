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
export type TwitchPlayerENDEDEvent = 'ended';
export type TwitchPlayerPAUSEEvent = 'pause';
export type TwitchPlayerPLAYEvent = 'play';
export type TwitchPlayerPLAYBACK_BLOCKEDEvent = 'playbackBlocked';
export type TwitchPlayerPLAYINGEvent = 'playing';
export type TwitchPlayerOFFLINEEvent = 'offline';
export type TwitchPlayerONLINEEvent = 'online';
export type TwitchPlayerREADYEvent = 'ready';
export type TwitchPlayerSEEKEvent = 'seek';

export type TwitchPlayerEVENT =
	| TwitchPlayerCAPTIONSEvent
	| TwitchPlayerENDEDEvent
	| TwitchPlayerPAUSEEvent
	| TwitchPlayerPLAYEvent
	| TwitchPlayerPLAYBACK_BLOCKEDEvent
	| TwitchPlayerPLAYINGEvent
	| TwitchPlayerOFFLINEEvent
	| TwitchPlayerONLINEEvent
	| TwitchPlayerREADYEvent
	| TwitchPlayerSEEKEvent;

export type TwitchPlayerEVENTCallback = (params: Record<string, never>) => void;

export type TwitchPlayerSEEKEVENTCallbackParams = { position: number };

export type TwitchPlayerSEEKEVENTCallback = (params: TwitchPlayerSEEKEVENTCallbackParams) => void;

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
	addEventListener(
		event: Exclude<TwitchPlayerEVENT, TwitchPlayerSEEKEvent>,
		callback: TwitchPlayerEVENTCallback
	): void;
	addEventListener(event: TwitchPlayerSEEKEvent, callback: TwitchPlayerSEEKEVENTCallback): void;
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
