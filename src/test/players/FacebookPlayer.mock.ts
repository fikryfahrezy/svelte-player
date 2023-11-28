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
	mute() {},
	pause() {},
	play() {},
	seek() {},
	setVolume() {},
	subscribe() {
		return {
			release() {}
		};
	},
	unmute() {}
};

export default facebookPlayer;
