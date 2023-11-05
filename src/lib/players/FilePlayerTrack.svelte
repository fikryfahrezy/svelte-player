<script lang="ts">
	import type { HTMLTrackAttributes } from 'svelte/elements';
	import type { FileUrl } from './file.types';

	export let url: FileUrl;
	export let tracks: Omit<HTMLTrackAttributes, `on:${string}`>[];
</script>

{#if url instanceof Array}
	{#each url as source}
		{#if typeof source === 'string'}
			<source src={source} />
		{:else}
			<source {...source} />
		{/if}
	{/each}
{/if}
{#each tracks as track}
	<track {...track} />
{/each}
