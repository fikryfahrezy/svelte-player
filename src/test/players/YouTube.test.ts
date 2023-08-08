import type {
	YTPlayerState,
	YT,
	YTPlayer,
	YTPlaybackRate,
	YTPlayerStateValue
} from '../../lib/players/youtube.global.types';
import type { YouTubeConfig } from '../../lib/players/youtube.types';

import { test, describe, beforeAll, afterAll, vi, expect } from 'vitest';
import { render } from '@testing-library/svelte';

import * as utils from '../../lib/players/utils';
import YouTubeSvelte from '../../lib/players/YouTube.svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';

const TEST_URL = 'https://www.youtube.com/watch?v=oUFJJNQGwhk';
const TEST_CONFIG: YouTubeConfig = {
	playerVars: {},
	embedOptions: {},
	onUnstarted: utils.noop
};

const TEST_PROPS = {
	controls: false,
	loop: false,
	playing: false,
	playsinline: false,
	config: TEST_CONFIG
};

const PLAYER_STATE: YTPlayerState = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5
};

class YouTubePlayerMock implements YTPlayer {
	constructor() {
		// do nothiing
	}

	cueVideoById() {
		// do nothing
	}

	loadVideoById() {
		// do nothing
	}

	cueVideoByUrl() {
		// do nothing
	}

	loadVideoByUrl() {
		// do nothing
	}

	cuePlaylist() {
		// do nothing
	}

	loadPlaylist() {
		// do nothing
	}

	playVideo() {
		// do nothing
	}
	pauseVideo() {
		// do nothing
	}
	stopVideo() {
		// do nothing
	}
	seekTo() {
		// do nothing
	}
	getSphericalProperties() {
		return {};
	}

	setSphericalProperties() {
		// do nothing
	}
	nextVideo() {
		// do nothing
	}
	previousVideo() {
		// do nothing
	}
	playVideoAt() {
		// do nothing
	}
	mute() {
		// do nothing
	}
	unMute() {
		// do nothing
	}
	isMuted() {
		return false;
	}
	setVolume() {
		// do nothing
	}
	getVolume() {
		return 0;
	}
	setSize() {
		return {};
	}
	getPlaybackRate(): YTPlaybackRate {
		return 1;
	}
	setPlaybackRate() {
		// do nothing
	}
	getAvailablePlaybackRates(): YTPlaybackRate[] {
		return [1];
	}
	setLoop() {
		// do nothing
	}
	setShuffle() {
		// do nothing
	}
	getVideoLoadedFraction() {
		return 0;
	}
	getPlayerState(): YTPlayerStateValue {
		return 0;
	}
	getCurrentTime() {
		return 0;
	}
	getDuration() {
		return 0;
	}
	getVideoUrl() {
		return '';
	}
	getVideoEmbedCode() {
		return '';
	}
	getPlaylist() {
		return [''];
	}
	getPlaylistIndex() {
		return 0;
	}
	addEventListener() {
		// do nothing
	}
	removeEventListener() {
		// do nothing
	}
	getIframe() {
		return document.createElement('iframe');
	}
	destroy() {
		// do nothing
	}
}

const YOUTUBE_SDK: YT = {
	loaded: 1,
	loading: 0,
	Player: YouTubePlayerMock,
	PlayerState: PLAYER_STATE,
	ready: utils.noop,
	setConfig: utils.noop,
	scan: utils.noop,
	subscribe: utils.noop,
	unsubscribe: utils.noop
};

describe('testPlayerMethods', () => {
	beforeAll(() => {
		vi.stubGlobal('location', {
			...window.location,
			origin: 'mock-origin'
		});

		vi.stubGlobal('YT', {
			PlayerState: PLAYER_STATE
		});

		vi.spyOn(document.body, 'contains').mockImplementation(() => true);
	});

	afterAll(() => {
		vi.unstubAllGlobals();
	});

	testPlayerMethods({
		Player: YouTubeSvelte,
		playerSDK: YOUTUBE_SDK,
		loadParameters: [TEST_URL, false],
		methods: {
			play: 'playVideo',
			pause: 'pauseVideo',
			stop: 'stopVideo',
			seekTo: 'seekTo',
			setVolume: 'setVolume',
			mute: 'mute',
			unmute: 'unMute',
			getDuration: 'getDuration',
			getCurrentTime: 'getCurrentTime',
			getSecondsLoaded: 'getVideoLoadedFraction',
			setPlaybackRate: 'setPlaybackRate'
		}
	});
});

test('load()', (t) => {
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return YOUTUBE_SDK;
	});

	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.load(TEST_URL);
	t.expect(getSDK).toHaveBeenCalledOnce();
	getSDK.mockRestore();
});

test('load() when ready', (t) => {
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return YOUTUBE_SDK;
	});

	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.load(TEST_URL, true);
	t.expect(getSDK).not.toHaveBeenCalledOnce();
	getSDK.mockRestore();
});

describe('onStateChange()', () => {
	beforeAll(() => {
		vi.stubGlobal('YT', {
			PlayerState: PLAYER_STATE
		});
	});

	afterAll(() => {
		vi.unstubAllGlobals();
	});

	test('onStateChange() - play', (t) => {
		let calledPlay = false;
		const onPlay = () => {
			calledPlay = true;
		};
		let calledBufferEnd = false;
		const onBufferEnd = () => {
			calledBufferEnd = true;
		};
		const instance = new YouTubeSvelte({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('play', onPlay);
		instance.$on('bufferEnd', onBufferEnd);
		instance.onStateChange({ data: PLAYER_STATE.PLAYING, target: expect.anything() });
		t.expect(calledPlay && calledBufferEnd).toStrictEqual(true);
	});

	test('onStateChange() - pause', async (t) => {
		const onPause = vi.fn();
		const instance = new YouTubeSvelte({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('pause', onPause);
		instance.onStateChange({ data: PLAYER_STATE.PAUSED, target: expect.anything() });
		t.expect(onPause).toBeCalled();
	});

	test('onStateChange() - buffer', async (t) => {
		const onBuffer = vi.fn();
		const instance = new YouTubeSvelte({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('buffer', onBuffer);
		instance.onStateChange({ data: PLAYER_STATE.BUFFERING, target: expect.anything() });
		t.expect(onBuffer).toBeCalled();
	});

	test('onStateChange() - ended', async (t) => {
		const onEnded = vi.fn();
		const instance = new YouTubeSvelte({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('ended', onEnded);
		instance.onStateChange({ data: PLAYER_STATE.ENDED, target: expect.anything() });
		t.expect(onEnded).toBeCalled();
	});

	test('onStateChange() - ready', async (t) => {
		const onReady = vi.fn();
		const instance = new YouTubeSvelte({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('ready', onReady);
		instance.onStateChange({ data: PLAYER_STATE.CUED, target: expect.anything() });
		t.expect(onReady).toBeCalled();
	});
});

test('render()', (t) => {
	const wrapper = render(YouTubeSvelte, TEST_PROPS);
	t.expect(wrapper.container.querySelector('.youtube-player')).not.toStrictEqual(null);
});
