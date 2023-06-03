type BooleanNumber = 0 | 1;

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
	listType: 'playlist' | 'user_uploads';
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

type YTPlayerState = {
	ENDED: 0;
	PLAYING: 1;
	PAUSED: 2;
	BUFFERING: 3;
	CUED: 5;
};

type YTPlayerStateValue =
	| -1
	| YTPlayerState['ENDED']
	| YTPlayerState['PLAYING']
	| YTPlayerState['PAUSED']
	| YTPlayerState['BUFFERING']
	| YTPlayerState['CUED'];

type YTPlayerOnStateChangeEvent = {
	target: YTPlayer;
	data: YTPlayerStateValue;
};

type YTPlaybackQualityValue = 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';

type YTPlayerOnPlaybackQualityChangeEvent = {
	target: YTPlayer;
	data: YTPlaybackQualityValue;
};

type YTPlayerOnPlaybackRateChangeEvent = {
	target: YTPlayer;
	data: number;
};

type YTPlayerOnErrorValue = 2 | 5 | 100 | 101 | 150;

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
	onApiChange(events: unknown): void;
};

type YTPlayerOptions = {
	height: string;
	width: string;
	videoId: string;
	playerVars: Partial<YTPlayerPlayerVars>;
	events: Partial<YTPlayerEvents>;
};

interface YTPlayer {
	loadVideoById(): void;
}

interface YTPlayerConstructor {
	new (container: string | HTMLElement, options?: Partial<YTPlayerOptions>): YTPlayer;
	readonly prototype: YTPlayer;
}

type YT = {
	Player: YTPlayerConstructor;
	PlayerState: YTPlayerState;
};
