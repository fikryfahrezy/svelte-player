<script lang="ts">
	import type { PlayerMedia, FilePlayerUrl, Dispatcher } from './types';

	import { onMount, createEventDispatcher } from 'svelte';

	export const url: FilePlayerUrl | undefined = undefined;
	export const playing: boolean | undefined = undefined;
	export const loop: boolean | undefined = undefined;
	export const controls: boolean | undefined = undefined;
	export const muted: boolean | undefined = undefined;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export const playsinline: boolean | undefined = undefined;
	export const config: object | undefined = undefined;

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: PlayerMedia | undefined;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: FilePlayerUrl, isReady?: boolean) {
		console.log('load');
	}

	export function play() {
		console.log('play');
	}

	export function pause() {
		console.log('pause');
	}

	export function stop() {
		console.log('stop');
	}

	export function seekTo(amount: number, keepPlaying?: boolean) {
		console.log('seekTo');
	}

	export function setVolume(fraction: number) {
		console.log('setVolume');
	}

	export function mute() {
		console.log('mute');
	}

	export function unmute() {
		console.log('unmute');
	}

	export function setPlaybackRate(rate: number) {
		console.log('setPlaybackRate');
	}

	export function setLoop(loop: boolean) {
		console.log('setLoop');
	}

	export function getDuration() {
		return 0;
	}

	export function getCurrentTime() {
		return 0;
	}

	export function getSecondsLoaded() {
		return 0;
	}

	export function enablePIP() {
		console.log('enablePIP');
	}

	export function disablePIP() {
		console.log('disablePIP');
	}

	export function getPlayer() {
		return null;
	}
</script>

<p>not implemented yet.</p>
