import type { DailyMotionPlayer } from '../../lib/players/dailymotion.global.types';

class DailyMotionPlayerMock implements DailyMotionPlayer {
	bufferedTime = 0;
	currentTime = 0;
	duration = 0;

	constructor() {
		// do nothing
	}
	load() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	play() {
		// do nothing
	}
	seek() {
		// do nothing
	}
	setMuted() {
		// do nothing
	}
	setVolume() {
		// do nothing
	}
}

export default DailyMotionPlayerMock;
