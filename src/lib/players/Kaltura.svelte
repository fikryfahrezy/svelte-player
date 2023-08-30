<script lang="ts">
	import type { GlobalSDKPlayerJSKey } from './global.types';
	import type { PlayerJSPlayer } from './playerjs.global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export let url: FilePlayerUrl;
	export let loop: boolean;
	export let muted: boolean;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (typeof propsUrl !== 'string') {
			return '';
		}
		return propsUrl;
	}

	$: propsUrl = handlePropsUrlChange(url);

	const SDK_URL = 'https://cdn.embed.ly/player-0.1.0.min.js';
	const SDK_GLOBAL: GlobalSDKPlayerJSKey = 'playerjs';

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement | undefined;

	let player: PlayerJSPlayer | undefined;
	let duration = 0;
	let currentTime = 0;
	let secondsLoaded = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(_: FilePlayerUrl, __?: boolean): void {
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL }).then(
			(playerjs) => {
				if (!iframeContainer) {
					return;
				}

				player = new playerjs.Player(iframeContainer);
				if (player.setLoop !== undefined) {
					player.setLoop(loop);
				}

				player.on('ready', () => {
					// An arbitrary timeout is required otherwise
					// the event listeners won’t work
					setTimeout(() => {
						if (player !== undefined) {
							player.isReady = true;
							if (player.setLoop !== undefined) {
								player.setLoop(loop);
							}
							if (muted) {
								player.mute();
							}
							addListeners(player);
							dispatch('ready');
						}
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
		// Nothing to do
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.setCurrentTime(seconds);
		}
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			player.setVolume(fraction * 100);
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

	export function setLoop(loop: boolean): void {
		if (player !== undefined && player.setLoop !== undefined) {
			player.setLoop(loop);
		}
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
		if (player !== undefined) {
			return player;
		}
		return null;
	}
</script>

<iframe
	bind:this={iframeContainer}
	src={propsUrl}
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
