<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import type { FileUrl, AddListenersFn, RemoveListenersFn } from './file.types';

	import { onMount } from 'svelte';

	export let url: FileUrl;
	export let src: string | undefined;
	export let style: string | undefined;
	export let preload: string | undefined;
	export let autoplay: boolean | undefined;
	export let controls: boolean | undefined;
	export let muted: boolean | undefined;
	export let loop: boolean | undefined;
	export let attributes: HTMLVideoAttributes | undefined;
	export let addListeners: AddListenersFn;
	export let removeListeners: RemoveListenersFn;

	let player: HTMLVideoElement;

	onMount(function () {
		addListeners(player);

		return function () {
			player.src = '';
			removeListeners(player, url);
		};
	});

	export function getPlayer() {
		return player;
	}
</script>

<video
	bind:this={player}
	{src}
	{style}
	{preload}
	{autoplay}
	{controls}
	{muted}
	{loop}
	{...attributes}
>
	<slot />
</video>
