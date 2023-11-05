import type {
	FileConfig,
	FileInternalPlayer,
	FileInternalPlayerKey
} from '../../lib/players/file.types';
import type { AnyFunction } from '../../lib/players/utility.types';
import type { DashJS, DashJSDebugLogLevel } from '../../lib/players/dash.types';

import { test, beforeAll, afterAll, vi, expect, type TestContext } from 'vitest';

import { defaultConfig } from '../../lib/props';
import * as utils from '../../lib/players/utils';
import FilePlayerSvelte from '../../lib/players/FilePlayer.svelte';

const dashDebug: DashJSDebugLogLevel = {
	LOG_LEVEL_NONE: 0,
	LOG_LEVEL_FATAL: 1,
	LOG_LEVEL_ERROR: 2,
	LOG_LEVEL_WARNING: 3,
	LOG_LEVEL_INFO: 4,
	LOG_LEVEL_DEBUG: 5
};

const TEST_CONFIG: FileConfig = defaultConfig.file;

const TEST_PROPS = {
	playing: false,
	loop: false,
	controls: false,
	muted: false,
	width: '640px',
	height: '360px',
	playsinline: false,
	config: TEST_CONFIG
};

function assertPlayerNotNull<TPlayer extends FileInternalPlayer[FileInternalPlayerKey]>(
	t: TestContext,
	player: TPlayer | null
): asserts player is TPlayer {
	t.expect(player).not.toStrictEqual(null);
}

class MockMediaStream {}

beforeAll(function () {
	vi.stubGlobal('navigator', {});

	vi.stubGlobal('window', {
		MediaStream: MockMediaStream,
		URL: {
			createObjectURL() {
				return 'mockObjectURL';
			}
		}
	});
});

afterAll(function () {
	vi.unstubAllGlobals();
});

test('listeners', async function (t) {
	const addListeners = vi.fn();
	const removeListeners = vi.fn();
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4',
			playsinline: true,
			_addListeners: addListeners,
			_removeListeners: removeListeners
		}
	});

	t.expect(addListeners).toHaveBeenCalledOnce();
	t.expect(removeListeners).not.toHaveBeenCalled();

	instance.$set({
		url: 'file.mp3'
	});

	await Promise.resolve().then(function () {
		t.expect(addListeners).toHaveBeenCalledTimes(2);
	});

	instance.$destroy();

	await Promise.resolve().then(function () {
		t.expect(removeListeners).toHaveBeenCalledTimes(2);
	});
});

test('onSeek', function (t) {
	const onSeek = vi.fn();
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	instance.$on('seek', onSeek);

	const Event = vi.fn();
	Event.prototype.target = { currentTime: 10 };
	instance.onSeek(new Event());

	t.expect(onSeek).toBeCalledWith(
		t.expect.objectContaining({
			detail: 10
		})
	);
});

test('load - hls', async function (t) {
	t.expect.assertions(2);

	vi.doMock('hls.js', function () {
		class Hls {
			static Events = { ERROR: 'ERROR' };
			on() {
				return null;
			}
			loadSource() {
				return null;
			}
			attachMedia() {
				return null;
			}
		}

		return { default: Hls };
	});

	const Hls = (await import('hls.js')).default;

	const url = 'file.m3u8';
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return Hls;
	});

	function onLoaded() {
		t.expect(true).toBeTruthy();
	}

	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url
		}
	});

	instance.$on('loaded', onLoaded);
	instance.load(url);
	t.expect(getSDK).toHaveBeenCalledOnce();
	getSDK.mockRestore();

	return Promise.resolve();
});

test('onError - hls', async function (t) {
	t.expect.assertions(2);

	vi.doMock('hls.js', function () {
		class Hls {
			static Events = { ERROR: 'ERROR' };
			on(event: string, cb: () => void) {
				if (event === 'ERROR') {
					setTimeout(cb, 100);
				}
			}

			loadSource() {
				return null;
			}
			attachMedia() {
				return null;
			}
		}

		return { default: Hls };
	});

	const Hls = (await import('hls.js')).default;

	return new Promise(function (resolve) {
		function onError() {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		}

		const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
			return Hls;
		});

		const url = 'file.m3u8';
		const instance = new FilePlayerSvelte({
			target: document.body,
			props: {
				...TEST_PROPS,
				url
			}
		});

		instance.$on('error', onError);
		instance.load(url);
		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('onError - flv', async function (t) {
	t.expect.assertions(2);

	vi.doMock('flv.js', function () {
		class FlvPlayer {
			attachMediaElement() {
				// do nothing
			}

			on(event: string, cb: (...args: unknown[]) => void) {
				if (event === 'error') {
					setTimeout(function () {
						cb({ error: event });
					}, 100);
				}
			}

			load() {
				// do nothing
			}
		}

		class FlvJS {
			static Events = { ERROR: 'error' };

			loadSource() {
				return null;
			}
			attachMedia() {
				return null;
			}
			static createPlayer() {
				return new FlvPlayer();
			}
		}

		return { default: FlvJS };
	});

	const flv = (await import('flv.js')).default;

	return new Promise(function (resolve) {
		function onError() {
			t.expect(true).toBeTruthy();
			resolve(undefined);
		}

		const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
			return flv;
		});

		const url = 'file.flv';
		const instance = new FilePlayerSvelte({
			target: document.body,
			props: {
				...TEST_PROPS,
				url
			}
		});

		instance.$on('error', onError);
		instance.load(url);
		t.expect(getSDK).toHaveBeenCalledOnce();
		getSDK.mockRestore();
	});
});

test('load - dash', async function (t) {
	t.expect.assertions(2);

	vi.doMock('dashjs', function () {
		const dashjs = {
			MediaPlayer: function () {
				return {
					create: function () {
						return {
							on: function () {
								return null;
							},
							initialize: function () {
								return null;
							},
							getDebug: function () {
								return {
									setLogToBrowserConsole: function () {
										return null;
									}
								};
							},
							updateSettings: function () {
								return null;
							}
						};
					}
				};
			},
			Debug: {
				LOG_LEVEL_NONE: 0
			}
		};

		return { default: dashjs };
	});

	const dashjsSDK = (await import('dashjs')).default;
	const dashjs: DashJS = {
		...dashjsSDK,
		Debug: dashDebug
	};

	const url = 'file.mpd';
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async function () {
		return dashjs;
	});

	function onLoaded() {
		t.expect(true).toBeTruthy();
	}

	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url
		}
	});

	instance.$on('loaded', onLoaded);
	instance.load(url);
	t.expect(getSDK).toHaveBeenCalledOnce();
	getSDK.mockRestore();

	return Promise.resolve();
});

test('load - MediaStream', async function (t) {
	t.expect.assertions(3);
	const url = new window.MediaStream();
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url
		}
	});

	instance.load(url);

	await Promise.resolve().then(function () {
		const player = instance.getPlayer('player');
		assertPlayerNotNull(t, player);
		t.expect(player.srcObject).toStrictEqual(url);
		t.expect(player.src).toStrictEqual('');
	});
});

test('load - MediaStream (srcObject not supported)', async function (t) {
	t.expect.assertions(3);
	const url = new window.MediaStream();
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	Object.defineProperty(player, 'srcObject', {
		get: function () {
			return null;
		},
		set: function () {
			throw new Error('Browser does not support srcObject');
		}
	});

	instance.load(url);

	await Promise.resolve().then(function () {
		t.expect(player.src).include('mockObjectURL');
		t.expect(player.srcObject).toBeFalsy();
	});
});

test('load - Blob URI', function (t) {
	const container = document.createElement('div');
	const url = 'blob:http://example.com:ceeed153-91f1-4456-a4a7-cb4085810cc4"';
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).toStrictEqual(url);
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('forceVideo', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mp3',
			config: {
				...TEST_CONFIG,
				forceVideo: true
			}
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).include('file.mp3');
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('forceAudio', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mp4',
			config: {
				...TEST_CONFIG,
				forceAudio: true
			}
		}
	});

	t.expect(container.querySelector('audio')).toBeTruthy();
	t.expect(container.querySelector('audio')?.src).include('file.mp4');
	t.expect(container.querySelector('audio')?.children.length).toStrictEqual(0);
});

test('render video poster', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mp3',
			config: {
				...TEST_CONFIG,
				attributes: { poster: 'poster.png' }
			}
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).include('file.mp3');
	t.expect(container.querySelector('video')?.poster).include('poster.png');
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('play()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	player.play = vi.fn();
	instance.play();
	t.expect(player.play).toHaveBeenCalledOnce();
});

test('play() - promise', async function (t) {
	t.expect.assertions(3);
	function onError() {
		t.expect(true).toBeTruthy();
	}

	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	instance.$on('error', onError);

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	player.play = vi.fn().mockImplementation(function () {
		return {
			catch: function (cb: AnyFunction) {
				cb();
			}
		};
	});
	instance.play();
	t.expect(player.play).toHaveBeenCalledOnce();

	return Promise.resolve();
});

test('pause()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	player.pause = vi.fn();
	instance.pause();
	t.expect(player.pause).toHaveBeenCalledOnce();
});

test('stop()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	player.removeAttribute = vi.fn();
	instance.stop();
	t.expect(player.removeAttribute).toHaveBeenNthCalledWith(1, 'src');
});

test('stop() - dash', async function (t) {
	t.expect.assertions(2);

	vi.doMock('dashjs', function () {
		const dashjs = {
			MediaPlayer: function () {
				return {
					create: function () {
						return {
							reset: vi.fn()
						};
					}
				};
			}
		};

		return { default: dashjs };
	});

	const dashjsSDK = (await import('dashjs')).default;

	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mpd'
		}
	});

	instance._setDash(dashjsSDK.MediaPlayer().create());

	const dash = instance.getPlayer('dash');
	assertPlayerNotNull(t, dash);

	instance.stop();
	t.expect(dash.reset).toHaveBeenCalledOnce();
});

test('seekTo()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	instance.seekTo(10);
	t.expect(player.currentTime).toStrictEqual(10);
});

test('setVolume()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	instance.setVolume(0.5);
	t.expect(player.volume).toStrictEqual(0.5);
});

test('mute()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	instance.mute();
	t.expect(player.muted).toStrictEqual(true);
});

test('unmute()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	instance.unmute();
	t.expect(player.muted).toStrictEqual(false);
});

test('setPlaybackRate()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	instance.setPlaybackRate(0.5);
	t.expect(player.playbackRate).toStrictEqual(0.5);
});

test('getDuration()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	Object.defineProperty(player, 'duration', {
		value: 10
	});

	t.expect(instance.getDuration()).toStrictEqual(10);
});

test('getCurrentTime()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	player.currentTime = 5;
	t.expect(instance.getCurrentTime()).toStrictEqual(5);
});

test('getSecondsLoaded()', function (t) {
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	Object.defineProperty(player, 'buffered', {
		configurable: true
	});
	Object.defineProperty(player, 'duration', {
		configurable: true
	});

	Object.defineProperty(player, 'buffered', {
		value: []
	});
	expect(instance.getSecondsLoaded()).toStrictEqual(0);

	Object.defineProperty(player, 'buffered', {
		value: {
			end: function () {
				return 10;
			}
		}
	});
	Object.defineProperty(player, 'duration', {
		value: 20
	});
	expect(instance.getSecondsLoaded()).toStrictEqual(10);

	Object.defineProperty(player, 'duration', {
		value: 5
	});
	expect(instance.getSecondsLoaded()).toStrictEqual(5);
});

test('render - video', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).include('file.mp4');
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('render - audio', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mp3'
		}
	});

	t.expect(container.querySelector('audio')).toBeTruthy();
	t.expect(container.querySelector('audio')?.src).include('file.mp3');
	t.expect(container.querySelector('audio')?.children.length).toStrictEqual(0);
});

test('render - hls', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.m3u8'
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).toStrictEqual('');
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('render - dash', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mpd'
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).toStrictEqual('');
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('render - dropbox', function (t) {
	const url = 'https://www.dropbox.com/s/abc/file.mp4';
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).include(
		'https://dl.dropboxusercontent.com/s/abc/file.mp4'
	);
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('render - string array', function (t) {
	const url = ['file.mp4', 'file.ogg'];
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(2);
	t.expect((container.querySelector('video')?.children.item(0) as HTMLVideoElement).src).include(
		'file.mp4'
	);
	t.expect((container.querySelector('video')?.children.item(1) as HTMLVideoElement).src).include(
		'file.ogg'
	);
});

test('render - object array', function (t) {
	const url = [
		{ src: 'file.mp4', type: 'video/mp4', media: '(max-width:800px)' },
		{ src: 'file.mp4', type: 'video/mp4' },
		{ src: 'file.ogg', type: 'video/ogg' }
	];
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(3);

	const firstChild = container.querySelector('video')?.children.item(0) as HTMLSourceElement;
	t.expect(firstChild.src).include('file.mp4');
	t.expect(firstChild.type).toStrictEqual('video/mp4');
	t.expect(firstChild.media).toStrictEqual('(max-width:800px)');

	const secondChild = container.querySelector('video')?.children.item(1) as HTMLSourceElement;
	t.expect(secondChild.src).include('file.mp4');
	t.expect(secondChild.type).toStrictEqual('video/mp4');

	const thirdChild = container.querySelector('video')?.children.item(2) as HTMLSourceElement;
	t.expect(thirdChild.src).include('file.ogg');
	t.expect(thirdChild.type).toStrictEqual('video/ogg');
});

test.todo('render tracks');

test('auto width/height', function (t) {
	const container = document.createElement('div');
	new FilePlayerSvelte({
		target: container,
		props: {
			...TEST_PROPS,
			url: 'file.mp4',
			width: 'auto',
			height: 'auto'
		}
	});

	t.expect(container.querySelector('video')).toBeTruthy();
	t.expect(container.querySelector('video')?.src).include('file.mp4');
	t.expect(container.querySelector('video')?.style).toStrictEqual(
		expect.objectContaining({ _values: { height: 'auto', width: 'auto' } })
	);
	t.expect(container.querySelector('video')?.children.length).toStrictEqual(0);
});

test('clear srcObject on url change', async function (t) {
	const url = new window.MediaStream();
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url
		}
	});

	instance.load(url);
	instance.$set({
		url: 'file.mpv'
	});

	const player = instance.getPlayer('player');
	assertPlayerNotNull(t, player);

	await Promise.resolve().then(function () {
		t.expect(player.srcObject).toStrictEqual(null);
	});
});
