import type { AnyFunction } from './utility.types';

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

export type SoundCloudPlayer = {
	bind(
		event: Exclude<SoundCloudPlayerEVENT, SoundCloudUIERROREvent>,
		listener: SoundCloudPlayerBindCallbackFn
	): void;
	bind(event: SoundCloudUIERROREvent, listener: (e: unknown) => void): void; // TODO: Fix the unknown types
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
