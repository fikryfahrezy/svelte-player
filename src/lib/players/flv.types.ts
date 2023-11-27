// Ref:
// https://github.com/bilibili/flv.js/blob/master/d.ts/flv.d.ts

export type MediaSegment = {
	duration: number;
	filesize?: number;
	url: string;
};

export type MediaDataSource = {
	type: string;
	isLive?: boolean;
	cors?: boolean;
	withCredentials?: boolean;

	hasAudio?: boolean;
	hasVideo?: boolean;

	duration?: number;
	filesize?: number;
	url?: string;

	segments?: MediaSegment[];
};

export interface Player {
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is fine*/
	on(event: string, listener: (...args: any[]) => void): void;
	attachMediaElement(mediaElement: HTMLMediaElement): void;
	load(): void;
}

export type Events = {
	ERROR: string;
	LOADING_COMPLETE: string;
	RECOVERED_EARLY_EOF: string;
	MEDIA_INFO: string;
	METADATA_ARRIVED: string;
	SCRIPTDATA_ARRIVED: string;
	STATISTICS_INFO: string;
};

export type FlvJS = {
	createPlayer(mediaDataSource: MediaDataSource, config?: object): Player;
	readonly Events: Readonly<Events>;
};
