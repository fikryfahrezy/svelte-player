// https://developers.soundcloud.com/docs/api/html5-widget

export type SoundCloudWidgetEvents = {
	LOAD_PROGRESS: 'loadProgress';
	PLAY_PROGRESS: 'playProgress';
	PLAY: 'play';
	PAUSE: 'pause';
	FINISH: 'finish';
	SEEK: 'seek';
	READY: 'ready';
	CLICK_DOWNLOAD: 'downloadClicked';
	CLICK_BUY: 'buyClicked';
	OPEN_SHARE_PANEL: 'sharePanelOpened';
	ERROR: 'error';
};

export type SoundCloudPlayerBindCallbackParams = {
	soundId: number;
	loadedProgress: number;
	currentPosition: number;
	relativePosition: number;
};

type SoundCloudWidgetLOAD_PROGRESSFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudWidgetLOAD_PROGRESSListener = {
	[k in SoundCloudWidgetEvents['LOAD_PROGRESS']]: SoundCloudWidgetLOAD_PROGRESSFn;
};

type SoundCloudWidgetPLAY_PROGRESSFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudWidgetPLAY_PROGRESSListener = {
	[k in SoundCloudWidgetEvents['PLAY_PROGRESS']]: SoundCloudWidgetPLAY_PROGRESSFn;
};

type SoundCloudWidgetPLAYFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudWidgetPLAYListener = {
	[k in SoundCloudWidgetEvents['PLAY']]: SoundCloudWidgetPLAYFn;
};

type SoundCloudWidgetPAUSEFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudWidgetPAUSEListener = {
	[k in SoundCloudWidgetEvents['PAUSE']]: SoundCloudWidgetPAUSEFn;
};

type SoundCloudWidgetFINISHFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudWidgetFINISHListener = {
	[k in SoundCloudWidgetEvents['FINISH']]: SoundCloudWidgetFINISHFn;
};

type SoundCloudWidgetSEEKFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudWidgetSEEKListener = {
	[k in SoundCloudWidgetEvents['SEEK']]: SoundCloudWidgetSEEKFn;
};

type SoundCloudUIREADYFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudUIREADYListener = {
	[k in SoundCloudWidgetEvents['READY']]: SoundCloudUIREADYFn;
};

type SoundCloudUICLICK_DOWNLOADFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudUICLICK_DOWNLOADListener = {
	[k in SoundCloudWidgetEvents['CLICK_DOWNLOAD']]: SoundCloudUICLICK_DOWNLOADFn;
};

type SoundCloudUICLICK_BUYFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudUICLICK_BUYListener = {
	[k in SoundCloudWidgetEvents['CLICK_BUY']]: SoundCloudUICLICK_BUYFn;
};

type SoundCloudUIOPEN_SHARE_PANELFn = (params: SoundCloudPlayerBindCallbackParams) => void;
type SoundCloudUIOPEN_SHARE_PANELListener = {
	[k in SoundCloudWidgetEvents['OPEN_SHARE_PANEL']]: SoundCloudUIOPEN_SHARE_PANELFn;
};

type SoundCloudUIERRORFn = (e: unknown) => void;
type SoundCloudUIERRORListener = {
	[k in SoundCloudWidgetEvents['ERROR']]: SoundCloudUIERRORFn;
};

type SoundCloudListeners = SoundCloudWidgetLOAD_PROGRESSListener &
	SoundCloudWidgetPLAY_PROGRESSListener &
	SoundCloudWidgetPLAYListener &
	SoundCloudWidgetPAUSEListener &
	SoundCloudWidgetFINISHListener &
	SoundCloudWidgetSEEKListener &
	SoundCloudUIREADYListener &
	SoundCloudUICLICK_DOWNLOADListener &
	SoundCloudUICLICK_BUYListener &
	SoundCloudUIOPEN_SHARE_PANELListener &
	SoundCloudUIERRORListener;

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

export type SoundCloudPlayer = {
	bind<E extends keyof SoundCloudListeners>(event: E, listener: SoundCloudListeners[E]): void;
	unbind(event: keyof SoundCloudListeners): void;
	load(url: string, options?: Partial<SoundCloudPlayerLoadOptions>): void;
	play(): void;
	pause(): void;
	toggle(): void;
	seekTo(milliseconds: number): void;
	setVolume(volume: number /* range 0-100 */): void;
	next(): void;
	prev(): void;
	skip(soundIndex: number /* starting from 0 */): void;
	getVolume(callback?: (volume: number /* range 0-100 */) => void): object;
	getDuration(callback?: (duration: number /* in millisecond */) => void): object;
	getPosition(callback?: (position: number /* in millisecond */) => void): object;
	getSounds(callback?: (sounds: Record<string, never>[][]) => void): object;
	getCurrentSound(callback?: (currentSound: Record<string, never>[]) => void): object;
	getCurrentSoundIndex(callback?: (index: number /* index of current sound */) => void): object;
	isPaused(callback?: (paused: boolean) => void): object;
};

export interface SoundCloudWidget {
	(container: string | HTMLIFrameElement): SoundCloudPlayer;
	Events: SoundCloudWidgetEvents;
}

export type SoundCloud = {
	Widget: SoundCloudWidget;
};
