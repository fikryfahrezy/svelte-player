<script lang="ts">
	import type { GlobalSDKVidyardKey } from './global.types';
	import type { VidyardSDKReady, VidyardPlayer } from './vidyard.global.types';
	import type { Dispatcher } from './types';
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

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: VidyardPlayer;
	let container: HTMLDivElement;
	let duration = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string) {
		const id = url && url.match(MATCH_URL_VIDYARD)?.[1];
		if (player) {
			stop();
		}
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL, sdkReady: SDK_GLOBAL_READY }).then(
			(Vidyard) => {
				if (!container) {
					return;
				}
				Vidyard.api.addReadyListener((_, newPlayer) => {
					if (player) {
						return;
					}
					player = newPlayer;
					player.on('ready', () => {
						dispatch('ready');
					});
					player.on('play', () => {
						dispatch('play');
					});
					player.on('pause', () => {
						dispatch('pause');
					});
					player.on('seek', (seekTimes) => {
						dispatch('seek', seekTimes);
					});
					player.on('playerComplete', () => {
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
			(error) => {
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

	export function seekTo(seconds: number) {
		player.seek(seconds);
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

	export function setPlayer(newPlayer: VidyardPlayer) {
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
