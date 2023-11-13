<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unused-vars -- this is fine for documentation */
	import type { NotImplementedPlayer } from './notimplemented.global.types';
	import type { PlayerUrl, PlayerDispatcher } from './types';
	import type { NotImplementedConfig } from './notimplemented.types';

	import { onMount, createEventDispatcher } from 'svelte';

	export const url: PlayerUrl | undefined = undefined;
	export const playing: boolean | undefined = undefined;
	export const loop: boolean | undefined = undefined;
	export const controls: boolean | undefined = undefined;
	export const volume: number | null = null;
	export const muted: boolean | undefined = undefined;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export const playsinline: boolean | undefined = undefined;
	export const config: NotImplementedConfig | undefined = undefined;

	const dispatch = createEventDispatcher<PlayerDispatcher>();

	let player: NotImplementedPlayer;

	onMount(function () {
		dispatch('mount');
	});

	export function load(url: PlayerUrl, isReady?: boolean): void {
		console.log('load');
	}

	export function play(): void {
		console.log('play');
	}

	export function pause(): void {
		console.log('pause');
	}

	export function stop(): void {
		console.log('stop');
	}

	export function seekTo(seconds: number, keepPlaying?: boolean): void {
		console.log('seekTo');
	}

	export function setVolume(fraction: number): void {
		console.log('setVolume');
	}

	export function mute(): void {
		console.log('mute');
	}

	export function unmute(): void {
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

	export function getDuration(): number | null {
		return 0;
	}

	export function getCurrentTime(): number | null {
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

	export function _setPlayer(newPlayer: NotImplementedPlayer) {
		player = newPlayer;
	}
</script>

<p>not implemented yet.</p>
