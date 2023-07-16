<script lang="ts">
	import type { GlobalSDKPlayerJSKey } from './global-types';
	import type { PlayerJSPlayer } from './playerjs.global.types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';
	import { MATCH_URL_STREAMABLE } from './patterns';

	export let url: FilePlayerUrl;
	export const playing: boolean | undefined = undefined;
	export let loop: boolean;
	export const controls: boolean | undefined = undefined;
	export const volume: number | null = null;
	export let muted: boolean;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export const playsinline: boolean | undefined = undefined;
	export const config: Record<string, never> | undefined = undefined;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (propsUrl instanceof Array) {
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

	export function getPlayer(): GetPlayerReturn {
		if (player !== undefined) {
			return player;
		}
		return null;
	}

	$: id = propsUrl.match(MATCH_URL_STREAMABLE)?.[1];
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
