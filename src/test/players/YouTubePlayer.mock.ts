import type {
	YTPlayer,
	YTPlaybackRate,
	YTPlayerStateValue
} from '../../lib/players/youtube.global.types';

class YouTubePlayerMock implements YTPlayer {
	constructor() {
		// do nothiing
	}

	cueVideoById() {
		// do nothing
	}

	loadVideoById() {
		// do nothing
	}

	cueVideoByUrl() {
		// do nothing
	}

	loadVideoByUrl() {
		// do nothing
	}

	cuePlaylist() {
		// do nothing
	}

	loadPlaylist() {
		// do nothing
	}

	playVideo() {
		// do nothing
	}
	pauseVideo() {
		// do nothing
	}
	stopVideo() {
		// do nothing
	}
	seekTo() {
		// do nothing
	}
	getSphericalProperties() {
		return {};
	}

	setSphericalProperties() {
		// do nothing
	}
	nextVideo() {
		// do nothing
	}
	previousVideo() {
		// do nothing
	}
	playVideoAt() {
		// do nothing
	}
	mute() {
		// do nothing
	}
	unMute() {
		// do nothing
	}
	isMuted() {
		return false;
	}
	setVolume() {
		// do nothing
	}
	getVolume() {
		return 0;
	}
	setSize() {
		return {};
	}
	getPlaybackRate(): YTPlaybackRate {
		return 1;
	}
	setPlaybackRate() {
		// do nothing
	}
	getAvailablePlaybackRates(): YTPlaybackRate[] {
		return [1];
	}
	setLoop() {
		// do nothing
	}
	setShuffle() {
		// do nothing
	}
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
	addEventListener() {
		// do nothing
	}
	removeEventListener() {
		// do nothing
	}
	getIframe() {
		return document.createElement('iframe');
	}
	destroy() {
		// do nothing
	}
}

export default YouTubePlayerMock;
