import type { DailyMotionConfig } from '../../lib/players/dailymotion.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import DailyMotion from '../../lib/players/DailyMotion.svelte';

describe('testPlayerMethods', () => {
	testPlayerMethods(DailyMotion, {
		play: 'play',
		pause: 'pause',
		stop: null,
		seekTo: 'seek',
		setVolume: 'setVolume',
		mute: 'setMuted',
		unmute: 'setMuted'
	});
});
