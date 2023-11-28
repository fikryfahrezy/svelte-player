import type { TwitchPlayer, TwitchPlaybackStats } from '../../lib/players/twitch.global.types';

const twitchPlaybackStats: TwitchPlaybackStats = {
	backendVersion: '',
	bufferSize: 0,
	codecs: '',
	displayResolution: '',
	fps: '',
	hlsLatencyBroadcaster: 0,
	playbackRate: 0,
	skippedFrames: 0,
	videoResolution: ''
};

class TwitchPlayerMock implements TwitchPlayer {
	constructor() {}
	disableCaptions() {}
	enableCaptions() {}
	pause() {}
	play() {}
	seek() {}
	setChannel() {}
	setCollection() {}
	setQuality() {}
	setVideo() {}
	getMuted() {
		return false;
	}
	setMuted() {}
	getVolume() {
		return 0;
	}
	setVolume() {}
	getPlaybackStats() {
		return twitchPlaybackStats;
	}
	getChannel() {
		return '';
	}
	getCurrentTime() {
		return 0;
	}
	getDuration() {
		return 0;
	}
	getEnded() {
		return false;
	}
	getQualities() {
		return [];
	}
	getQuality() {
		return '';
	}
	getVideo() {
		return '';
	}
	isPaused() {
		return false;
	}
	addEventListener() {}

	static CAPTIONS = 'captions' as const;
	static ENDED = 'ended' as const;
	static PAUSE = 'pause' as const;
	static PLAY = 'play' as const;
	static PLAYBACK_BLOCKED = 'playbackBlocked' as const;
	static PLAYING = 'playing' as const;
	static OFFLINE = 'offline' as const;
	static ONLINE = 'online' as const;
	static READY = 'ready' as const;
	static SEEK = 'seek' as const;
}

export default TwitchPlayerMock;
