import type { AnyFunction } from './utility.types';

// https://github.com/embedly/player.js
// Also some copied from https://github.com/cookpete/react-player
export type PlayerJSPlayerREADYEvent = 'ready';
type PlayerJSPlayerREADYListener = {
	[k in PlayerJSPlayerREADYEvent]: () => void;
};

export type PlayerJSPlayerPLAYEvent = 'play';
type PlayerJSPlayerPLAYListener = {
	[k in PlayerJSPlayerPLAYEvent]: () => void;
};

export type PlayerJSPlayerPAUSEEvent = 'pause';
type PlayerJSPlayerPAUSEListener = {
	[k in PlayerJSPlayerPAUSEEvent]: () => void;
};

export type PlayerJSPlayerENDEDEvent = 'ended';
type PlayerJSPlayerENDEDListener = {
	[k in PlayerJSPlayerENDEDEvent]: () => void;
};

export type PlayerJSPlayerSEEKEDEvent = 'seeked';
type PlayerJSPlayerSEEKEDListener = {
	[k in PlayerJSPlayerSEEKEDEvent]: () => void;
};

export type PlayerJSPlayerPROGRESSEvent = 'progress';
export type PlayerJSProgressEventCallbackData = { percent: number };
export type PlayerJSProgressEventCallback = (data: PlayerJSProgressEventCallbackData) => void;
type PlayerJSPlayerPROGRESSListener = {
	[k in PlayerJSPlayerPROGRESSEvent]: PlayerJSProgressEventCallback;
};

export type PlayerJSPlayerBUFFEREDEvent = 'buffered';
type PlayerJSPlayerBUFFEREDListener = {
	[k in PlayerJSPlayerBUFFEREDEvent]: PlayerJSProgressEventCallback;
};

export type PlayerJSPlayerTIMEUPDATEEvent = 'timeupdate';
export type PlayerJSTimeupdateEventCallbackData = { seconds: number; duration: number };
export type PlayerJSTimeupdateEventCallback = (data: PlayerJSTimeupdateEventCallbackData) => void;
type PlayerJSPlayerTIMEUPDATEListener = {
	[k in PlayerJSPlayerTIMEUPDATEEvent]: PlayerJSTimeupdateEventCallback;
};

export type PlayerJSPlayerERROREvent = 'error';
export type PlayerJSErrorEventCallbackData = unknown;
export type PlayerJSTErrorEventCallback = (data: PlayerJSErrorEventCallbackData) => void;
type PlayerJSPlayerERRORListener = {
	[k in PlayerJSPlayerERROREvent]: PlayerJSTErrorEventCallback;
};

type PlayerJSListeners = PlayerJSPlayerREADYListener &
	PlayerJSPlayerPLAYListener &
	PlayerJSPlayerPAUSEListener &
	PlayerJSPlayerENDEDListener &
	PlayerJSPlayerSEEKEDListener &
	PlayerJSPlayerPROGRESSListener &
	PlayerJSPlayerBUFFEREDListener &
	PlayerJSPlayerTIMEUPDATEListener &
	PlayerJSPlayerERRORListener;

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
	off(event: keyof PlayerJSListeners, callback?: AnyFunction): void;
	on<E extends keyof PlayerJSListeners>(event: E, listener: PlayerJSListeners[E]): void;
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
