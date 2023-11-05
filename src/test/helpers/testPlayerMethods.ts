import type { SpyInstance } from 'vitest';
import type { SvelteComponent, ComponentProps } from 'svelte';
import type { PlayerRef, PlayerInstance } from '../../lib/players/types';
import type { Constructor, ObjectMethods } from '../../lib/players/utility.types';

import { vi, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';

type SvelteComponentOptions<C extends SvelteComponent> =
	| ComponentProps<C>
	| { props: ComponentProps<C> };

type Methods<TPlayer extends PlayerInstance> = {
	[k in keyof Partial<Omit<PlayerRef, 'load'>>]: keyof ObjectMethods<TPlayer> | null;
};

export default function <TComponent extends SvelteComponent, TPlayer extends PlayerInstance>(
	PlayerComponent: Constructor<TComponent>,
	player: TPlayer,
	methods: Methods<TPlayer>,
	props?: SvelteComponentOptions<TComponent>
) {
	for (const method of Object.keys(methods)) {
		test(`${method}`, async function (t) {
			const instance = render(PlayerComponent, props).component;
			t.expect(instance[method]).toBeTruthy();
			instance._setPlayer(player);
			const playerMethod = methods[method as keyof Methods<TPlayer>];

			let methodSpy: SpyInstance | undefined = undefined;
			if (playerMethod) {
				// TODO: fix type and async implementation
				methodSpy = vi
					.spyOn(player as any, playerMethod as string)
					.mockImplementation(async function () {
						return vi.fn();
					});
			}

			instance[method]();

			if (methodSpy) {
				expect(methodSpy).toHaveBeenCalled();
				methodSpy.mockRestore();
			}
		});
	}
}
