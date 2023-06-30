<script lang="ts">
	import type {
		GlobalSDKDASHKey,
		GlobalSDKHLSKey,
		GlobalSDKFLVKey,
		GlobalSDKHLSClass
	} from './global-types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { FileConfig, ShouldUseAudioParams } from './file-types';
	import type { DashJSMediaPlayerClass } from './dash-types';
	import type { FlvJSPlayer } from './flv-types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK, isMediaStream, supportsWebKitPresentationMode } from './utils';
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
	const HLS_GLOBAL: GlobalSDKHLSKey = 'Hls';
	const DASH_SDK_URL = 'https://cdnjs.cloudflare.com/ajax/libs/dashjs/VERSION/dash.all.min.js';
	const DASH_GLOBAL: GlobalSDKDASHKey = 'dashjs';
	const FLV_SDK_URL = 'https://cdn.jsdelivr.net/npm/flv.js@VERSION/dist/flv.min.js';
	const FLV_GLOBAL: GlobalSDKFLVKey = 'flvjs';
	const MATCH_DROPBOX_URL = /www\.dropbox\.com\/.+/;
	const MATCH_CLOUDFLARE_STREAM = /https:\/\/watch\.cloudflarestream\.com\/([a-z0-9]+)/;
	const REPLACE_CLOUDFLARE_STREAM = 'https://videodelivery.net/{id}/manifest/video.m3u8';

	const dispatch = createEventDispatcher<Dispatcher>();

	let hls: GlobalSDKHLSClass | undefined = undefined;
	let dash: DashJSMediaPlayerClass | undefined = undefined;
	let flv: FlvJSPlayer | undefined = undefined;

	onMount(() => {
		dispatch('mount');
		if (player !== undefined) {
			addListeners(player);
			if (IS_IOS || config.forceDisableHls) {
				player.load();
			}
		}
		return () => {
			if (player !== undefined) {
				player.src = '';
				removeListeners(player);
			}
		};
	});

	$: shouldUseAudio({ config, url });

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
		dispatch('ready');
		// this.props.onReady(...args)
	}

	function onPlay(...args: any) {
		// this.props.onPlay(...args)
		dispatch('play');
	}

	function onBuffer(...args: any) {
		// this.props.onBuffer(...args)
		dispatch('buffer');
	}

	function onBufferEnd(...args: any) {
		// this.props.onBufferEnd(...args)
		dispatch('bufferEnd');
	}

	function onPause(...args: any) {
		// this.props.onPause(...args)
		dispatch('pause');
	}

	function onEnded(...args: any) {
		// this.props.onEnded(...args)
		dispatch('ended');
	}

	function onError(...args: any) {
		// this.props.onError(...args)
		dispatch('error', {
			error: 'error'
		});
	}

	function onPlayBackRateChange(event: any) {
		// this.props.onPlaybackRateChange(event.target.playbackRate)
		dispatch('playbackRateChange', event.target.playbackRate);
	}

	function onEnablePIP(...args: any) {
		// this.props.onEnablePIP(...args)
		dispatch('enablePIP');
	}

	function onDisablePIP(e: any) {
		// const { onDisablePIP, playing } = this.props;
		// onDisablePIP(e);
		// if (playing) {
		// 	this.play();
		// }

		dispatch('disablePIP');
		if (playing) {
			play();
		}
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

	export function load(url: FilePlayerUrl, _?: boolean) {
		const { hlsVersion, hlsOptions, dashVersion, flvVersion } = config;
		if (hls) {
			hls.destroy();
		}

		if (dash) {
			dash.reset();
		}

		if (typeof url === 'string') {
			if (shouldUseHLS(url)) {
				getSDK({
					url: HLS_SDK_URL.replace('VERSION', hlsVersion),
					sdkGlobal: HLS_GLOBAL
				}).then((Hls) => {
					hls = new Hls(hlsOptions);
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						dispatch('ready');
					});
					hls.on(Hls.Events.ERROR, (e, data) => {
						dispatch('error', {
							error: e,
							data: data,
							sdkInstance: hls,
							sdkGlobal: Hls
						});
					});
					if (MATCH_CLOUDFLARE_STREAM.test(url)) {
						const id = url.match(MATCH_CLOUDFLARE_STREAM)?.[1];
						if (id !== undefined) {
							hls.loadSource(REPLACE_CLOUDFLARE_STREAM.replace('{id}', id));
						}
					} else {
						hls.loadSource(url);
					}
					if (player !== undefined) {
						hls.attachMedia(player);
					}
					dispatch('loaded');
				});
			}
			if (shouldUseDASH(url)) {
				getSDK({
					url: DASH_SDK_URL.replace('VERSION', dashVersion),
					sdkGlobal: DASH_GLOBAL
				}).then((dashjs) => {
					dash = dashjs.MediaPlayer().create();
					dash.initialize(player, url, playing);
					dash.on('error', (e) => {
						dispatch('error', {
							error: e.error
						});
					});
					if (parseInt(dashVersion) < 3) {
						const dashDebug = dash.getDebug();
						if (
							'setLogToBrowserConsole' in dashDebug &&
							typeof dashDebug.setLogToBrowserConsole === 'function'
						) {
							dashDebug.setLogToBrowserConsole(false);
						}
					} else {
						dash.updateSettings({ debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE } });
					}
					dispatch('loaded');
				});
			}
			if (shouldUseFLV(url)) {
				getSDK({
					url: FLV_SDK_URL.replace('VERSION', flvVersion),
					sdkGlobal: FLV_GLOBAL
				}).then((flvjs) => {
					flv = flvjs.createPlayer({ type: 'flv', url });
					if (player !== undefined) {
						flv.attachMediaElement(player);
					}
					flv.on(flvjs.Events.ERROR, (e, data) => {
						dispatch('error', {
							error: e.error,
							data: data,
							sdkInstance: flv,
							sdkGlobal: flvjs
						});
					});
					flv.load();
					dispatch('loaded');
				});
			}
		}

		if (player !== undefined) {
			if (url instanceof Array) {
				// When setting new urls (<source>) on an already loaded video,
				// HTMLMediaElement.load() is needed to reset the media element
				// and restart the media resource. Just replacing children source
				// dom nodes is not enough
				player.load();
			} else if (isMediaStream(url)) {
				try {
					player.srcObject = url as unknown as MediaStream;
				} catch (e) {
					player.src = window.URL.createObjectURL(url as unknown as MediaSource | Blob);
				}
			}
		}
	}

	export function play() {
		if (player !== undefined) {
			const promise = player.play();
			if (promise) {
				promise.catch((err) => {
					dispatch('error', {
						error: err
					});
				});
			}
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
			if (dash) {
				dash.reset();
			}
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

	export function enablePIP() {
		if (document.pictureInPictureElement !== player) {
			if (
				player !== undefined &&
				'requestPictureInPicture' in player &&
				player.requestPictureInPicture
			) {
				player.requestPictureInPicture();
			}
		} else if (
			'requestPictureInPicture' in player &&
			supportsWebKitPresentationMode(player) &&
			'webkitPresentationMode' in player &&
			player.webkitPresentationMode !== 'picture-in-picture' &&
			'webkitSetPresentationMode' in player &&
			typeof player.webkitSetPresentationMode === 'function'
		) {
			player.webkitSetPresentationMode('picture-in-picture');
		}
	}

	export function disablePIP() {
		if (document.exitPictureInPicture && document.pictureInPictureElement === player) {
			document.exitPictureInPicture();
		} else if (
			player !== undefined &&
			'requestPictureInPicture' in player &&
			supportsWebKitPresentationMode(player) &&
			'webkitPresentationMode' in player &&
			player.webkitPresentationMode !== 'inline' &&
			'webkitSetPresentationMode' in player &&
			typeof player.webkitSetPresentationMode === 'function'
		) {
			player.webkitSetPresentationMode('inline');
		}
	}

	export function setPlaybackRate(rate: number) {
		try {
			if (player !== undefined) {
				player.playbackRate = rate;
			}
		} catch (error) {
			dispatch('error', {
				error: error
			});
		}
	}

	export function setLoop(_: boolean) {
		// do nothing
	}

	export function getDuration() {
		if (!player) {
			return 0;
		}
		const { duration, seekable } = player;
		// on iOS, live streams return Infinity for the duration
		// so instead we use the end of the seekable timerange
		if (duration === Infinity && seekable.length > 0) {
			return seekable.end(seekable.length - 1);
		}
		return duration;
	}

	export function getCurrentTime() {
		if (!player) {
			return 0;
		}
		return player.currentTime;
	}

	export function getSecondsLoaded() {
		if (!player) {
			return 0;
		}
		const { buffered } = player;
		if (buffered.length === 0) {
			return 0;
		}
		const end = buffered.end(buffered.length - 1);
		const duration = getDuration();
		if (duration !== null && end > duration) {
			return duration;
		}
		return end;
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

	export function getPlayer() {
		if (player !== undefined) {
			return player;
		}

		return null;
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
>
	{#if url instanceof Array}
		{#each url as urlElement}
			{#if typeof urlElement === 'string'}
				<source src={urlElement} />
			{:else}
				<source {...urlElement} />
			{/if}
		{/each}
	{/if}
	{#each config.tracks as track}
		<track {...track} />
	{/each}
</svelte:element>

<style>
	.fullwidth {
		width: 100%;
	}

	.fullheight {
		height: 100%;
	}
</style>
