import type {
	Twitch,
	TwitchPlayer,
	TwitchPlaybackStats
} from '../../lib/players/twitch.global.types';
import type { TwitchConfig } from '../../lib/players/twitch.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import TwitchSvelte from '../../lib/players/Twitch.svelte';

const TEST_URL = 'https://www.twitch.tv/videos/106400740';

const TEST_CONFIG: TwitchConfig = {
	options: {},
	playerId: null
};

const TEST_PROPS = {
	controls: false,
	muted: false,
	playing: false,
	playsinline: false,
	config: TEST_CONFIG
};

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
	constructor() {
		// do nothing
	}
	disableCaptions() {
		// do nothing
	}
	enableCaptions() {
		// do nothing
	}
	pause() {
		// do nothing
	}
	play() {
		// do nothing
	}
	seek() {
		// do nothing
	}
	setChannel() {
		// do nothing
	}
	setCollection() {
		// do nothing
	}
	setQuality() {
		// do nothing
	}
	setVideo() {
		// do nothing
	}
	getMuted() {
		return false;
	}
	setMuted() {
		// do nothing
	}
	getVolume() {
		return 0;
	}
	setVolume() {
		// do nothing
	}
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
	addEventListener() {
		// do nothing
	}

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

const PLAYERJS_SDK: Twitch = {
	Player: TwitchPlayerMock
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: TwitchSvelte,
		playerSDK: PLAYERJS_SDK,
		loadParameters: [TEST_URL, false],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: 'pause',
			seekTo: 'seek',
			setVolume: 'setVolume',
			mute: 'setMuted',
			unmute: 'setMuted',
			getDuration: 'getDuration',
			getCurrentTime: 'getCurrentTime',
			getSecondsLoaded: null
		},
		props: TEST_PROPS
	});
});
