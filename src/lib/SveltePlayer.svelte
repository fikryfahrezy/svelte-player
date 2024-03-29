<script lang="ts" context="module">
	import type { Player as PlayerType } from './players/types';
	import players from './players';

	const customPlayers: PlayerType[] = [];

	export function addCustomPlayer(player: PlayerType) {
		customPlayers.push(player);
	}

	export function removeCustomPlayers() {
		customPlayers.length = 0;
	}

	export function canPlay(url: PlayerUrl) {
		for (const Player of [...customPlayers, ...players]) {
			if (Player.canPlay(url)) {
				return true;
			}
		}
		return false;
	}

	export function canEnablePIP(url: PlayerUrl) {
		for (const Player of [...customPlayers, ...players]) {
			if (Player.canEnablePIP && Player.canEnablePIP(url)) {
				return true;
			}
		}
		return false;
	}
</script>

<script lang="ts">
	import type { PlayerMediaRef, SeekToType, SveltePlayerDispatcher } from './types';
	import type { RecursivePartial } from './players/utility.types';
	import type {
		PlayerUrl,
		PlayerConfig,
		PlayerConfigProps,
		PlayerGetPlayerKey,
		PlayerInternalPlayer
	} from './players/types';

	import { createEventDispatcher } from 'svelte';
	import merge from 'deepmerge';
	import memoize from 'memoize-one';
	import Player from './PlayerMedia.svelte';
	import Preview from './Preview.svelte';
	import { defaultConfig } from './props';

	export const someValue = 123;

	export let url: PlayerUrl;
	export let playing = false;
	export let loop = false;
	export let controls = false;
	export let light: boolean = false;
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
	export let config: RecursivePartial<PlayerConfig> = {};
	export let oEmbedUrl = 'https://noembed.com/embed?url={url}';

	export let progressFrequency: number | undefined = undefined;
	export let display: string | undefined = undefined;

	const dispatch = createEventDispatcher<SveltePlayerDispatcher>();

	let playerRef: PlayerMediaRef;
	let isElementLight = !!$$slots['light'];
	let showPreviewState = !!light || isElementLight;

	function handleClickPreview(e: Event) {
		showPreviewState = false;
		dispatch('clickPreview', e);
	}

	export function showPreview() {
		showPreviewState = true;
	}

	export function getDuration() {
		if (!playerRef) {
			return null;
		}
		return playerRef.getDuration();
	}

	export function getCurrentTime() {
		if (!playerRef) {
			return null;
		}
		return playerRef.getCurrentTime();
	}

	export function getSecondsLoaded() {
		if (!playerRef) {
			return null;
		}
		return playerRef.getSecondsLoaded();
	}

	export function getInternalPlayer<TKey extends PlayerGetPlayerKey>(
		key: TKey | 'player' = 'player'
	): PlayerInternalPlayer['player'] | PlayerInternalPlayer[TKey] | null {
		if (!playerRef) {
			return null;
		}
		return playerRef.getInternalPlayer(key);
	}

	export function seekTo(fraction: number, type?: SeekToType, keepPlaying?: boolean) {
		if (!playerRef) {
			return null;
		}
		playerRef.seekTo(fraction, type, keepPlaying);
	}

	export function handleReady() {
		dispatch('ready');
	}

	function getConfig<TUrl extends PlayerUrl, TKey extends string>(
		configUrl: TUrl,
		configKey: TKey
	) {
		const memoized = memoize<(url: TUrl, key: TKey) => PlayerConfigProps>((_, key) => {
			return merge<PlayerConfigProps>(defaultConfig[key] || {}, config[key] || {});
		});

		return memoized(configUrl, configKey);
	}

	export function _getPlayer() {
		return playerRef;
	}

	export function _setPlayer(newPlayer: PlayerMediaRef) {
		playerRef = newPlayer;
	}
</script>

{#if showPreviewState}
	{#if url}
		<Preview
			{light}
			{previewTabIndex}
			{oEmbedUrl}
			url={typeof url !== 'string' ? '' : url}
			playIcon={$$slots['play-icon']}
			{isElementLight}
			on:click={handleClickPreview}
		>
			<slot name="light" slot="light" />
			<slot name="play-icon" slot="play-icon" />
		</Preview>
	{/if}
{:else}
	{#each [...customPlayers, ...players] as player}
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
				{display}
				loopOnEnded={player.loopOnEnded}
				forceLoad={player.forceLoad}
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
