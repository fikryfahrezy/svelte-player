// Ref:
// https://github.com/video-dev/hls.js/blob/master/src/hls.ts
export type ErrorData = object;

export type HlsConfig = object;

export type ManifestParsedData = object;

export enum Events {
	MANIFEST_PARSED = 'hlsManifestParsed',
	ERROR = 'hlsError'
}

export type HlsListeners = {
	[Events.MANIFEST_PARSED]: (event: Events.MANIFEST_PARSED, data: ManifestParsedData) => void;
	[Events.ERROR]: (event: Events.ERROR, data: ErrorData) => void;
};

export interface HLSClass {
	on<E extends keyof HlsListeners, Context = undefined>(
		event: E,
		listener: HlsListeners[E],
		context?: Context
	): void;
	destroy(): void;
	loadSource(url: string): void;
	attachMedia(media: HTMLMediaElement): void;
}

export interface HlsJS {
	new (userConfig?: Partial<HlsConfig>): HLSClass;
	Events: typeof Events;
}
