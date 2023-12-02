// https://www.mixcloud.com/developers/widget/
export type MixcloudPlayerLoadOptions = {
	hide_cover: boolean;
	hide_tracklist: boolean;
	mini: boolean;
	hide_artwork: boolean;
	light: boolean;
};

export type MixcloudWidgetEVENTCallback = () => void;

export type MixcloudPROGRESSEvent = 'progress';
export type MixcloudWidgetProgressEVENTCallback = (seconds: number, duration: number) => void;
export type MixcloudWidgetProgressEVENT = {
	[l in MixcloudPROGRESSEvent]: {
		on(callback: MixcloudWidgetProgressEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudBUFFERINGEvent = 'buffering';
export type MixcloudWidgetBufferingEVENT = {
	[k in MixcloudBUFFERINGEvent]: {
		on(callback: MixcloudWidgetEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudPLAYEvent = 'play';
export type MixcloudWidgetPlayEVENT = {
	[k in MixcloudPLAYEvent]: {
		on(callback: MixcloudWidgetEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudPAUSEEvent = 'pause';
export type MixcloudWidgetPauseEVENT = {
	[k in MixcloudPAUSEEvent]: {
		on(callback: MixcloudWidgetEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudENDEDEvent = 'ended';
export type MixcloudWidgetEventEVENT = {
	[k in MixcloudENDEDEvent]: {
		on(callback: MixcloudWidgetEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudERROREvent = 'error';
export type MixcloudWidgetErrorEVENTCallback = (error: unknown) => void;
export type MixcloudWidgetErrorEVENT = {
	[l in MixcloudERROREvent]: {
		on(callback: MixcloudWidgetErrorEVENTCallback): void;
		off(callback: MixcloudWidgetEVENTCallback): void;
	};
};

export type MixcloudWidgetEVENT = MixcloudWidgetProgressEVENT &
	MixcloudWidgetErrorEVENT &
	MixcloudWidgetBufferingEVENT &
	MixcloudWidgetPlayEVENT &
	MixcloudWidgetPauseEVENT &
	MixcloudWidgetEventEVENT;

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
