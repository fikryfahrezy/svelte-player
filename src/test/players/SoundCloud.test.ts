import type {
	SoundCloud,
	SoundCloudPlayer,
	SoundCloudWidgetEvents
} from '../../lib/players/soundcloud.global.types';
import type { SoundCloudConfig } from '../../lib/players/soundcloud.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import SoundCloudSvelte from '../../lib/players/SoundCloud.svelte';

const TEST_URL = 'https://soundcloud.com/miami-nights-1984/accelerated';

const TEST_CONFIG: SoundCloudConfig = {
	options: {}
};

const TEST_PROPS = {
	volume: 0,
	url: TEST_URL,
	config: TEST_CONFIG
};

class SoundCloudPlayerMock implements SoundCloudPlayer {
	constructor() {
		// do nothing
	}
	bind() {
		// do nothing
	}
	unbind() {
		// do nothing
	}
	load() {
		// do nothing
	}
	play() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	toggle() {
		// do nothing
	}
	seekTo() {
		// do nothing
	}
	setVolume() {
		// do nothing
	}
	next() {
		// do nothing
	}
	prev() {
		// do nothing
	}
	skip() {
		// do nothing
	}
	getVolume() {
		return 0;
	}
	getDuration() {
		return 0;
	}
	getPosition() {
		return 0;
	}
	getSounds() {
		return [];
	}
	getCurrentSound() {
		return {};
	}
	getCurrentSoundIndex() {
		return 0;
	}
	isPaused() {
		return false;
	}
}

const soundCloudWidgetEvents: SoundCloudWidgetEvents = {
	LOAD_PROGRESS: 'loadProgress',
	PLAY_PROGRESS: 'playProgress',
	PLAY: 'play',
	PAUSE: 'pause',
	FINISH: 'finish',
	SEEK: 'seek',
	READY: 'ready',
	CLICK_DOWNLOAD: 'downloadClicked',
	CLICK_BUY: 'buyClicked',
	OPEN_SHARE_PANEL: 'sharePanelOpened',
	ERROR: 'error'
};

function Widget() {
	return new SoundCloudPlayerMock();
}

Widget.Events = soundCloudWidgetEvents;

const PLAYERJS_SDK: SoundCloud = {
	Widget
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: SoundCloudSvelte,
		playerSDK: PLAYERJS_SDK,
		loadParameters: [TEST_URL, false],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'seekTo',
			setVolume: 'setVolume',
			mute: 'setVolume',
			unmute: 'setVolume'
		},
		props: TEST_PROPS
	});
});
