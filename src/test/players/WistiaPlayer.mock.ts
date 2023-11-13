import type {
	WistiaPlayer,
	WistiaHeightOption,
	WistiaLookOption,
	WistiaLOOKCHANGEEventCallbackData,
	WistiaPlayerState,
	WistiaQualityOption
} from '../../lib/players/wistia.global.types';

class WistiaPlayerMock implements WistiaPlayer {
	constructor() {
		// do nothing
	}

	addToPlaylist() {
		// do nothing
	}
	aspect() {
		return 0;
	}
	bind() {
		// do nothing
	}
	cancelFullscreen() {
		// do nothing
	}
	duration() {
		return 0;
	}
	email(): string;
	email(_: string): void;
	email(): string | void {
		// do nothing
	}
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
	height(): number | void {
		// do nothing
	}
	inFullscreen() {
		return false;
	}
	isMuted() {
		return false;
	}
	look(): WistiaLOOKCHANGEEventCallbackData;
	look(options: Partial<WistiaLookOption>): void;
	look(): WistiaLOOKCHANGEEventCallbackData | void {
		// do nothing
	}
	mute() {
		// do nothing
	}
	name() {
		return '';
	}
	pause() {
		// do nothing
	}
	percentWatched() {
		return 0;
	}
	play() {
		// do nothing
	}
	playbackRate() {
		// do nothing
	}
	ready() {
		return false;
	}
	remove() {
		// do nothing
	}
	replaceWith() {
		// do nothing
	}
	requestFullscreen() {
		// do nothing
	}
	secondsWatched() {
		return 0;
	}
	secondsWatchedVector() {
		return [];
	}
	setSubtitlesScale() {
		// do nothing
	}
	state(): WistiaPlayerState {
		return 'beforeplay';
	}
	time(): number;
	time(seconds: number): void;
	time(): number | void {
		// do nothing
	}
	unbind() {
		// do nothing
	}
	unmute() {
		// do nothing
	}
	videoHeight(): number;
	videoHeight(pixels: number, options?: Partial<WistiaHeightOption>): void;
	videoHeight(): number | void {
		// do nothing
	}
	videoQuality(): WistiaQualityOption;
	videoQuality(quality: WistiaQualityOption): void;
	videoQuality(): WistiaQualityOption | void {
		// do nothing
	}
	videoWidth(): number;
	videoWidth(pixels: number, options?: Partial<WistiaHeightOption>): void;
	videoWidth(): number | void {
		// do nothing
	}
	visitorKey() {
		return '';
	}
	volume(): number;
	volume(volume: number): void;
	volume(): number | void {
		// do nothing
	}
	width(): number;
	width(pixels: number): void;
	width(): number | void {
		// do nothing
	}
}

export default WistiaPlayerMock;
