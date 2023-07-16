import type { VimeoPlayerOptions } from './vimeo.global.types';

export type ViemoConfig = {
	playerOptions: Partial<VimeoPlayerOptions>;
	title: string | null;
};
