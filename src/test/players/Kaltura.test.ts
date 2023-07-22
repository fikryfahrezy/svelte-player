import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import Kaltura from '../../lib/players/Kaltura.svelte';

const TEST_URL =
	'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622336&entry_id=1_i1jmzcn3';

describe('testPlayerMethods', () => {
	testPlayerMethods(
		Kaltura,
		{
			play: 'play',
			pause: 'pause',
			stop: null,
			seekTo: 'setCurrentTime',
			setVolume: 'setVolume',
			mute: 'mute',
			unmute: 'unmute'
		},
		{ url: TEST_URL }
	);
});
