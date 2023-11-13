import type { TwitchConfig } from '../../lib/players/twitch.types';

import { test, vi, describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';
import TwitchSvelte from '../../lib/players/Twitch.svelte';
import * as utils from '../../lib/players/utils';
import TwitchPlayerMock from './TwitchPlayerPlayer.mock';

const TEST_URL = 'https://www.twitch.tv/videos/106400740';

const TEST_CONFIG: TwitchConfig = {
	options: {},
	playerId: 'mock-player-id'
};

const TEST_PROPS = {
	controls: false,
	muted: false,
	playing: false,
	playsinline: false,
	config: TEST_CONFIG
};

describe('testPlayerMethods', function () {
	testPlayerMethods(
		TwitchSvelte,
		new TwitchPlayerMock(),
		{
			play: 'play',
			pause: 'pause',
			stop: 'pause',
			seekTo: 'seek',
			setVolume: 'setVolume',
			mute: 'setMuted',
			unmute: 'setMuted',
			getDuration: 'getDuration',
			getCurrentTime: 'getCurrentTime',
			getSecondsLoaded: null
		},
		TEST_PROPS
	);
});

test('load()', async function (t) {
	t.expect.assertions(3);

	vi.doMock('./TwitchPlayerPlayer.mock', function () {
		const Player = function (id: string) {
			t.expect(id).toStrictEqual('mock-player-id');
		};

		Player.READY = 'READY';
		Player.PLAY = 'PLAY';
		Player.PAUSE = 'PAUSE';
		Player.ENDED = 'ENDED';
		Player.prototype.addEventListener = vi.fn(function (event, fn) {
			if (event === 'READY') {
				setTimeout(fn, 100);
			}
		});

		return { default: Player };
	});

	const Player = (await import('./TwitchPlayerPlayer.mock')).default;
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return { Player };
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new TwitchSvelte({
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
	new TwitchSvelte({ target: document.body, props: TEST_PROPS });

	const element = document.body.querySelector('.twitch-player') as HTMLIFrameElement;
	t.expect(element).not.toStrictEqual(null);
	t.expect(element.className).includes('twitch-player');
	t.expect(element.id).toStrictEqual('mock-player-id');
});
