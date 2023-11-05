import type { FacebookPlayer } from '../../lib/players/facebook.global.types';

const facebookPlayer: FacebookPlayer = {
	getCurrentPosition() {
		return 0;
	},
	getDuration() {
		return 0;
	},
	getVolume() {
		return 0;
	},
	isMuted() {
		return false;
	},
	mute() {
		// do nothing
	},
	pause() {
		// do nothing
	},
	play() {
		// do nothing
	},
	seek() {
		// do nothing
	},
	setVolume() {
		// do nothing
	},
	subscribe() {
		return {
			release() {
				// do nothing
			}
		};
	},
	unmute() {
		// do nothing
	}
};

export default facebookPlayer;
