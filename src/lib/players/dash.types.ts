// Ref:
// https://github.com/Dash-Industry-Forum/dash.js/blob/development/index.d.ts

import type { VoidFunction } from './utility.types';

export interface Logger {
	debug: VoidFunction;
	info: VoidFunction;
	warn: VoidFunction;
	error: VoidFunction;
	fatal: VoidFunction;
}

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
