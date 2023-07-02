import type { TwitchPlayerOptions, TwitchPlayerLinkOption } from './global-types';

export type TwitchConfig = {
	options: Partial<Omit<TwitchPlayerOptions, keyof TwitchPlayerLinkOption>>;
	playerId: string | null;
};
