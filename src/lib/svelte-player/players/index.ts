import type { Player } from './types';
import { youtube } from './patterns';

const players = [
	{
		canPlay: youtube,
		loadComponent: import('./YouTube.svelte')
	}
] satisfies Player[];

export default players;
