import type {
	Vimeo,
	VimeoPlayer,
	VimeoPlayerTextTrack,
	VimeoPlayerChapter,
	VimeoPlayerOptions,
	VimeoEmbedOptions,
	VimeoPlayerSetAutopauseParams
} from '../../lib/players/vimeo.global.types';
import type { ViemoConfig } from '../../lib/players/vimeo.types';

import { describe } from 'vitest';
import testPlayerMethods from '../helpers/testPlayerMethods';

import VimeoSvelte from '../../lib/players/Vimeo.svelte';

const TEST_URL = 'https://vimeo.com/90509568';

const TEST_CONFIG: ViemoConfig = {
	playerOptions: {},
	title: null
};

const TEST_PROPS = {
	playing: false,
	loop: false,
	controls: false,
	muted: false,
	playsinline: false,
	config: TEST_CONFIG
};

const vimeoPlayerTextTrack: VimeoPlayerTextTrack = {
	kind: '',
	label: '',
	language: '',
	mode: ''
};

const vimeoPlayerChapter: VimeoPlayerChapter = {
	index: 0,
	startTime: 0,
	title: ''
};

class VimeoPlayerMock implements VimeoPlayer {
	constructor() {
		// do nothing
	}
	async getAutopause() {
		return false;
	}
	async getCurrentTime() {
		return 0;
	}
	async getDuration() {
		return 0;
	}
	async getEnded() {
		return false;
	}
	async getLoop() {
		return false;
	}
	async getPaused() {
		return false;
	}
	async getPlaybackRate() {
		return 0;
	}
	async getVolume() {
		return 0;
	}
	async pause() {
		// do nothing
	}
	async play() {
		// do nothing
	}
	setAutopause<T extends VimeoEmbedOptions['autopause']>(params: VimeoPlayerSetAutopauseParams<T>) {
		return params.autopause;
	}
	async setCurrentTime<T extends number>(seconds: T) {
		return seconds;
	}
	async setLoop<T extends VimeoEmbedOptions['loop']>(loop: T) {
		return loop;
	}
	async setPlaybackRate<T extends number>(playbackRate: T) {
		return playbackRate;
	}
	async setVolume<T extends number>(volume: T) {
		return volume;
	}
	async getChapters() {
		return [];
	}
	async getCurrentChapter() {
		return vimeoPlayerChapter;
	}
	async addCuePoint() {
		return '';
	}
	async getCuePoints() {
		return [];
	}
	async removeCuePoint<T extends string>(id: T) {
		return id;
	}
	async disableTextTrack() {
		// do nothing
	}
	async enableTextTrack() {
		return vimeoPlayerTextTrack;
	}
	async getTextTracks() {
		return [];
	}
	async destroy() {
		// do nothing
	}
	async getColor() {
		return '';
	}
	async getColors() {
		return [];
	}
	async getVideoEmbedCode() {
		return '';
	}
	async getVideoHeight() {
		return 0;
	}
	async getVideoId() {
		return 0;
	}
	async getVideoTitle() {
		return '';
	}
	async getVideoUrl() {
		return '';
	}
	async getVideoWidth() {
		return 0;
	}
	async ready() {
		// do nothing
	}
	setColor<T extends VimeoPlayerOptions['color']>(color: T) {
		return color;
	}
	setColors<T extends VimeoPlayerOptions['colors']>(colors: T) {
		return colors;
	}
	unload() {
		// do nothing
	}
	async loadVideo() {
		return 0;
	}
	on() {
		// do nothing
	}
	off() {
		// do nothing
	}
}

const PLAYERJS_SDK: Vimeo = {
	Player: VimeoPlayerMock
};

describe('testPlayerMethods', () => {
	testPlayerMethods({
		Player: VimeoSvelte,
		playerSDK: PLAYERJS_SDK,
		loadParameters: [TEST_URL],
		methods: {
			play: 'play',
			pause: 'pause',
			stop: 'unload',
			seekTo: 'setCurrentTime',
			setVolume: 'setVolume',
			mute: 'setVolume',
			unmute: 'setVolume',
			getDuration: null,
			getCurrentTime: null,
			getSecondsLoaded: null
		},
		props: TEST_PROPS
	});
});
