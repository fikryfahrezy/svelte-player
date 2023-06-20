import type {
	GlobalSDKObject,
	InternalPlayerKey,
	Dispatcher,
	PlayerMediaRef,
	PlayerUrl
} from './players/types';

export type SeekToType = 'seconds' | 'fraction';

export type PlayerDispatcher = Dispatcher & {
	ready: PlayerMediaRef;
};

export type PlayerRef = {
	getDuration(): number | null;
	getCurrentTime(): number | null;
	getSecondsLoaded(): number | null;
	getInternalPlayer(key?: InternalPlayerKey): GlobalSDKObject | null;
	seekTo(amount: number, type?: SeekToType, keepPlaying?: boolean): void;
};

export type SveltePlayerDispatcher = Dispatcher & {
	ready: PlayerRef;
	onClickPreview: null;
};

export type SveltePlayerRef = PlayerRef & {
	canEnablePIP(url: PlayerUrl): boolean;
	showPreview(): void;
};
