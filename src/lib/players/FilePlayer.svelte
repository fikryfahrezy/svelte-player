<script lang="ts">
	import type { FilePlayerUrl } from './types';
	import type { FileConfig, ShouldUseAudioParams } from './file-types';
	import { isMediaStream } from './utils';
	import { AUDIO_EXTENSIONS, HLS_EXTENSIONS, DASH_EXTENSIONS, FLV_EXTENSIONS } from './patterns';

	export let url: FilePlayerUrl;
	export let playing: boolean;
	export let loop: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let width: string;
	export let height: string;
	export const playsinline: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check ;
	export let config: FileConfig;

	let player: HTMLAudioElement | HTMLVideoElement | undefined;

	const HAS_NAVIGATOR = typeof navigator !== 'undefined';
	const IS_IPAD_PRO =
		HAS_NAVIGATOR && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
	const IS_IOS =
		HAS_NAVIGATOR &&
		(/iPad|iPhone|iPod/.test(navigator.userAgent) || IS_IPAD_PRO) &&
		'MSStream' in window &&
		!window.MSStream;
	const IS_SAFARI =
		HAS_NAVIGATOR &&
		/^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
		'MSStream' in window &&
		!window.MSStream;
	const HLS_SDK_URL = 'https://cdn.jsdelivr.net/npm/hls.js@VERSION/dist/hls.min.js';
	const HLS_GLOBAL = 'Hls';
	const DASH_SDK_URL = 'https://cdnjs.cloudflare.com/ajax/libs/dashjs/VERSION/dash.all.min.js';
	const DASH_GLOBAL = 'dashjs';
	const FLV_SDK_URL = 'https://cdn.jsdelivr.net/npm/flv.js@VERSION/dist/flv.min.js';
	const FLV_GLOBAL = 'flvjs';
	const MATCH_DROPBOX_URL = /www\.dropbox\.com\/.+/;
	const MATCH_CLOUDFLARE_STREAM = /https:\/\/watch\.cloudflarestream\.com\/([a-z0-9]+)/;
	const REPLACE_CLOUDFLARE_STREAM = 'https://videodelivery.net/{id}/manifest/video.m3u8';

	function shouldUseAudio(props: ShouldUseAudioParams) {
		if (props.config.forceVideo) {
			return false;
		}
		if (props.config.attributes && 'poster' in props.config.attributes) {
			return false; // Use <video> so that poster is shown
		}
		if (props.url instanceof Array) {
			return false;
		}

		return AUDIO_EXTENSIONS.test(props.url) || props.config.forceAudio;
	}

	function shouldUseHLS(url: FilePlayerUrl) {
		if ((IS_SAFARI && config.forceSafariHLS) || config.forceHLS) {
			return true;
		}
		if (IS_IOS || config.forceDisableHls) {
			return false;
		}
		if (url instanceof Array) {
			return false;
		}

		return HLS_EXTENSIONS.test(url) || MATCH_CLOUDFLARE_STREAM.test(url);
	}

	function shouldUseDASH(url: FilePlayerUrl) {
		if (url instanceof Array) {
			return false;
		}
		return DASH_EXTENSIONS.test(url) || config.forceDASH;
	}

	function shouldUseFLV(url: FilePlayerUrl) {
		if (url instanceof Array) {
			return false;
		}
		return FLV_EXTENSIONS.test(url) || config.forceFLV;
	}

	export function load(url: FilePlayerUrl, isReady?: boolean) {
		console.log('load');
	}

	export function play() {
		console.log('play');
	}

	export function pause() {
		console.log('pause');
	}

	export function stop() {
		console.log('stop');
	}

	export function seekTo(amount: number, keepPlaying?: boolean) {
		console.log('seekTo');
	}

	export function setVolume(fraction: number) {
		console.log('setVolume');
	}

	export function mute() {
		console.log('mute');
	}

	export function unmute() {
		console.log('unmute');
	}

	export function setPlaybackRate(rate: number) {
		console.log('setPlaybackRate');
	}

	export function setLoop(loop: boolean) {
		console.log('setLoop');
	}

	export function getDuration() {
		return 0;
	}

	export function getCurrentTime() {
		return 0;
	}

	export function getSecondsLoaded() {
		return 0;
	}

	export function getPlayer() {
		return null;
	}

	function getSource(url: FilePlayerUrl) {
		const useHLS = shouldUseHLS(url);
		const useDASH = shouldUseDASH(url);
		const useFLV = shouldUseFLV(url);
		if (url instanceof Array || isMediaStream(url) || useHLS || useDASH || useFLV) {
			return undefined;
		}
		if (MATCH_DROPBOX_URL.test(url)) {
			return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
		}
		return url;
	}

	function checkShouldUseAudio(url: FilePlayerUrl) {
		return shouldUseAudio({ config, url });
	}

	$: Element = (checkShouldUseAudio(url) ? 'audio' : 'video') as 'audio' | 'video';
	$: widthStyle = `${width === 'auto' ? `width: ${width};` : ''}`;
	$: heightStyle = `${height === 'auto' ? `height: ${height};` : ''}`;
	$: style = widthStyle + heightStyle;
</script>

<svelte:element
	this={Element}
	bind:this={player}
	src={getSource(url)}
	{style}
	preload="auto"
	autoplay={playing || undefined}
	controls={controls || undefined}
	muted={muted || undefined}
	loop={loop || undefined}
	{...config.attributes}
	class:fullwidth={style === ''}
	class:fullheight={style === ''}
/>

<style>
	.fullwidth {
		width: 100%;
	}

	.fullheight {
		height: 100%;
	}
</style>
