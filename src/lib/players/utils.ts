// The codes in this file, is just copy-paste from https://github.com/cookpete/react-player
// See original: https://github.com/cookpete/react-player/blob/master/src/utils.js

import type {
	GetSDKParams,
	GlobalSDK,
	GlobalSDKType,
	GlobalSDKObject,
	FilePlayerUrl
} from './types';
import loadScript from 'load-script';

declare global {
	interface Window {
		YT: YT;
		onYouTubeIframeAPIReady: () => void;
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

function getGlobal(key: GlobalSDKType) {
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
	isLoaded,
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

export function callPlayer(player: GlobalSDKObject, checkIsReady?: () => boolean) {
	return function <T extends keyof typeof player>(
		method: T,
		...args: Parameters<(typeof player)[T]>
	) {
		const isReady = checkIsReady?.() ?? true;
		if (!isReady) {
			return null;
		}

		// Util method for calling a method on this.player
		// but guard against errors and console.warn instead
		if (!player || !player[method]) {
			let message = `SveltePlayer: player could not call %c${method}%c – `;
			if (!player) {
				message += 'The player was not available';
			} else if (!player[method]) {
				message += 'The method was not available';
			}
			console.warn(message, 'font-weight: bold', '');
			return null;
		}

		return (
			player[method] as (...args: Parameters<(typeof player)[T]>) => ReturnType<(typeof player)[T]>
		)(...args);
	};
}

export function isMediaStream(url: string) {
	return (
		typeof window !== 'undefined' &&
		typeof window.MediaStream !== 'undefined' &&
		(url as unknown) instanceof window.MediaStream
	);
}

export function isBlobUrl(url: string) {
	return /^blob:/.test(url);
}

export function supportsWebKitPresentationMode(video = document.createElement('video')) {
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
