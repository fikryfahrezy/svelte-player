<script lang="ts">
	import type { GlobalSDKWistiaKey } from './global.types';
	import type { WistiaPlayer } from './wistia.global.types';
	import type { Dispatcher } from './types';
	import type { WistiaConfig } from './wistia.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { MATCH_URL_WISTIA } from './patterns';
	import { randomString, getSDK } from './utils';

	export let url: string;
	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let config: WistiaConfig;

	const SDK_URL = 'https://fast.wistia.com/assets/external/E-v1.js';
	const SDK_GLOBAL: GlobalSDKWistiaKey = 'Wistia';
	const PLAYER_ID_PREFIX = 'wistia-player-';

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: WistiaPlayer;

	$: playerID = config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`;

	onMount(function () {
		dispatch('mount');
	});

	export function load() {
		getSDK(SDK_URL, SDK_GLOBAL).then(
			function (Wistia) {
				if (config.customControls) {
					config.customControls.forEach(function (control) {
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
			function (error) {
				dispatch('error', { error });
			}
		);
	}

	function unbind() {
		player.unbind('play', onPlay);
		player.unbind('pause', onPause);
		player.unbind('seek', onSeek);
		player.unbind('end', onEnded);
		player.unbind('playbackratechange', onPlaybackRateChange);
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

	export function play() {
		player.play();
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		unbind();
		player.remove();
	}

	export function seekTo(seconds: number) {
		player.time(seconds);
	}

	export function setVolume(fraction: number) {
		player.volume(fraction);
	}

	export function mute() {
		player.mute();
	}

	export function unmute() {
		player.unmute();
	}

	export function setPlaybackRate(rate: number) {
		player.playbackRate(rate);
	}

	export function getDuration() {
		return player.duration();
	}

	export function getCurrentTime() {
		return player.time();
	}

	export function getSecondsLoaded() {
		return null;
	}

	export function getPlayer() {
		return player;
	}

	export function setPlayer(newPlayer: WistiaPlayer) {
		player = newPlayer;
	}

	$: videoID = url && url.match(MATCH_URL_WISTIA)?.[1];
	$: className = `wistia_embed wistia_async_${videoID} wistia-player`;
</script>

<div id={playerID} class={className} />

<style>
	.wistia-player {
		width: 100%;
		height: 100%;
	}
</style>
