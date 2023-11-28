import type { DailyMotionPlayer } from '../../lib/players/dailymotion.global.types';

class DailyMotionPlayerMock implements DailyMotionPlayer {
	bufferedTime = 0;
	currentTime = 0;
	duration = 0;

	constructor() {}
	load() {}
	pause() {}
	play() {}
	seek() {}
	setMuted() {}
	setVolume() {}
}

export default DailyMotionPlayerMock;
