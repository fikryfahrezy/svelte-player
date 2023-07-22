import type { YTPlayerState } from '../../lib/players/youtube.global.types';

import { test, describe, beforeAll, afterAll, vi, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';

import * as utils from '../../lib/players/utils';
import YouTube from '../../lib/players/YouTube.svelte';

const TEST_URL = 'https://www.youtube.com/watch?v=oUFJJNQGwhk';
const TEST_CONFIG = {
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

const playerState: YTPlayerState = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5
};

describe('testPlayerMethods', () => {
	beforeAll(() => {
		vi.stubGlobal('location', {
			...window.location,
			origin: 'mock-origin'
		});

		vi.stubGlobal('YT', {
			PlayerState: playerState
		});

		vi.spyOn(document.body, 'contains').mockImplementation(() => true);
	});

	afterAll(() => {
		vi.unstubAllGlobals();
	});

	testPlayerMethods(YouTube, {
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
	});
});

test('load()', (t) => {
	class Player {
		constructor() {
			// do nothing
		}
	}

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return { Player } as any;
	});

	const instance = new YouTube({
		target: document.body,
		props: TEST_PROPS
	});
	instance.load(TEST_URL);
	t.expect(getSDK).toHaveBeenCalledOnce();
	getSDK.mockRestore();
});

test('load() when ready', (t) => {
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return {} as any;
	});

	const instance = new YouTube({
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
			PlayerState: playerState
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
		const instance = new YouTube({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('play', onPlay);
		instance.$on('bufferEnd', onBufferEnd);
		instance.onStateChange({ data: playerState.PLAYING, target: expect.anything() });
		t.expect(calledPlay && calledBufferEnd).toStrictEqual(true);
	});

	test('onStateChange() - pause', async (t) => {
		const onPause = vi.fn();
		const instance = new YouTube({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('pause', onPause);
		instance.onStateChange({ data: playerState.PAUSED, target: expect.anything() });
		t.expect(onPause).toBeCalled();
	});

	test('onStateChange() - buffer', async (t) => {
		const onBuffer = vi.fn();
		const instance = new YouTube({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('buffer', onBuffer);
		instance.onStateChange({ data: playerState.BUFFERING, target: expect.anything() });
		t.expect(onBuffer).toBeCalled();
	});

	test('onStateChange() - ended', async (t) => {
		const onEnded = vi.fn();
		const instance = new YouTube({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('ended', onEnded);
		instance.onStateChange({ data: playerState.ENDED, target: expect.anything() });
		t.expect(onEnded).toBeCalled();
	});

	test('onStateChange() - ready', async (t) => {
		const onReady = vi.fn();
		const instance = new YouTube({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('ready', onReady);
		instance.onStateChange({ data: playerState.CUED, target: expect.anything() });
		t.expect(onReady).toBeCalled();
	});
});

test('render()', (t) => {
	const wrapper = render(YouTube, TEST_PROPS);
	t.expect(wrapper.container.querySelector('.youtube-player')).not.toStrictEqual(null);
});
