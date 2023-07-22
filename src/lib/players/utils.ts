// The codes in this file, is just copy-paste from https://github.com/cookpete/react-player
// See original: https://github.com/cookpete/react-player/blob/master/src/utils.js

import type {
	GlobalSDKYT,
	GlobalSDK,
	GlobalSDKType,
	GlobalSDKFLV,
	GlobalSDKDASH,
	GlobalSDKHLS,
	GlobalSDKTwitch,
	GlobalSDKSoundCloud,
	GlobalSDKMixcloud,
	GlobalSDKDailyMotion,
	GlobalSDKFacebook,
	GlobalSDKVimeo,
	GlobalSDKPlayerJS,
	GlobalSDKWistia,
	GlobalSDKVidyard
} from './global.types';
import type { WistiaWQ } from './wistia.global.types';
import type { GetSDKParams, FilePlayerUrl, PlayerInstance } from './types';
import loadScript from 'load-script';

declare global {
	interface Window {
		YT: GlobalSDKYT;
		onYouTubeIframeAPIReady(): void;
		SC: GlobalSDKSoundCloud;
		Vimeo: GlobalSDKVimeo;
		FB: GlobalSDKFacebook;
		fbAsyncInit(): void;
		playerjs: GlobalSDKPlayerJS;
		Wistia: GlobalSDKWistia;
		_wq: Partial<WistiaWQ>[];
		Twitch: GlobalSDKTwitch;
		DM: GlobalSDKDailyMotion;
		dmAsyncInit(): void;
		Mixcloud: GlobalSDKMixcloud;
		VidyardV4: GlobalSDKVidyard;
		onVidyardAPI(): void;
		Hls: GlobalSDKHLS;
		dashjs: GlobalSDKDASH;
		flvjs: GlobalSDKFLV;
	}
}

const MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/;
const MATCH_END_QUERY = /[?&#]end=([0-9hms]+)/;
const MATCH_START_STAMP = /(\d+)(h|m|s)/g;
const MATCH_NUMERIC = /^\d+$/;

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
function parseTimeParam(url: FilePlayerUrl, pattern: RegExp) {
	if (url instanceof Array) {
		return undefined;
	}
	const match = url.match(pattern);
	if (match) {
		const stamp = match[1];
		if (stamp.match(MATCH_START_STAMP)) {
			return parseTimeString(stamp);
		}
		if (MATCH_NUMERIC.test(stamp)) {
			return parseInt(stamp);
		}
	}
	return undefined;
}

function parseTimeString(stamp: string) {
	let seconds = 0;
	let array = MATCH_START_STAMP.exec(stamp);
	while (array !== null) {
		const [, count, period] = array;
		if (period === 'h') seconds += parseInt(count, 10) * 60 * 60;
		if (period === 'm') seconds += parseInt(count, 10) * 60;
		if (period === 's') seconds += parseInt(count, 10);
		array = MATCH_START_STAMP.exec(stamp);
	}
	return seconds;
}

export function parseStartTime(url: FilePlayerUrl) {
	return parseTimeParam(url, MATCH_START_QUERY);
}

export function parseEndTime(url: FilePlayerUrl) {
	return parseTimeParam(url, MATCH_END_QUERY);
}

// http://stackoverflow.com/a/38622545
export function randomString() {
	return Math.random().toString(36).substring(2, 7);
}

export function queryString(object: Record<string, unknown>) {
	return Object.keys(object)
		.map((key) => `${key}=${object[key]}`)
		.join('&');
}

function getGlobal<T extends GlobalSDKType>(key: T): GlobalSDK[T] | null {
	if (window[key]) {
		return window[key];
	}
	return null;
}

// Util function to load an external SDK
// or return the SDK if it is already loaded
type Request = {
	resolve: (value: any) => void;
	reject: (reason?: any) => void;
};

const requests: Record<string, Request[] | null> = {};
export function getSDK<T extends GlobalSDKType>({
	fetchScript = loadScript,
	isLoaded = () => true,
	sdkGlobal,
	url,
	sdkReady = null
}: GetSDKParams<T>): Promise<GlobalSDK[T]> {
	const existingGlobal = getGlobal(sdkGlobal);
	if (existingGlobal && isLoaded(existingGlobal)) {
		return Promise.resolve(existingGlobal);
	}
	return new Promise((resolve, reject) => {
		// If we are already loading the SDK, add the resolve and reject
		// functions to the existing array of requests
		if (requests[url]) {
			requests[url]?.push({ resolve, reject });
			return;
		}
		requests[url] = [{ resolve, reject }];
		const onLoaded = (sdk: typeof existingGlobal) => {
			// When loaded, resolve all pending request promises
			requests[url]?.forEach((request) => request.resolve(sdk));
		};
		if (sdkReady) {
			const previousOnReady = window[sdkReady];
			window[sdkReady] = function () {
				if (previousOnReady) previousOnReady();
				onLoaded(getGlobal(sdkGlobal));
			};
		}
		fetchScript(url, function (err) {
			if (err) {
				// Loading the SDK failed – reject all requests and
				// reset the array of requests for this SDK
				requests[url]?.forEach((request) => request.reject(err));
				requests[url] = null;
			} else if (!sdkReady) {
				onLoaded(getGlobal(sdkGlobal));
			}
		});
	});
}

export function callPlayer<TPlayer extends PlayerInstance>(player?: TPlayer) {
	if (player === undefined) {
		return null;
	}

	return function <TMethod extends keyof TPlayer>(
		method: TMethod,
		...args: Parameters<TPlayer[TMethod]>
	) {
		return (
			player[method] as (...args: Parameters<TPlayer[TMethod]>) => ReturnType<TPlayer[TMethod]>
		)(...args);
	};
}

export function isMediaStream(url: FilePlayerUrl) {
	return (
		typeof window !== 'undefined' &&
		typeof window.MediaStream !== 'undefined' &&
		url instanceof window.MediaStream
	);
}

export function isBlobUrl(url: string) {
	return /^blob:/.test(url);
}

export function supportsWebKitPresentationMode(
	video: HTMLMediaElement = document.createElement('video')
) {
	// Check if Safari supports PiP, and is not on mobile (other than iPad)
	// iPhone safari appears to "support" PiP through the check, however PiP does not function
	const notMobile = /iPhone|iPod/.test(navigator.userAgent) === false;
	return (
		'webkitSupportsPresentationMode' in video &&
		video.webkitSupportsPresentationMode &&
		'webkitSetPresentationMode' in video &&
		typeof video.webkitSetPresentationMode === 'function' &&
		notMobile
	);
}

export const noop = () => {
	// this comment to suppress warning from eslint
};
