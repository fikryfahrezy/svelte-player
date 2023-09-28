import type { SvelteComponent } from 'svelte';
import type {
	InternalPlayerKey,
	Dispatcher,
	FilePlayerUrl,
	PlayerInstance,
	PlayerMedia,
	PlayerProps,
	Config
} from './players/types';

export type SeekToType = 'seconds' | 'fraction';

export type PlayerDispatcher = Dispatcher & {
	ready: undefined;
};

export type PlayerRef = {
	getDuration(): number | null;
	getCurrentTime(): number | null;
	getSecondsLoaded(): number | null;
	getInternalPlayer(key?: InternalPlayerKey): PlayerInstance | null;
	seekTo(amount: number, type?: SeekToType, keepPlaying?: boolean): void;
};

export type SveltePlayerDispatcher = Omit<Dispatcher, 'ready'> & {
	ready: PlayerRef;
	onClickPreview: null;
};

export type SveltePlayerRef = PlayerRef & {
	canEnablePIP(url: FilePlayerUrl): boolean;
	showPreview(): void;
};

export type PlayerKey = keyof Config;
export type PlayerConfig = Config[keyof Config];

export type PlayerMediaRef = SvelteComponent<Partial<PlayerProps>> & PlayerMedia;
