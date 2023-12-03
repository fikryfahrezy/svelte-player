import type { AnyFunction, Tail } from './utility.types';

// https://wistia.com/support/developers/embed-options
// https://docs.wistia.com/docs/player-controls-framework

export type WistiaTurnstileRequiredOptions = {
	topText: string; // fill with '' if want leave blank
	bottomText: string; // fill with '' if want leave blank
};

export type WistiaTurnstileVideoIndexOptionsPartial = {
	sectionIndex?: undefined; // this must be used in conjunction with `videoIndex`
	videoIndex?: undefined; // this must be used in conjunction with `sectionIndex`
};

export type WistiaTurnstileVideoIndexOptions = {
	sectionIndex: number; // this must be used in conjunction with `videoIndex`
	videoIndex: number; // this must be used in conjunction with `sectionIndex`
};

export type WistiaPluginTime = 'before' | 'end' | number; // if number then in seconds

export type WistiaTurnstileOptionalOptions = {
	time: WistiaPluginTime;
	askName: boolean;
	allowSkip: boolean;
	alwaysShow: boolean;
	invalidDomains: string;
	validDomains: string;
	emailExampleText: string;
	firstNameExampleText: string;
	lastNameExampleText: string;
};

export type WistiaTurnstileOptions = (
	| WistiaTurnstileVideoIndexOptionsPartial
	| WistiaTurnstileVideoIndexOptions
) &
	WistiaTurnstileRequiredOptions &
	Partial<WistiaTurnstileOptionalOptions>;

export type WistiaTurnstileKey = 'requireEmail-v1';

export type WistiaTurnstile = {
	[k in WistiaTurnstileKey]: WistiaTurnstileOptions;
};

export type WistiaPostRollCTAOptions = {
	text: string;
	link: string;
	autoSize: boolean;
	backgroundOpacity: number; // range between 0-1
	image: string;
	on: boolean;
	raw: string;
	rewatch: boolean;
	time: WistiaPluginTime;
};

export type WistiaPostRollCTAKey = 'postRoll-v1';

export type WistiaPostRollCTA = {
	[k in WistiaPostRollCTAKey]: Partial<WistiaPostRollCTAOptions>;
};

export type WistiaAnnotationsRequiredLink = {
	time: number;
	duration: number;
	text: string;
};

export type WistiaAnnotationsOptionalLink = {
	url: null | string | undefined;
};

export type WistiaAnnotationsLink = WistiaAnnotationsRequiredLink &
	Partial<WistiaAnnotationsOptionalLink>;

export type WistiaAnnotationsOptions = {
	links: WistiaAnnotationsLink[] | false;
};

export type WistiaAnnotationsKey = 'midrollLink-v1';

export type WistiaAnnotations = {
	[k in WistiaAnnotationsKey]: WistiaAnnotationsOptions;
};

export type WistiaLoopingVideoThumbnailOptions = {
	on: boolean;
	hashedId: string;
	trimStart: number; // in seconds
	trimEnd: number; // in seconds
	async: boolean;
};

export type WistiaLoopingVideoThumbnailKey = 'videoThumbnail';

export type WistiaLoopingVideoThumbnail = {
	[k in WistiaLoopingVideoThumbnailKey]: Partial<WistiaLoopingVideoThumbnailOptions>;
};

export type WistiaSharePluginDownloadTypeSDMP4 = 'sd_mp4';
export type WistiaSharePluginDownloadTypeHDMP4 = 'hd_mp4';
export type WistiaSharePluginDownloadTypeORIGINAL = 'original';

export type WistiaSharePluginDownloadType =
	| WistiaSharePluginDownloadTypeSDMP4
	| WistiaSharePluginDownloadTypeHDMP4
	| WistiaSharePluginDownloadTypeORIGINAL;

export type WistiaSharePluginOptions = {
	channels: string; // available options "facebook-googlePlus-twitter-email-embed-download-linkedIn"
	pageTitle: string;
	overrideUrl: 'true' | 'false';
	pageUrl: string;
	downloadType: WistiaSharePluginDownloadType;
	tweetText: string;
};

export type WistiaSharePluginKey = 'share';

export type WistiaSharePlugin = {
	[k in WistiaSharePluginKey]: Partial<WistiaSharePluginOptions>;
};

export type WistiaChaptersPluginChapter = {
	title: string;
	time: string;
};

export type WistiaChaptersPluginOptions = {
	on: boolean;
	chapterList: WistiaChaptersPluginChapter[];
};

export type WistiaChaptersPluginKey = 'chapters';

export type WistiaChaptersPlugin = {
	[k in WistiaChaptersPluginKey]: Partial<WistiaChaptersPluginOptions>;
};

export type WistiaCaptionsPluginOptions = {
	onByDefault: boolean;
	language: string; // 3 character language code specified by ISO-639–2
	'plugin[captions-v1][subtitlesScale]': number;
	transcript: boolean;
};

export type WistiaCaptionsPluginKey = 'captions-v1';

export type WistiaCaptionsPlugin = {
	[k in WistiaCaptionsPluginKey]: Partial<WistiaCaptionsPluginOptions>;
};

export type WistiaEmbedOptionsPlugin = WistiaTurnstile &
	WistiaPostRollCTA &
	WistiaAnnotations &
	WistiaLoopingVideoThumbnail &
	WistiaSharePlugin &
	WistiaChaptersPlugin &
	WistiaCaptionsPlugin;

export type EmbedLinkTransitionOption = 'fade' | 'slide' | 'crossfade' | 'none';

export type SpecialEmbedLinkOptions = {
	autoPlay: boolean;
	container: string;
	includeInPlaylist: boolean;
	transition: EmbedLinkTransitionOption;
	transitionTime: number; // total time in milliseconds
};

export type SpecialPlaylistOptions = {
	playlistLinks: string; // Accepts any string, but “auto” and “manual” are special values
	playlistLoop: boolean;
};

export type WistiaEmbedEndVideoBehaviorOption = 'default' | 'reset' | 'loop';
export type WistiaEmbedFitStrategyOption = 'contain' | 'cover' | 'fill' | 'none';
export type WistiaEmbedPreloadOption = 'metadata' | 'auto' | 'none' | 'true' | 'false';
export type WistiaQualityOption = number; // 224 | 360 | 540 | 720 | 1080 | 3840 or any number;
export type WistiaResumableOption = 'true' | 'false' | 'auto';
export type WistiaSilentAutoPlayOption = 'true' | 'false' | 'allow';
export type WistiaTimeOption = string | number; // number in seconds or string like "5m45s"
export type WistiaVideoFoamWidth = {
	minWidth: number;
	maxWidth: number;
};
export type WistiaVideoFoamHeight = {
	minHeight: number;
	maxHeight: number;
};
export type WistiaVideoFoamOption = boolean | WistiaVideoFoamWidth | WistiaVideoFoamHeight;

export type WistiaEmbedOptions = {
	autoPlay: boolean;
	controlsVisibleOnLoad: boolean;
	copyLinkAndThumbnailEnabled: boolean;
	doNotTrack: boolean;
	email: string;
	endVideoBehavior: WistiaEmbedEndVideoBehaviorOption;
	fakeFullscreen: boolean;
	fitStrategy: WistiaEmbedFitStrategyOption;
	fullscreenButton: boolean;
	fullscreenOnRotateToLandscape: boolean;
	keyMoments: boolean;
	muted: boolean;
	playbackRateControl: boolean;
	playbar: boolean;
	playButton: boolean;
	playerColor: string; // hexadecimal color
	playlistLinks: SpecialPlaylistOptions['playlistLinks'];
	playlistLoop: boolean;
	playsinline: boolean;
	playPauseNotifier: boolean;
	playSuspendedOffScreen: boolean;
	'plugin[videoThumbnail][clickToPlayButton]': boolean;
	preload: WistiaEmbedPreloadOption;
	qualityControl: boolean;
	qualityMax: WistiaQualityOption;
	qualityMin: WistiaQualityOption;
	resumable: WistiaResumableOption;
	seo: boolean;
	settingsControl: boolean;
	silentAutoPlay: WistiaSilentAutoPlayOption;
	smallPlayButton: boolean;
	stillUrl: string;
	time: WistiaTimeOption;
	thumbnailAltText: string;
	videoFoam: boolean;
	volume: number; // range between 0-1
	volumeControl: boolean;
	wmode: string; // like "transparent"
	plugin: WistiaEmbedOptionsPlugin;
};

type WistiaNoDataListenerCb<E> = (event: E, callback: AnyFunction) => void | AnyFunction;

export type WistiaBEFOREREMOVEEvent = 'beforeremove';
type WistiaBEFOREREMOVEListener<E extends WistiaBEFOREREMOVEEvent = WistiaBEFOREREMOVEEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaBEFOREREPLACEEvent = 'beforereplace';
type WistiaBEFOREREPLACEListener<E extends WistiaBEFOREREPLACEEvent = WistiaBEFOREREPLACEEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaCANCELFULLSCREENEvent = 'cancelfullscreen';
type WistiaCANCELFULLSCREENListener<
	E extends WistiaCANCELFULLSCREENEvent = WistiaCANCELFULLSCREENEvent
> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaENDEvent = 'end';
type WistiaENDListener<E extends WistiaENDEvent = WistiaENDEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaENTERFULLSCREEEvent = 'enterfullcreen';
type WistiaENTERFULLSCREEListener<E extends WistiaENTERFULLSCREEEvent = WistiaENTERFULLSCREEEvent> =
	{
		bind: {
			[k in E]: WistiaNoDataListenerCb<k>;
		};
		unbind: {
			[k in E]: WistiaNoDataListenerCb<k>;
		};
	};

export type WistiaHEIGHTCHANGEEvent = 'heightchange';
type WistiaHEIGHTCHANGEListener<E extends WistiaHEIGHTCHANGEEvent = WistiaHEIGHTCHANGEEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaPAUSEEvent = 'pause';
type WistiaPAUSEListener<E extends WistiaPAUSEEvent = WistiaPAUSEEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaPLAYEvent = 'play';
type WistiaPLAYListener<E extends WistiaPLAYEvent = WistiaPLAYEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaWIDTHCHANGEEvent = 'widthchange';
type WistiaWIDTHCHANGEListener<E extends WistiaWIDTHCHANGEEvent = WistiaWIDTHCHANGEEvent> = {
	bind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaBETWEENTIMESEvent = 'betweentimes';
export type WistiaBETWEENTIMESEventCallback = (data: boolean) => void;
type WistiaBETWEENTIMESListenerFn<
	TEvent,
	TReturn extends void | AnyFunction = void | AnyFunction
> = (
	event: TEvent,
	timeStart: number,
	timeEnd: number,
	callback: WistiaBETWEENTIMESEventCallback
) => TReturn;
type WistiaBETWEENTIMESListener<E extends WistiaBETWEENTIMESEvent = WistiaBETWEENTIMESEvent> = {
	bind: {
		[k in E]: WistiaBETWEENTIMESListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaBETWEENTIMESListenerFn<k, void>;
	};
};

export type WistiaCAPTIONSCHANGEEvent = 'captionschange';
export type WistiaCAPTIONSCHANGEEventCallbackData = {
	visible: boolean;
	language: string;
};
export type WistiaCAPTIONSCHANGEEventCallback = (
	data: WistiaCAPTIONSCHANGEEventCallbackData
) => void;
type WistiaCAPTIONSCHANGEListenerFn<E> = (
	event: E,
	callback: WistiaCAPTIONSCHANGEEventCallback
) => void | AnyFunction;
type WistiaCAPTIONSCHANGEListener<E extends WistiaCAPTIONSCHANGEEvent = WistiaCAPTIONSCHANGEEvent> =
	{
		bind: {
			[k in E]: WistiaCAPTIONSCHANGEListenerFn<k>;
		};
		unbind: {
			[k in E]: WistiaNoDataListenerCb<k>;
		};
	};

export type WistiaCONVERSIONEvent = 'conversion';
export type WistiaCONVERSIONEventCallbackTypeData =
	| 'pre-roll-email'
	| 'mid-roll-email'
	| 'post-roll-email';
export type WistiaCONVERSIONEventCallback = (
	type: WistiaCONVERSIONEventCallbackTypeData,
	email: string,
	firstName: string,
	lastName: string
) => void;
type WistiaCONVERSIONListenerFn<E> = (
	event: E,
	callback: WistiaCONVERSIONEventCallback
) => void | AnyFunction;
type WistiaCONVERSIONListener<E extends WistiaCONVERSIONEvent = WistiaCONVERSIONEvent> = {
	bind: {
		[k in E]: WistiaCONVERSIONListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaCROSSTIMEEvent = 'crosstime';
type WistiaCROSSTIMEListenerFn<TEvent, TReturn extends void | AnyFunction = void | AnyFunction> = (
	event: TEvent,
	time: number,
	callback: AnyFunction
) => TReturn;
type WistiaCROSSTIMEListener<E extends WistiaCROSSTIMEEvent = WistiaCROSSTIMEEvent> = {
	bind: {
		[k in E]: WistiaCROSSTIMEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaCROSSTIMEListenerFn<k, void>;
	};
};

export type WistiaLOOKCHANGEEvent = 'lookchange';
export type WistiaLOOKCHANGEEventCallbackData = {
	heading: number;
	pitch: number;
	fov: number;
};
export type WistiaLOOKCHANGEEventCallback = (data: WistiaLOOKCHANGEEventCallbackData) => void;
type WistiaLOOKCHANGEListenerFn<E> = (
	event: E,
	callback: WistiaLOOKCHANGEEventCallback
) => void | AnyFunction;
type WistiaLOOKCHANGEListener<E extends WistiaLOOKCHANGEEvent = WistiaLOOKCHANGEEvent> = {
	bind: {
		[k in E]: WistiaLOOKCHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaMUTECHANGEEvent = 'mutechange';
export type WistiaMUTECHANGEEventCallback = (data: boolean) => void;
type WistiaMUTECHANGEListenerFn<E> = (
	event: E,
	callback: WistiaMUTECHANGEEventCallback
) => void | AnyFunction;
type WistiaMUTECHANGEListener<E extends WistiaMUTECHANGEEvent = WistiaMUTECHANGEEvent> = {
	bind: {
		[k in E]: WistiaMUTECHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaPERCENTWATCHEDCHANGEDEvent = 'percentwatchedchanged';
export type WistiaPERCENTWATCHEDCHANGEDEventCallback = (
	percent: number,
	lastPercent: number
) => void;
type WistiaPERCENTWATCHEDCHANGEDListenerFn<E> = (
	event: E,
	callback: WistiaPERCENTWATCHEDCHANGEDEventCallback
) => void | AnyFunction;
type WistiaPERCENTWATCHEDCHANGEDListener<
	E extends WistiaPERCENTWATCHEDCHANGEDEvent = WistiaPERCENTWATCHEDCHANGEDEvent
> = {
	bind: {
		[k in E]: WistiaPERCENTWATCHEDCHANGEDListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaPLAYBACKRATECHANGEEvent = 'playbackratechange';
export type WistiaPLAYBACKRATECHANGEEventCallback = (data: number) => void;
type WistiaPLAYBACKRATECHANGEListenerFn<E> = (
	event: E,
	callback: WistiaPLAYBACKRATECHANGEEventCallback
) => void | AnyFunction;
type WistiaPLAYBACKRATECHANGEListener<
	E extends WistiaPLAYBACKRATECHANGEEvent = WistiaPLAYBACKRATECHANGEEvent
> = {
	bind: {
		[k in E]: WistiaPLAYBACKRATECHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaSECONDSCHANGEEvent = 'secondschange';
export type WistiaSECONDSCHANGEEventCallback = (data: number) => void;
type WistiaSECONDSCHANGEListenerFn<E> = (
	event: E,
	callback: WistiaSECONDSCHANGEEventCallback
) => void | AnyFunction;
type WistiaSECONDSCHANGEListener<E extends WistiaSECONDSCHANGEEvent = WistiaSECONDSCHANGEEvent> = {
	bind: {
		[k in E]: WistiaSECONDSCHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaSEEKEvent = 'seek';
export type WistiaSEEKEventCallback = (currentTime: number, lastTime: number) => void;
type WistiaSEEKListenerFn<E> = (event: E, callback: WistiaSEEKEventCallback) => void | AnyFunction;
type WistiaSEEKListener<E extends WistiaSEEKEvent = WistiaSEEKEvent> = {
	bind: {
		[k in E]: WistiaSEEKListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaSILENTPLAYBACKMODECHANGEEvent = 'silentplaybackmodechange';
export type WistiaSILENTPLAYBACKMODECHANGEEventCallback = (data: boolean) => void;
type WistiaSILENTPLAYBACKMODECHANGEListenerFn<E> = (
	event: E,
	callback: WistiaSILENTPLAYBACKMODECHANGEEventCallback
) => void | AnyFunction;
type WistiaSILENTPLAYBACKMODECHANGEListener<
	E extends WistiaSILENTPLAYBACKMODECHANGEEvent = WistiaSILENTPLAYBACKMODECHANGEEvent
> = {
	bind: {
		[k in E]: WistiaSILENTPLAYBACKMODECHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaTIMECHANGEEvent = 'timechange';
export type WistiaTIMECHANGEEventCallback = (data: number) => void;
type WistiaTIMECHANGEListenerFn<E> = (
	event: E,
	callback: WistiaTIMECHANGEEventCallback
) => void | AnyFunction;
type WistiaTIMECHANGEListener<E extends WistiaTIMECHANGEEvent = WistiaTIMECHANGEEvent> = {
	bind: {
		[k in E]: WistiaTIMECHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

export type WistiaVOLUMECHANGEEvent = 'volumechnage';
export type WistiaVOLUMECHANGEEventCallback = (volume: number, isMuted: boolean) => void;
type WistiaVOLUMECHANGEListenerFn<E> = (
	event: E,
	callback: WistiaVOLUMECHANGEEventCallback
) => void | AnyFunction;
type WistiaVOLUMECHANGEListener<E extends WistiaVOLUMECHANGEEvent = WistiaVOLUMECHANGEEvent> = {
	bind: {
		[k in E]: WistiaVOLUMECHANGEListenerFn<k>;
	};
	unbind: {
		[k in E]: WistiaNoDataListenerCb<k>;
	};
};

type WistiaListeners = WistiaBEFOREREMOVEListener['bind'] &
	WistiaBEFOREREPLACEListener['bind'] &
	WistiaBETWEENTIMESListener['bind'] &
	WistiaCANCELFULLSCREENListener['bind'] &
	WistiaCAPTIONSCHANGEListener['bind'] &
	WistiaCONVERSIONListener['bind'] &
	WistiaCROSSTIMEListener['bind'] &
	WistiaENDListener['bind'] &
	WistiaENTERFULLSCREEListener['bind'] &
	WistiaHEIGHTCHANGEListener['bind'] &
	WistiaLOOKCHANGEListener['bind'] &
	WistiaMUTECHANGEListener['bind'] &
	WistiaPAUSEListener['bind'] &
	WistiaPERCENTWATCHEDCHANGEDListener['bind'] &
	WistiaPLAYListener['bind'] &
	WistiaPLAYBACKRATECHANGEListener['bind'] &
	WistiaSECONDSCHANGEListener['bind'] &
	WistiaSEEKListener['bind'] &
	WistiaSILENTPLAYBACKMODECHANGEListener['bind'] &
	WistiaTIMECHANGEListener['bind'] &
	WistiaVOLUMECHANGEListener['bind'] &
	WistiaWIDTHCHANGEListener['bind'];

type WistiaUnbind = WistiaBEFOREREMOVEListener['unbind'] &
	WistiaBEFOREREPLACEListener['unbind'] &
	WistiaBETWEENTIMESListener['unbind'] &
	WistiaCANCELFULLSCREENListener['unbind'] &
	WistiaCAPTIONSCHANGEListener['unbind'] &
	WistiaCONVERSIONListener['unbind'] &
	WistiaCROSSTIMEListener['unbind'] &
	WistiaENDListener['unbind'] &
	WistiaENTERFULLSCREEListener['unbind'] &
	WistiaHEIGHTCHANGEListener['unbind'] &
	WistiaLOOKCHANGEListener['unbind'] &
	WistiaMUTECHANGEListener['unbind'] &
	WistiaPAUSEListener['unbind'] &
	WistiaPERCENTWATCHEDCHANGEDListener['unbind'] &
	WistiaPLAYListener['unbind'] &
	WistiaPLAYBACKRATECHANGEListener['unbind'] &
	WistiaSECONDSCHANGEListener['unbind'] &
	WistiaSEEKListener['unbind'] &
	WistiaSILENTPLAYBACKMODECHANGEListener['unbind'] &
	WistiaTIMECHANGEListener['unbind'] &
	WistiaVOLUMECHANGEListener['unbind'] &
	WistiaWIDTHCHANGEListener['unbind'];

export type WistiaAddToPlaylistBeforeHashedIdPosition = {
	before: string;
};

export type WistiaAddToPlaylistAfterHashedIdPosition = {
	after: string;
};

export type WistiaAddToPlaylistIndexPosition = {
	index: number;
};

export type WistiaAddToPlaylistPosition =
	| WistiaAddToPlaylistBeforeHashedIdPosition
	| WistiaAddToPlaylistAfterHashedIdPosition
	| WistiaAddToPlaylistIndexPosition;

export type WistiaHeightOption = {
	constrain: boolean;
};

export type WistiaLookOption = WistiaLOOKCHANGEEventCallbackData & {
	tween: boolean;
};

export type WistiaPlayerState = 'beforeplay' | 'playing' | 'paused' | 'ended';

// https://wistia.com/support/developers/player-api
export type WistiaPlayer = {
	addToPlaylist(
		hashedId: string,
		options?: Partial<WistiaEmbedOptions>,
		position?: WistiaAddToPlaylistPosition
	): void;
	aspect(): number; // ratio (width/height) originally uploaded video
	bind<E extends keyof WistiaListeners>(
		event: E,
		...restParams: Tail<Parameters<WistiaListeners[E]>>
	): void;
	cancelFullscreen(): void;
	duration(): number;
	email(): string | null; // return null if hasData() is true
	email(email: string): void;
	embedded(): boolean;
	eventKey(): string;
	getSubtitlesScale(): number;
	hasData(): boolean;
	hashedId(): string;
	height(): number;
	height(height: number, options?: Partial<WistiaHeightOption>): void;
	inFullscreen(): boolean;
	isMuted(): boolean;
	look(): WistiaLOOKCHANGEEventCallbackData;
	look(options: Partial<WistiaLookOption>): void;
	mute(): void;
	name(): string | null; // return null if hasData() is true
	pause(): void;
	percentWatched(): number; // range between 0-1
	play(): void;
	playbackRate(rate: number /* 0 to infinity */): void;
	ready(): boolean;
	remove(): void;
	replaceWith(hasedId: string, options?: Partial<SpecialEmbedLinkOptions>): void;
	requestFullscreen(): void;
	secondsWatched(): number;
	secondsWatchedVector(): number[];
	setSubtitlesScale(scale: number): void;
	state(): WistiaPlayerState;
	time(): number; // in seconds
	time(seconds: number): void;
	unbind<E extends keyof WistiaUnbind>(
		event: E,
		...restParams: Tail<Parameters<WistiaUnbind[E]>>
	): void;
	unmute(): void;
	videoHeight(): number; // in pixels
	videoHeight(pixels: number, options?: Partial<WistiaHeightOption>): void;
	videoQuality(): WistiaQualityOption;
	videoQuality(quality: WistiaQualityOption): void;
	videoWidth(): number; // in pixels
	videoWidth(pixels: number, options?: Partial<WistiaHeightOption>): void;
	visitorKey(): string;
	volume(): number; // range between 0-1
	volume(volume: number /* range between 0-1 */): void;
	width(): number; // in pixels
	width(pixels: number): void;
};

// The types are not defined in API reference page
// these `unknown` types just placeholder
export type WistiaPlayerControllVideo = Record<string, unknown> & {
	requestControls(requesterName: unknown): unknown;
	releaseControls(requesterName: unknown): unknown;
	enterInputContext(context: string): void;
	exitInputContext(context: string): void;
	getInputContext(): string;
	setControlEnabled(handle: string, enabled: boolean): void;
	whenControlMounted: Promise<string>;
	getControl(handle: string): unknown;
};

export type WistiaPlayerControlType =
	| 'control-bar-left'
	| 'control-bar-right'
	| 'background'
	| 'foreground'
	| 'above-control-bar'
	| 'right-flyout'
	| 'left-flyout';

export type WistiaPlayerControlClassRequiredProperties = {
	handle: string;
	type: WistiaPlayerControlType;
};

export type WistiaPlayerControlClassOptionalProperties = {
	isVideoChrome: boolean;
	sortValue: number;
	width: string | number;
};

export type WistiaPlayerControlClassOptionalFunctions = {
	shouldMount(video: WistiaPlayerControllVideo): boolean;
};

export type WistiaPlayerControlClassProperties = WistiaPlayerControlClassRequiredProperties &
	Partial<WistiaPlayerControlClassOptionalProperties>;
export type WistiaPlayerControlClassFunctions = Partial<WistiaPlayerControlClassOptionalFunctions>;

export type WistiaPlayerControlTypeControlPropsPartial = {
	width?: undefined;
	height?: undefined;
	left?: undefined;
	top?: undefined;
};

export type WistiaPlayerControlTypeControlProps = {
	width: number;
	height: number;
	left: number;
	top: number;
};

// The values type is not defined in API reference page
// these values type may be incorrect
export type WistiaPlayerControlSharedProps = {
	chromeless: boolean;
	controlBarHeight: number;
	controlsAreVisible: boolean;
	playerLanguage: string;
	scale: number;
	videoHeight: number;
	videoWidth: number;
};

export type WistiaPlayerControlDefaultProps = (
	| WistiaPlayerControlTypeControlPropsPartial
	| WistiaPlayerControlTypeControlProps
) &
	WistiaPlayerControlSharedProps &
	Record<string, unknown>;

export type WistiaPlayerControlCustomInstanceOptionalProperties = {
	buttonElement: HTMLElement;
	mounted: Promise<unknown>;
	props: WistiaPlayerControlDefaultProps;
};

export type WistiaPlayerControlCustomInstanceProperties =
	Partial<WistiaPlayerControlCustomInstanceOptionalProperties>;

export type WistiaPlayerControlCustomInstanceOptionalFunctions = {
	mount(controlRoot: HTMLElement): void;
	buttonMount(buttonRoot: HTMLElement): void;
	mountDialog(dialogRoot: HTMLElement): void;
	onControlPropsUpdated(prevProps: WistiaPlayerControlDefaultProps): void;
	destroy(): void;
	onClickButton(event: unknown): void;
	setButtonLabel(label: string): void;
	controlDialogWillOpen(): void;
	controlDialogOpened(): void;
	controlDialogWillClose(): void;
	controlDialogClosed(): void;
};

export type WistiaPlayerControlCustomInstanceFunctions =
	Partial<WistiaPlayerControlCustomInstanceOptionalFunctions>;

export type WistiaPlayerControlProperties = WistiaPlayerControlClassProperties &
	WistiaPlayerControlCustomInstanceProperties;

export type WistiaPlayerControlFunctions = WistiaPlayerControlClassFunctions &
	WistiaPlayerControlCustomInstanceFunctions;

export interface WistiaPlayerControl
	extends WistiaPlayerControlProperties,
		WistiaPlayerControlFunctions {}

export type WistiaWQ = {
	id: string;
	options: Partial<WistiaEmbedOptions>;
	onReady(video: WistiaPlayer): void;
	onHasData(video: WistiaPlayer): void;
	// this method stated in doc, but don't find the reference
	// so not sure if the types correct or not
	onEmbedded(video: WistiaPlayer): void;
	revoke: WistiaWQ;
};

export type Wistia = {
	defineControl(control: WistiaPlayerControl): void;
};
