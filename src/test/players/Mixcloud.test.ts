import type { MixcloudPlayer, MixcloudWidget } from '../../lib/players/mixcloud.global.types';
import type { MixcloudConfig } from '../../lib/players/mixcloud.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import MixcloudSvelte from '../../lib/players/Mixcloud.svelte';

const TEST_URL = 'https://www.mixcloud.com/mixcloud/meet-the-curators';

const TEST_CONFIG: MixcloudConfig = {
	options: {}
};

const TEST_PROPS = {
	url: TEST_URL,
	config: TEST_CONFIG
};

class MixcloudWidgetMock implements MixcloudWidget {
	constructor() {
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
	togglePlay() {
		// do nothing
	}
	async seek() {
		return false;
	}
	async getPosition() {
		return 0;
	}
	async getDuration() {
		return 0;
	}
	async getIsPaused() {
		return false;
	}
	ready = Promise.resolve(null as never);
	events = {
		buffering: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		play: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		pause: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		ended: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		progress: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		error: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		}
	};
}

const PLAYERJS_SDK: MixcloudPlayer = {
	PlayerWidget() {
		return new MixcloudWidgetMock();
	},
	noConflict() {
		// do nothing
	},
	async FooterWidget() {
		return new MixcloudWidgetMock();
	}
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: MixcloudSvelte,
		playerSDK: PLAYERJS_SDK,
		loadParameters: [TEST_URL],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'seek',
			setVolume: null,
			mute: null,
			unmute: null,
			getSecondsLoaded: null
		},
		props: TEST_PROPS
	});
});
