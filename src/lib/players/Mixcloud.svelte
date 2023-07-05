<script lang="ts">
	import type { MixcloudPlayer } from './global-types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';
	import type { MixcloudConfig } from './mixcloud-types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { queryString } from './utils';
	import { MATCH_URL_MIXCLOUD } from './patterns';

	export const url: FilePlayerUrl | undefined = undefined;
	export const playing: boolean | undefined = undefined;
	export const loop: boolean | undefined = undefined;
	export const controls: boolean | undefined = undefined;
	export const volume: number | null = null;
	export const muted: boolean | undefined = undefined;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export const playsinline: boolean | undefined = undefined;
	export let config: MixcloudConfig;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (propsUrl instanceof Array) {
			return '';
		}
		return propsUrl;
	}

	$: propsUrl = handlePropsUrlChange(url);

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement | undefined;

	let player: MixcloudPlayer | undefined;

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

	export function seekTo(amount: number, keepPlaying?: boolean): void {
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

	export function setPlaybackRate(rate: number): void {
		console.log('setPlaybackRate');
	}

	export function setLoop(loop: boolean): void {
		console.log('setLoop');
	}

	export function getDuration(): number {
		return 0;
	}

	export function getCurrentTime() {
		return 0;
	}

	export function getSecondsLoaded(): number {
		return 0;
	}

	// This function save to remove the function
	// if there is no implementation
	export function enablePIP(): void {
		console.log('enablePIP');
	}

	// This function save to remove the function
	// if there is no implementation
	export function disablePIP(): void {
		console.log('disablePIP');
	}

	export function getPlayer(): GetPlayerReturn {
		return null;
	}

	const id = (propsUrl ?? '').match(MATCH_URL_MIXCLOUD)?.[1];
	const query = queryString({
		...config.options,
		feed: id === undefined ? `/${id}/` : ''
	});
</script>

<iframe
	bind:this={iframeContainer}
	title="Mix Cloud Player"
	class="mixcloud-player"
	src={`https://www.mixcloud.com/widget/iframe/?${query}`}
	frameborder={0}
	allow="autoplay"
/>

<style>
	.mixcloud-player {
		width: 100%;
		height: 100%;
	}
</style>
