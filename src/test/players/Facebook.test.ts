import type { Facebook, FacebookPlayer } from '../../lib/players/facebook.global.types';
import type { FacebookConfig } from '../../lib/players/facebook.types';

import { describe, vi } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import * as utils from '../../lib/players/utils';
import FacebookSvelte from '../../lib/players/Facebook.svelte';

const TEST_URL = 'https://www.facebook.com/facebook/videos/10153231379946729';
const TEST_CONFIG: FacebookConfig = {
	appId: '123',
	version: 'v3.3',
	playerId: 'facebook-player',
	attributes: {}
};

const TEST_PROPS = {
	controls: false,
	muted: false,
	playing: true,
	url: TEST_URL,
	config: TEST_CONFIG
};

const FACEBOOK_INSTANCE: FacebookPlayer = {
	getCurrentPosition() {
		return 0;
	},
	getDuration() {
		return 0;
	},
	getVolume() {
		return 0;
	},
	isMuted() {
		return false;
	},
	mute() {
		// do nothing
	},
	pause() {
		// do nothing
	},
	play() {
		// do nothing
	},
	seek() {
		// do nothing
	},
	setVolume() {
		// do nothing
	},
	subscribe() {
		return {
			release() {
				// do nothing
			}
		};
	},
	unmute() {
		// do nothing
	}
};

const FACEBOOK_SDK: Facebook = {
	init: utils.noop,
	Event: {
		subscribe: vi.fn().mockImplementation((event, fn) => {
			if (event === 'xfbml.ready') {
				fn({
					type: 'video',
					id: TEST_CONFIG.playerId,
					instance: FACEBOOK_INSTANCE
				});
			}
		})
	},
	XFBML: {
		parse: utils.noop
	}
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: FacebookSvelte,
		playerSDK: FACEBOOK_SDK,
		loadParameters: [TEST_URL, false],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'seek',
			setVolume: 'setVolume',
			mute: 'mute',
			unmute: 'unmute',
			getDuration: 'getDuration',
			getCurrentTime: 'getCurrentPosition',
			getSecondsLoaded: null
		},
		props: TEST_PROPS
	});
});
