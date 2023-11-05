import type { SoundCloudPlayer } from '../../lib/players/soundcloud.global.types';

class SoundCloudPlayerMock implements SoundCloudPlayer {
	constructor() {
		// do nothing
	}
	bind() {
		// do nothing
	}
	unbind() {
		// do nothing
	}
	load() {
		// do nothing
	}
	play() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	toggle() {
		// do nothing
	}
	seekTo() {
		// do nothing
	}
	setVolume() {
		// do nothing
	}
	next() {
		// do nothing
	}
	prev() {
		// do nothing
	}
	skip() {
		// do nothing
	}
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
