<script lang="ts">
	import type { SoundCloudPlayer } from './global-types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';
	import type { SoundCloudConfig } from './sound-cloud-types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export let url: FilePlayerUrl;
	export const playing: boolean | undefined = undefined;
	export const loop: boolean | undefined = undefined;
	export const controls: boolean | undefined = undefined;
	export const muted: boolean | undefined = undefined;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export const playsinline: boolean | undefined = undefined;
	export const config: SoundCloudConfig | undefined = undefined;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (propsUrl instanceof Array) {
			return '';
		}
		return propsUrl;
	}

	$: propsUrl = handlePropsUrlChange(url);

	const SDK_URL = 'https://w.soundcloud.com/player/api.js';
	const SDK_GLOBAL = 'SC';

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement | undefined;
	let player: SoundCloudPlayer | undefined;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: FilePlayerUrl, isReady?: boolean): void {
		getSDK({
			url: SDK_URL,
			sdkGlobal: SDK_GLOBAL
		}).then((SC) => {
			if (!iframeContainer) {
				return;
			}
			const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = SC.Widget.Events;
			if (!isReady) {
				player = SC.Widget(iframeContainer);
			}
		});
	}

	export function play(): void {
		if (player !== undefined) {
			// do something
		}
		console.log('play');
	}

	export function pause() {
		if (player !== undefined) {
			// do something
		}
		console.log('pause');
	}

	export function stop() {
		if (player !== undefined) {
			// do something
		}
		console.log('stop');
	}

	export function seekTo(amount: number, keepPlaying?: boolean): void {
		if (player !== undefined) {
			// do something
		}
		console.log('seekTo');
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			// do something
		}
		console.log('setVolume');
	}

	export function mute(): void {
		if (player !== undefined) {
			// do something
		}
		console.log('mute');
	}

	export function unmute(): void {
		if (player !== undefined) {
			// do something
		}
		console.log('unmute');
	}

	export function setPlaybackRate(rate: number): void {
		if (player !== undefined) {
			// do something
		}
		console.log('setPlaybackRate');
	}

	export function setLoop(loop: boolean): void {
		if (player !== undefined) {
			// do something
		}
		console.log('setLoop');
	}

	export function getDuration(): number {
		if (player !== undefined) {
			return 0;
		}
		return 0;
	}

	export function getCurrentTime(): number {
		if (player !== undefined) {
			return 0;
		}

		return 0;
	}

	export function getSecondsLoaded(): number {
		if (player !== undefined) {
			return 0;
		}

		return 0;
	}

	export function getPlayer(): GetPlayerReturn | null {
		if (player !== undefined) {
			return player;
		}

		return null;
	}
</script>

<iframe
	bind:this={iframeContainer}
	title="Sound Cloud Player"
	class="sound-cloud-player"
	src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(propsUrl)}`}
	frameborder={0}
	allow="autoplay"
/>

<style>
	.sound-cloud-player {
		width: 100%;
		height: 100%;
	}
</style>
