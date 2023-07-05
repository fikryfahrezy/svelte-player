import type { FilePlayerUrl } from './types';
import {
	canPlayYoutube,
	canPlayFile,
	AUDIO_EXTENSIONS,
	canPlayTwitch,
	canPlaySoundCloud,
	canPlayMixcloud
} from './patterns';
import { supportsWebKitPresentationMode } from './utils';

const players = [
	{
		key: 'youtube',
		canPlay: canPlayYoutube,
		canEnablePIP: undefined,
		loadComponent: () => {
			return import('./YouTube.svelte');
		}
	},
	{
		key: 'soundcloud',
		canPlay: canPlaySoundCloud,
		canEnablePIP: undefined,
		loadComponent: () => {
			return import('./SoundCloud.svelte');
		}
	},
	{
		key: 'twitch',
		canPlay: canPlayTwitch,
		canEnablePIP: undefined,
		loadComponent: () => {
			return import('./Twitch.svelte');
		}
	},
	{
		key: 'twitch',
		canPlay: canPlayMixcloud,
		canEnablePIP: undefined,
		loadComponent: () => {
			return import('./Mixcloud.svelte');
		}
	},
	{
		key: 'file',
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
			return import('./FilePlayer.svelte');
		}
	},
	{
		key: 'not-implemented',
		canPlay() {
			return false;
		},
		canEnablePIP: () => {
			return false;
		},
		loadComponent: () => {
			return import('./NotImplemented.svelte');
		}
	}
] as const;

export type Player = (typeof players)[number];

export default players;
