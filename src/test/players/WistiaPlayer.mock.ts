import type {
	WistiaPlayer,
	WistiaHeightOption,
	WistiaLookOption,
	WistiaLOOKCHANGEEventCallbackData,
	WistiaPlayerState,
	WistiaQualityOption
} from '../../lib/players/wistia.global.types';

class WistiaPlayerMock implements WistiaPlayer {
	constructor() {}

	addToPlaylist() {}
	aspect() {
		return 0;
	}
	bind() {}
	cancelFullscreen() {}
	duration() {
		return 0;
	}
	email(): string;
	email(_: string): void;
	email(): string | void {}
	embedded() {
		return false;
	}
	eventKey() {
		return '';
	}
	getSubtitlesScale() {
		return 0;
	}
	hasData() {
		return false;
	}
	hashedId() {
		return '';
	}
	height(): number;
	height(height: number, options?: Partial<WistiaHeightOption>): void;
	height(): number | void {}
	inFullscreen() {
		return false;
	}
	isMuted() {
		return false;
	}
	look(): WistiaLOOKCHANGEEventCallbackData;
	look(options: Partial<WistiaLookOption>): void;
	look(): WistiaLOOKCHANGEEventCallbackData | void {}
	mute() {}
	name() {
		return '';
	}
	pause() {}
	percentWatched() {
		return 0;
	}
	play() {}
	playbackRate() {}
	ready() {
		return false;
	}
	remove() {}
	replaceWith() {}
	requestFullscreen() {}
	secondsWatched() {
		return 0;
	}
	secondsWatchedVector() {
		return [];
	}
	setSubtitlesScale() {}
	state(): WistiaPlayerState {
		return 'beforeplay';
	}
	time(): number;
	time(seconds: number): void;
	time(): number | void {}
	unbind() {}
	unmute() {}
	videoHeight(): number;
	videoHeight(pixels: number, options?: Partial<WistiaHeightOption>): void;
	videoHeight(): number | void {}
	videoQuality(): WistiaQualityOption;
	videoQuality(quality: WistiaQualityOption): void;
	videoQuality(): WistiaQualityOption | void {}
	videoWidth(): number;
	videoWidth(pixels: number, options?: Partial<WistiaHeightOption>): void;
	videoWidth(): number | void {}
	visitorKey() {
		return '';
	}
	volume(): number;
	volume(volume: number): void;
	volume(): number | void {}
	width(): number;
	width(pixels: number): void;
	width(): number | void {}
}

export default WistiaPlayerMock;
