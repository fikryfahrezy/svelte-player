import { test, vi, describe } from 'vitest';
import { render } from '@testing-library/svelte';
import testPlayerMethods from '../helpers/testPlayerMethods';
import StreamableSvelte from '../../lib/players/Streamable.svelte';
import * as utils from '../../lib/players/utils';
import PlayerJSPlayerMock from './PlayerJSPlayer.mock';

const TEST_URL = 'https://streamable.com/moo';
const TEST_PROPS = {
	loop: false,
	muted: false,
	url: TEST_URL
};

describe('testPlayerMethods', function () {
	testPlayerMethods(
		StreamableSvelte,
		new PlayerJSPlayerMock(),
		{
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'setCurrentTime',
			setVolume: 'setVolume',
			mute: 'mute',
			unmute: 'unmute'
		},
		TEST_PROPS
	);
});

test('load()', async function (t) {
	t.expect.assertions(3);
	vi.doMock('./PlayerJSPlayer.mock', function () {
		const Player = vi.fn(function (iframe) {
			t.expect(iframe.className).includes('streamable-player');
		});

		Player.prototype.on = vi.fn(function (event, fn) {
			if (event === 'ready') {
				setTimeout(fn, 100);
			}
		});

		Player.prototype.setLoop = vi.fn(function () {
			return null;
		});

		return { default: Player };
	});

	const Player = (await import('./PlayerJSPlayer.mock')).default;
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return { Player };
	});

	return new Promise(function (resolve) {
		const onReady = vi.fn(function () {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		});

		const instance = new StreamableSvelte({
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
	const instance = new StreamableSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setDuration(10);
	t.expect(instance.getDuration()).toStrictEqual(10);
});

test('getCurrentTime()', function (t) {
	const instance = new StreamableSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setCurrentTime(5);
	t.expect(instance.getCurrentTime()).toStrictEqual(5);
});

test('getSecondsLoaded()', function (t) {
	const instance = new StreamableSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance._setSecondsLoaded(5);
	t.expect(instance.getSecondsLoaded()).toStrictEqual(5);
});

test('render()', function (t) {
	const wrapper = render(StreamableSvelte, TEST_PROPS);

	const element = wrapper.container.querySelector('.streamable-player') as HTMLIFrameElement;
	t.expect(element).not.toStrictEqual(null);
	t.expect(element.frameBorder).toStrictEqual('0');
	t.expect(element.scrolling).toStrictEqual('no');
	t.expect(element.className).includes('streamable-player');
	t.expect(element.title).toStrictEqual('Streamable Player');
});
