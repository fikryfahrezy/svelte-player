// https://www.mixcloud.com/developers/widget/
export type MixcloudPlayerLoadOptions = {
	hide_cover: boolean;
	hide_tracklist: boolean;
	mini: boolean;
	hide_artwork: boolean;
	light: boolean;
};

export type MixcloudPROGRESSEvent = 'progress';
export type MixcloudBUFFERINGEvent = 'buffering';
export type MixcloudPLAYEvent = 'play';
export type MixcloudPAUSEEvent = 'pause';
export type MixcloudENDEDEvent = 'ended';
export type MixcloudERROREvent = 'error';

export type MixcloudPlayerEVENT =
	| MixcloudPROGRESSEvent
	| MixcloudBUFFERINGEvent
	| MixcloudPLAYEvent
	| MixcloudPAUSEEvent
	| MixcloudENDEDEvent
	| MixcloudERROREvent;

export type MixcloudWidgetEVENTCallback = () => void;
export type MixcloudWidgetProgressEVENTCallback = (seconds: number, duration: number) => void;
export type MixcloudWidgetErrorßEVENTCallback = (error: unknown) => void;

export type MixcloudWidgetProgressEVENT = {
	[l in Extract<MixcloudPlayerEVENT, MixcloudPROGRESSEvent>]: {
		on(callback: MixcloudWidgetProgressEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudWidgetErrorEVENT = {
	[l in Extract<MixcloudPlayerEVENT, MixcloudERROREvent>]: {
		on(callback: MixcloudWidgetErrorßEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudWidgetEVENT = MixcloudWidgetProgressEVENT &
	MixcloudWidgetErrorEVENT & {
		[k in Exclude<MixcloudPlayerEVENT, MixcloudPROGRESSEvent | MixcloudERROREvent>]: {
			on(callback: MixcloudWidgetEVENTCallback): void;
			off(callback: MixcloudWidgetEVENTCallback): void;
		};
	};

export type MixcloudWidget = {
	load(cloudcastKey: string, startPlaying: boolean): void;
	play(): void;
	pause(): void;
	togglePlay(): void;
	seek(seconds: number): Promise<boolean>;
	getPosition(): Promise<number>;
	getDuration(): Promise<number>;
	getIsPaused(): Promise<boolean>;
	ready: Promise<never>;
	events: MixcloudWidgetEVENT;
};

export type MixcloudPlayer = {
	PlayerWidget(iframe: HTMLIFrameElement): MixcloudWidget;
	noConflict(mixcloudApiObject: MixcloudPlayer): void;
	FooterWidget(url: string): Promise<MixcloudWidget>; // Still Experimental in date 7-6-23
};
