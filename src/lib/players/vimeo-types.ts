import type { VimeoPlayerOptions } from './global-types';

export type ViemoConfig = {
	playerOptions: Partial<VimeoPlayerOptions>;
	title: string | null;
};
