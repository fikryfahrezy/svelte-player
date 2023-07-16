import type { TwitchPlayerOptions, TwitchPlayerLinkOption } from './twitch.global.types';

export type TwitchConfig = {
	options: Partial<Omit<TwitchPlayerOptions, keyof TwitchPlayerLinkOption>>;
	playerId: string | null;
};
