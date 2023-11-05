import type { PlayerJSPlayer } from '../../lib/players/playerjs.global.types';

class PlayerJSPlayerMock implements PlayerJSPlayer {
	isReady = false;

	constructor() {
		// do nothing
	}
	getCurrentTime() {
		// do nothing
	}
	getMuted() {
		// do nothing
	}
	getDuration() {
		return 0;
	}
	getPaused() {
		// do nothing
	}
	getVolume() {
		return 0;
	}
	mute() {
		// do nothing
	}
	off() {
		// do nothing
	}
	on() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	play() {
		// do nothing
	}
	setCurrentTime() {
		// do nothing
	}
	setLoop() {
		// do nothing
	}
	setVolume() {
		// do nothing
	}
	supports() {
		return false;
	}
	unmute() {
		// do nothing
	}
}

export default PlayerJSPlayerMock;
