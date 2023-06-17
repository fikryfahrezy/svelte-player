// import type { Player } from './types';
import { youtube } from './patterns';

const players = [
	{
		canPlay: youtube,
		loadComponent: () => {
			return import('./YouTube.svelte');
		}
	}
];

export type Player = (typeof players)[number];

export default players;
