// https://wistia.com/support/developers/embed-options
export type WistiaTurnstileRequiredOptions = {
	topText: string; // fill with '' if want leave blank
	bottomText: string; // fill with '' if want leave blank
};

export type WistiaTurnstileVideoIndexUndefinedOptions = {
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
	| WistiaTurnstileVideoIndexUndefinedOptions
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

// https://wistia.com/support/developers/player-api
export type WistiaPlayer = {
	addToPlaylist(): any;
	aspect(): any;
	bind(): any;
	cancelFullscreen(): any;
	duration(): any;
	email(): any;
	email(): any;
	embedded(): any;
	eventKey(): any;
	getSubtitlesScale(): any;
	hasData(): any;
	hashedId(): any;
	height(): any;
	height(): any;
	inFullscreen(): any;
	isMuted(): any;
	isMuted(): any;
	look(): any;
	mute(): any;
	name(): any;
	pause(): any;
	percentWatched(): any;
	play(): any;
	playbackRate(): any;
	ready(): any;
	remove(): any;
	replaceWith(): any;
	requestFullscreen(): any;
	revoke(): any;
	secondsWatched(): any;
	secondsWatchedVector(): any;
	setSubtitlesScale(): any;
	state(): any;
	time(): any;
	time(): any;
	unbind(): any;
	unbind(): any;
	videoHeight(): any;
	videoHeight(): any;
	videoQuality(): any;
	videoQuality(): any;
	videoWidth(): any;
	videoWidth(): any;
	visitorKey(): any;
	volume(): any;
	volume(): any;
	width(): any;
	width(): any;
};

export type WistiaWQ = {
	id: string;
	options?: Partial<WistiaEmbedOptions>;
	onReady?(video: WistiaPlayer): void;
	onHasData?(video: WistiaPlayer): void;
};

export type Wistia = Record<string, never>;
