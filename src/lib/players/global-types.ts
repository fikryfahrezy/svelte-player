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
	addEventListener(
		event: Extract<TwitchPlayerEVENT, TwitchPlayerSEEKEvent>,
		callback: TwitchPlayerSEEKEVENTCallback
	): void;
}

export interface TwitchPlayerConstructor {
	new (container: string, options: Partial<TwitchPlayerOptions>): TwitchPlayer;
	readonly prototype: TwitchPlayer;
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

// https://developers.soundcloud.com/docs/api/html5-widget
export type SoundCloudWidgetLOAD_PROGRESSEvent = 'loadProgress';
export type SoundCloudWidgetPLAY_PROGRESSEvent = 'playProgress';
export type SoundCloudWidgetPLAYEvent = 'play';
export type SoundCloudWidgetPAUSEEvent = 'pause';
export type SoundCloudWidgetFINISHEvent = 'finish';
export type SoundCloudWidgetSEEKEvent = 'seek';

export type SoundCloudUIREADYEvent = 'ready';
export type SoundCloudUICLICK_DOWNLOADEvent = 'downloadClicked';
export type SoundCloudUICLICK_BUYEvent = 'buyClicked';
export type SoundCloudUIOPEN_SHARE_PANELEvent = 'sharePanelOpened';
export type SoundCloudUIERROREvent = 'error';

export type SoundCloudPlayerEVENT =
	| SoundCloudWidgetLOAD_PROGRESSEvent
	| SoundCloudWidgetPLAY_PROGRESSEvent
	| SoundCloudWidgetPLAYEvent
	| SoundCloudWidgetPAUSEEvent
	| SoundCloudWidgetFINISHEvent
	| SoundCloudWidgetSEEKEvent
	| SoundCloudUIREADYEvent
	| SoundCloudUICLICK_DOWNLOADEvent
	| SoundCloudUICLICK_BUYEvent
	| SoundCloudUIOPEN_SHARE_PANELEvent
	| SoundCloudUIERROREvent;

export type SoundCloudWidgetEvents = {
	LOAD_PROGRESS: SoundCloudWidgetLOAD_PROGRESSEvent;
	PLAY_PROGRESS: SoundCloudWidgetPLAY_PROGRESSEvent;
	PLAY: SoundCloudWidgetPLAYEvent;
	PAUSE: SoundCloudWidgetPAUSEEvent;
	FINISH: SoundCloudWidgetFINISHEvent;
	SEEK: SoundCloudWidgetSEEKEvent;
	READY: SoundCloudUIREADYEvent;
	CLICK_DOWNLOAD: SoundCloudUICLICK_DOWNLOADEvent;
	CLICK_BUY: SoundCloudUICLICK_BUYEvent;
	OPEN_SHARE_PANEL: SoundCloudUIOPEN_SHARE_PANELEvent;
	ERROR: SoundCloudUIERROREvent;
};

export type SoundCloudPlayerLoadOptions = {
	auto_play: boolean;
	color: string /* hex code, example #0066CC */;
	buying: boolean;
	sharing: boolean;
	download: boolean;
	show_artwork: boolean;
	show_playcount: boolean;
	show_user: boolean;
	start_track: number /* from 0 */;
	single_active: boolean;
	callback(): void;
	visual: boolean; // Undocumented, but makes player fill container and look better
};

export type SoundCloudPlayerBindCallbackParams = {
	soundId: number;
	loadedProgress: number;
	currentPosition: number;
	relativePosition: number;
};

export type SoundCloudPlayerBindCallbackFn = (params: SoundCloudPlayerBindCallbackParams) => void;

// TODO: Fix the any / unknown types
export type SoundCloudPlayer = {
	bind(
		event: Exclude<SoundCloudPlayerEVENT, SoundCloudUIERROREvent>,
		listener: SoundCloudPlayerBindCallbackFn
	): void;
	bind(
		event: Extract<SoundCloudPlayerEVENT, SoundCloudUIERROREvent>,
		listener: (e: unknown) => void
	): void;
	unbind(event: SoundCloudPlayerEVENT): void;
	load(url: string, options?: Partial<SoundCloudPlayerLoadOptions>): void;
	play(): void;
	pause(): void;
	toggle(): void;
	seekTo(milliseconds: number): void;
	setVolume(volume: number /* range 0-100 */): void;
	next(): void;
	prev(): void;
	skip(soundIndex: number /* starting from 0 */): void;
	getVolume(callback: AnyFunction): number /* range 0-100 */; // TODO: Change AnyFunction
	getDuration(callback: AnyFunction): number /* in millisecond */; // TODO: Change AnyFunction
	getPosition(callback: AnyFunction): number /* in millisecond */; // TODO: Change AnyFunction
	getSounds(callback: AnyFunction): Record<string, never>[]; // TODO: Change AnyFunction
	getCurrentSound(callback: AnyFunction): Record<string, never>; // TODO: Change AnyFunction
	getCurrentSoundIndex(callback: AnyFunction): number /* index of current sound */; // TODO: Change AnyFunction
	isPaused(callback: AnyFunction): boolean; // TODO: Change AnyFunction
};

export interface SoundCloudWidget {
	(container: string | HTMLIFrameElement): SoundCloudPlayer;
	Events: SoundCloudWidgetEvents;
}

export type SoundCloud = {
	Widget: SoundCloudWidget;
};

// https://www.mixcloud.com/developers/widget/
export type MixcloudPlayerLoadOptions = {
	hide_cover: boolean;
	hide_tracklist: boolean;
	mini: boolean;
	hide_artwork: boolean;
	light: boolean;
};

export type MixcloudPROGRESSEvent = 'progress';
export type MixcloudBUFFERINGEvent = 'buffering';
export type MixcloudPLAYEvent = 'play';
export type MixcloudPAUSEEvent = 'pause';
export type MixcloudENDEDEvent = 'ended';
export type MixcloudERROREvent = 'error';

export type MixcloudPlayerEVENT =
	| MixcloudPROGRESSEvent
	| MixcloudBUFFERINGEvent
	| MixcloudPLAYEvent
	| MixcloudPAUSEEvent
	| MixcloudENDEDEvent
	| MixcloudERROREvent;

export type MixcloudWidgetEVENTCallback = () => void;
export type MixcloudWidgetProgressEVENTCallback = (seconds: number, duration: number) => void;
export type MixcloudWidgetErrorßEVENTCallback = (error: unknown) => void;

export type MixcloudWidgetProgressEVENT = {
	[l in Extract<MixcloudPlayerEVENT, MixcloudPROGRESSEvent>]: {
		on(callback: MixcloudWidgetProgressEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudWidgetErrorEVENT = {
	[l in Extract<MixcloudPlayerEVENT, MixcloudERROREvent>]: {
		on(callback: MixcloudWidgetErrorßEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudWidgetEVENT = MixcloudWidgetProgressEVENT &
	MixcloudWidgetErrorEVENT & {
		[k in Exclude<MixcloudPlayerEVENT, MixcloudPROGRESSEvent | MixcloudERROREvent>]: {
			on(callback: MixcloudWidgetEVENTCallback): void;
			off(callback: MixcloudWidgetEVENTCallback): void;
		};
	};

export type MixcloudWidget = {
	load(cloudcastKey: string, startPlaying: boolean): void;
	play(): void;
	pause(): void;
	togglePlay(): void;
	seek(seconds: number): Promise<boolean>;
	getPosition(): Promise<number>;
	getDuration(): Promise<number>;
	getIsPaused(): Promise<boolean>;
	ready: Promise<never>;
	events: MixcloudWidgetEVENT;
};

export type MixcloudPlayer = {
	PlayerWidget(iframe: HTMLIFrameElement): MixcloudWidget;
	noConflict(mixcloudApiObject: MixcloudPlayer): void;
	FooterWidget(url: string): Promise<MixcloudWidget>; // 7-6-23: Experimental
};

// DailyMotion types are reversed from https://github.com/cookpete/react-player
// The DailyMotion Player API has been deprecated https://github.com/dailymotion/dailymotion-sdk-js
// The new documentation is accessible at https://developers.dailymotion.com/sdks/#sdk-javascript
export type DailyMotionPlayerOptionsParams = {
	api: number;
	'endscreen-enable': boolean;
	controls: boolean;
	autoplay: boolean;
	mute: boolean;
	start: number;
	origin: string;
};

export type DailyMotionPlayerOptionsEvents = {
	apiready(event: Event): void;
	seeked(event: Event): void;
	video_end(event: Event): void;
	durationchange(event: Event): void;
	pause(event: Event): void;
	playing(event: Event): void;
	waiting(event: Event): void;
	error(event: Event): void;
};

export type DailyMotionPlayerOptions = {
	width: string;
	height: string;
	video: string;
	params: Partial<DailyMotionPlayerOptionsParams>;
	events: Partial<DailyMotionPlayerOptionsEvents>;
};

export type DailyMotionPlayerLoadOptions = {
	start: number;
	autoplay: boolean;
};

export interface DailyMotionPlayer {
	play(): void;
	pause(): void;
	seek(seconds: number): void;
	setVolume(fraction: number): void;
	setMuted(muted: boolean): void;
	load(id: string, options: Partial<DailyMotionPlayerLoadOptions>): void;
	duration: number;
	currentTime: number;
	bufferedTime: number;
}

export interface DailyMotionPlayerConstructor {
	new (container: HTMLElement, options: Partial<DailyMotionPlayerOptions>): DailyMotionPlayer;
	readonly prototype: DailyMotionPlayer;
}

export type DailyMotion = {
	player: DailyMotionPlayerConstructor;
};

export type NotImplementedPlayer = Record<string, never>;

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
	SC: SoundCloud;
	Twitch: Twitch;
	DM: DailyMotion;
	Mixcloud: MixcloudPlayer;
	Hls: HlsJS;
	dashjs: DashJS;
	flvjs: FlvJS;
};

export type GlobalSDKType = keyof GlobalSDK;

export type GlobalSDKYTKey = Extract<GlobalSDKType, 'YT'>;
export type GlobalSDKSoundCloudKey = Extract<GlobalSDKType, 'SC'>;
export type GlobalSDKTwitchKey = Extract<GlobalSDKType, 'Twitch'>;
export type GlobalSDKDailyMotionKey = Extract<GlobalSDKType, 'DM'>;
export type GlobalSDKMixcloudKey = Extract<GlobalSDKType, 'Mixcloud'>;
export type GlobalSDKHLSKey = Extract<GlobalSDKType, 'Hls'>;
export type GlobalSDKDASHKey = Extract<GlobalSDKType, 'dashjs'>;
export type GlobalSDKFLVKey = Extract<GlobalSDKType, 'flvjs'>;

export type GlobalSDKValue = GlobalSDK[GlobalSDKType];

export type GlobalSDKYT = Extract<GlobalSDKValue, YT>;
export type GlobalSDKSoundCloud = Extract<GlobalSDKValue, SoundCloud>;
export type GlobalSDKTwitch = Extract<GlobalSDKValue, Twitch>;
export type GlobalSDKDailyMotion = Extract<GlobalSDKValue, DailyMotion>;
export type GlobalSDKMixcloud = Extract<GlobalSDKValue, MixcloudPlayer>;
export type GlobalSDKHLSClass = Hls;
export type GlobalSDKHLS = Extract<GlobalSDKValue, HlsJS>;
export type GlobalSDKDASH = Extract<GlobalSDKValue, DashJS>;
export type GlobalSDKFLV = Extract<GlobalSDKValue, FlvJS>;

export type GlobalSDKReady = 'onYouTubeIframeAPIReady' | 'dmAsyncInit';

export type GlobalSDKYTReady = Extract<GlobalSDKReady, 'onYouTubeIframeAPIReady'>;
export type GlobalSDKDailyMotionReady = Extract<GlobalSDKReady, 'dmAsyncInit'>;
