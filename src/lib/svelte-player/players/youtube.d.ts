// See more about YouTube's IFrame API here:
// https://developers.google.com/youtube/iframe_api_reference

type BooleanNumber = 0 | 1;

type YTPlayerOnErrorValue = 2 | 5 | 100 | 101 | 150;

type YTPlaybackRate = 0.25 | 0.5 | 1 | 1.5 | 2;

type YTListPlaylistType = 'playlist';

type YTListUserUploadsType = 'user_uploads';

type YTListType = YTListPlaylistType | YTListUserUploadsType;

type YTPlaybackQualityValue = 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';

type YTPlayerState = {
	UNSTARTED: -1;
	ENDED: 0;
	PLAYING: 1;
	PAUSED: 2;
	BUFFERING: 3;
	CUED: 5;
};

type YTPlayerStateValue = YTPlayerState[keyof YTPlayerState];

type YTPlayerPlayerVars = {
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

type YTPlayerOnReadyEvent = {
	target: YTPlayer;
};

type YTPlayerOnStateChangeEvent = {
	target: YTPlayer;
	data: YTPlayerStateValue;
};

type YTPlayerOnPlaybackQualityChangeEvent = {
	target: YTPlayer;
	data: YTPlaybackQualityValue;
};

type YTPlayerOnPlaybackRateChangeEvent = {
	target: YTPlayer;
	data: number;
};

type YTPlayerOnErrorEvent = {
	target: YTPlayer;
	data: YTPlayerOnErrorValue;
};

type YTPlayerEvents = {
	onReady(event: YTPlayerOnReadyEvent): void;
	onStateChange(event: YTPlayerOnStateChangeEvent): void;
	onPlaybackQualityChange(event: YTPlayerOnPlaybackQualityChangeEvent): void;
	onPlaybackRateChange(event: YTPlayerOnPlaybackRateChangeEvent): void;
	onError(event: YTPlayerOnErrorEvent): void;
	onApiChange(events: unknown): void; // TODO: to implement corrent type
};

type YTPlayerOptions = {
	height: string;
	width: string;
	videoId: string;
	playerVars: Partial<YTPlayerPlayerVars>;
	events: Partial<YTPlayerEvents>;
};

type CueVideoByIDParams = {
	videoId: string;
	startSeconds?: number;
	endSeconds?: number;
};

type LoadVideoByIDParams = {
	videoId: string;
	startSeconds?: number;
	endSeconds?: number;
};

type CueVideoByUrlParams = {
	mediaContentUrl: string;
	startSeconds?: number;
	endSeconds?: number;
};

type LoadVideoByUrlParams = {
	mediaContentUrl: string;
	startSeconds?: number;
	endSeconds?: number;
};

type CuePlaylistParams = {
	listType?: YTListType;
	list: string;
	index?: number;
	startSeconds?: number;
};

type LoadPlaylistParams = {
	list: string;
	listType?: YTListType;
	index?: number;
	startSeconds?: number;
};

type SphericalObject = {
	yaw: number; // between 0 - 360
	pitch: number; // between -90 - 90
	roll: number; // between -180 - 180
	fov: number; // between 30 - 120
};

type SetSphericalPropertiesParams = SphericalObject & {
	enableOrientationSensor?: boolean;
};

interface YTPlayer {
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
	playVideoAt(index: number): Void;
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
	addEventListener(event: string, listener: string | function): void;
	removeEventListener(event: string, listener: string | function): void;
	getIframe(): HTMLIFrameElement;
	destroy(): void;
}

interface YTPlayerConstructor {
	new (container: string | HTMLElement, options?: Partial<YTPlayerOptions>): YTPlayer;
	readonly prototype: YTPlayer;
}

type YT = {
	Player: YTPlayerConstructor;
	PlayerState: YTPlayerState;
	loaded: BooleanNumber;
	loading: BooleanNumber;
	ready: function; // TODO: to impelment corrent type
	scan: function; // TODO: to impelment corrent type
	setConfig: function; // TODO: to impelment corrent type
	subscribe: function; // TODO: to impelment corrent type
	unsubscribe: function; // TODO: to impelment corrent type
};
