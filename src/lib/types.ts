import type { PlayerDispatcher, PlayerInternalPlayer, PlayerGetPlayerKey } from './players/types';

export type SeekToType = 'seconds' | 'fraction';

export type PlayerMediaRef = {
	getDuration(): number | null;
	getCurrentTime(): number | null;
	getSecondsLoaded(): number | null;
	getInternalPlayer(key?: 'player'): PlayerInternalPlayer['player'] | null;
	getInternalPlayer<TKey extends PlayerGetPlayerKey>(key: TKey): PlayerInternalPlayer[TKey] | null;
	seekTo(amount: number, type?: SeekToType, keepPlaying?: boolean): void;
};

export type PreviewDispatcher = {
	click?: Event;
};

export type SveltePlayerRef = PlayerMediaRef & {
	showPreview(): void;
};

export type SveltePlayerDispatcher = PlayerDispatcher & {
	clickPreview: Event;
};
