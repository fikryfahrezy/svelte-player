import type { AnyFunction } from './utility.types';

// https://github.com/embedly/player.js
// Also some copied from https://github.com/cookpete/react-player
export type PlayerJSPlayerREADYEvent = 'ready';
export type PlayerJSPlayerPROGRESSEvent = 'progress';
export type PlayerJSPlayerTIMEUPDATEEvent = 'timeupdate';
export type PlayerJSPlayerPLAYEvent = 'play';
export type PlayerJSPlayerPAUSEEvent = 'pause';
export type PlayerJSPlayerENDEDEvent = 'ended';
export type PlayerJSPlayerSEEKEDEvent = 'seeked';
export type PlayerJSPlayerERROREvent = 'error';
export type PlayerJSPlayerBUFFEREDEvent = 'buffered';

export type PlayerJSPProgressEvents = PlayerJSPlayerPROGRESSEvent | PlayerJSPlayerBUFFEREDEvent;

export type PlayerJSPlayerEvents =
	| PlayerJSPProgressEvents
	| PlayerJSPlayerREADYEvent
	| PlayerJSPlayerTIMEUPDATEEvent
	| PlayerJSPlayerPLAYEvent
	| PlayerJSPlayerPAUSEEvent
	| PlayerJSPlayerENDEDEvent
	| PlayerJSPlayerSEEKEDEvent
	| PlayerJSPlayerERROREvent;

export type PlayerJSPlayerNoDataEvents = Exclude<
	PlayerJSPlayerEvents,
	PlayerJSPProgressEvents | PlayerJSPlayerTIMEUPDATEEvent | PlayerJSPlayerERROREvent
>;

export type PlayerJSWithDataEventCallback<T> = (data: T) => void;

export type PlayerJSNoDataEventCallback = PlayerJSWithDataEventCallback<undefined>;

export type PlayerJSProgressEventCallbackData = { percent: number };
export type PlayerJSProgressEventCallback =
	PlayerJSWithDataEventCallback<PlayerJSProgressEventCallbackData>;

export type PlayerJSTimeupdateEventCallbackData = { seconds: number; duration: number };
export type PlayerJSTimeupdateEventCallback =
	PlayerJSWithDataEventCallback<PlayerJSTimeupdateEventCallbackData>;

export type PlayerJSErrorEventCallbackData = unknown;
export type PlayerJSTErrorEventCallback =
	PlayerJSWithDataEventCallback<PlayerJSErrorEventCallbackData>;

export type PlayerJSPlayerGetPausedCallback = (value: boolean) => void;
export type PlayerJSPlayerGetMutedCallback = (value: boolean) => void;
export type PlayerJSPlayerGetVolumeCallback = (volume: number /* range 0-100 */) => void;
export type PlayerJSPlayerGetDurationCallback = (volume: number /* in seconds */) => void;
export type PlayerJSPlayerGetCurrentTimeCallback = (volume: number /* in seconds */) => void;

export interface PlayerJSPlayer {
	play(): void;
	pause(): void;
	getPaused(callback: PlayerJSPlayerGetPausedCallback): void;
	mute(): void;
	unmute(): void;
	getMuted(callback: PlayerJSPlayerGetMutedCallback): void;
	setVolume(volume: number /* range 0-100 */): void;
	getVolume(callback: PlayerJSPlayerGetVolumeCallback): number;
	getDuration(callback: PlayerJSPlayerGetDurationCallback): number;
	setCurrentTime(value: number /* in seconds */): void;
	getCurrentTime(callback: PlayerJSPlayerGetCurrentTimeCallback): void;
	off(event: PlayerJSPlayerEvents, callback?: AnyFunction): void;
	on(event: PlayerJSPlayerTIMEUPDATEEvent, callback: PlayerJSTimeupdateEventCallback): void;
	on(event: PlayerJSPProgressEvents, callback: PlayerJSProgressEventCallback): void;
	on(event: PlayerJSPlayerNoDataEvents, callback: PlayerJSNoDataEventCallback): void;
	on(event: PlayerJSPlayerERROREvent, callback: PlayerJSTErrorEventCallback): void;
	supports(method: string, event: string): boolean;
	setLoop?(value: boolean): void;
	isReady: boolean;
}

export interface PlayerJSPlayerConstructor {
	new (container: HTMLIFrameElement): PlayerJSPlayer;
}

export type PlayerJS = {
	Player: PlayerJSPlayerConstructor;
};
