import type { PlayerMediaRef } from '../../lib/types';

import { vi, test, describe } from 'vitest';
import SveltePlayer from '../../lib/SveltePlayer.svelte';

const playerMediaRefMock: PlayerMediaRef = {
	getCurrentTime() {
		return 123;
	},
	getDuration() {
		return 123;
	},
	getSecondsLoaded() {
		return 123;
	},
	seekTo() {
		return;
	},
	getInternalPlayer() {
		return document.createElement('video');
	}
};

describe('COMMON_METHODS', function () {
	const COMMON_TIME_METHODS = [
		'getDuration',
		'getCurrentTime',
		'getSecondsLoaded',
		'getInternalPlayer'
	] as const;

	for (const method of COMMON_TIME_METHODS) {
		test(`${method}()`, function (t) {
			const instance = new SveltePlayer({
				target: document.body
			});

			instance._setPlayer({
				...playerMediaRefMock,
				[method]: vi.fn().mockImplementation(() => {
					return 123;
				})
			});

			t.expect(instance[method]()).toStrictEqual(123);
		});

		test(`${method}() - null`, (t) => {
			const instance = new SveltePlayer({
				target: document.body
			});

			t.expect(instance[method]()).toStrictEqual(null);
		});
	}
});

test('getInternalPlayer() - default', (t) => {
	const instance = new SveltePlayer({
		target: document.body
	});

	const getInternalPlayer = vi.fn().mockImplementation(() => {
		return 'abc';
	});
	instance._setPlayer({ ...playerMediaRefMock, getInternalPlayer });

	t.expect(instance.getInternalPlayer()).toStrictEqual('abc');
	t.expect(getInternalPlayer).toHaveBeenNthCalledWith(1, 'player');
});

test('seekTo()', (t) => {
	const instance = new SveltePlayer({
		target: document.body
	});

	instance._setPlayer({ ...playerMediaRefMock, seekTo: vi.fn() });
	instance.seekTo(5);

	t.expect(instance._getPlayer().seekTo).toHaveBeenCalledOnce();
	t.expect(instance._getPlayer().seekTo).toHaveBeenCalledWith(5, undefined, undefined);
});

test('seekTo() - null', (t) => {
	const instance = new SveltePlayer({
		target: document.body
	});
	t.expect(instance.seekTo(5)).toStrictEqual(null);
});

test('onReady()', (t) => {
	const onReady = vi.fn();
	const instance = new SveltePlayer({
		target: document.body
	});

	instance.$on('ready', onReady);
	instance.handleReady();

	t.expect(onReady).toHaveBeenCalledOnce();
});

test('refs', (t) => {
	const instance = new SveltePlayer({
		target: document.body
	});

	instance._setPlayer(playerMediaRefMock);
	t.expect(instance._getPlayer()).toStrictEqual(playerMediaRefMock);
});
