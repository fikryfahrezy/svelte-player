import type { SoundCloudPlayer } from '../../lib/players/soundcloud.global.types';

class SoundCloudPlayerMock implements SoundCloudPlayer {
	constructor() {}
	bind() {}
	unbind() {}
	load() {}
	play() {}
	pause() {}
	toggle() {}
	seekTo() {}
	setVolume() {}
	next() {}
	prev() {}
	skip() {}
	getVolume() {
		return 0;
	}
	getDuration() {
		return 0;
	}
	getPosition() {
		return 0;
	}
	getSounds() {
		return [];
	}
	getCurrentSound() {
		return {};
	}
	getCurrentSoundIndex() {
		return 0;
	}
	isPaused() {
		return false;
	}
}

export default SoundCloudPlayerMock;
