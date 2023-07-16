import type { FilePlayerUrl } from './types';
import {
	canPlayYoutube,
	canPlayFile,
	AUDIO_EXTENSIONS,
	canPlayTwitch,
	canPlaySoundCloud,
	canPlayMixcloud,
	canPlayDailyMotion,
	canPlayFacebook,
	canPlayVimeo,
	canPlayStreamable,
	canPlayKaltura,
	canPlayWistia
} from './patterns';
import { supportsWebKitPresentationMode } from './utils';

const players = [
	{
		key: 'youtube',
		canPlay: canPlayYoutube,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./YouTube.svelte');
		}
	},
	{
		key: 'soundcloud',
		canPlay: canPlaySoundCloud,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./SoundCloud.svelte');
		}
	},
	{
		key: 'vimeo',
		canPlay: canPlayVimeo,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: true,
		loadComponent: () => {
			return import('./Vimeo.svelte');
		}
	},
	{
		key: 'facebook',
		canPlay: canPlayFacebook,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./Facebook.svelte');
		}
	},
	{
		key: 'streamable',
		canPlay: canPlayStreamable,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./Streamable.svelte');
		}
	},
	{
		key: 'wistia',
		canPlay: canPlayWistia,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./Wistia.svelte');
		}
	},
	{
		key: 'twitch',
		canPlay: canPlayTwitch,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./Twitch.svelte');
		}
	},
	{
		key: 'dailymotion',
		canPlay: canPlayDailyMotion,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./DailyMotion.svelte');
		}
	},
	{
		key: 'mixcloud',
		canPlay: canPlayMixcloud,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./Mixcloud.svelte');
		}
	},
	{
		key: 'kaltura',
		canPlay: canPlayKaltura,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent: () => {
			return import('./Kaltura.svelte');
		}
	},
	{
		key: 'file',
		canPlay: canPlayFile,
		loopOnEnded: undefined,
		forceLoad: undefined,
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
		loopOnEnded: undefined,
		forceLoad: undefined,
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
