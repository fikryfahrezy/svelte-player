import type { Facebook } from '../../lib/players/facebook.global.types';
import type { FacebookConfig } from '../../lib/players/facebook.types';

import { describe, vi, test, expect } from 'vitest';

import * as utils from '../../lib/players/utils';
import FacebookSvelte from '../../lib/players/Facebook.svelte';

import testPlayerMethods from '../helpers/testPlayerMethods';
import facebookPlayer from './FacebookPlayer.mock';

const TEST_URL = 'https://www.facebook.com/facebook/videos/10153231379946729';
const TEST_CONFIG = {
	appId: '123',
	version: 'v3.3',
	playerId: 'facebook-player',
	attributes: {}
} satisfies FacebookConfig;

const TEST_PROPS = {
	controls: false,
	muted: false,
	playing: true,
	url: TEST_URL,
	config: TEST_CONFIG
};

describe('testPlayerMethods', function () {
	testPlayerMethods(
		FacebookSvelte,
		facebookPlayer,
		{
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'seek',
			setVolume: 'setVolume',
			mute: 'mute',
			unmute: 'unmute',
			getDuration: 'getDuration',
			getCurrentTime: 'getCurrentPosition',
			getSecondsLoaded: null
		},
		TEST_PROPS
	);
});

test('load()', async function (t) {
	t.expect.assertions(2);
	const FACEBOOK_SDK: Facebook = {
		init() {
			return null;
		},
		Event: {
			subscribe: vi.fn().mockImplementation(function (event, fn) {
				if (event === 'xfbml.ready') {
					fn({
						type: 'video',
						id: TEST_CONFIG.playerId,
						instance: facebookPlayer
					});
				}
			})
		},
		XFBML: t.expect.anything()
	};

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return FACEBOOK_SDK;
	});

	function onReady() {
		t.expect(true).toBeTruthy();
	}

	const instance = new FacebookSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance.$on('ready', onReady);
	instance.load(TEST_URL);
	t.expect(getSDK).toHaveBeenCalled();
	getSDK.mockRestore();

	return Promise.resolve();
});

test('load() when ready', async function (t) {
	t.expect.assertions(2);
	const FACEBOOK_SDK: Facebook = {
		init: expect.anything(),
		Event: expect.anything(),
		XFBML: {
			parse() {
				t.expect(true).toBeTruthy();
			}
		}
	};

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return FACEBOOK_SDK;
	});

	const instance = new FacebookSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance.load(TEST_URL, true);
	t.expect(getSDK).toHaveBeenCalled();
	getSDK.mockRestore();

	return Promise.resolve();
});

test('render()', function (t) {
	new FacebookSvelte({ target: document.body, props: TEST_PROPS });
	t.expect(document.body.querySelector('.facebook-player')).not.toStrictEqual(null);
});
