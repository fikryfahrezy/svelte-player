import type { FilePlayerUrl } from './types';
import { canPlayYoutube, canPlayFile, AUDIO_EXTENSIONS } from './patterns';
import { supportsWebKitPresentationMode } from './utils';

const players = [
	{
		canPlay: canPlayYoutube,
		loadComponent: () => {
			return import('./YouTube.svelte');
		}
	},
	{
		canPlay: canPlayFile,
		canEnablePIP: (url: FilePlayerUrl) => {
			return (
				canPlayFile(url) &&
				(document.pictureInPictureEnabled || supportsWebKitPresentationMode()) &&
				typeof url === 'string' &&
				!AUDIO_EXTENSIONS.test(url)
			);
		},
		loadComponent: () => {
			return import('./NotImplemented.svelte');
		}
	}
];

export type Player = (typeof players)[number];

export default players;
