import type { Mock, SpyInstance } from 'vitest';
import type { SvelteComponent } from 'svelte';
import type { PlayerMedia, PlayerProps } from '../../lib/types';

import { vi, test, beforeEach, afterEach, expect } from 'vitest';
import * as utils from '../../lib/players/utils';

type Constructor<T> = new (...args: any[]) => T;

type Methods = {
	[k in keyof Partial<Omit<PlayerMedia, 'load'>>]: string | null;
};

export default function (
	Player: Constructor<SvelteComponent>,
	methods: Methods,
	props?: Partial<PlayerProps>
) {
	let callPlayer: SpyInstance;
	let returnFunction: Mock;

	beforeEach(() => {
		returnFunction = vi.fn();
		callPlayer = vi.spyOn(utils, 'callPlayer').mockImplementation(() => returnFunction);
	});

	afterEach(() => {
		returnFunction.mockRestore();
		callPlayer.mockRestore();
	});

	test.each(
		Object.keys(methods).map((method) => {
			return [method];
		})
	)('%s', (method) => {
		const instance = new Player({
			target: document.body,
			props: props
		});
		instance[method]();
		const methodName = methods[method as keyof Methods];
		if (methodName) {
			expect(returnFunction).toHaveBeenCalled();
		}
	});
}
