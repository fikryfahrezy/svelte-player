import type { ViemoConfig } from '../../lib/players/vimeo.types';

import { test, vi, describe } from 'vitest';
import { render } from '@testing-library/svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';
import VimeoSvelte from '../../lib/players/Vimeo.svelte';
import * as utils from '../../lib/players/utils';
import VimeoPlayerMock from './VimeoPlayer.mock';

const TEST_URL = 'https://vimeo.com/90509568';

const TEST_CONFIG: ViemoConfig = {
	playerOptions: {},
	title: null
};

const TEST_PROPS = {
	playing: false,
	loop: false,
	controls: false,
	muted: false,
	playsinline: false,
	config: TEST_CONFIG
};

describe('testPlayerMethods', function () {
	testPlayerMethods(VimeoSvelte, new VimeoPlayerMock(), {
		play: 'play',
		pause: 'pause',
		stop: 'unload',
		seekTo: 'setCurrentTime',
		setVolume: 'setVolume',
		mute: 'setVolume',
		unmute: 'setVolume',
		getDuration: null,
		getCurrentTime: null,
		getSecondsLoaded: null
	});
});

test('load()', async function (t) {
	t.expect.assertions(2);

	vi.doMock('./VimeoPlayer.mock', function () {
		const Player = vi.fn();

		Player.prototype.ready = vi.fn(function () {
			return Promise.resolve();
		});
		Player.prototype.getDuration = vi.fn(function () {
			return Promise.resolve();
		});
		Player.prototype.on = vi.fn(function (event, fn) {
			if (event === 'loaded') {
				setTimeout(fn, 100);
			}
		});

		return { default: Player };
	});

	const Player = (await import('./VimeoPlayer.mock')).default;
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return { Player };
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new VimeoSvelte({
			target: document.body,
			props: TEST_PROPS
		});

		instance.$on('ready', onReady);
		instance.load(TEST_URL);

		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('render()', function (t) {
	const wrapper = render(VimeoSvelte, TEST_PROPS);

	const element = wrapper.container.querySelector('.vimeo-player') as HTMLIFrameElement;
	t.expect(element).not.toStrictEqual(null);
	t.expect(element.className).includes('vimeo-player');
});
