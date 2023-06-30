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
	getVideoLoadedFraction(): number; // between 0 - 1
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
};

export type GlobalSDKType = keyof GlobalSDK;

export type GlobalSDKYTKey = Extract<GlobalSDKType, 'YT'>;
export type GlobalSDKHLSKey = Extract<GlobalSDKType, 'Hls'>;
export type GlobalSDKDASHKey = Extract<GlobalSDKType, 'dashjs'>;
export type GlobalSDKFLVKey = Extract<GlobalSDKType, 'flvjs'>;

export type GlobalSDKValue = GlobalSDK[GlobalSDKType];

export type GlobalSDKYT = Extract<GlobalSDKValue, YT>;
export type GlobalSDKHLS = Extract<GlobalSDKValue, HlsJS>;
export type GlobalSDKHLSClass = Hls;
export type GlobalSDKDASH = Extract<GlobalSDKValue, DashJS>;
export type GlobalSDKFLV = Extract<GlobalSDKValue, FlvJS>;

export type GlobalSDKReady = 'onYouTubeIframeAPIReady';

export type GlobalSDKYTReady = Extract<GlobalSDKReady, 'onYouTubeIframeAPIReady'>;
