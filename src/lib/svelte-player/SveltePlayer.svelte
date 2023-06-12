<script lang="ts">
	import Player from './Player.svelte';
	import players from './players';

	export let url: string;
	export let muted = false;
	export let playing = false;
	export let stopOnUnmount = true;
</script>

{#each players as player}
	{#if player.canPlay(url)}
		<Player
			{url}
			{muted}
			{playing}
			{stopOnUnmount}
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
