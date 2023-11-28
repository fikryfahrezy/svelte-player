import type { MixcloudWidget } from '../../lib/players/mixcloud.global.types';

class MixcloudWidgetMock implements MixcloudWidget {
	constructor() {}
	load() {}
	play() {}
	pause() {}
	togglePlay() {}
	async seek() {
		return false;
	}
	async getPosition() {
		return 0;
	}
	async getDuration() {
		return 0;
	}
	async getIsPaused() {
		return false;
	}
	ready = Promise.resolve(null as never);
	events = {
		buffering: {
			on() {},
			off() {}
		},
		play: {
			on() {},
			off() {}
		},
		pause: {
			on() {},
			off() {}
		},
		ended: {
			on() {},
			off() {}
		},
		progress: {
			on() {},
			off() {}
		},
		error: {
			on() {},
			off() {}
		}
	};
}

export default MixcloudWidgetMock;
