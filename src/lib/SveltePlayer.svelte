<script lang="ts">
	import type { PlayerRef, SeekToType, SveltePlayerDispatcher } from './types';
	import type { InternalPlayerKey, PlayerUrl } from './players/types';
	import { createEventDispatcher } from 'svelte';
	import Player from './Player.svelte';
	import players from './players';

	export let url: PlayerUrl;
	export let playing = false;
	export let loop = false;
	export let controls = false;
	export let light = false;
	export let volume: number | null = null;
	export let muted = false;
	export let playbackRate = 1;
	export let progressInterval = 1000;
	export let playsinline = false;
	export let stopOnUnmount = true;

	export let progressFrequency: number | undefined = undefined;

	const dispatch = createEventDispatcher<SveltePlayerDispatcher>();

	let showPreviewState = !!light;
	let playerRef: PlayerRef;

	export function showPreview() {
		showPreviewState = true;
	}

	export function getDuration() {
		if (!playerRef) return null;
		return playerRef.getDuration();
	}

	export function getCurrentTime() {
		if (!playerRef) return null;
		return playerRef.getCurrentTime();
	}

	export function getSecondsLoaded() {
		if (!playerRef) return null;
		return playerRef.getSecondsLoaded();
	}

	export function getInternalPlayer(key: InternalPlayerKey = 'player') {
		if (!playerRef) return null;
		return playerRef.getInternalPlayer(key);
	}

	export function seekTo(fraction: number, type?: SeekToType, keepPlaying?: boolean) {
		if (!playerRef) return null;
		playerRef.seekTo(fraction, type, keepPlaying);
	}

	const sveltePlayer: PlayerRef = {
		getCurrentTime,
		getDuration,
		getInternalPlayer,
		getSecondsLoaded,
		seekTo
	};

	function handleReady() {
		dispatch('ready', sveltePlayer);
	}
</script>

{#each players as player}
	{#if player.canPlay(url)}
		<Player
			{url}
			{muted}
			{playing}
			{stopOnUnmount}
			{loop}
			{progressInterval}
			{progressFrequency}
			{playbackRate}
			{volume}
			{controls}
			{playsinline}
			activePlayer={player.loadComponent}
			bind:this={playerRef}
			on:ready={handleReady}
			on:start
			on:play
			on:pause
			on:buffer
			on:playbackRateChange
			on:seek
			on:ended
			on:error
			on:progress
			on:duration
			on:playbackQualityChange
		/>
	{/if}
{/each}
