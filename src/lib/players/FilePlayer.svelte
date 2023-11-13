<script lang="ts">
	import type { GlobalSDKDASHKey, GlobalSDKHLSKey, GlobalSDKFLVKey } from './global.types';
	import type { PlayerDispatcher } from './types';
	import type {
		FileConfig,
		FilePlayerElement,
		FileUrl,
		FileInternalPlayerKey,
		FileInternalPlayer,
		DashJSMediaPlayerClass,
		FlvJSPlayer,
		HLSClass,
		PlayerElementRef
	} from './file.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK, isMediaStream, supportsWebKitPresentationMode } from './utils';
	import { AUDIO_EXTENSIONS, HLS_EXTENSIONS, DASH_EXTENSIONS, FLV_EXTENSIONS } from './patterns';
	import FilePlayerAudio from './FilePlayerAudio.svelte';
	import FilePlayerVideo from './FilePlayerVideo.svelte';
	import FilePlayerTrack from './FilePlayerTrack.svelte';

	export let url: FileUrl;
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

	const dispatch = createEventDispatcher<PlayerDispatcher>();

	let hls: HLSClass | undefined = undefined;
	let dash: DashJSMediaPlayerClass | undefined = undefined;
	let flv: FlvJSPlayer | undefined = undefined;

	let playerElementRef: PlayerElementRef;
	let player: FilePlayerElement;

	export function setInternalPlayer(newPlayer: FilePlayerElement) {
		if (player === undefined) {
			player = newPlayer;
		}
	}

	onMount(function () {
		dispatch('mount');
		setInternalPlayer(playerElementRef.getPlayer());
		if (IS_IOS || config.forceDisableHls) {
			player.load();
		}

		return function () {
			if (hls) {
				hls.destroy();
			}
		};
	});

	export let _addListeners = function (playerParams: FilePlayerElement) {
		player = playerParams;
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
	};

	export let _removeListeners = function (playerParams: FilePlayerElement, urlParams?: typeof url) {
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
	};

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
		if (player && supportsWebKitPresentationMode(player)) {
			const { webkitPresentationMode } = player;
			if (webkitPresentationMode === 'picture-in-picture') {
				onEnablePIP(e);
			} else if (webkitPresentationMode === 'inline') {
				onDisablePIP(e);
			}
		}
	}

	export function onSeek(e: Event) {
		dispatch('seek', (e.target as HTMLMediaElement).currentTime);
	}

	type ShouldUseAudioParams = {
		url: FileUrl;
		config: FileConfig;
	};

	function shouldUseAudio(props: ShouldUseAudioParams) {
		if (props.config.forceVideo) {
			return false;
		}
		if ('poster' in props.config.attributes) {
			return false; // Use <video> so that poster is shown
		}
		return AUDIO_EXTENSIONS.test(String(props.url)) || props.config.forceAudio;
	}

	function shouldUseHLS(url: FileUrl): url is string {
		if ((IS_SAFARI && config.forceSafariHLS) || config.forceHLS) {
			return true;
		}
		if (IS_IOS || config.forceDisableHls) {
			return false;
		}
		return HLS_EXTENSIONS.test(String(url)) || MATCH_CLOUDFLARE_STREAM.test(String(url));
	}

	function shouldUseDASH(url: FileUrl): url is string {
		return DASH_EXTENSIONS.test(String(url)) || config.forceDASH;
	}

	function shouldUseFLV(url: FileUrl): url is string {
		return FLV_EXTENSIONS.test(String(url)) || config.forceFLV;
	}

	export function load(loadUrl: FileUrl) {
		const { hlsVersion, hlsOptions, dashVersion, flvVersion } = config;
		if (hls) {
			hls.destroy();
		}
		if (dash) {
			dash.reset();
		}
		if (shouldUseHLS(loadUrl)) {
			getSDK(HLS_SDK_URL.replace('VERSION', hlsVersion), HLS_GLOBAL).then(function (Hls) {
				hls = new Hls(hlsOptions);
				hls.on(Hls.Events.MANIFEST_PARSED, function () {
					dispatch('ready');
				});
				hls.on(Hls.Events.ERROR, function (e, data) {
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
				hls.attachMedia(player);
				dispatch('loaded');
			});
		}
		if (shouldUseDASH(loadUrl)) {
			getSDK(DASH_SDK_URL.replace('VERSION', dashVersion), DASH_GLOBAL).then(function (dashjs) {
				dash = dashjs.MediaPlayer().create();
				dash.initialize(player, loadUrl, playing);
				dash.on('error', function (e) {
					dispatch('error', {
						error: e.error
					});
				});
				if (parseInt(dashVersion) < 3) {
					dash.getDebug().setLogToBrowserConsole?.(false);
				} else {
					dash.updateSettings({ debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE } });
				}
				dispatch('loaded');
			});
		}
		if (shouldUseFLV(loadUrl)) {
			getSDK(FLV_SDK_URL.replace('VERSION', flvVersion), FLV_GLOBAL).then(function (flvjs) {
				flv = flvjs.createPlayer({ type: 'flv', url: loadUrl });
				flv.attachMediaElement(player);
				flv.on(flvjs.Events.ERROR, function (e, data) {
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
			player.load();
		} else if (isMediaStream(loadUrl)) {
			try {
				player.srcObject = loadUrl;
			} catch (e) {
				player.src = window.URL.createObjectURL(loadUrl as unknown as MediaSource | Blob);
			}
		}
	}

	export function play() {
		const promise = player.play();
		if (promise) {
			promise.catch(function (err) {
				dispatch('error', {
					error: err
				});
			});
		}
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		player.removeAttribute('src');
		if (dash) {
			dash.reset();
		}
	}

	export function seekTo(seconds: number, keepPlaying = true) {
		player.currentTime = seconds;
		if (!keepPlaying) {
			pause();
		}
	}

	export function setVolume(fraction: number) {
		player.volume = fraction;
	}

	export function mute() {
		player.muted = true;
	}

	export function unmute() {
		player.muted = false;
	}

	export function enablePIP() {
		if ('requestPictureInPicture' in player && document.pictureInPictureElement !== player) {
			player.requestPictureInPicture();
		} else if (
			supportsWebKitPresentationMode(player) &&
			player.webkitPresentationMode !== 'picture-in-picture'
		) {
			player.webkitSetPresentationMode('picture-in-picture');
		}
	}

	export function disablePIP() {
		if (document.exitPictureInPicture && document.pictureInPictureElement === player) {
			document.exitPictureInPicture();
		} else if (
			supportsWebKitPresentationMode(player) &&
			player.webkitPresentationMode !== 'inline'
		) {
			player.webkitSetPresentationMode('inline');
		}
	}

	export function setPlaybackRate(rate: number) {
		try {
			player.playbackRate = rate;
		} catch (error) {
			dispatch('error', {
				error: error
			});
		}
	}

	export function getDuration() {
		if (!player) {
			return null;
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
			return null;
		}
		return player.currentTime;
	}

	export function getSecondsLoaded() {
		if (!player) {
			return null;
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

	function getSource(url: FileUrl) {
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

	export function getPlayer<TKey extends FileInternalPlayerKey>(
		key: TKey
	): FileInternalPlayer[TKey] | null {
		const fileInternalPlayer: Partial<FileInternalPlayer> = {
			dash,
			flv,
			hls,
			player
		};

		return fileInternalPlayer[key] ?? null;
	}

	export function _setPlayer(newPlayer: FilePlayerElement) {
		player = newPlayer;
	}

	export function _setDash(newDashPlayer: DashJSMediaPlayerClass) {
		dash = newDashPlayer;
	}

	$: useAudio = shouldUseAudio({ config, url });
	$: widthStyle = `width: ${width === 'auto' ? width : '100%'};`;
	$: heightStyle = `height: ${height === 'auto' ? height : '100%'};`;
	$: style = widthStyle + heightStyle;
</script>

{#if useAudio}
	<FilePlayerAudio
		{url}
		{style}
		bind:this={playerElementRef}
		src={getSource(url)}
		addListeners={_addListeners}
		removeListeners={_removeListeners}
		preload="auto"
		autoplay={playing || undefined}
		controls={controls || undefined}
		muted={muted || undefined}
		loop={loop || undefined}
		attributes={config.attributes}
	>
		<FilePlayerTrack {url} tracks={config.tracks} />
	</FilePlayerAudio>
{:else}
	<FilePlayerVideo
		{url}
		{style}
		bind:this={playerElementRef}
		src={getSource(url)}
		addListeners={_addListeners}
		removeListeners={_removeListeners}
		preload="auto"
		autoplay={playing || undefined}
		controls={controls || undefined}
		muted={muted || undefined}
		loop={loop || undefined}
		attributes={config.attributes}
	>
		<FilePlayerTrack {url} tracks={config.tracks} />
	</FilePlayerVideo>
{/if}
