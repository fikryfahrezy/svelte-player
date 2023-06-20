import type { PlayerUrl } from './types';
import type { FilePlayerUrl } from './file-types';

import { isMediaStream, isBlobUrl } from './utils';

// The codes in this file, is just copy-paste from https://github.com/cookpete/react-player
// See original: https://github.com/cookpete/react-player/blob/master/src/patterns.js

export const MATCH_URL_YOUTUBE =
	/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
export const AUDIO_EXTENSIONS =
	/\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
export const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
export const FLV_EXTENSIONS = /\.(flv)($|\?)/i;

export function canPlayYoutube(url: PlayerUrl) {
	if (url instanceof Array) {
		return url.every((item) => MATCH_URL_YOUTUBE.test(item));
	}
	return MATCH_URL_YOUTUBE.test(url);
}

export function canPlayFile(url: FilePlayerUrl) {
	if (url instanceof Array) {
		for (const item of url) {
			if (typeof item === 'string' && canPlayFile(item)) {
				return true;
			}
			if (typeof item === 'object' && canPlayFile(item.src)) {
				return true;
			}
		}
		return false;
	}
	if (isMediaStream(url) || isBlobUrl(url)) {
		return true;
	}
	return (
		AUDIO_EXTENSIONS.test(url) ||
		VIDEO_EXTENSIONS.test(url) ||
		HLS_EXTENSIONS.test(url) ||
		DASH_EXTENSIONS.test(url) ||
		FLV_EXTENSIONS.test(url)
	);
}
