<script lang="ts">
	import type {
		GlobalSDKDASHKey,
		GlobalSDKHLSKey,
		GlobalSDKFLVKey,
		GlobalSDKHLSClass
	} from './global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { FileConfig, ShouldUseAudioParams, PlayerElement } from './file.types';
	import type { DashJSMediaPlayerClass } from './dash.types';
	import type { FlvJSPlayer } from './flv.types';

	import { onMount, createEventDispatcher, beforeUpdate, afterUpdate } from 'svelte';
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

	let hls: GlobalSDKHLSClass | undefined = undefined;
	let dash: DashJSMediaPlayerClass | undefined = undefined;
	let flv: FlvJSPlayer | undefined = undefined;

	type Props = {
		url: FilePlayerUrl;
		config: FileConfig;
	};

	let propsHistory: (Props | undefined)[] = [];

	function handlePropsChange(newProps: Props) {
		propsHistory = [propsHistory[propsHistory.length - 1], newProps];
	}

	$: handlePropsChange({ url, config });

	function handlePlayerChange(newPlayer: PlayerElement, prevPlayer?: PlayerElement) {
		const prevProps = propsHistory[0];
		const currentProps = propsHistory[1];

		if (prevPlayer === undefined || prevProps === undefined || currentProps === undefined) {
			return;
		}

		if (shouldUseAudio(currentProps) !== shouldUseAudio(prevProps)) {
			removeListeners(prevPlayer, prevProps.url);
			addListeners(newPlayer);
		}

		if (currentProps.url !== prevProps.url && !isMediaStream(currentProps.url)) {
			newPlayer.srcObject = null;
		}
	}

	type PlayerObjectType = 'player' | 'prevPlayer';
	const playerObjectTarget: Record<PlayerObjectType, PlayerElement> = {} as Record<
		PlayerObjectType,
		PlayerElement
	>;
	const playerObjectHandler: ProxyHandler<typeof playerObjectTarget> = {
		set(target, p, newValue) {
			if (newValue && target['prevPlayer']) {
				handlePlayerChange(newValue, target['prevPlayer']);
			}
			target['prevPlayer'] = target[p as keyof typeof target];
			target[p as keyof typeof target] = newValue;
			return true;
		}
	};
	const playerObject = new Proxy<Record<PlayerObjectType, PlayerElement>>(
		playerObjectTarget,
		playerObjectHandler
	);

	onMount(() => {
		dispatch('mount');
		addListeners(playerObject.player);
		playerObject.player.src = String(getSource(url)); // Ensure src is set in strict mode
		if (IS_IOS || config.forceDisableHls) {
			playerObject.player.load();
		}

		return () => {
			playerObject.player.src = '';
			removeListeners(playerObject.player);
			if (hls) {
				hls.destroy();
			}
		};
	});

	function addListeners(playerParams: PlayerElement) {
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

	function removeListeners(playerParams: PlayerElement, urlParams?: typeof url) {
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
		if (playerObject.player && supportsWebKitPresentationMode(playerObject.player)) {
			const { webkitPresentationMode } = playerObject.player;
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
		if ('poster' in props.config.attributes) {
			return false; // Use <video> so that poster is shown
		}
		return AUDIO_EXTENSIONS.test(String(props.url)) || props.config.forceAudio;
	}

	function shouldUseHLS(url: FilePlayerUrl): url is string {
		if ((IS_SAFARI && config.forceSafariHLS) || config.forceHLS) {
			return true;
		}
		if (IS_IOS || config.forceDisableHls) {
			return false;
		}

		return HLS_EXTENSIONS.test(String(url)) || MATCH_CLOUDFLARE_STREAM.test(String(url));
	}

	function shouldUseDASH(url: FilePlayerUrl): url is string {
		return DASH_EXTENSIONS.test(String(url)) || config.forceDASH;
	}

	function shouldUseFLV(url: FilePlayerUrl): url is string {
		return FLV_EXTENSIONS.test(String(url)) || config.forceFLV;
	}

	export function load(loadUrl: FilePlayerUrl): void {
		const { hlsVersion, hlsOptions, dashVersion, flvVersion } = config;
		if (hls) {
			hls.destroy();
		}

		if (dash) {
			dash.reset();
		}

		if (shouldUseHLS(loadUrl)) {
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
				if (MATCH_CLOUDFLARE_STREAM.test(loadUrl)) {
					const id = loadUrl.match(MATCH_CLOUDFLARE_STREAM)?.[1];
					hls.loadSource(REPLACE_CLOUDFLARE_STREAM.replace('{id}', String(id)));
				} else {
					hls.loadSource(loadUrl);
				}
				hls.attachMedia(playerObject.player);
				dispatch('loaded');
			});
		}
		if (shouldUseDASH(loadUrl)) {
			getSDK({
				url: DASH_SDK_URL.replace('VERSION', dashVersion),
				sdkGlobal: DASH_GLOBAL
			}).then((dashjs) => {
				dash = dashjs.MediaPlayer().create();
				dash.initialize(playerObject.player, loadUrl, playing);
				dash.on('error', (e) => {
					dispatch('error', {
						error: e.error
					});
				});
				if (parseInt(dashVersion) < 3) {
					dash.getDebug().setLogToBrowserConsole(false);
				} else {
					dash.updateSettings({ debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE } });
				}
				dispatch('loaded');
			});
		}
		if (shouldUseFLV(loadUrl)) {
			getSDK({
				url: FLV_SDK_URL.replace('VERSION', flvVersion),
				sdkGlobal: FLV_GLOBAL
			}).then((flvjs) => {
				flv = flvjs.createPlayer({ type: 'flv', url: loadUrl });
				flv.attachMediaElement(playerObject.player);
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

		if (loadUrl instanceof Array) {
			// When setting new urls (<source>) on an already loaded video,
			// HTMLMediaElement.load() is needed to reset the media element
			// and restart the media resource. Just replacing children source
			// dom nodes is not enough
			playerObject.player.load();
		} else if (isMediaStream(loadUrl)) {
			try {
				playerObject.player.srcObject = loadUrl;
			} catch (e) {
				playerObject.player.src = window.URL.createObjectURL(
					loadUrl as unknown as MediaSource | Blob
				);
			}
		}
	}

	export function play(): void {
		const promise = playerObject.player.play();
		if (promise) {
			promise.catch((err) => {
				dispatch('error', {
					error: err
				});
			});
		}
	}

	export function pause(): void {
		playerObject.player.pause();
	}

	export function stop(): void {
		playerObject.player.removeAttribute('src');
		if (dash) {
			dash.reset();
		}
	}

	export function seekTo(seconds: number): void {
		playerObject.player.currentTime = seconds;
	}

	export function setVolume(fraction: number): void {
		playerObject.player.volume = fraction;
	}

	export function mute(): void {
		playerObject.player.muted = true;
	}

	export function unmute(): void {
		playerObject.player.muted = false;
	}

	export function enablePIP(): void {
		if (
			'requestPictureInPicture' in playerObject.player &&
			document.pictureInPictureElement !== playerObject.player
		) {
			playerObject.player.requestPictureInPicture();
		} else if (
			supportsWebKitPresentationMode(playerObject.player) &&
			playerObject.player.webkitPresentationMode !== 'picture-in-picture'
		) {
			playerObject.player.webkitSetPresentationMode('picture-in-picture');
		}
	}

	export function disablePIP(): void {
		if (document.exitPictureInPicture && document.pictureInPictureElement === playerObject.player) {
			document.exitPictureInPicture();
		} else if (
			supportsWebKitPresentationMode(playerObject.player) &&
			playerObject.player.webkitPresentationMode !== 'inline'
		) {
			playerObject.player.webkitSetPresentationMode('inline');
		}
	}

	export function setPlaybackRate(rate: number): void {
		try {
			playerObject.player.playbackRate = rate;
		} catch (error) {
			dispatch('error', {
				error: error
			});
		}
	}

	export function getDuration() {
		if (!playerObject.player) {
			return null;
		}
		const { duration, seekable } = playerObject.player;
		// on iOS, live streams return Infinity for the duration
		// so instead we use the end of the seekable timerange
		if (duration === Infinity && seekable.length > 0) {
			return seekable.end(seekable.length - 1);
		}
		return duration;
	}

	export function getCurrentTime() {
		if (!playerObject.player) {
			return null;
		}
		return playerObject.player.currentTime;
	}

	export function getSecondsLoaded() {
		if (!playerObject.player) {
			return null;
		}
		const { buffered } = playerObject.player;
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
		if (typeof url === 'string' && MATCH_DROPBOX_URL.test(url)) {
			return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
		}

		const useHLS = shouldUseHLS(url);
		const useDASH = shouldUseDASH(url);
		const useFLV = shouldUseFLV(url);
		if (url instanceof Array || isMediaStream(url) || useHLS || useDASH || useFLV) {
			return undefined;
		}

		return url;
	}

	export function getPlayer(): PlayerElement {
		return playerObject.player;
	}

	export function setPlayer(newPlayer: PlayerElement) {
		playerObject.player = newPlayer;
	}

	$: Element = (shouldUseAudio({ config, url }) ? 'audio' : 'video') as 'audio' | 'video';
	$: widthStyle = `${width === 'auto' ? `width: ${width};` : ''}`;
	$: heightStyle = `${height === 'auto' ? `height: ${height};` : ''}`;
	$: style = widthStyle + heightStyle;
</script>

<svelte:element
	this={Element}
	bind:this={playerObject.player}
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
		{#each url as source}
			{#if typeof source === 'string'}
				<source src={source} />
			{:else}
				<source {...source} />
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
