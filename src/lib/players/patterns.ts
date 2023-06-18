import type { PlayerUrl } from './types';

// The codes in this file, is just copy-paste from https://github.com/cookpete/react-player
// See original: https://github.com/cookpete/react-player/blob/master/src/patterns.js

export const MATCH_URL_YOUTUBE =
	/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

export const youtube = (url: PlayerUrl) => {
	if (url instanceof Array) {
		return url.every((item) => MATCH_URL_YOUTUBE.test(item));
	}
	return MATCH_URL_YOUTUBE.test(url);
};
