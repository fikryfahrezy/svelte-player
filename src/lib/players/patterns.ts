import type { FilePlayerUrl } from './types';

import { isMediaStream, isBlobUrl } from './utils';

// The codes in this file, is just copy-paste from https://github.com/cookpete/react-player
// See original: https://github.com/cookpete/react-player/blob/master/src/patterns.js

export const MATCH_URL_YOUTUBE =
	/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
export const MATCH_URL_SOUNDCLOUD = /(?:soundcloud\.com|snd\.sc)\/[^.]+$/;
export const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/;
export const MATCH_URL_FACEBOOK =
	/^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
export const MATCH_URL_FACEBOOK_WATCH = /^https?:\/\/fb\.watch\/.+$/;
export const MATCH_URL_STREAMABLE = /streamable\.com\/([a-z0-9]+)$/;
export const MATCH_URL_WISTIA =
	/(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/;
export const MATCH_URL_TWITCH_VIDEO = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/;
export const MATCH_URL_TWITCH_CHANNEL = /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/;
export const MATCH_URL_DAILYMOTION =
	/^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:[\w.#_-]+)?/;
export const MATCH_URL_MIXCLOUD = /mixcloud\.com\/([^/]+\/[^/]+)/;
export const MATCH_URL_VIDYARD = /vidyard.com\/(?:watch\/)?([a-zA-Z0-9-_]+)/;
export const MATCH_URL_KALTURA =
	/^https?:\/\/[a-zA-Z]+\.kaltura.(com|org)\/p\/([0-9]+)\/sp\/([0-9]+)00\/embedIframeJs\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+)(.*)entry_id.([a-zA-Z0-9-_].*)$/;
export const AUDIO_EXTENSIONS =
	/\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
export const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
export const FLV_EXTENSIONS = /\.(flv)($|\?)/i;

export function everyNonObjectUrl(url: Exclude<FilePlayerUrl, string>, urlCase: RegExp) {
	const isArray = url instanceof Array;
	let isEveryUrl = isArray;
	if (isArray) {
		for (let i = 0; i < url.length; i++) {
			const item = url[i];
			if (typeof item !== 'string') {
				return false;
			}
			isEveryUrl = isEveryUrl && urlCase.test(item);
		}
	}
	return isEveryUrl;
}

export function canPlayYoutube(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return everyNonObjectUrl(url, MATCH_URL_YOUTUBE);
	}
	return MATCH_URL_YOUTUBE.test(url);
}

export function canPlaySoundCloud(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_SOUNDCLOUD.test(url) && !AUDIO_EXTENSIONS.test(url);
}

export function canPlayVimeo(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_VIMEO.test(url) && !VIDEO_EXTENSIONS.test(url) && !HLS_EXTENSIONS.test(url);
}

export function canPlayFacebook(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_FACEBOOK.test(url) || MATCH_URL_FACEBOOK_WATCH.test(url);
}

export function canPlayStreamable(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_STREAMABLE.test(url);
}

export function canPlayWistia(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_WISTIA.test(url);
}

export function canPlayTwitch(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_TWITCH_VIDEO.test(url) || MATCH_URL_TWITCH_CHANNEL.test(url);
}

export function canPlayDailyMotion(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_DAILYMOTION.test(url);
}

export function canPlayMixcloud(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_MIXCLOUD.test(url);
}

export function canPlayVidyard(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_VIDYARD.test(url);
}

export function canPlayKaltura(url: FilePlayerUrl) {
	if (typeof url !== 'string') {
		return false;
	}
	return MATCH_URL_KALTURA.test(url);
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
	if (typeof url !== 'string' || isMediaStream(url) || isBlobUrl(url)) {
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
