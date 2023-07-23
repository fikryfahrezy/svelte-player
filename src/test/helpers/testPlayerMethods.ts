import type { SpyInstance } from 'vitest';
import type { SvelteComponent, ComponentProps } from 'svelte';
import type { PlayerMedia } from '../../lib/types';
import type { GlobalSDK } from '../../lib/players/global.types';

import { vi, test, expect } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import * as utils from '../../lib/players/utils';

type Constructor<T> = new (...args: any[]) => T;

type SvelteComponentOptions<C extends SvelteComponent> =
	| ComponentProps<C>
	| { props: ComponentProps<C> };

type Methods = {
	[k in keyof Partial<Omit<PlayerMedia, 'load'>>]: string | null;
};

type TestPlayerMethodParams<C extends SvelteComponent> = {
	Player: Constructor<C>;
	loadParameters: Parameters<PlayerMedia['load']>;
	props?: SvelteComponentOptions<C>;
	playerSDK: GlobalSDK[keyof GlobalSDK];
	methods: Methods;
};

export default function <C extends SvelteComponent>({
	Player,
	props,
	loadParameters,
	methods,
	playerSDK
}: TestPlayerMethodParams<C>) {
	test(`${Player.name} Methods`, async () => {
		const getSDK = vi.spyOn(utils, 'getSDK').mockImplementation(async () => {
			return playerSDK;
		});

		const instance = render(Player, props).component;
		instance.load(...loadParameters);

		await waitFor(() => {
			expect(instance.getPlayer()).not.toBeNull();
		});

		const player = instance.getPlayer();

		for (const method of Object.keys(methods)) {
			let methodSpy: SpyInstance | undefined = undefined;
			const methodName = methods[method as keyof Methods];

			if (methodName) {
				methodSpy = vi.spyOn(player, methodName).mockImplementation(() => {
					return undefined;
				});
			}

			instance[method]();

			if (methodSpy !== undefined) {
				expect(methodSpy).toHaveBeenCalled();
				methodSpy.mockRestore();
			}
		}

		getSDK.mockRestore();
	});
}
