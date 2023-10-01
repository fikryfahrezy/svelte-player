<script lang="ts">
	import type { GlobalSDKPlayerJSKey } from './global.types';
	import type { PlayerJSPlayer } from './playerjs.global.types';
	import type { Dispatcher } from './types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export let url: string;
	export let loop: boolean;
	export let muted: boolean;

	const SDK_URL = 'https://cdn.embed.ly/player-0.1.0.min.js';
	const SDK_GLOBAL: GlobalSDKPlayerJSKey = 'playerjs';

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement;
	let player: PlayerJSPlayer;

	let duration: number | null = null;
	let currentTime: number | null = null;
	let secondsLoaded: number | null = null;

	onMount(function () {
		dispatch('mount');
	});

	export function load() {
		getSDK(SDK_URL, SDK_GLOBAL).then(
			function (playerjs) {
				if (!iframeContainer) {
					return;
				}

				player = new playerjs.Player(iframeContainer);
				player.setLoop?.(loop);

				player.on('ready', function () {
					// An arbitrary timeout is required otherwise
					// the event listeners won’t work
					setTimeout(function () {
						player.isReady = true;
						player.setLoop?.(loop);
						if (muted) {
							player.mute();
						}
						addListeners(player);
						dispatch('ready');
					}, 500);
				});
			},
			function (error) {
				dispatch('error', {
					error
				});
			}
		);
	}

	function addListeners(player: PlayerJSPlayer) {
		player.on('play', function () {
			dispatch('play');
		});
		player.on('pause', function () {
			dispatch('pause');
		});
		player.on('ended', function () {
			dispatch('ended');
		});
		player.on('error', function (error) {
			dispatch('error', {
				error
			});
		});
		player.on('timeupdate', function (data) {
			duration = data.duration;
			currentTime = data.seconds;
		});
	}

	export function play() {
		player.play();
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		// Nothing to do
	}

	export function seekTo(seconds: number) {
		player.setCurrentTime(seconds);
	}

	export function setVolume(fraction: number) {
		player.setVolume(fraction * 100);
	}

	export function setLoop(loop: boolean) {
		player.setLoop?.(loop);
	}

	export function mute() {
		player.mute();
	}

	export function unmute() {
		player.unmute();
	}

	export function getDuration() {
		return duration;
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getSecondsLoaded() {
		return secondsLoaded;
	}

	export function getPlayer() {
		return player;
	}

	export function setPlayer(newPlayer: PlayerJSPlayer) {
		player = newPlayer;
	}
</script>

<iframe
	bind:this={iframeContainer}
	src={url}
	frameBorder="0"
	scrolling="no"
	class="kaltura-player"
	allow="encrypted-media; autoplay; fullscreen;"
	referrerPolicy="no-referrer-when-downgrade"
	title="Kaltura Player"
/>

<style>
	.kaltura-player {
		width: 100%;
		height: 100%;
	}
</style>
