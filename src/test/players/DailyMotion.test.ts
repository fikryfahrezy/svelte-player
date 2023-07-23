import type { DailyMotionPlayer, DailyMotion } from '../../lib/players/dailymotion.global.types';
import type { DailyMotionConfig } from '../../lib/players/dailymotion.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import DailyMotionSvelte from '../../lib/players/DailyMotion.svelte';

const TEST_URL = 'https://www.dailymotion.com/video/x5e9eog';
const TEST_CONFIG: DailyMotionConfig = {
	params: {}
};

const TEST_PROPS = {
	config: TEST_CONFIG,
	controls: false,
	muted: false,
	playing: false
};

class DailyMotionPlayerMock implements DailyMotionPlayer {
	bufferedTime = 0;
	currentTime = 0;
	duration = 0;

	constructor() {
		// do nothing
	}
	load() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	play() {
		// do nothing
	}
	seek() {
		// do nothing
	}
	setMuted() {
		// do nothing
	}
	setVolume() {
		// do nothing
	}
}

const DAILYMOTION_SDK: DailyMotion = {
	player: DailyMotionPlayerMock
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: DailyMotionSvelte,
		playerSDK: DAILYMOTION_SDK,
		loadParameters: [TEST_URL],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'seek',
			setVolume: 'setVolume',
			mute: 'setMuted',
			unmute: 'setMuted'
		},
		props: TEST_PROPS
	});
});
