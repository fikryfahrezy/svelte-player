import type { FileConfig } from '../../lib/players/file.types';
import type { DashJS, DashJSDebugLogLevel } from '../../lib/players/dash.types';

import { test, beforeAll, afterAll, vi, expect } from 'vitest';

import { defaultConfig } from '../../lib/props';
import * as utils from '../../lib/players/utils';
import FilePlayerSvelte from '../../lib/players/FilePlayer.svelte';

const wait = async (callback: () => void, timeout: number) => {
	await new Promise((resolve) => {
		setTimeout(() => {
			callback();
			resolve(undefined);
		}, timeout);
	});
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

class MockMediaStream {}

beforeAll(() => {
	vi.stubGlobal('navigator', {});

	vi.stubGlobal('window', {
		MediaStream: MockMediaStream,
		URL: {
			createObjectURL: () => 'mockObjectURL'
		}
	});
});

afterAll(() => {
	vi.unstubAllGlobals();
});

test('load - hls', async (t) => {
	vi.doMock('hls.js', () => {
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
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return Hls;
	});
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			url,
			...TEST_PROPS
		}
	});

	const onLoaded = vi.fn();
	instance.$on('loaded', onLoaded);
	instance.load(url);
	t.expect(getSDK).toHaveBeenCalledOnce();
	await expect(
		wait(() => {
			t.expect(onLoaded).toHaveBeenCalledOnce();
		}, 100)
	).resolves.toEqual(undefined);
	getSDK.mockRestore();
});

test('onError - hls', async (t) => {
	vi.doMock('hls.js', () => {
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

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return Hls;
	});

	const url = 'file.m3u8';
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			url,
			...TEST_PROPS
		}
	});

	const onError = vi.fn();
	instance.$on('error', onError);
	instance.load(url);
	t.expect(getSDK).toHaveBeenCalledOnce();
	await expect(
		wait(() => {
			t.expect(onError).toHaveBeenCalledOnce();
		}, 200)
	).resolves.toEqual(undefined);
	getSDK.mockRestore();
});

test('onError - flv', async (t) => {
	vi.doMock('flv.js', () => {
		class FlvPlayer {
			attachMediaElement() {
				// do nothing
			}

			on(event: string, cb: (...args: unknown[]) => void) {
				if (event === 'error') {
					setTimeout(() => {
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

	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return flv;
	});

	const url = 'file.flv';
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			url,
			...TEST_PROPS
		}
	});

	const onError = vi.fn();
	instance.$on('error', onError);
	instance.load(url);
	t.expect(getSDK).toHaveBeenCalledOnce();
	await expect(
		wait(() => {
			t.expect(onError).toHaveBeenCalledOnce();
		}, 200)
	).resolves.toEqual(undefined);
	getSDK.mockRestore();
});

test('load - dash', async (t) => {
	vi.doMock('dashjs', () => {
		const dashjs = {
			MediaPlayer() {
				return {
					create() {
						return {
							on() {
								return null;
							},
							initialize() {
								return null;
							},
							getDebug() {
								return {
									setLogToBrowserConsole() {
										return null;
									}
								};
							},
							updateSettings() {
								return null;
							}
						};
					}
				};
			}
		};

		return { default: dashjs };
	});

	const dashjsSDK = (await import('dashjs')).default;
	const dashjs: DashJS = {
		...dashjsSDK,
		Debug: {
			LOG_LEVEL_NONE: 0,
			LOG_LEVEL_FATAL: 1,
			LOG_LEVEL_ERROR: 2,
			LOG_LEVEL_WARNING: 3,
			LOG_LEVEL_INFO: 4,
			LOG_LEVEL_DEBUG: 5
		}
	};

	const url = 'file.mpd';
	const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
		return dashjs;
	});
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			url,
			...TEST_PROPS
		}
	});

	const onLoaded = vi.fn();
	instance.$on('loaded', onLoaded);
	instance.load(url);
	t.expect(getSDK).toHaveBeenCalledOnce();
	await expect(
		wait(() => {
			t.expect(onLoaded).toHaveBeenCalledOnce();
		}, 100)
	).resolves.toEqual(undefined);
	getSDK.mockRestore();
});

test('load - MediaStream', async (t) => {
	const url = new window.MediaStream();
	const instance = new FilePlayerSvelte({
		target: document.body,
		props: {
			url,
			...TEST_PROPS
		}
	});

	instance.load(url);
});
