<script lang="ts">
	import type { PlayerMedia, Dispatcher } from './players/types';
	import { createEventDispatcher } from 'svelte';
	import players from './players';

	export let url: string;
	export let muted: boolean | undefined = undefined;
	let isPlayerReady = false;
	let player: PlayerMedia | undefined;

	const dispatch = createEventDispatcher<Dispatcher>();

	function onPlayerMount(event: CustomEvent<PlayerMedia>) {
		player = event.detail;
	}

	function onPlayerReady() {
		isPlayerReady = true;
		dispatch('onReady');
	}

	$: {
		if (player !== undefined && isPlayerReady) {
			if (muted) {
				player.mute();
			} else {
				player.unmute();
			}
		}
	}
</script>

{#each players as player}
	{#if player.canPlay(url)}
		{#await player.loadComponent then { default: Player }}
			<svelte:component
				this={Player}
				{url}
				on:mount={onPlayerMount}
				on:onReady={onPlayerReady}
				on:onPlay
				on:onBufferEnd
				on:onPause
				on:onBuffer
				on:onEnded
			/>
		{/await}
	{/if}
{/each}
