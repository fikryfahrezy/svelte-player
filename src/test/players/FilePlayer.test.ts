import type { FileConfig } from '../../lib/players/file.types';

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
			on = () => null;
			loadSource = () => null;
			attachMedia = () => null;
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
			on = (event: string, cb: () => void) => {
				console.log(event);
				if (event === 'ERROR') {
					setTimeout(cb, 100);
				}
			};

			loadSource = () => null;
			attachMedia = () => null;
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
