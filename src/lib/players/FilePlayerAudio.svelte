<script lang="ts">
	import type { HTMLAudioAttributes } from 'svelte/elements';
	import type { FileUrl, AddListenersFn, RemoveListenersFn } from './file.types';

	import { onMount } from 'svelte';
	import { isMediaStream } from './utils';

	export let url: FileUrl;
	export let src: string | undefined;
	export let style: string | undefined;
	export let preload: string | undefined;
	export let autoplay: boolean | undefined;
	export let controls: boolean | undefined;
	export let muted: boolean | undefined;
	export let loop: boolean | undefined;
	export let attributes: HTMLAudioAttributes | undefined;
	export let addListeners: AddListenersFn;
	export let removeListeners: RemoveListenersFn;

	let player: HTMLAudioElement;

	function handleUrlChange(newUrl: FileUrl) {
		if (player !== undefined && !isMediaStream(newUrl)) {
			player.srcObject = null;
		}
	}

	$: handleUrlChange(url);

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

<audio
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
</audio>
