<script lang="ts">
	import type { FilePlayerUrl } from './types';
	import type { FileConfig, ShouldUseAudioParams } from './file-types';

	import { onMount } from 'svelte';
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

	onMount(() => {
		if (player !== undefined) {
			addListeners(player);
		}
		return () => {
			if (player !== undefined) {
				player.src = '';
				removeListeners(player);
			}
		};
	});

	function addListeners(playerParams: Exclude<typeof player, undefined>) {
		playerParams.addEventListener('play', onPlay);
		playerParams.addEventListener('waiting', onBuffer);
		playerParams.addEventListener('playing', onBufferEnd);
		playerParams.addEventListener('pause', onPause);
		playerParams.addEventListener('seeked', onSeek);
		playerParams.addEventListener('ended', onEnded);
		playerParams.addEventListener('error', onError);
		playerParams.addEventListener('ratechange', onPlayBackRateChange);
		playerParams.addEventListener('enterpictureinpicture', onEnablePIP);
		playerParams.addEventListener('leavepictureinpicture', onDisablePIP);
		playerParams.addEventListener('webkitpresentationmodechanged', onPresentationModeChange);
		if (!shouldUseHLS(url)) {
			// onReady is handled by hls.js
			playerParams.addEventListener('canplay', onReady);
		}
		if (playsinline) {
			playerParams.setAttribute('playsinline', '');
			playerParams.setAttribute('webkit-playsinline', '');
			playerParams.setAttribute('x5-playsinline', '');
		}
	}

	function removeListeners(
		playerParams: Exclude<typeof player, undefined>,
		urlParams?: typeof url
	) {
		playerParams.removeEventListener('canplay', onReady);
		playerParams.removeEventListener('play', onPlay);
		playerParams.removeEventListener('waiting', onBuffer);
		playerParams.removeEventListener('playing', onBufferEnd);
		playerParams.removeEventListener('pause', onPause);
		playerParams.removeEventListener('seeked', onSeek);
		playerParams.removeEventListener('ended', onEnded);
		playerParams.removeEventListener('error', onError);
		playerParams.removeEventListener('ratechange', onPlayBackRateChange);
		playerParams.removeEventListener('enterpictureinpicture', onEnablePIP);
		playerParams.removeEventListener('leavepictureinpicture', onDisablePIP);
		playerParams.removeEventListener('webkitpresentationmodechanged', onPresentationModeChange);
		if (urlParams !== undefined && !shouldUseHLS(urlParams)) {
			// onReady is handled by hls.js
			playerParams.removeEventListener('canplay', onReady);
		}
	}

	function onReady(...args: any) {
		// this.props.onReady(...args)
	}

	function onPlay(...args: any) {
		// this.props.onPlay(...args)
	}

	function onBuffer(...args: any) {
		// this.props.onBuffer(...args)
	}

	function onBufferEnd(...args: any) {
		// this.props.onBufferEnd(...args)
	}

	function onPause(...args: any) {
		// this.props.onPause(...args)
	}

	function onEnded(...args: any) {
		// this.props.onEnded(...args)
	}

	function onError(...args: any) {
		// this.props.onError(...args)
	}

	function onPlayBackRateChange(event: any) {
		// this.props.onPlaybackRateChange(event.target.playbackRate)
	}

	function onEnablePIP(...args: any) {
		// this.props.onEnablePIP(...args)
	}

	function onDisablePIP(e: any) {
		// const { onDisablePIP, playing } = this.props;
		// onDisablePIP(e);
		// if (playing) {
		// 	this.play();
		// }
	}

	function onPresentationModeChange(e: any) {
		// if (this.player && supportsWebKitPresentationMode(this.player)) {
		// 	const { webkitPresentationMode } = this.player;
		// 	if (webkitPresentationMode === 'picture-in-picture') {
		// 		this.onEnablePIP(e);
		// 	} else if (webkitPresentationMode === 'inline') {
		// 		this.onDisablePIP(e);
		// 	}
		// }
	}

	function onSeek(e: any) {
		// this.props.onSeek(e.target.currentTime);
	}

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
		if (player !== undefined) {
			const promise = player.play();
			// if (promise) {
			// 	promise.catch(props.onError);
			// }
		}
	}

	export function pause() {
		if (player !== undefined) {
			player.pause();
		}
	}

	export function stop() {
		if (player !== undefined) {
			player.removeAttribute('src');
			// if (this.dash) {
			// 	this.dash.reset();
			// }
		}
	}

	export function seekTo(seconds: number, _?: boolean) {
		if (player !== undefined) {
			player.currentTime = seconds;
		}
	}

	export function setVolume(fraction: number) {
		if (player !== undefined) {
			player.volume = fraction;
		}
	}

	export function mute() {
		if (player !== undefined) {
			player.muted = true;
		}
	}

	export function unmute() {
		if (player !== undefined) {
			player.muted = false;
		}
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

	export function enablePIP() {
		console.log('enablePIP');
	}

	export function disablePIP() {
		console.log('disablePIP');
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