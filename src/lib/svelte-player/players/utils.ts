// The codes in this file, is just copy-paste from https://github.com/cookpete/react-player
// See original: https://github.com/cookpete/react-player/blob/master/src/utils.js

import type { GetSDKParams, GlobalSDK, GlobalSDKType } from './types';
import loadScript from 'load-script';

declare global {
	interface Window {
		YT: YT;
		onYouTubeIframeAPIReady: () => void;
	}
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
			} else {
				console.log(window.YT);
			}
		});
	});
}
