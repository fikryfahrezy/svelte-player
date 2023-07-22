import type { FacebookConfig } from '../../lib/players/facebook.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import Facebook from '../../lib/players/Facebook.svelte';

const TEST_CONFIG: FacebookConfig = {
	appId: '123',
	version: 'v3.3',
	playerId: null,
	attributes: {}
};

describe('testPlayerMethods', () => {
	testPlayerMethods(
		Facebook,
		{
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
		{ config: TEST_CONFIG }
	);
});
