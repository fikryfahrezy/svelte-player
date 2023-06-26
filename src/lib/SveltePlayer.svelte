<script lang="ts">
	// Recursive Partial<T> in TypeScript
	// https://stackoverflow.com/a/51365037/12976234
	type RecursivePartial<T> = {
		[P in keyof T]?: T[P] extends (infer U)[]
			? RecursivePartial<U>[]
			: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
	};

	import type {
		PlayerRef,
		SeekToType,
		SveltePlayerDispatcher,
		SveltePlayerRef,
		Config,
		PlayerKey
	} from './types';
	import type { InternalPlayerKey, PlayerUrl, FilePlayerUrl } from './players/types';

	import { createEventDispatcher } from 'svelte';
	import merge from 'deepmerge';
	import memoize from 'memoize-one';
	import Player from './PlayerMedia.svelte';
	import players from './players';
	import Preview from './Preview.svelte';
	import { defaultConfig } from './props';

	export let url: FilePlayerUrl;
	export let playing = false;
	export let loop = false;
	export let controls = false;
	export let light: boolean | string = false;
	export let volume: number | null = null;
	export let muted = false;
	export let playbackRate = 1;
	export let width = '640px';
	export let height = '360px';
	export let progressInterval = 1000;
	export let playsinline = false;
	export let pip = false;
	export let stopOnUnmount = true;
	export let previewTabIndex = 0;
	export let config: RecursivePartial<Config> = {};
	export let oEmbedUrl = 'https://noembed.com/embed?url={url}';

	export let progressFrequency: number | undefined = undefined;

	const dispatch = createEventDispatcher<SveltePlayerDispatcher>();

	let showPreviewState = !!light;
	let playerRef: PlayerRef;

	export function canEnablePIP(url: PlayerUrl) {
		for (const Player of [...players]) {
			if (Player.canEnablePIP && Player.canEnablePIP(url)) {
				return true;
			}
		}
		return false;
	}

	function handlePropsLightChange(propsLight: typeof light) {
		if (propsLight) {
			showPreviewState = true;
		}
		if (!propsLight) {
			showPreviewState = false;
		}
	}

	$: handlePropsLightChange(light);

	function handleClickPreview() {
		showPreviewState = false;
		dispatch('clickPreview');
	}

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

	const sveltePlayer: SveltePlayerRef = {
		showPreview,
		canEnablePIP,
		getCurrentTime,
		getDuration,
		getInternalPlayer,
		getSecondsLoaded,
		seekTo
	};

	function handleReady() {
		dispatch('ready', sveltePlayer);
	}

	function getConfig<T extends PlayerKey>(configUrl: FilePlayerUrl, configKey: T) {
		const memoized = memoize<(url: typeof configUrl, key: T) => Config[T]>((_, key) => {
			return merge<Config[T]>(defaultConfig[key] || {}, config[key] || {});
		});

		return memoized(configUrl, configKey);
	}
</script>

{#if showPreviewState}
	{#if url}
		<Preview
			url={url instanceof Array ? '' : url}
			{light}
			{previewTabIndex}
			{oEmbedUrl}
			isCustomPlayIcon={$$slots['play-icon']}
			on:click={handleClickPreview}
		>
			<slot name="play-icon" slot="play-icon" />
		</Preview>
	{/if}
{:else}
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
				{pip}
				{width}
				{height}
				config={getConfig(url, player.key)}
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
{/if}
