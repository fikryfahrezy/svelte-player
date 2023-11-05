import type { SoundCloudWidgetEvents } from '../../lib/players/soundcloud.global.types';
import type { SoundCloudConfig } from '../../lib/players/soundcloud.types';

import { test, vi, describe } from 'vitest';
import { render } from '@testing-library/svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';
import SoundCloudSvelte from '../../lib/players/SoundCloud.svelte';
import * as utils from '../../lib/players/utils';
import SoundCloudPlayerMock from './SoundCloudPlayer.mock';

const TEST_URL = 'https://soundcloud.com/miami-nights-1984/accelerated';

const TEST_CONFIG: SoundCloudConfig = {
	options: {}
};

const TEST_PROPS = {
	volume: 0,
	url: TEST_URL,
	config: TEST_CONFIG
};

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

describe('testPlayerMethods', function () {
	testPlayerMethods(SoundCloudSvelte, new SoundCloudPlayerMock(), {
		play: 'play',
		pause: 'pause',
		stop: null,
		seekTo: 'seekTo',
		setVolume: 'setVolume',
		mute: 'setVolume',
		unmute: 'setVolume'
	});
});

test('load()', async function (t) {
	t.expect.assertions(3);

	vi.doMock('./SoundCloudPlayer.mock', function () {
		const Player = vi.fn();
		Player.prototype.bind = vi.fn();
		Player.prototype.getDuration = vi.fn(function (fn) {
			fn(1000);
		});
		Player.prototype.load = vi.fn(function (_, options) {
			options.callback();
		});

		return { default: Player };
	});

	const SoundCloudPlayerMock = (await import('./SoundCloudPlayer.mock')).default;

	function Widget(container: string | HTMLIFrameElement) {
		t.expect((container as HTMLIFrameElement).className).contains('soundcloud-player');
		return new SoundCloudPlayerMock();
	}

	Widget.Events = soundCloudWidgetEvents;

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return { Widget };
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new SoundCloudSvelte({
			target: document.body,
			props: TEST_PROPS
		});

		instance.$on('ready', onReady);
		instance.load(TEST_URL);

		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('getDuration()', function (t) {
	const instance = new SoundCloudSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setDuration(10);
	t.expect(instance.getDuration()).toStrictEqual(10);
});

test('getCurrentTime()', function (t) {
	const instance = new SoundCloudSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setCurrentTime(5);
	t.expect(instance.getCurrentTime()).toStrictEqual(5);
});

test('getSecondsLoaded()', function (t) {
	const instance = new SoundCloudSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setDuration(10);
	instance._setFractionLoaded(0.5);
	t.expect(instance.getSecondsLoaded()).toStrictEqual(5);
});

test('render()', function (t) {
	const wrapper = render(SoundCloudSvelte, TEST_PROPS);

	const element = wrapper.container.querySelector('.soundcloud-player') as HTMLIFrameElement;
	t.expect(element).not.toStrictEqual(null);
	t.expect(element.frameBorder).toStrictEqual('0');
	t.expect(element.className).includes('soundcloud-player');
	t.expect(element.title).toStrictEqual('SoundCloud Player');
});
