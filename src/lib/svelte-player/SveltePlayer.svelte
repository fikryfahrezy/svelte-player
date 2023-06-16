<script lang="ts">
	import Player from './Player.svelte';
	import players from './players';

	export let url: string | string[];
	export let muted = false;
	export let playing = false;
	export let stopOnUnmount = true;
	export let loop = false;
	export let progressInterval = 1000;
	export let playbackRate = 1;
	export let progressFrequency: number | undefined = undefined;
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
			activePlayer={player.loadComponent}
			on:buffer
			on:bufferEnd
			on:ended
			on:pause
			on:play
			on:ready
		/>
	{/if}
{/each}
