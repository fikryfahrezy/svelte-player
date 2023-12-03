import type {
	YTPlayer,
	YTPlaybackRate,
	YTPlayerStateValue
} from '../../lib/players/youtube.global.types';

class YouTubePlayerMock implements YTPlayer {
	constructor() {
		// do nothiing
	}

	cueVideoById() {}

	loadVideoById() {}

	cueVideoByUrl() {}

	loadVideoByUrl() {}

	cuePlaylist() {}

	loadPlaylist() {}

	playVideo() {}
	pauseVideo() {}
	stopVideo() {}
	seekTo() {}
	getSphericalProperties() {
		return {};
	}

	setSphericalProperties() {}
	nextVideo() {}
	previousVideo() {}
	playVideoAt() {}
	mute() {}
	unMute() {}
	isMuted() {
		return false;
	}
	setVolume() {}
	getVolume() {
		return 0;
	}
	setSize() {
		return this as unknown as YTPlayer;
	}
	getPlaybackRate(): YTPlaybackRate {
		return 1;
	}
	setPlaybackRate() {}
	getAvailablePlaybackRates(): YTPlaybackRate[] {
		return [1];
	}
	setLoop() {}
	setShuffle() {}
	getVideoLoadedFraction() {
		return 0;
	}
	getPlayerState(): YTPlayerStateValue {
		return 0;
	}
	getCurrentTime() {
		return 0;
	}
	getDuration() {
		return 0;
	}
	getVideoUrl() {
		return '';
	}
	getVideoEmbedCode() {
		return '';
	}
	getPlaylist() {
		return [''];
	}
	getPlaylistIndex() {
		return 0;
	}
	addEventListener() {}
	removeEventListener() {}
	getIframe() {
		return document.createElement('iframe');
	}
	destroy() {}
	getOption() {}
	getOptions() {}
	setOption() {}
}

export default YouTubePlayerMock;
