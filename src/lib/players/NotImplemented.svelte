<script lang="ts">
	import type { NotImplementedPlayer } from './notimplemented.global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { NotImplementedConfig } from './notimplemented.types';

	import { onMount, createEventDispatcher } from 'svelte';

	export const url: FilePlayerUrl | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const playing: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const loop: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const controls: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const volume: number | null = null; // not used yet, but for suppress the warn from svelte check
	export const muted: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const width: string | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const height: string | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const playsinline: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const config: NotImplementedConfig | undefined = undefined; // not used yet, but for suppress the warn from svelte check

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: NotImplementedPlayer;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: FilePlayerUrl, isReady?: boolean): void {
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

	export function seekTo(seconds: number, keepPlaying?: boolean): void {
		console.log('seekTo');
	}

	export function setVolume(fraction: number): void {
		console.log('setVolume');
	}

	export function mute() {
		console.log('mute');
	}

	export function unmute() {
		console.log('unmute');
	}

	// This function safe to remove the function
	// if there is no implementation
	export function setPlaybackRate(rate: number): void {
		console.log('setPlaybackRate');
	}

	// This function safe to remove the function
	// if there is no implementation
	export function setLoop(loop: boolean): void {
		console.log('setLoop');
	}

	export function getDuration(): number {
		return 0;
	}

	export function getCurrentTime() {
		return 0;
	}

	export function getSecondsLoaded(): number | null {
		return 0;
	}

	// This function safe to remove the function
	// if there is no implementation
	export function enablePIP(): void {
		console.log('enablePIP');
	}

	// This function safe to remove the function
	// if there is no implementation
	export function disablePIP(): void {
		console.log('disablePIP');
	}

	export function getPlayer(): NotImplementedPlayer {
		return player;
	}

	export function setPlayer(newPlayer: NotImplementedPlayer) {
		player = newPlayer;
	}
</script>

<p>not implemented yet.</p>
