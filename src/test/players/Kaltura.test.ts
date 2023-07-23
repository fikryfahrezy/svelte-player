import type { PlayerJS, PlayerJSPlayer } from '../../lib/players/playerjs.global.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import KalturaSvelte from '../../lib/players/Kaltura.svelte';

const TEST_URL =
	'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622336&entry_id=1_i1jmzcn3';
const TEST_PROPS = {
	loop: false,
	muted: false,
	url: TEST_URL
};

class PlajerJSPlayerMock implements PlayerJSPlayer {
	isReady = false;

	constructor() {
		// do nothing
	}
	getCurrentTime() {
		// do nothing
	}
	getMuted() {
		// do nothing
	}
	getDuration() {
		return 0;
	}
	getPaused() {
		// do nothing
	}
	getVolume() {
		return 0;
	}
	mute() {
		// do nothing
	}
	off() {
		// do nothing
	}
	on() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	play() {
		// do nothing
	}
	setCurrentTime() {
		// do nothing
	}
	setLoop() {
		// do nothing
	}
	setVolume() {
		// do nothing
	}
	supports() {
		return false;
	}
	unmute() {
		// do nothing
	}
}

const PLAYERJS_SDK: PlayerJS = {
	Player: PlajerJSPlayerMock
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: KalturaSvelte,
		playerSDK: PLAYERJS_SDK,
		loadParameters: [TEST_URL, false],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'setCurrentTime',
			setVolume: 'setVolume',
			mute: 'mute',
			unmute: 'unmute'
		},
		props: TEST_PROPS
	});
});
