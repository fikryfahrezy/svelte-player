<script lang="ts">
	import type { GlobalSDKSoundCloudKey } from './global.types';
	import type { SoundCloudPlayer } from './soundcloud.global.types';
	import type { PlayerDispatcher } from './types';
	import type { SoundCloudConfig } from './soundcloud.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export let url: string;
	export let volume: number | null;
	export let config: SoundCloudConfig;
	export let display: string | undefined = undefined;

	const SDK_URL = 'https://w.soundcloud.com/player/api.js';
	const SDK_GLOBAL: GlobalSDKSoundCloudKey = 'SC';

	const dispatch = createEventDispatcher<PlayerDispatcher>();

	let iframeContainer: HTMLIFrameElement;
	let player: SoundCloudPlayer;

	let duration = 0;
	let currentTime = 0;
	let fractionLoaded = 0;

	onMount(function () {
		dispatch('mount');
	});

	export function load(url: string, isReady?: boolean) {
		getSDK(SDK_URL, SDK_GLOBAL).then(function (SC) {
			if (!iframeContainer) {
				return;
			}
			const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = SC.Widget.Events;
			if (!isReady) {
				player = SC.Widget(iframeContainer);
				player.bind(PLAY, function () {
					dispatch('play');
				});
				player.bind(PAUSE, function () {
					const remaining = duration - currentTime;
					if (remaining < 0.05) {
						// Prevent onPause firing right before onEnded
						return;
					}
					dispatch('pause');
				});
				player.bind(PLAY_PROGRESS, function (e) {
					currentTime = e.currentPosition / 1000;
					fractionLoaded = e.loadedProgress;
				});
				player.bind(FINISH, function () {
					dispatch('ended');
				});
				player.bind(ERROR, function (e) {
					dispatch('error', { error: e });
				});
			}

			player.load(url, {
				...config.options,
				callback() {
					player.getDuration(function (durationParam) {
						duration = durationParam / 1000;
						dispatch('ready');
					});
				}
			});
		});
	}

	export function play() {
		player.play();
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		// Nothing to do
	}

	export function seekTo(seconds: number, keepPlaying = true) {
		player.seekTo(seconds * 1000);
		if (!keepPlaying) {
			pause();
		}
	}

	export function setVolume(fraction: number) {
		player.setVolume(fraction * 100);
	}

	export function mute() {
		setVolume(0);
	}

	export function unmute() {
		if (volume !== null) {
			setVolume(volume);
		}
	}

	export function getDuration() {
		return duration;
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getSecondsLoaded() {
		return fractionLoaded * duration;
	}

	export function getPlayer() {
		return player;
	}

	export function _setPlayer(newPlayer: SoundCloudPlayer) {
		player = newPlayer;
	}

	export function _setDuration(newDuration: number) {
		duration = newDuration;
	}

	export function _setCurrentTime(newCurrentTime: number) {
		currentTime = newCurrentTime;
	}

	export function _setFractionLoaded(newFractionLoaded: number) {
		fractionLoaded = newFractionLoaded;
	}
</script>

<iframe
	bind:this={iframeContainer}
	title="SoundCloud Player"
	class="soundcloud-player"
	src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`}
	frameborder={0}
	allow="autoplay"
	style:display
/>

<style>
	.soundcloud-player {
		width: 100%;
		height: 100%;
	}
</style>
