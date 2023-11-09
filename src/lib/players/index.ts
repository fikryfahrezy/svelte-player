import type { PlayerUrl, Player } from './types';
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
	canPlayWistia,
	canPlayVidyard
} from './patterns';
import { supportsWebKitPresentationMode } from './utils';

const players: Player[] = [
	{
		key: 'youtube',
		name: 'YouTube',
		canPlay: canPlayYoutube,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent() {
			return import('./YouTube.svelte');
		}
	},
	{
		key: 'soundcloud',
		name: 'SoundCloud',
		canPlay: canPlaySoundCloud,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent() {
			return import('./SoundCloud.svelte');
		}
	},
	{
		key: 'vimeo',
		name: 'Vimeo',
		canPlay: canPlayVimeo,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: true,
		loadComponent() {
			return import('./Vimeo.svelte');
		}
	},
	{
		key: 'facebook',
		name: 'Facebook',
		canPlay: canPlayFacebook,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent() {
			return import('./Facebook.svelte');
		}
	},
	{
		key: 'streamable',
		name: 'Streamable',
		canPlay: canPlayStreamable,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent() {
			return import('./Streamable.svelte');
		}
	},
	{
		key: 'wistia',
		name: 'Wistia',
		canPlay: canPlayWistia,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent() {
			return import('./Wistia.svelte');
		}
	},
	{
		key: 'twitch',
		name: 'Twitch',
		canPlay: canPlayTwitch,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent() {
			return import('./Twitch.svelte');
		}
	},
	{
		key: 'dailymotion',
		name: 'DailyMotion',
		canPlay: canPlayDailyMotion,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent() {
			return import('./DailyMotion.svelte');
		}
	},
	{
		key: 'mixcloud',
		name: 'Mixcloud',
		canPlay: canPlayMixcloud,
		canEnablePIP: undefined,
		loopOnEnded: true,
		forceLoad: undefined,
		loadComponent() {
			return import('./Mixcloud.svelte');
		}
	},
	{
		key: 'vidyard',
		name: 'Vidyard',
		canPlay: canPlayVidyard,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent() {
			return import('./Vidyard.svelte');
		}
	},
	{
		key: 'kaltura',
		name: 'Kaltura',
		canPlay: canPlayKaltura,
		canEnablePIP: undefined,
		loopOnEnded: undefined,
		forceLoad: undefined,
		loadComponent() {
			return import('./Kaltura.svelte');
		}
	},
	{
		key: 'file',
		name: 'FilePlayer',
		canPlay: canPlayFile,
		loopOnEnded: undefined,
		forceLoad: undefined,
		canEnablePIP(url: PlayerUrl) {
			return (
				canPlayFile(url) &&
				(document.pictureInPictureEnabled || supportsWebKitPresentationMode()) &&
				typeof url === 'string' &&
				!AUDIO_EXTENSIONS.test(url)
			);
		},
		loadComponent() {
			return import('./FilePlayer.svelte');
		}
	},
	{
		key: 'not-implemented',
		name: 'NotImplemented',
		loopOnEnded: undefined,
		forceLoad: undefined,
		canPlay() {
			return false;
		},
		canEnablePIP() {
			return false;
		},
		loadComponent() {
			return import('./NotImplemented.svelte');
		}
	}
];

export default players;
