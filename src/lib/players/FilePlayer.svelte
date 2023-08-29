<script lang="ts">
	import type {
		GlobalSDKDASHKey,
		GlobalSDKHLSKey,
		GlobalSDKFLVKey,
		GlobalSDKHLSClass
	} from './global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { FileConfig, ShouldUseAudioParams } from './file.types';
	import type { DashJSMediaPlayerClass } from './dash.types';
	import type { FlvJSPlayer } from './flv.types';

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
	export let playsinline: boolean;
	export let config: FileConfig;

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

	type UrlObject = {
		url: FilePlayerUrl | undefined;
		prevUrl: FilePlayerUrl | undefined;
	};

	const urlObj: Partial<UrlObject> = {};
	const urlObjProxy = new Proxy(urlObj, {
		set(target, prop, newValue) {
			if (prop === 'url') {
				target.prevUrl = target.url;
			}
			target[prop as keyof UrlObject] = newValue;
			return true;
		}
	});

	type PlayerElement = HTMLAudioElement | HTMLVideoElement;
	type PlayerObject = {
		player: PlayerElement | undefined;
	};

	// This code is to replicate ReactPlayer behavior
	// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/players/FilePlayer.js#L34-L37
	const playerObj: Partial<PlayerObject> = {};
	const playerObjProxy = new Proxy(playerObj, {
		set(target, prop, newValue) {
			if (prop === 'player' && newValue !== null) {
				if (target.player !== undefined) {
					removeListeners(target.player, urlObjProxy.prevUrl);
				}

				addListeners(newValue as PlayerElement);
				target[prop as keyof PlayerObject] = newValue;
			}
			return true;
		}
	});

	let hls: GlobalSDKHLSClass | undefined = undefined;
	let dash: DashJSMediaPlayerClass | undefined = undefined;
	let flv: FlvJSPlayer | undefined = undefined;

	onMount(() => {
		dispatch('mount');
		const player = playerObjProxy.player;
		if (player !== undefined) {
			if (IS_IOS || config.forceDisableHls) {
				player.load();
			}
		}
		return () => {
			if (player !== undefined) {
				player.src = '';
				removeListeners(player);
				if (hls) {
					hls.destroy();
				}
			}
		};
	});

	$: player = playerObjProxy.player;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (!isMediaStream(propsUrl) && player !== undefined) {
			player.srcObject = null;
		}
		urlObjProxy.url = propsUrl;
	}

	$: handlePropsUrlChange(url);

	function addListeners(playerParams: Exclude<PlayerObject['player'], undefined>) {
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
		playerParams: Exclude<PlayerObject['player'], undefined>,
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

	function onReady(e: Event) {
		dispatch('ready', e);
	}

	function onPlay(e: Event) {
		dispatch('play', e);
	}

	function onBuffer(e: Event) {
		dispatch('buffer', e);
	}

	function onBufferEnd(e: Event) {
		dispatch('bufferEnd', e);
	}

	function onPause(e: Event) {
		dispatch('pause', e);
	}

	function onEnded(e: Event) {
		dispatch('ended', e);
	}

	function onError(e: Event) {
		dispatch('error', {
			error: e
		});
	}

	function onPlayBackRateChange(event: Event) {
		dispatch('playbackRateChange', (event.target as HTMLMediaElement).playbackRate);
	}

	function onEnablePIP(e: Event) {
		dispatch('enablePIP', e);
	}

	function onDisablePIP(e: Event) {
		dispatch('disablePIP', e);
		if (playing) {
			play();
		}
	}

	function onPresentationModeChange(e: Event) {
		if (player && supportsWebKitPresentationMode(player) && 'webkitPresentationMode' in player) {
			const { webkitPresentationMode } = player;
			if (webkitPresentationMode === 'picture-in-picture') {
				onEnablePIP(e);
			} else if (webkitPresentationMode === 'inline') {
				onDisablePIP(e);
			}
		}
	}

	function onSeek(e: Event) {
		dispatch('seek', (e.target as HTMLMediaElement).currentTime);
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

	export function load(url: FilePlayerUrl, _?: boolean): void {
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

	export function play(): void {
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

	export function pause(): void {
		if (player !== undefined) {
			player.pause();
		}
	}

	export function stop(): void {
		if (player !== undefined) {
			player.removeAttribute('src');
			if (dash) {
				dash.reset();
			}
		}
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.currentTime = seconds;
		}
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			player.volume = fraction;
		}
	}

	export function mute(): void {
		if (player !== undefined) {
			player.muted = true;
		}
	}

	export function unmute(): void {
		if (player !== undefined) {
			player.muted = false;
		}
	}

	export function enablePIP(): void {
		if (document.pictureInPictureElement !== player) {
			if (
				player !== undefined &&
				'requestPictureInPicture' in player &&
				player.requestPictureInPicture
			) {
				player.requestPictureInPicture();
			}
		} else if (
			supportsWebKitPresentationMode(player) &&
			'webkitPresentationMode' in player &&
			player.webkitPresentationMode !== 'picture-in-picture' &&
			'webkitSetPresentationMode' in player &&
			typeof player.webkitSetPresentationMode === 'function'
		) {
			player.webkitSetPresentationMode('picture-in-picture');
		}
	}

	export function disablePIP(): void {
		if (document.exitPictureInPicture && document.pictureInPictureElement === player) {
			document.exitPictureInPicture();
		} else if (
			player !== undefined &&
			supportsWebKitPresentationMode(player) &&
			'webkitPresentationMode' in player &&
			player.webkitPresentationMode !== 'inline' &&
			'webkitSetPresentationMode' in player &&
			typeof player.webkitSetPresentationMode === 'function'
		) {
			player.webkitSetPresentationMode('inline');
		}
	}

	export function setPlaybackRate(rate: number): void {
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

	export function getDuration(): number {
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

	export function getCurrentTime(): number {
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

	export function getPlayer(): PlayerElement | null {
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
	bind:this={playerObjProxy.player}
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
