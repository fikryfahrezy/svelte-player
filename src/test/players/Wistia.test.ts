import type { WistiaConfig } from '../../lib/players/wistia.types';

import { test, vi, describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';
import WistiaSvelte from '../../lib/players/Wistia.svelte';
import * as utils from '../../lib/players/utils';
import WistiaPlayerMock from './WistiaPlayer.mock';

const TEST_URL = 'https://home.wistia.com/medias/e4a27b971d';

const TEST_CONFIG: WistiaConfig = {
	customControls: null,
	options: {},
	playerId: 'mock-player-id'
};

const TEST_PROPS = {
	url: TEST_URL,
	playing: false,
	controls: false,
	muted: false,
	config: TEST_CONFIG
};

describe('testPlayerMethods', function () {
	testPlayerMethods(
		WistiaSvelte,
		new WistiaPlayerMock(),
		{
			play: 'play',
			pause: 'pause',
			// stop: 'remove',
			seekTo: 'time',
			setVolume: 'volume',
			mute: 'mute',
			unmute: 'unmute',
			getDuration: 'duration',
			getCurrentTime: 'time',
			getSecondsLoaded: null,
			setPlaybackRate: 'playbackRate'
		},
		TEST_PROPS
	);
});

test('load()', async function (t) {
	t.expect.assertions(4);

	const Wistia = {
		defineControl() {
			// no implementation
		}
	};
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return Wistia;
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new WistiaSvelte({
			target: document.body,
			props: TEST_PROPS
		});

		instance.$on('ready', onReady);
		instance.load();

		setTimeout(function () {
			t.expect(window._wq instanceof Array).toStrictEqual(true);
			t.expect(window._wq.length === 1).toStrictEqual(true);
			window._wq[0].onReady?.(new WistiaPlayerMock());
		}, 100);

		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('render()', function (t) {
	new WistiaSvelte({ target: document.body, props: TEST_PROPS });

	const element = document.body.querySelector('.wistia-player') as HTMLIFrameElement;
	t.expect(element).not.toStrictEqual(null);
	t.expect(element.className).includes('wistia-player');
	t.expect(element.id).includes('mock-player-id');
});
