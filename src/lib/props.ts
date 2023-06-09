import type { Config } from './types';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const defaultConfig: Config = {
	soundcloud: {
		options: {
			visual: true,
			buying: false,
			download: false,
			sharing: false,
			show_playcount: false
		}
	},
	streamable: undefined,
	youtube: {
		playerVars: {
			playsinline: 1,
			rel: 0,
			iv_load_policy: 1,
			modestbranding: 1
		},
		embedOptions: {},
		onUnstarted: noop
	},
	facebook: {
		appId: '1309697205772819',
		version: 'v3.3',
		playerId: null,
		attributes: {}
	},
	dailymotion: {
		params: {
			api: 1,
			'endscreen-enable': false
		}
	},
	vimeo: {
		playerOptions: {
			autopause: false,
			byline: false,
			portrait: false,
			title: false
		},
		title: null
	},
	kaltura: undefined,
	file: {
		attributes: {},
		tracks: [],
		forceVideo: false,
		forceAudio: false,
		forceHLS: false,
		forceDASH: false,
		forceFLV: false,
		hlsOptions: {},
		hlsVersion: '1.1.4',
		dashVersion: '3.1.3',
		flvVersion: '1.5.0',
		forceDisableHls: false
	},
	mixcloud: {
		options: {
			hide_cover: true
		}
	},
	twitch: {
		options: {},
		playerId: null
	},
	'not-implemented': {}
};
