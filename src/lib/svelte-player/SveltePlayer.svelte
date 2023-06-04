<script lang="ts">
	import players from './players';

	export let url: string;
</script>

{#each players as player}
	{#if player.canPlay(url)}
		{#await player.loadComponent then { default: Player }}
			<svelte:component this={Player} {url} />
		{/await}
	{/if}
{/each}
