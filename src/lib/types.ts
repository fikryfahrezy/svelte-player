import type {
	GlobalSDKObject,
	InternalPlayerKey,
	Dispatcher,
	PlayerMediaRef
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
};
