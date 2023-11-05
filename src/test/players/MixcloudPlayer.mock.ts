import type { MixcloudWidget } from '../../lib/players/mixcloud.global.types';

class MixcloudWidgetMock implements MixcloudWidget {
	constructor() {
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
	togglePlay() {
		// do nothing
	}
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
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		play: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		pause: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		ended: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		progress: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		},
		error: {
			on() {
				// do nothing
			},
			off() {
				// do nothing
			}
		}
	};
}

export default MixcloudWidgetMock;
