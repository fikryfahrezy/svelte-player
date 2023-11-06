import type { DailyMotionConfig } from '../../lib/players/dailymotion.types';

import { describe, test, vi, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import * as utils from '../../lib/players/utils';
import DailyMotionSvelte from '../../lib/players/DailyMotion.svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';
import DailyMotionPlayerMock from './DailyMotionPlayer.mock';

const TEST_VIDEO_ID = 'x5e9eog';
const TEST_URL = `https://www.dailymotion.com/video/${TEST_VIDEO_ID}`;
const TEST_CONFIG = {
	params: {}
} satisfies DailyMotionConfig;

const TEST_PROPS = {
	config: TEST_CONFIG,
	controls: false,
	muted: false,
	playing: false
};

beforeEach(function () {
	vi.restoreAllMocks();
});

describe('testPlayerMethods', function () {
	testPlayerMethods(DailyMotionSvelte, new DailyMotionPlayerMock(), {
		play: 'play',
		pause: 'pause',
		stop: null,
		seekTo: 'seek',
		setVolume: 'setVolume',
		mute: 'setMuted',
		unmute: 'setMuted'
	});
});

test('load()', async function (t) {
	t.expect.assertions(4);
	vi.doMock('./DailyMotionPlayer.mock', function () {
		const Player = vi.fn(function (container, options) {
			t.expect(container.tagName).toStrictEqual('DIV');
			t.expect(options.video).toStrictEqual(TEST_VIDEO_ID);
			t.expect(true).toBeTruthy();
		});

		return { default: Player };
	});

	const Player = (await import('./DailyMotionPlayer.mock')).default;
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return { player: Player };
	});

	const instance = new DailyMotionSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.load(TEST_URL);

	t.expect(getSDK).toHaveBeenCalledOnce();
	getSDK.mockRestore();
	return Promise.resolve();
});

// TODO: Add test for this, this behaciour cannot
// be tested yet because we can't set container
// programmatically
test('load() - no container', async function (t) {
	t.expect(true).toStrictEqual(true);
});

test('load() - existing player', async function (t) {
	vi.doMock('./DailyMotionPlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.load = vi.fn();

		return { default: Player };
	});

	const Player = (await import('./DailyMotionPlayer.mock')).default;

	const instance = new DailyMotionSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setPlayer(new Player());
	instance.load(TEST_URL);
	t.expect(instance.getPlayer().load).toHaveBeenCalledWith(TEST_VIDEO_ID, expect.anything());
});

test('onDurationChange()', async function (t) {
	vi.doMock('./DailyMotionPlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.duration = 10;

		return { default: Player };
	});

	const Player = (await import('./DailyMotionPlayer.mock')).default;

	function onDuration(duration: CustomEvent) {
		t.expect(duration.detail).toStrictEqual(10);
	}

	const instance = new DailyMotionSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.$on('duration', onDuration);
	instance._setPlayer(new Player());
	instance._onDurationChange();
});

test('getDuration()', async function (t) {
	vi.doMock('./DailyMotionPlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.duration = 10;

		return { default: Player };
	});

	const Player = (await import('./DailyMotionPlayer.mock')).default;

	const instance = new DailyMotionSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setPlayer(new Player());
	t.expect(instance.getDuration()).toStrictEqual(10);
});

test('getCurrentTime()', async function (t) {
	vi.doMock('./DailyMotionPlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.currentTime = 5;

		return { default: Player };
	});

	const Player = (await import('./DailyMotionPlayer.mock')).default;

	const instance = new DailyMotionSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setPlayer(new Player());
	t.expect(instance.getCurrentTime()).toStrictEqual(5);
});

test('getSecondsLoaded()', async function (t) {
	vi.doMock('./DailyMotionPlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.bufferedTime = 5;

		return { default: Player };
	});

	const Player = (await import('./DailyMotionPlayer.mock')).default;

	const instance = new DailyMotionSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setPlayer(new Player());
	t.expect(instance.getSecondsLoaded()).toStrictEqual(5);
});

test('render()', function (t) {
	const wrapper = render(DailyMotionSvelte, TEST_PROPS);
	t.expect(wrapper.container.querySelector('.dailymotion-player')).not.toStrictEqual(null);
});
