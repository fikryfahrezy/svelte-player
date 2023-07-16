import type { WistiaEmbedOptions, WistiaPlayerControl } from './wistia.global.types';

export type WistiaConfig = {
	options: Partial<WistiaEmbedOptions>;
	playerId: string | null;
	customControls: WistiaPlayerControl[] | null;
};
