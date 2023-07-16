// DailyMotion types are copied from https://github.com/cookpete/react-player
// The DailyMotion Player API has been deprecated https://github.com/dailymotion/dailymotion-sdk-js
// The new documentation is accessible at https://developers.dailymotion.com/sdks/#sdk-javascript
export type DailyMotionPlayerOptionsParams = {
	api: number;
	'endscreen-enable': boolean;
	controls: boolean;
	autoplay: boolean;
	mute: boolean;
	start: number;
	origin: string;
};

export type DailyMotionPlayerOptionsEvents = {
	apiready(event: Event): void;
	seeked(event: Event): void;
	video_end(event: Event): void;
	durationchange(event: Event): void;
	pause(event: Event): void;
	playing(event: Event): void;
	waiting(event: Event): void;
	error(event: Event): void;
};

export type DailyMotionPlayerOptions = {
	width: string;
	height: string;
	video: string;
	params: Partial<DailyMotionPlayerOptionsParams>;
	events: Partial<DailyMotionPlayerOptionsEvents>;
};

export type DailyMotionPlayerLoadOptions = {
	start: number;
	autoplay: boolean;
};

export interface DailyMotionPlayer {
	play(): void;
	pause(): void;
	seek(seconds: number): void;
	setVolume(fraction: number): void;
	setMuted(muted: boolean): void;
	load(id: string, options: Partial<DailyMotionPlayerLoadOptions>): void;
	duration: number;
	currentTime: number;
	bufferedTime: number;
}

export interface DailyMotionPlayerConstructor {
	new (container: HTMLElement, options: Partial<DailyMotionPlayerOptions>): DailyMotionPlayer;
	readonly prototype: DailyMotionPlayer;
}

export type DailyMotion = {
	player: DailyMotionPlayerConstructor;
};
