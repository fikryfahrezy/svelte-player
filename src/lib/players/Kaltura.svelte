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
	let duration = 0;
	let currentTime = 0;
	let secondsLoaded = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load() {
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL }).then(
			(playerjs) => {
				if (!iframeContainer) {
					return;
				}

				player = new playerjs.Player(iframeContainer);
				player.setLoop?.(loop);

				player.on('ready', () => {
					// An arbitrary timeout is required otherwise
					// the event listeners won’t work
					setTimeout(() => {
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
			(error) => {
				dispatch('error', {
					error
				});
			}
		);
	}

	function addListeners(player: PlayerJSPlayer) {
		player.on('play', () => {
			dispatch('play');
		});
		player.on('pause', () => {
			dispatch('pause');
		});
		player.on('ended', () => {
			dispatch('ended');
		});
		player.on('error', (error) => {
			dispatch('error', {
				error
			});
		});
		player.on('timeupdate', (data) => {
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

	export function mute() {
		player.mute();
	}

	export function unmute() {
		player.unmute();
	}

	export function setLoop(loop: boolean) {
		player.setLoop?.(loop);
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
