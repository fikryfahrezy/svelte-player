import type { YTPlayerState, YT } from '../../lib/players/youtube.global.types';
import type { YouTubeConfig } from '../../lib/players/youtube.types';

import { test, describe, beforeAll, afterAll, vi } from 'vitest';

import * as utils from '../../lib/players/utils';
import YouTubeSvelte from '../../lib/players/YouTube.svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';
import YouTubePlayerMock from './YouTubePlayer.mock';

const TEST_URL_ID = 'oUFJJNQGwhk';
const TEST_URL = `https://www.youtube.com/watch?v=${TEST_URL_ID}`;
const TEST_CONFIG = {
	playerVars: {},
	embedOptions: {},
	onUnstarted: utils.noop
} satisfies YouTubeConfig;

const TEST_PROPS = {
	controls: false,
	loop: false,
	playing: false,
	playsinline: false,
	config: TEST_CONFIG
};

const PLAYER_STATE = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5
} satisfies YTPlayerState;

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

beforeAll(function () {
	vi.stubGlobal('location', {
		...window.location,
		origin: 'mock-origin'
	});

	vi.stubGlobal('YT', {
		PlayerState: PLAYER_STATE
	});
});

afterAll(function () {
	vi.unstubAllGlobals();
});

describe('testPlayerMethods', function () {
	beforeAll(function () {
		vi.spyOn(document.body, 'contains').mockImplementation(function () {
			return true;
		});
	});

	afterAll(function () {
		vi.resetAllMocks();
	});

	testPlayerMethods(YouTubeSvelte, new YouTubePlayerMock(), {
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

test('load()', async function (t) {
	t.expect.assertions(3);
	vi.doMock('./YouTubePlayer.mock', function () {
		const Player = vi.fn(function (container, options) {
			t.expect(container.tagName).toStrictEqual('DIV');
			setTimeout(options.events.onReady, 100);
		});

		return { default: Player };
	});

	const Player = (await import('./YouTubePlayer.mock')).default;
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return { ...YOUTUBE_SDK, Player };
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new YouTubeSvelte({
			target: document.body,
			props: TEST_PROPS
		});
		instance.$on('ready', onReady);
		instance.load(TEST_URL);
		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('load() when ready', async function (t) {
	const cueVideoById = vi.fn();
	vi.doMock('./YouTubePlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.cueVideoById = cueVideoById;

		return { default: Player };
	});

	const Player = (await import('./YouTubePlayer.mock')).default;
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return YOUTUBE_SDK;
	});

	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setPlayer(new Player());
	instance.load(TEST_URL, true);
	t.expect(cueVideoById).toHaveBeenCalledWith({
		videoId: TEST_URL_ID,
		startSeconds: undefined,
		endSeconds: undefined
	});
	t.expect(getSDK).not.toHaveBeenCalled();
	getSDK.mockRestore();
});

test('onStateChange() - play', function (t) {
	let calledPlay = false;
	let calledBufferEnd = false;
	function onPlay() {
		calledPlay = true;
	}
	function onBufferEnd() {
		calledBufferEnd = true;
	}
	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.$on('play', onPlay);
	instance.$on('bufferEnd', onBufferEnd);
	instance.onStateChange({ data: PLAYER_STATE.PLAYING, target: t.expect.anything() });
	t.expect(calledPlay && calledBufferEnd).toStrictEqual(true);
});

test('onStateChange() - pause', async function (t) {
	const onPause = vi.fn();
	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.$on('pause', onPause);
	instance.onStateChange({ data: PLAYER_STATE.PAUSED, target: t.expect.anything() });
	t.expect(onPause).toBeCalled();
});

test('onStateChange() - buffer', async function (t) {
	const onBuffer = vi.fn();
	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.$on('buffer', onBuffer);
	instance.onStateChange({ data: PLAYER_STATE.BUFFERING, target: t.expect.anything() });
	t.expect(onBuffer).toBeCalled();
});

test('onStateChange() - ended', async function (t) {
	const onEnded = vi.fn();
	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setPlayer(new YouTubePlayerMock());
	instance.$on('ended', onEnded);
	instance.onStateChange({ data: PLAYER_STATE.ENDED, target: t.expect.anything() });
	t.expect(onEnded).toBeCalled();
});

test('onStateChange() - ready', async function (t) {
	const onReady = vi.fn();
	const instance = new YouTubeSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.$on('ready', onReady);
	instance.onStateChange({ data: PLAYER_STATE.CUED, target: t.expect.anything() });
	t.expect(onReady).toBeCalled();
});

test('render()', function (t) {
	new YouTubeSvelte({ target: document.body, props: TEST_PROPS });
	t.expect(document.body.querySelector('.youtube-player')).not.toStrictEqual(null);
});
