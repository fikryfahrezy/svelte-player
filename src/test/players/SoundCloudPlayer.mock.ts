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
		return {};
	}
	getDuration() {
		return {};
	}
	getPosition() {
		return {};
	}
	getSounds() {
		return [];
	}
	getCurrentSound() {
		return {};
	}
	getCurrentSoundIndex() {
		return {};
	}
	isPaused() {
		return {};
	}
}

export default SoundCloudPlayerMock;
