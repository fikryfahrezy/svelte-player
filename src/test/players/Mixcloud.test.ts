import type { MixcloudConfig } from '../../lib/players/mixcloud.types';

import { vi, test, describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';
import MixcloudSvelte from '../../lib/players/Mixcloud.svelte';
import * as utils from '../../lib/players/utils';
import MixcloudWidgetMock from './MixcloudPlayer.mock';

const TEST_URL = 'https://www.mixcloud.com/mixcloud/meet-the-curators';

const TEST_CONFIG: MixcloudConfig = {
	options: {}
};

const TEST_PROPS = {
	url: TEST_URL,
	config: TEST_CONFIG
};

describe('testPlayerMethods', function () {
	testPlayerMethods(
		MixcloudSvelte,
		new MixcloudWidgetMock(),
		{
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'seek',
			setVolume: null,
			mute: null,
			unmute: null,
			getSecondsLoaded: null
		},
		TEST_PROPS
	);
});

test('load()', async function (t) {
	t.expect.assertions(2);

	const MixcloudSDK = {
		PlayerWidget() {
			return new MixcloudWidgetMock();
		},
		noConflict() {
			// no implementation
		},
		async FooterWidget() {
			return new MixcloudWidgetMock();
		}
	};

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return MixcloudSDK;
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new MixcloudSvelte({
			target: document.body,
			props: TEST_PROPS
		});

		instance.$on('ready', onReady);
		instance.load();

		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('getDuration()', function (t) {
	const instance = new MixcloudSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setDuration(10);
	t.expect(instance.getDuration()).toStrictEqual(10);
});

test('getCurrentTime()', function (t) {
	const instance = new MixcloudSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setCurrentTime(5);
	t.expect(instance.getCurrentTime()).toStrictEqual(5);
});

test('render()', function (t) {
	new MixcloudSvelte({ target: document.body, props: TEST_PROPS });

	const element = document.body.querySelector('.mixcloud-player') as HTMLIFrameElement;
	t.expect(element).not.toStrictEqual(null);
	t.expect(element.frameBorder).toStrictEqual('0');
	t.expect(element.className).includes('mixcloud-player');
	t.expect(element.title).toStrictEqual('Mixcloud Player');
});
