<script lang="ts">
	import type { GlobalSDKWistiaKey } from './global.types';
	import type { WistiaPlayer } from './wistia.global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { WistiaConfig } from './wistia.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { MATCH_URL_WISTIA } from './patterns';
	import { randomString, getSDK } from './utils';

	export let url: FilePlayerUrl;
	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let config: WistiaConfig;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (propsUrl instanceof Array) {
			return '';
		}
		return propsUrl;
	}

	$: propsUrl = handlePropsUrlChange(url);

	const SDK_URL = 'https://fast.wistia.com/assets/external/E-v1.js';
	const SDK_GLOBAL: GlobalSDKWistiaKey = 'Wistia';
	const PLAYER_ID_PREFIX = 'wistia-player-';

	$: playerID = config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`;

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: WistiaPlayer | undefined;

	onMount(() => {
		dispatch('mount');
	});

	export function load(_: FilePlayerUrl, __?: boolean): void {
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL }).then(
			(Wistia) => {
				if (config.customControls) {
					config.customControls.forEach((control) => {
						Wistia.defineControl(control);
					});
				}
				window._wq = window._wq || [];
				window._wq.push({
					id: playerID,
					options: {
						autoPlay: playing,
						silentAutoPlay: 'allow',
						muted: muted,
						controlsVisibleOnLoad: controls,
						fullscreenButton: controls,
						playbar: controls,
						playbackRateControl: controls,
						qualityControl: controls,
						volumeControl: controls,
						settingsControl: controls,
						smallPlayButton: controls,
						...config.options
					},
					onReady(video) {
						player = video;
						unbind();
						player.bind('play', onPlay);
						player.bind('pause', onPause);
						player.bind('seek', onSeek);
						player.bind('end', onEnded);
						player.bind('playbackratechange', onPlaybackRateChange);
						dispatch('ready');
					}
				});
			},
			(error) => {
				dispatch('error', { error });
			}
		);
	}

	// Proxy methods to prevent listener leaks
	function onPlay() {
		dispatch('play');
	}
	function onPause() {
		dispatch('pause');
	}
	function onSeek(currentTime: number, _: number) {
		dispatch('seek', currentTime);
	}
	function onEnded() {
		dispatch('ended');
	}
	function onPlaybackRateChange(rate: number) {
		dispatch('playbackRateChange', rate);
	}

	function unbind() {
		if (player !== undefined) {
			player.unbind('play', onPlay);
			player.unbind('pause', onPause);
			player.unbind('seek', onSeek);
			player.unbind('end', onEnded);
			player.unbind('playbackratechange', onPlaybackRateChange);
		}
	}

	export function play() {
		if (player !== undefined) {
			player.play();
		}
	}

	export function pause() {
		if (player !== undefined) {
			player.pause();
		}
	}

	export function stop() {
		unbind();
		if (player !== undefined) {
			player.remove();
		}
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.time(seconds);
		}
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			player.volume(fraction);
		}
	}

	export function mute() {
		if (player !== undefined) {
			player.mute();
		}
	}

	export function unmute() {
		if (player !== undefined) {
			player.unmute();
		}
	}

	export function setPlaybackRate(rate: number): void {
		if (player !== undefined) {
			player.playbackRate(rate);
		}
	}

	export function getDuration(): number {
		if (player !== undefined) {
			return player.duration();
		}
		return 0;
	}

	export function getCurrentTime() {
		if (player !== undefined) {
			return player.time();
		}
		return 0;
	}

	export function getSecondsLoaded(): number {
		return 0;
	}

	export function getPlayer(): WistiaPlayer | null {
		if (player !== undefined) {
			return player;
		}
		return null;
	}

	$: videoID = propsUrl && propsUrl.match(MATCH_URL_WISTIA)?.[1];
	$: className = `wistia_embed wistia_async_${videoID} wistia-player`;
</script>

<div id={playerID} class={className} />

<style>
	.wistia-player {
		width: 100%;
		height: 100%;
	}
</style>
