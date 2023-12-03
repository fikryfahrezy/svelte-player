import type { AnyFunction } from './utility.types';

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
	data: null;
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

export type YTPlayerOnApiChangeEvent = {
	target: YTPlayer;
	data: null;
};

export type YTPlayerEvents = {
	onReady(event: YTPlayerOnReadyEvent): void;
	onStateChange(event: YTPlayerOnStateChangeEvent): void;
	onPlaybackQualityChange(event: YTPlayerOnPlaybackQualityChangeEvent): void;
	onPlaybackRateChange(event: YTPlayerOnPlaybackRateChangeEvent): void;
	onError(event: YTPlayerOnErrorEvent): void;
	onApiChange(events: YTPlayerOnApiChangeEvent): void;
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

export type OptionModuleCaptions = 'captions';
type OptionModuleCaptionsOptionObject = {
	fontSize: -1 | 0 | 1 | 2 | 3;
	reload: boolean;
};
type OptionModuleCaptionsOption = {
	[k in OptionModuleCaptions]: OptionModuleCaptionsOptionObject;
};

type GetOptionsModules = OptionModuleCaptionsOption;

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
	setSize(width: number, height: number): YTPlayer;
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
	addEventListener<E extends keyof YTPlayerEvents>(event: E, listener: YTPlayerEvents[E]): void;
	removeEventListener<E extends keyof YTPlayerEvents>(event: E, listener: AnyFunction): void;
	getIframe(): HTMLIFrameElement;
	destroy(): void;
	getOptions<TModule extends keyof GetOptionsModules>(module?: TModule): unknown;
	getOption<
		TModule extends keyof GetOptionsModules,
		TOptions extends keyof GetOptionsModules[TModule]
	>(
		module?: TModule,
		option?: TOptions
	): unknown;
	setOption<
		TModule extends keyof GetOptionsModules,
		TOptions extends keyof GetOptionsModules[TModule],
		TValue extends GetOptionsModules[TModule][TOptions]
	>(
		module?: TModule,
		option?: TOptions,
		value?: TValue
	): unknown;
}

export interface YTPlayerConstructor {
	new (container: string | HTMLElement, options?: Partial<YTPlayerOptions>): YTPlayer;
}

export type YT = {
	Player: YTPlayerConstructor;
	PlayerState: YTPlayerState;
	loaded: BooleanNumber;
};

export type YTSDKReady = 'onYouTubeIframeAPIReady';
