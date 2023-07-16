<script lang="ts">
	import type { GlobalSDKSoundCloudKey } from './global-types';
	import type { SoundCloudPlayer } from './soundcloud.global.types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';
	import type { SoundCloudConfig } from './soundcloud.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export let url: FilePlayerUrl;
	export const playing: boolean | undefined = undefined;
	export const loop: boolean | undefined = undefined;
	export const controls: boolean | undefined = undefined;
	export let volume: number | null;
	export const muted: boolean | undefined = undefined;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export const playsinline: boolean | undefined = undefined;
	export let config: SoundCloudConfig;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (propsUrl instanceof Array) {
			return '';
		}
		return propsUrl;
	}

	$: propsUrl = handlePropsUrlChange(url);

	const SDK_URL = 'https://w.soundcloud.com/player/api.js';
	const SDK_GLOBAL: GlobalSDKSoundCloudKey = 'SC';

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement | undefined;
	let player: SoundCloudPlayer | undefined;

	let duration = 0;
	let currentTime = 0;
	let fractionLoaded = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string, isReady?: boolean): void {
		getSDK({
			url: SDK_URL,
			sdkGlobal: SDK_GLOBAL
		}).then((SC) => {
			if (!iframeContainer) {
				return;
			}
			const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = SC.Widget.Events;
			if (!isReady) {
				player = SC.Widget(iframeContainer);
				player.bind(PLAY, () => {
					dispatch('play');
				});
				player.bind(PAUSE, () => {
					const remaining = duration - currentTime;
					if (remaining < 0.05) {
						// Prevent onPause firing right before onEnded
						return;
					}
					dispatch('pause');
				});
				player.bind(PLAY_PROGRESS, (e) => {
					currentTime = e.currentPosition / 1000;
					fractionLoaded = e.loadedProgress;
				});
				player.bind(FINISH, () => {
					dispatch('ended');
				});
				player.bind(ERROR, (e) => {
					dispatch('error', { error: e });
				});
			}

			if (player !== undefined) {
				player.load(url, {
					...config.options,
					callback: () => {
						if (player !== undefined) {
							player.getDuration((durationParam) => {
								duration = durationParam / 1000;
								dispatch('ready');
							});
						}
					}
				});
			}
		});
	}

	export function play(): void {
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
		// Nothing to do
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.seekTo(seconds * 1000);
		}
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			player.setVolume(fraction * 100);
		}
	}

	export function mute(): void {
		setVolume(0);
	}

	export function unmute(): void {
		if (volume !== null) {
			setVolume(volume);
		}
	}

	export function getDuration(): number {
		return duration;
	}

	export function getCurrentTime(): number {
		return currentTime;
	}

	export function getSecondsLoaded(): number {
		return fractionLoaded * duration;
	}

	export function getPlayer(): GetPlayerReturn | null {
		if (player !== undefined) {
			return player;
		}

		return null;
	}
</script>

<iframe
	bind:this={iframeContainer}
	title="Sound Cloud Player"
	class="soundcloud-player"
	src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(propsUrl)}`}
	frameborder={0}
	allow="autoplay"
/>

<style>
	.soundcloud-player {
		width: 100%;
		height: 100%;
	}
</style>
