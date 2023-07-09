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

// https://developers.facebook.com/docs/plugins/embedded-video-player/api/
export type FacebookPlayerSubscribeStartedPlayingEvent = 'startedPlaying';
export type FacebookPlayerSubscribePausedEvent = 'paused';
export type FacebookPlayerSubscribeFinishedPlayingEvent = 'finishedPlaying';
export type FacebookPlayerSubscribeStartedBufferingEvent = 'startedBuffering';
export type FacebookPlayerSubscribeFinishedBufferingEvent = 'finishedBuffering';
export type FacebookPlayerSubscribeErrorEvent = 'error';

export type FacebookPlayerSubscribeEvents =
	| FacebookPlayerSubscribeStartedPlayingEvent
	| FacebookPlayerSubscribePausedEvent
	| FacebookPlayerSubscribeFinishedPlayingEvent
	| FacebookPlayerSubscribeStartedBufferingEvent
	| FacebookPlayerSubscribeFinishedBufferingEvent
	| FacebookPlayerSubscribeErrorEvent;

export type FacebookPlayerSubscribeCallback = () => void;

export type FacebookPlayerSubscribeErrorCallback = (error: unknown) => void;

export type FacebookPlayerSubscribeReturn = {
	release(event: FacebookPlayerSubscribeEvents): void;
};

export type FacebookPlayer = {
	play(): void;
	pause(): void;
	seek(seconds: number): void;
	mute(): void;
	unmute(): void;
	isMuted(): boolean;
	setVolume(volume: number /* from 0 to 1 */): void;
	getVolume(): number; // from 0 to 1
	getCurrentPosition(): number; // return video time position in seconds
	getDuration(): number; // return video duration in seconds
	subscribe(
		event: Exclude<FacebookPlayerSubscribeEvents, FacebookPlayerSubscribeErrorEvent>,
		callback: FacebookPlayerSubscribeCallback
	): FacebookPlayerSubscribeReturn;
	subscribe(
		event: FacebookPlayerSubscribeErrorEvent,
		callback: FacebookPlayerSubscribeErrorCallback
	): FacebookPlayerSubscribeReturn;
};

export type FacebookInitOptions = {
	appId: string;
	xfbml: boolean;
	version: string;
};

export type FacebookXFBMLReadyEvent = 'xfbml.ready';

// This not in documentation but there is this event
// Copied from https://github.com/cookpete/react-player
export type FacebookXFBMLRenderEvent = 'xfbml.render';

export type FacebookSubscribeEvents = FacebookXFBMLReadyEvent | FacebookXFBMLRenderEvent;

export type FacebookSubscribeCallbackMsg = {
	instance: FacebookPlayer;
	type: string;
	id: string;
};

export type FacebookSubscribeReadyCallback = (msg: FacebookSubscribeCallbackMsg) => void;

export type FacebookSubscribeRenderCallback = (msg: number) => void;

export type FacebookEvent = {
	subscribe(event: FacebookXFBMLReadyEvent, callback: FacebookSubscribeReadyCallback): void;
	subscribe(event: FacebookXFBMLRenderEvent, callback: FacebookSubscribeRenderCallback): void;
};

export type FacebookXFBML = {
	parse(): void;
};

export type Facebook = {
	init(options: FacebookInitOptions): void;
	Event: FacebookEvent;
	XFBML: FacebookXFBML;
};

// https://developer.vimeo.com/player/sdk/reference

export type VimeoEmbedIDOption = {
	id: number;
};

export type VimeoEmbedURLOption = {
	url: string;
};

export type VimeoEmbedOptions = (VimeoEmbedIDOption | VimeoEmbedURLOption) & {
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

export type VimeoPlayerNoDataEventEvents = VimeoPlayerBUFFERENDEvent | VimeoPlayerBUFFERSTARTEvent;

export type VimeoPlayerProgressEvents =
	| VimeoPlayerENDEDEvent
	| VimeoPlayerPAUSEEvent
	| VimeoPlayerPLAYEvent
	| VimeoPlayerPROGRESSEvent;

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

export type ViemoPlayerNoDataEventCallback = () => void;

export type ViemoPlayerWithDataEventCallback<T> = (data: T) => void;

export type VimeoPlayerPROGRESSEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerPROGRESSEventCallbackData>;

export type VimeoPlayerERROREventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerERROREventCallbackData>;

export type VimeoPlayerLOADEDEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerLOADEDEventCallbackData>;

export type VimeoPlayerPLAYBACKRATECHANGEEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerPLAYBACKRATECHANGEEventCallbackData>;

export type VimeoPlayerVOLUMECHANGEEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerVOLUMECHANGEEventCallbackData>;

export type VimeoPlayerCHAPTERCHANGEEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerChapter>;

export type VimeoPlayerCUECHANGEEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerCUECHANGEEventCallbackData>;

export type VimeoPlayerCUEPOINTEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerCuePoint>;

export type VimeoPlayerTEXTTRACKCHANGEEventCallback =
	ViemoPlayerWithDataEventCallback<VimeoPlayerTEXTTRACKCHANGEEventCallbackData>;

export type VimeoPlayerSetAutopauseParams<T extends VimeoEmbedOptions['autopause']> = {
	autopause: T;
};

export type VimeoPlayer = {
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
	enableTextTrack(language: string, kind: string): Promise<VimeoPlayerTextTrack>;
	getTextTracks(): Promise<VimeoPlayerTextTrack[]>;
	on(event: VimeoPlayerNoDataEventEvents, callback: ViemoPlayerNoDataEventCallback): void;
	on(event: VimeoPlayerProgressEvents, callback: VimeoPlayerPROGRESSEventCallback): void;
	on(event: VimeoPlayerERROREvent, callback: VimeoPlayerERROREventCallback): void;
	on(event: VimeoPlayerLOADEDEvent, callback: VimeoPlayerLOADEDEventCallbackData): void;
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
	SC: SoundCloud;
	Vimeo: VimeoPlayer;
	FB: Facebook;
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
export type GlobalSDKVimeoKey = Extract<GlobalSDKType, 'Vimeo'>;
export type GlobalSDKFacebookKey = Extract<GlobalSDKType, 'FB'>;
export type GlobalSDKTwitchKey = Extract<GlobalSDKType, 'Twitch'>;
export type GlobalSDKDailyMotionKey = Extract<GlobalSDKType, 'DM'>;
export type GlobalSDKMixcloudKey = Extract<GlobalSDKType, 'Mixcloud'>;
export type GlobalSDKHLSKey = Extract<GlobalSDKType, 'Hls'>;
export type GlobalSDKDASHKey = Extract<GlobalSDKType, 'dashjs'>;
export type GlobalSDKFLVKey = Extract<GlobalSDKType, 'flvjs'>;

export type GlobalSDKValue = GlobalSDK[GlobalSDKType];

export type GlobalSDKYT = Extract<GlobalSDKValue, YT>;
export type GlobalSDKSoundCloud = Extract<GlobalSDKValue, SoundCloud>;
export type GlobalSDKVimeo = Extract<GlobalSDKValue, VimeoPlayer>;
export type GlobalSDKFacebook = Extract<GlobalSDKValue, Facebook>;
export type GlobalSDKTwitch = Extract<GlobalSDKValue, Twitch>;
export type GlobalSDKDailyMotion = Extract<GlobalSDKValue, DailyMotion>;
export type GlobalSDKMixcloud = Extract<GlobalSDKValue, MixcloudPlayer>;
export type GlobalSDKHLSClass = Hls;
export type GlobalSDKHLS = Extract<GlobalSDKValue, HlsJS>;
export type GlobalSDKDASH = Extract<GlobalSDKValue, DashJS>;
export type GlobalSDKFLV = Extract<GlobalSDKValue, FlvJS>;

export type GlobalSDKReady = 'onYouTubeIframeAPIReady' | 'dmAsyncInit' | 'fbAsyncInit';

export type GlobalSDKYTReady = Extract<GlobalSDKReady, 'onYouTubeIframeAPIReady'>;
export type GlobalSDKDailyMotionReady = Extract<GlobalSDKReady, 'dmAsyncInit'>;
export type GlobalSDKFacebookReady = Extract<GlobalSDKReady, 'fbAsyncInit'>;

export type NotImplementedPlayer = Record<string, never>;
