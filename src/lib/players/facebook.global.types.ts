// https://developers.facebook.com/docs/plugins/embedded-video-player/api/
export type FacebookPlayerSubscribeStartedPlayingEvent = 'startedPlaying';
export type FacebookPlayerSubscribePausedEvent = 'paused';
export type FacebookPlayerSubscribeFinishedPlayingEvent = 'finishedPlaying';
export type FacebookPlayerSubscribeStartedBufferingEvent = 'startedBuffering';
export type FacebookPlayerSubscribeFinishedBufferingEvent = 'finishedBuffering';
export type FacebookPlayerSubscribeErrorEvent = 'error';

export type FacebookPlayerSubscribeEvents =
	| FacebookPlayerSubscribeStartedPlayingEvent
	| FacebookPlayerSubscribePausedEvent
	| FacebookPlayerSubscribeFinishedPlayingEvent
	| FacebookPlayerSubscribeStartedBufferingEvent
	| FacebookPlayerSubscribeFinishedBufferingEvent
	| FacebookPlayerSubscribeErrorEvent;

export type FacebookPlayerSubscribeCallback = () => void;

export type FacebookPlayerSubscribeErrorCallback = (error: unknown) => void;

export type FacebookPlayerSubscribeReturn = {
	release(event: FacebookPlayerSubscribeEvents): void;
};

export type FacebookPlayer = {
	play(): void;
	pause(): void;
	seek(seconds: number): void;
	mute(): void;
	unmute(): void;
	isMuted(): boolean;
	setVolume(volume: number /* from 0 to 1 */): void;
	getVolume(): number; // from 0 to 1
	getCurrentPosition(): number; // return video time position in seconds
	getDuration(): number; // return video duration in seconds
	subscribe(
		event: Exclude<FacebookPlayerSubscribeEvents, FacebookPlayerSubscribeErrorEvent>,
		callback: FacebookPlayerSubscribeCallback
	): FacebookPlayerSubscribeReturn;
	subscribe(
		event: FacebookPlayerSubscribeErrorEvent,
		callback: FacebookPlayerSubscribeErrorCallback
	): FacebookPlayerSubscribeReturn;
};

export type FacebookInitOptions = {
	appId: string;
	xfbml: boolean;
	version: string;
};

export type FacebookXFBMLReadyEvent = 'xfbml.ready';

// This not in documentation but there is this event
// Copied from https://github.com/cookpete/react-player
export type FacebookXFBMLRenderEvent = 'xfbml.render';

export type FacebookSubscribeEvents = FacebookXFBMLReadyEvent | FacebookXFBMLRenderEvent;

export type FacebookSubscribeCallbackMsg = {
	instance: FacebookPlayer;
	type: string;
	id: string;
};

export type FacebookSubscribeReadyCallback = (msg: FacebookSubscribeCallbackMsg) => void;

export type FacebookSubscribeRenderCallback = (msg: number) => void;

export type FacebookEvent = {
	subscribe(event: FacebookXFBMLReadyEvent, callback: FacebookSubscribeReadyCallback): void;
	subscribe(event: FacebookXFBMLRenderEvent, callback: FacebookSubscribeRenderCallback): void;
};

export type FacebookXFBML = {
	parse(): void;
};

export type Facebook = {
	init(options: FacebookInitOptions): void;
	Event: FacebookEvent;
	XFBML: FacebookXFBML;
};

export type FacebookSDKReady = 'fbAsyncInit';
