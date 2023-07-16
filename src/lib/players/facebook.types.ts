import type { HTMLAttributes } from 'svelte/elements';
import type { FacebookInitOptions } from './facebook.global.types';

export type FacebookConfigAttributes = Omit<HTMLAttributes<HTMLDivElement>, `on:${string}`>;

export type FacebookConfig = Omit<FacebookInitOptions, 'xfbml'> & {
	playerId: string | null;
	attributes: FacebookConfigAttributes;
};
