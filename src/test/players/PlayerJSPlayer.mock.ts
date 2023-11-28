import type { PlayerJSPlayer } from '../../lib/players/playerjs.global.types';

class PlayerJSPlayerMock implements PlayerJSPlayer {
	isReady = false;

	constructor() {}
	getCurrentTime() {}
	getMuted() {}
	getDuration() {
		return 0;
	}
	getPaused() {}
	getVolume() {
		return 0;
	}
	mute() {}
	off() {}
	on() {}
	pause() {}
	play() {}
	setCurrentTime() {}
	setLoop() {}
	setVolume() {}
	supports() {
		return false;
	}
	unmute() {}
}

export default PlayerJSPlayerMock;
