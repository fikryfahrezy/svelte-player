// import type { MediaPlayerClass } from 'dashjs';

/* eslint-disable @typescript-eslint/no-explicit-any -- this is fine*/
export interface Logger {
	debug(...params: any[]): void;
	info(...params: any[]): void;
	warn(...params: any[]): void;
	error(...params: any[]): void;
	fatal(...params: any[]): void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type Debug = {
	getLogger(): Logger;
	setLogTimestampVisible(flag: boolean): void;
	setCalleeNameVisible(flag: boolean): void;
	setLogToBrowserConsole?(setLog: boolean): void;
};

export enum LogLevel {
	LOG_LEVEL_NONE = 0,
	LOG_LEVEL_FATAL = 1,
	LOG_LEVEL_ERROR = 2,
	LOG_LEVEL_WARNING = 3,
	LOG_LEVEL_INFO = 4,
	LOG_LEVEL_DEBUG = 5
}

export type MediaPlayerSetting = {
	debug?: {
		logLevel?: LogLevel;
	};
};

export type MediaPlayerERROREvent = 'error';

export type DataEventCallback<T> = (data: T) => void;

export interface Event {
	type: string;
}

export interface GenericErrorEvent extends Event {
	type: MediaPlayerERROREvent;
	error: 'capability' | 'mediasource' | 'key_session' | 'key_message';
	event: string;
}

export interface DownloadErrorEvent extends Event {
	type: MediaPlayerERROREvent;
	error: 'download';
	event: {
		id: string;
		url: string;
		request: XMLHttpRequest;
	};
}

export interface ManifestErrorEvent extends Event {
	type: MediaPlayerERROREvent;
	error: 'manifestError';
	event: {
		id: string;
		message: string;
		manifest?: object;
		event?: string;
	};
}

export interface TimedTextErrorEvent extends Event {
	type: MediaPlayerERROREvent;
	error: 'cc';
	event: {
		id: string;
		message: string;
		cc: string;
	};
}

export type MediaPlayerErrorEvent = {
	type: MediaPlayerERROREvent;
	error: {
		code: number;
		message: string;
		data: object;
	};
};

export type ErrorEvent =
	| GenericErrorEvent
	| DownloadErrorEvent
	| ManifestErrorEvent
	| TimedTextErrorEvent
	| MediaPlayerErrorEvent;

export type ErrorEventCallback = DataEventCallback<ErrorEvent>;

export interface MediaPlayerClass {
	initialize(view?: HTMLElement, source?: string, autoPlay?: boolean): void;
	getDebug(): Debug;
	updateSettings(settings: MediaPlayerSetting): void;
	reset(): void;
	on(event: MediaPlayerERROREvent, callback: ErrorEventCallback, scope?: object): void;
}

export interface MediaPlayerFactory {
	create(): MediaPlayerClass;
}

export type DebugLogLevel = {
	[k in keyof typeof LogLevel]: (typeof LogLevel)[k];
};

export type DashJS = {
	MediaPlayer(): MediaPlayerFactory;
	Debug: DebugLogLevel;
};
