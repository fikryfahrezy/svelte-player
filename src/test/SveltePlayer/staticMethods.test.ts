import SveletePlayer, {
	canPlay,
	addCustomPlayer,
	removeCustomPlayers
} from '../../lib/SveltePlayer.svelte';

import { test } from 'vitest';
import { waitFor, render, screen } from '@testing-library/svelte';

test('canPlay()', function (t) {
	t.expect(canPlay('https://www.youtube.com/watch?v=oUFJJNQGwhk')).toStrictEqual(true);
	t.expect(canPlay('https://youtube.com/shorts/370kwJ-x5TY?feature=share')).toStrictEqual(true);
	t.expect(canPlay('https://soundcloud.com/miami-nights-1984/accelerated')).toStrictEqual(true);
	t.expect(canPlay('https://www.facebook.com/facebook/videos/10153231379946729')).toStrictEqual(
		true
	);
	t.expect(canPlay('https://vimeo.com/90509568')).toStrictEqual(true);
	t.expect(canPlay('https://www.twitch.tv/videos/106400740')).toStrictEqual(true);
	t.expect(canPlay('https://streamable.com/moo')).toStrictEqual(true);
	t.expect(canPlay('https://home.wistia.com/medias/e4a27b971d')).toStrictEqual(true);
	t.expect(canPlay('https://www.dailymotion.com/video/x5e9eog')).toStrictEqual(true);
	t.expect(canPlay('https://www.mixcloud.com/mixcloud/meet-the-curators')).toStrictEqual(true);
	t.expect(canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')).toStrictEqual(true);
	t.expect(canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4#t=1')).toStrictEqual(true);
	t.expect(canPlay('http://example.com/random/path')).toStrictEqual(false);
});

test('addCustomPlayer()', async function (t) {
	t.expect.assertions(3);
	addCustomPlayer({
		key: 'not-implemented',
		name: 'CustomPlayer',
		canPlay(url) {
			return /example\.com/.test(String(url));
		},
		loadComponent() {
			return import('../../lib/players/NotImplemented.svelte');
		}
	});

	t.expect(canPlay('http://example.com/random/path')).toStrictEqual(true);

	render(SveletePlayer, { url: 'http://example.com/random/path' });
	await waitFor(function () {
		t.expect(screen.getByText('not implemented yet.')).toBeDefined();
	});

	removeCustomPlayers();
	t.expect(canPlay('http://example.com/random/path')).toStrictEqual(false);
});
