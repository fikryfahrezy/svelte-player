import type { PlayerUrl } from './types';

export type FileMediaUrl = { src: string; type: string };

export type FilePlayerUrl = PlayerUrl | FileMediaUrl[];
