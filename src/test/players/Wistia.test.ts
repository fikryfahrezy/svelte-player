import type { Wistia } from '../../lib/players/wistia.global.types';
import type { WistiaConfig } from '../../lib/players/wistia.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import WistiaSvelte from '../../lib/players/Wistia.svelte';

const TEST_URL = 'https://home.wistia.com/medias/e4a27b971d';

const TEST_CONFIG: WistiaConfig = {
	customControls: null,
	options: {},
	playerId: 'mock-player-id'
};

const TEST_PROPS = {
	url: TEST_URL,
	playing: false,
	controls: false,
	muted: false,
	config: TEST_CONFIG
};

const PLAYERJS_SDK: Wistia = {
	defineControl() {
		// do nothing
	}
};

describe.skip('testPlayerMethods', () => {
	testPlayerMethods({
		Player: WistiaSvelte,
		playerSDK: PLAYERJS_SDK,
		loadParameters: [TEST_URL],
		methods: {
			play: 'play',
			pause: 'pause',
			// stop: 'remove',
			seekTo: 'time',
			setVolume: 'volume',
			mute: 'mute',
			unmute: 'unmute',
			getDuration: 'duration',
			getCurrentTime: 'time',
			getSecondsLoaded: null,
			setPlaybackRate: 'playbackRate'
		},
		props: TEST_PROPS
	});
});
