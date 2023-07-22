<script lang="ts">
	import type { GlobalSDKVidyardKey } from './global.types';
	import type { VidyardSDKReady, VidyardPlayer } from './vidyard.global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { VidyardConfig } from './vidyard.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';
	import { MATCH_URL_VIDYARD } from './patterns';

	export let playing: boolean;
	export let volume: number | null;
	export let config: VidyardConfig;

	const SDK_URL = 'https://play.vidyard.com/embed/v4.js';
	const SDK_GLOBAL: GlobalSDKVidyardKey = 'VidyardV4';
	const SDK_GLOBAL_READY: VidyardSDKReady = 'onVidyardAPI';

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: VidyardPlayer | undefined;
	let container: HTMLDivElement | undefined;
	let duration = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string, _?: boolean): void {
		const id = url && url.match(MATCH_URL_VIDYARD)?.[1];
		if (id === undefined) {
			return;
		}
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
					uuid: id,
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
		if (player !== undefined) {
			player.play();
		}
	}

	export function pause() {
		if (player !== undefined) {
			player.pause();
		}
	}

	export function stop() {
		if (player !== undefined) {
			window.VidyardV4.api.destroyPlayer(player);
		}
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.seek(seconds);
		}
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			player.setVolume(fraction);
		}
	}

	export function mute() {
		setVolume(0);
	}

	export function unmute() {
		if (volume !== null) {
			setVolume(volume);
		}
	}

	export function setPlaybackRate(rate: number): void {
		if (player !== undefined) {
			player.setPlaybackSpeed(rate);
		}
	}

	export function getDuration(): number {
		return duration;
	}

	export function getCurrentTime() {
		if (player !== undefined) {
			return player.currentTime();
		}
		return 0;
	}

	export function getSecondsLoaded(): number {
		return 0;
	}

	export function getPlayer(): VidyardPlayer | null {
		if (player !== undefined) {
			return player;
		}
		return null;
	}
</script>

<div class="vidyard-player">
	<div bind:this={container} />
</div>

<style>
	.vidyard-player {
		width: 100%;
		height: 100%;
	}
</style>
