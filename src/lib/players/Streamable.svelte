<script lang="ts">
	import type { GlobalSDKPlayerJSKey } from './global.types';
	import type { PlayerJSPlayer } from './playerjs.global.types';
	import type { Dispatcher } from './types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';
	import { MATCH_URL_STREAMABLE } from './patterns';

	export let loop: boolean;
	export let muted: boolean;

	const SDK_URL = 'https://cdn.embed.ly/player-0.1.0.min.js';
	const SDK_GLOBAL: GlobalSDKPlayerJSKey = 'playerjs';

	const dispatch = createEventDispatcher<Dispatcher>();

	let url: string;
	let iframeContainer: HTMLIFrameElement;
	let player: PlayerJSPlayer;
	let duration = 0;
	let currentTime = 0;
	let secondsLoaded = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(loadUrl: string): void {
		url = loadUrl;
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL }).then(
			(playerjs) => {
				if (!iframeContainer) {
					return;
				}

				player = new playerjs.Player(iframeContainer);
				player.setLoop?.(loop);

				player.on('ready', () => {
					dispatch('ready');
				});
				player.on('play', () => {
					dispatch('play');
				});
				player.on('pause', () => {
					dispatch('pause');
				});
				player.on('seeked', () => {
					dispatch('seek', 0);
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
				player.on('buffered', ({ percent }) => {
					if (duration) {
						secondsLoaded = duration * percent;
					}
				});
				if (muted) {
					player.mute();
				}
			},
			(error) => {
				dispatch('error', {
					error
				});
			}
		);
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

	export function seekTo(seconds: number): void {
		player.setCurrentTime(seconds);
	}

	export function setVolume(fraction: number): void {
		player.setVolume(fraction * 100);
	}

	export function mute() {
		player.mute();
	}

	export function unmute() {
		player.unmute();
	}

	export function setLoop(loop: boolean): void {
		player.setLoop?.(loop);
	}

	export function getDuration(): number {
		return duration;
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getSecondsLoaded(): number {
		return secondsLoaded;
	}

	export function getPlayer(): PlayerJSPlayer | null {
		return player;
	}

	export function setPlayer(newPlayer: PlayerJSPlayer) {
		player = newPlayer;
	}

	$: id = url.match(MATCH_URL_STREAMABLE)?.[1];
</script>

<iframe
	bind:this={iframeContainer}
	src={`https://streamable.com/o/${id}`}
	frameBorder="0"
	scrolling="no"
	class="streamable-player"
	allow="encrypted-media; autoplay; fullscreen;"
	title="Streamable Player"
/>

<style>
	.streamable-player {
		width: 100%;
		height: 100%;
	}
</style>
