import type { PlayerRef } from '../lib/players/types';
import PlayerSvelte from '../lib/PlayerMedia.svelte';

import { vi, test, describe, expect } from 'vitest';
import { render } from '@testing-library/svelte';

const playerRefMock: PlayerRef = {
	load() {
		return;
	},
	stop() {
		return;
	},
	play() {
		return;
	},
	pause() {
		return;
	},
	setVolume() {
		return;
	},
	mute() {
		return;
	},
	unmute() {
		return;
	},
	getDuration() {
		return null;
	},
	getCurrentTime() {
		return null;
	},
	getSecondsLoaded() {
		return null;
	},
	seekTo() {
		return;
	},
	setPlaybackRate() {
		return;
	},
	setLoop() {
		return;
	},
	enablePIP() {
		return;
	},
	disablePIP() {
		return;
	},
	getPlayer() {
		return null;
	}
};

const TEST_PROPS = {
	url: '',
	playing: false,
	loop: false,
	controls: false,
	volume: null,
	muted: false,
	playbackRate: 1,
	width: '640px',
	height: '360px',
	progressInterval: 1000,
	playsinline: false,
	pip: false,
	stopOnUnmount: true,
	config: {},
	activePlayer: undefined
};

test('unmount()', async function (t) {
	t.expect.assertions(1);
	const wrapper = render(PlayerSvelte, TEST_PROPS);
	const fake = vi.fn();
	wrapper.component._setIsReady(true);
	wrapper.component._setPlayer({ ...playerRefMock, stop: fake });
	wrapper.unmount();

	t.expect(fake).toHaveBeenCalledOnce();
	return Promise.resolve();
});

test('getInternalPlayer()', function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	const videoElement = document.createElement('video');

	instance._setPlayer({
		...playerRefMock,
		getPlayer() {
			return videoElement;
		}
	});

	t.expect(instance.getInternalPlayer()).toStrictEqual(videoElement);
});

test('getInternalPlayer() - null', function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	t.expect(instance.getInternalPlayer()).toStrictEqual(null);
});

test('player.load()', async function (t) {
	t.expect.assertions(6);
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, url: 'file.mp4' }
	});
	const fake = vi.fn();

	instance._setPlayer({
		...playerRefMock,
		load: fake
	});

	instance.handlePlayerMount();
	instance._setIsLoading(false);
	instance._setStartOnPlay(false);
	instance._setOnDurationCalled(true);

	instance.$set({ url: 'another-file.mp4' });

	await Promise.resolve().then(function () {
		t.expect(fake).toHaveBeenCalledTimes(2);
	});

	t.expect(fake).toHaveBeenNthCalledWith(1, 'file.mp4');
	t.expect(fake).toHaveBeenNthCalledWith(2, 'another-file.mp4', false);
	t.expect(instance._getIsLoading()).toStrictEqual(true);
	t.expect(instance._getStartOnPlay()).toStrictEqual(true);
	t.expect(instance._getOnDurationCalled()).toStrictEqual(false);
});

test('set loadOnReady', async function (t) {
	const stub = vi.spyOn(console, 'warn');
	const instance = new PlayerSvelte({
		target: document.body,
		props: {
			...TEST_PROPS,
			url: 'file.mp4'
		}
	});

	instance._setPlayer(playerRefMock);
	instance._setIsLoading(true);
	instance.$set({ url: 'another-file.mp4' });

	await Promise.resolve().then(function () {
		t.expect(stub).toHaveBeenCalledOnce();
	});
	t.expect(instance._getLoadOnReady()).toStrictEqual('another-file.mp4');
	stub.mockRestore();
});

test('player.play()', async function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	const load = vi.fn();
	const play = vi.fn();
	instance._setPlayer({ ...playerRefMock, load, play });
	instance.$set({ playing: true });

	await Promise.resolve().then(function () {
		t.expect(play).toHaveBeenCalledOnce();
	});
});

test('player.pause()', async function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, playing: true }
	});

	const load = vi.fn();
	const pause = vi.fn();
	instance._setPlayer({ ...playerRefMock, load, pause });
	instance._setIsPlaying(true);
	instance.$set({ playing: false });

	await Promise.resolve().then(function () {
		t.expect(pause).toHaveBeenCalledOnce();
	});
});

test('player.setVolume()', async function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, volume: 0.5 }
	});

	const load = vi.fn();
	const setVolume = vi.fn();
	instance._setPlayer({ ...playerRefMock, load, setVolume });
	instance.$set({ volume: 0.4 });

	await Promise.resolve().then(function () {
		t.expect(setVolume).toHaveBeenCalledOnce();
	});
});

test('player.mute()', async function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, muted: false }
	});

	const load = vi.fn();
	const mute = vi.fn();
	instance._setPlayer({ ...playerRefMock, load, mute });
	instance.$set({ muted: true });

	await Promise.resolve().then(function () {
		t.expect(mute).toHaveBeenCalledOnce();
	});
});

test('player.unmute()', async function (t) {
	t.expect.assertions(2);
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, muted: true, volume: 0.8 }
	});

	const load = vi.fn();
	const unmute = vi.fn();
	const setVolume = vi.fn();
	instance._setPlayer({ ...playerRefMock, load, unmute, setVolume });
	instance.$set({ muted: false });

	await Promise.resolve().then(function () {
		t.expect(unmute).toHaveBeenCalledOnce();
	});

	return new Promise(function (resolve) {
		setTimeout(function () {
			t.expect(setVolume).toHaveBeenCalledWith(0.8);
			resolve(undefined);
		});
	});
});

test('player.setPlaybackRate()', async function (t) {
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, playbackRate: 1 }
	});

	const load = vi.fn();
	const setPlaybackRate = vi.fn();
	instance._setPlayer({ ...playerRefMock, load, setPlaybackRate });
	instance.$set({ playbackRate: 0.4 });

	await Promise.resolve().then(function () {
		t.expect(setPlaybackRate).toHaveBeenCalledOnce();
	});
});

describe('COMMON_METHODS', function () {
	const COMMON_TIME_METHODS = ['getDuration', 'getCurrentTime', 'getSecondsLoaded'] as const;

	for (const method of COMMON_TIME_METHODS) {
		test(`${method}()`, function (t) {
			const instance = new PlayerSvelte({
				target: document.body
			});

			instance._setPlayer({
				...playerRefMock,
				[method]: vi.fn().mockImplementation(function () {
					return 123;
				})
			});
			instance._setIsReady(true);

			t.expect(instance[method]()).toStrictEqual(123);
		});

		test(`${method}() - null`, function (t) {
			const instance = new PlayerSvelte({
				target: document.body
			});

			t.expect(instance[method]()).toStrictEqual(null);
		});
	}
});

test('progress', function (t) {
	const load = vi.fn();
	const onProgress = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, url: 'file.mp4' }
	});

	instance.$on('progress', onProgress);
	instance._setPlayer({
		...playerRefMock,
		load,
		getCurrentTime: vi.fn().mockReturnValue(10),
		getSecondsLoaded: vi.fn().mockReturnValue(20),
		getDuration: vi.fn().mockReturnValue(40)
	});
	instance._setIsReady(true);
	instance.progress();
	instance.progress(); // Call twice to ensure onProgress is not called again
	t.expect(onProgress).toHaveBeenCalledWith(
		expect.objectContaining({
			detail: {
				loaded: 0.5,
				loadedSeconds: 20,
				played: 0.25,
				playedSeconds: 10
			}
		})
	);
});

test('progress() handlePlayerMount', function (t) {
	const load = vi.fn();
	const onProgress = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, url: 'file.mp4' }
	});

	instance.$on('progress', onProgress);
	instance._setIsReady(true);
	instance._setPlayer({
		...playerRefMock,
		load,
		getCurrentTime: vi.fn().mockReturnValue(10),
		getSecondsLoaded: vi.fn().mockReturnValue(20),
		getDuration: vi.fn().mockReturnValue(40)
	});
	instance.handlePlayerMount();
	t.expect(onProgress).toHaveBeenCalledWith(
		expect.objectContaining({
			detail: {
				loaded: 0.5,
				loadedSeconds: 20,
				played: 0.25,
				playedSeconds: 10
			}
		})
	);
});

test('seekTo() - seconds', function (t) {
	const load = vi.fn();
	const seekTo = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance._setPlayer({ ...playerRefMock, load, seekTo });
	instance._setIsReady(true);
	instance.seekTo(10);
	t.expect(seekTo).toHaveBeenCalledWith(10, false);
});

test('seekTo() - fraction', function (t) {
	const load = vi.fn();
	const seekTo = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance._setPlayer({
		...playerRefMock,
		load,
		seekTo,
		getDuration: vi.fn().mockReturnValue(10)
	});
	instance._setIsReady(true);
	instance.seekTo(0.5);

	t.expect(seekTo).toHaveBeenCalledWith(5, false);
});

test('seekTo() - warning', function (t) {
	const stub = vi.spyOn(console, 'warn');
	const load = vi.fn();
	const seekTo = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance._setPlayer({
		...playerRefMock,
		load,
		seekTo,
		getDuration: vi.fn().mockReturnValue(null)
	});
	instance._setIsReady(true);
	instance.seekTo(0.5);

	t.expect(seekTo).not.toHaveBeenCalled();
	t.expect(stub).toHaveBeenCalledOnce();
	stub.mockRestore();
});

test('seekTo() - set seekOnPlay', function (t) {
	const load = vi.fn();
	const seekTo = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance._setPlayer({ ...playerRefMock, load, seekTo });
	instance._setIsReady(false);
	instance.seekTo(10);

	t.expect(seekTo).not.toHaveBeenCalled();
	t.expect(instance._getSeekOnPlay()).toStrictEqual(10);
});

test('onReady()', function (t) {
	const onReady = vi.fn();
	const load = vi.fn();
	const setVolume = vi.fn();
	const play = vi.fn();
	const handleDurationCheck = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, playing: true, volume: 1, handleDurationCheck }
	});

	instance.$on('ready', onReady);
	instance._setPlayer({ ...playerRefMock, load, setVolume, play });
	instance._setIsReady(true);
	instance.handleReady();
	t.expect(setVolume).toHaveBeenCalledWith(1);
	t.expect(play).toHaveBeenCalledOnce();
});

test('loadOnReady', function (t) {
	const onReady = vi.fn();
	const load = vi.fn();
	const play = vi.fn();
	const handleDurationCheck = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, playing: true, volume: 1, handleDurationCheck }
	});

	instance.$on('ready', onReady);
	instance._setPlayer({ ...playerRefMock, load, play });
	instance._setLoadOnReady('file.mp4');
	instance.handleReady();
	t.expect(load).toHaveBeenCalledWith('file.mp4', true);
	t.expect(play).not.toHaveBeenCalledOnce();
});

test('onPlay', function (t) {
	const onPlay = vi.fn();
	const handleDurationCheck = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, handleDurationCheck }
	});

	instance.$on('play', onPlay);
	instance._setPlayer(playerRefMock);
	instance.handlePlay();
	t.expect(onPlay).toHaveBeenCalledOnce();
	t.expect(instance._getIsPlaying()).toStrictEqual(true);
	t.expect(instance._getIsLoading()).toStrictEqual(false);
});

test('onStart', function (t) {
	const onStart = vi.fn();
	const handleDurationCheck = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, handleDurationCheck }
	});

	instance.$on('start', onStart);
	instance._setPlayer(playerRefMock);
	instance._setStartOnPlay(true);
	instance.handlePlay();
	t.expect(onStart).toHaveBeenCalledOnce();
	t.expect(instance._getStartOnPlay()).toStrictEqual(false);
});

test('seekOnPlay', function (t) {
	const seekTo = vi.fn();
	const handleDurationCheck = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, handleDurationCheck }
	});

	instance._setPlayer({ ...playerRefMock, seekTo });
	instance._setIsReady(true);
	instance._setSeekOnPlay(10);
	instance.handlePlay();
	t.expect(seekTo).toHaveBeenCalledWith(10, false);
	t.expect(instance._getSeekOnPlay()).toStrictEqual(null);
});

test('onPause()', function (t) {
	const onPause = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance.$on('pause', onPause);
	instance._setIsLoading(false);
	instance.handlePause();
	t.expect(onPause).toHaveBeenCalledOnce();
	t.expect(instance._getIsPlaying()).toStrictEqual(false);
});

test('onPause() - isLoading', function (t) {
	const onPause = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});

	instance.$on('pause', onPause);
	instance._setIsLoading(true);
	instance.handlePause();
	t.expect(onPause).not.toHaveBeenCalledOnce();
});

test('onEnded()', function (t) {
	const onEnded = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: TEST_PROPS
	});
	instance.$on('ended', onEnded);
	instance._setIsPlaying(true);
	instance.handleEnded();
	t.expect(onEnded).toHaveBeenCalledOnce();
	t.expect(instance._getIsPlaying()).toStrictEqual(false);
});

test('loopOnEnded', function (t) {
	const seekTo = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS, loop: true, loopOnEnded: true }
	});

	instance._setPlayer({ ...playerRefMock, seekTo });
	instance._setIsReady(true);
	instance._setIsPlaying(true);
	instance.handleEnded();
	t.expect(seekTo).toHaveBeenCalledWith(0, false);
	t.expect(instance._getIsPlaying()).toStrictEqual(true);
});

test('handleDurationCheck', function (t) {
	const onDuration = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS }
	});

	instance.$on('duration', onDuration);
	instance._setPlayer({ ...playerRefMock, getDuration: vi.fn().mockReturnValue(10) });
	instance._setIsReady(true);
	instance.handleDurationCheck();
	instance.handleDurationCheck(); // Call twice to ensure onDuration is not called again
	t.expect(onDuration).toHaveBeenCalledWith(
		expect.objectContaining({
			detail: 10
		})
	);
	t.expect(instance._getOnDurationCalled()).toStrictEqual(true);
});

test('durationCheckTimeout', function (t) {
	const onDuration = vi.fn();
	const instance = new PlayerSvelte({
		target: document.body,
		props: { ...TEST_PROPS }
	});

	instance.$on('duration', onDuration);
	instance._setPlayer({ ...playerRefMock, getDuration: vi.fn().mockReturnValue(null) });
	instance._setDurationCheckTimeout(null);
	instance.handleDurationCheck();
	t.expect(onDuration).not.toHaveBeenCalledWith();
	t.expect(instance._getDurationCheckTimeout()).toBeTruthy();
});
