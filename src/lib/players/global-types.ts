import type Hls from 'hls.js';
import type dashjs from 'dashjs';
import type flvjs from 'flv.js';

// See more about YouTube's IFrame API here:
// https://developers.google.com/youtube/iframe_api_reference

export type BooleanNumber = 0 | 1;

export type YTPlayerOnErrorValue = 2 | 5 | 100 | 101 | 150;

export type YTPlaybackRate = 0.25 | 0.5 | 1 | 1.5 | 2;

export type YTListPlaylistType = 'playlist';

export type YTListUserUploadsType = 'user_uploads';

export type YTListType = YTListPlaylistType | YTListUserUploadsType;

export type YTPlaybackQualityValue = 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';

export type YTPlayerState = {
	UNSTARTED: -1;
	ENDED: 0;
	PLAYING: 1;
	PAUSED: 2;
	BUFFERING: 3;
	CUED: 5;
};

export type YTPlayerStateValue = YTPlayerState[keyof YTPlayerState];

export type YTPlayerPlayerVars = {
	autoplay: BooleanNumber;
	cc_lang_pref: string;
	cc_load_policy: BooleanNumber;
	color: 'red' | 'white';
	controls: BooleanNumber;
	disablekb: BooleanNumber;
	enablejsapi: BooleanNumber;
	end: number;
	fs: BooleanNumber;
	hl: string;
	iv_load_policy: BooleanNumber;
	list: string;
	listType: YTListType;
	loop: BooleanNumber;
	modestbranding: BooleanNumber;
	origin: string;
	playlist: string;
	playsinline: BooleanNumber;
	rel: BooleanNumber;
	start: number;
	widget_referrer: string;
};

export type YTPlayerOnReadyEvent = {
	target: YTPlayer;
};

export type YTPlayerOnStateChangeEvent = {
	target: YTPlayer;
	data: YTPlayerStateValue;
};

export type YTPlayerOnPlaybackQualityChangeEvent = {
	target: YTPlayer;
	data: YTPlaybackQualityValue;
};

export type YTPlayerOnPlaybackRateChangeEvent = {
	target: YTPlayer;
	data: number;
};

export type YTPlayerOnErrorEvent = {
	target: YTPlayer;
	data: YTPlayerOnErrorValue;
};

export type YTPlayerEvents = {
	onReady(event: YTPlayerOnReadyEvent): void;
	onStateChange(event: YTPlayerOnStateChangeEvent): void;
	onPlaybackQualityChange(event: YTPlayerOnPlaybackQualityChangeEvent): void;
	onPlaybackRateChange(event: YTPlayerOnPlaybackRateChangeEvent): void;
	onError(event: YTPlayerOnErrorEvent): void;
	onApiChange(events: unknown): void; // TODO: to implement corrent type
};

export type YTPlayerOptions = {
	height: string;
	width: string;
	videoId: string;
	playerVars: Partial<YTPlayerPlayerVars>;
	events: Partial<YTPlayerEvents>;
};

export type CueVideoByIDParams = {
	videoId: string;
	startSeconds?: number;
	endSeconds?: number;
};

export type LoadVideoByIDParams = {
	videoId: string;
	startSeconds?: number;
	endSeconds?: number;
};

export type CueVideoByUrlParams = {
	mediaContentUrl: string;
	startSeconds?: number;
	endSeconds?: number;
};

export type LoadVideoByUrlParams = {
	mediaContentUrl: string;
	startSeconds?: number;
	endSeconds?: number;
};

export type CuePlaylistParams = {
	listType?: YTListType;
	list: string;
	index?: number;
	startSeconds?: number;
};

export type LoadPlaylistParams = {
	list: string;
	listType?: YTListType;
	index?: number;
	startSeconds?: number;
};

export type SphericalObject = {
	yaw: number; // between 0 - 360
	pitch: number; // between -90 - 90
	roll: number; // between -180 - 180
	fov: number; // between 30 - 120
};

export type SetSphericalPropertiesParams = SphericalObject & {
	enableOrientationSensor?: boolean;
};

export type AnyFunction = (...args: any[]) => any; // TODO: remove this

export interface YTPlayer {
	cueVideoById(videoId: string, startSeconds?: number): void;
	cueVideoById(params: CueVideoByIDParams): void;
	loadVideoById(videoId: string, startSeconds?: number): void;
	loadVideoById(params: LoadVideoByIDParams): void;
	cueVideoByUrl(mediaContentUrl: string, startSeconds?: number): void;
	cueVideoByUrl(params: CueVideoByUrlParams): void;
	loadVideoByUrl(mediaContentUrl: string, startSeconds?: number): void;
	loadVideoByUrl(params: LoadVideoByUrlParams): void;
	cuePlaylist(playlist: string | string[], index?: number, startSeconds?: number): void;
	cuePlaylist(params: CuePlaylistParams): void;
	loadPlaylist(playlist: string | string[], index?: number, startSeconds?: number): void;
	loadPlaylist(params: LoadPlaylistParams): void;
	playVideo(): void;
	pauseVideo(): void;
	stopVideo(): void;
	seekTo(seconds: number, allowSeekAhead?: boolean): void;
	getSphericalProperties(): Record<string, never> | SphericalObject;
	setSphericalProperties(properties: Partial<SetSphericalPropertiesParams>): void;
	nextVideo(): void;
	previousVideo(): void;
	playVideoAt(index: number): void;
	mute(): void;
	unMute(): void;
	isMuted(): boolean;
	setVolume(volume: number): void;
	getVolume(): number;
	setSize(width: number, height: number): object; // TODO: to implement corrent type
	getPlaybackRate(): YTPlaybackRate;
	setPlaybackRate(suggestedRate: number): void;
	getAvailablePlaybackRates(): YTPlaybackRate[];
	setLoop(loopPlaylists: boolean): void;
	setShuffle(shufflePlaylist: boolean): void;
	getVideoLoadedFraction(): number; //Float, between 0 - 1
	getPlayerState(): YTPlayerStateValue;
	getCurrentTime(): number;
	getDuration(): number;
	getVideoUrl(): string;
	getVideoEmbedCode(): string;
	getPlaylist(): string[];
	getPlaylistIndex(): number;
	addEventListener(event: string, listener: string | AnyFunction): void; // TODO: to impelment corrent type for `AnyFunction`
	removeEventListener(event: string, listener: string | AnyFunction): void; // TODO: to impelment corrent type for `AnyFunction`
	getIframe(): HTMLIFrameElement;
	destroy(): void;
}

export interface YTPlayerConstructor {
	new (container: string | HTMLElement, options?: Partial<YTPlayerOptions>): YTPlayer;
	readonly prototype: YTPlayer;
}

export type YT = {
	Player: YTPlayerConstructor;
	PlayerState: YTPlayerState;
	loaded: BooleanNumber;
	loading: BooleanNumber;
	ready: AnyFunction; // TODO: to impelment corrent type
	scan: AnyFunction; // TODO: to impelment corrent type
	setConfig: AnyFunction; // TODO: to impelment corrent type
	subscribe: AnyFunction; // TODO: to impelment corrent type
	unsubscribe: AnyFunction; // TODO: to impelment corrent type
};

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

export type TwitchPlayerCAPTIONS = 'captions';
export type TwitchPlayerENDED = 'ended';
export type TwitchPlayerPAUSE = 'pause';
export type TwitchPlayerPLAY = 'play';
export type TwitchPlayerPLAYBACK_BLOCKED = 'playbackBlocked';
export type TwitchPlayerPLAYING = 'playing';
export type TwitchPlayerOFFLINE = 'offline';
export type TwitchPlayerONLINE = 'online';
export type TwitchPlayerREADY = 'ready';
export type TwitchPlayerSEEK = 'seek';

export type TwitchPlayerEVENT =
	| TwitchPlayerCAPTIONS
	| TwitchPlayerENDED
	| TwitchPlayerPAUSE
	| TwitchPlayerPLAY
	| TwitchPlayerPLAYBACK_BLOCKED
	| TwitchPlayerPLAYING
	| TwitchPlayerOFFLINE
	| TwitchPlayerONLINE
	| TwitchPlayerREADY
	| TwitchPlayerSEEK;

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
		event: Exclude<TwitchPlayerEVENT, TwitchPlayerSEEK>,
		callback: TwitchPlayerEVENTCallback
	): void;
	addEventListener(
		event: Extract<TwitchPlayerEVENT, TwitchPlayerSEEK>,
		callback: TwitchPlayerSEEKEVENTCallback
	): void;
}

export interface TwitchPlayerConstructor {
	new (container: string, options: Partial<TwitchPlayerOptions>): TwitchPlayer;
	readonly prototype: TwitchPlayer;
	CAPTIONS: TwitchPlayerCAPTIONS;
	ENDED: TwitchPlayerENDED;
	PAUSE: TwitchPlayerPAUSE;
	PLAY: TwitchPlayerPLAY;
	PLAYBACK_BLOCKED: TwitchPlayerPLAYBACK_BLOCKED;
	PLAYING: TwitchPlayerPLAYING;
	OFFLINE: TwitchPlayerOFFLINE;
	ONLINE: TwitchPlayerONLINE;
	READY: TwitchPlayerREADY;
	SEEK: TwitchPlayerSEEK;
}

export type Twitch = {
	Player: TwitchPlayerConstructor;
};

type TypeOfDashJS = typeof dashjs;
type DashJSLogLevel = TypeOfDashJS['LogLevel'];

export type DashJSDebugLogLevel = {
	LOG_LEVEL_NONE: DashJSLogLevel['LOG_LEVEL_NONE'];
	LOG_LEVEL_FATAL: DashJSLogLevel['LOG_LEVEL_FATAL'];
	LOG_LEVEL_ERROR: DashJSLogLevel['LOG_LEVEL_ERROR'];
	LOG_LEVEL_WARNING: DashJSLogLevel['LOG_LEVEL_WARNING'];
	LOG_LEVEL_INFO: DashJSLogLevel['LOG_LEVEL_INFO'];
	LOG_LEVEL_DEBUG: DashJSLogLevel['LOG_LEVEL_DEBUG'];
};

export type DashJS = TypeOfDashJS & {
	Debug: DashJSDebugLogLevel;
};
export type FlvJS = typeof flvjs;
export type HlsJS = typeof Hls;

export type GlobalSDK = {
	YT: YT;
	Hls: HlsJS;
	dashjs: DashJS;
	flvjs: FlvJS;
	Twitch: Twitch;
};

export type GlobalSDKType = keyof GlobalSDK;

export type GlobalSDKYTKey = Extract<GlobalSDKType, 'YT'>;
export type GlobalSDKHLSKey = Extract<GlobalSDKType, 'Hls'>;
export type GlobalSDKDASHKey = Extract<GlobalSDKType, 'dashjs'>;
export type GlobalSDKFLVKey = Extract<GlobalSDKType, 'flvjs'>;
export type GlobalSDKTwitchKey = Extract<GlobalSDKType, 'Twitch'>;

export type GlobalSDKValue = GlobalSDK[GlobalSDKType];

export type GlobalSDKYT = Extract<GlobalSDKValue, YT>;
export type GlobalSDKHLS = Extract<GlobalSDKValue, HlsJS>;
export type GlobalSDKHLSClass = Hls;
export type GlobalSDKDASH = Extract<GlobalSDKValue, DashJS>;
export type GlobalSDKFLV = Extract<GlobalSDKValue, FlvJS>;
export type GlobalSDKTwitch = Extract<GlobalSDKValue, Twitch>;

export type GlobalSDKReady = 'onYouTubeIframeAPIReady';

export type GlobalSDKYTReady = Extract<GlobalSDKReady, 'onYouTubeIframeAPIReady'>;
