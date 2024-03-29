import type { SpyInstance } from 'vitest';
import type { SvelteComponent, ComponentProps } from 'svelte';
import type { PlayerRef, PlayerInstance } from '../../lib/players/types';
import type { Constructor, ObjectMethodKeys } from '../../lib/players/utility.types';

import { vi, test, expect } from 'vitest';

type SvelteComponentOptions<C extends SvelteComponent> =
	| ComponentProps<C>
	| { props: ComponentProps<C> };

type Methods<TPlayer extends PlayerInstance> = {
	[k in keyof Partial<Omit<PlayerRef, 'load'>>]: ObjectMethodKeys<TPlayer> | null;
};

export default function <TComponent extends SvelteComponent, TPlayer extends PlayerInstance>(
	PlayerComponent: Constructor<TComponent>,
	player: TPlayer,
	methods: Methods<TPlayer>,
	props?: SvelteComponentOptions<TComponent>
) {
	for (const method of Object.keys(methods)) {
		test(`${method}`, async function (t) {
			const instance = new PlayerComponent({
				target: document.body,
				props
			});
			t.expect(instance[method]).toBeTruthy();
			instance._setPlayer(player);
			const playerMethod = methods[method as keyof typeof methods];

			let methodSpy: SpyInstance | undefined = undefined;
			if (playerMethod) {
				methodSpy = vi.spyOn(player, playerMethod).mockImplementation(async function () {
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
