<script lang="ts">
	import type { GlobalSDKVidyardKey } from './global.types';
	import type { VidyardSDKReady, VidyardPlayer } from './vidyard.global.types';
	import type { PlayerDispatcher } from './types';
	import type { VidyardConfig } from './vidyard.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';
	import { MATCH_URL_VIDYARD } from './patterns';

	export let playing: boolean;
	export let volume: number | null;
	export let config: VidyardConfig;
	export let display: string | undefined = undefined;

	const SDK_URL = 'https://play.vidyard.com/embed/v4.js';
	const SDK_GLOBAL: GlobalSDKVidyardKey = 'VidyardV4';
	const SDK_GLOBAL_READY: VidyardSDKReady = 'onVidyardAPI';

	const dispatch = createEventDispatcher<PlayerDispatcher>();

	let container: HTMLDivElement;
	let player: VidyardPlayer;

	let duration: number | null = null;

	onMount(function () {
		dispatch('mount');
	});

	export function load(url: string) {
		const id = url && url.match(MATCH_URL_VIDYARD)?.[1];
		if (player) {
			stop();
		}
		getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(
			function (Vidyard) {
				if (!container) {
					return;
				}
				Vidyard.api.addReadyListener(function (_, newPlayer) {
					if (player) {
						return;
					}
					player = newPlayer;
					player.on('ready', function () {
						dispatch('ready');
					});
					player.on('play', function () {
						dispatch('play');
					});
					player.on('pause', function () {
						dispatch('pause');
					});
					player.on('seek', function (seekTimes) {
						dispatch('seek', seekTimes);
					});
					player.on('playerComplete', function () {
						dispatch('ended');
					});
					if (player.metadata !== null) {
						duration = player.metadata.length_in_seconds;
						dispatch('duration', player.metadata.length_in_seconds);
					}
				}, id);
				Vidyard.api.renderPlayer({
					uuid: String(id),
					container: container,
					autoplay: playing ? 1 : 0,
					...config.options
				});
			},
			function (error) {
				dispatch('error', { error });
			}
		);
	}

	export function play() {
		player.play();
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		window.VidyardV4.api.destroyPlayer(player);
	}

	export function seekTo(seconds: number, keepPlaying = true) {
		player.seek(seconds);
		if (!keepPlaying) {
			pause();
		}
	}

	export function setVolume(fraction: number) {
		player.setVolume(fraction);
	}

	export function mute() {
		setVolume(0);
	}

	export function unmute() {
		if (volume !== null) {
			setVolume(volume);
		}
	}

	export function setPlaybackRate(rate: number) {
		player.setPlaybackSpeed(rate);
	}

	export function getDuration() {
		return duration;
	}

	export function getCurrentTime() {
		return player.currentTime();
	}

	export function getSecondsLoaded() {
		return null;
	}

	export function getPlayer() {
		return player;
	}

	export function _setPlayer(newPlayer: VidyardPlayer) {
		player = newPlayer;
	}
</script>

<div class="vidyard-player" style:display>
	<div bind:this={container} />
</div>

<style>
	.vidyard-player {
		width: 100%;
		height: 100%;
	}
</style>
