<script lang="ts">
	import type { GlobalSDKMixcloudKey } from './global.types';
	import type { MixcloudWidget } from './mixcloud.global.types';
	import type { Dispatcher } from './types';
	import type { MixcloudConfig } from './mixcloud.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { queryString, getSDK } from './utils';
	import { MATCH_URL_MIXCLOUD } from './patterns';

	export let url: string;
	export let config: MixcloudConfig;

	const SDK_URL = 'https://widget.mixcloud.com/media/js/widgetApi.js';
	const SDK_GLOBAL: GlobalSDKMixcloudKey = 'Mixcloud';

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement;
	let player: MixcloudWidget;

	let duration: number | null = null;
	let currentTime: number | null = null;

	onMount(function () {
		dispatch('mount');
	});

	export function load() {
		getSDK(SDK_URL, SDK_GLOBAL).then(
			function (Mixcloud) {
				player = Mixcloud.PlayerWidget(iframeContainer);
				player.ready.then(function () {
					player.events.play.on(function () {
						dispatch('play');
					});
					player.events.pause.on(function () {
						dispatch('pause');
					});
					player.events.ended.on(function () {
						dispatch('ended');
					});
					player.events.error.on(function (error) {
						dispatch('error', {
							error
						});
					});
					player.events.progress.on(function (seconds, durationParam) {
						currentTime = seconds;
						duration = durationParam;
					});
					dispatch('ready');
				});
			},
			function (error) {
				dispatch('error', {
					error
				});
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
		// Nothing to do
	}

	export function seekTo(seconds: number) {
		player.seek(seconds);
	}

	export function setVolume(_: number) {
		// No volume support
	}

	export function mute() {
		// No volume support
	}

	export function unmute() {
		// No volume support
	}

	export function getDuration() {
		return duration;
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getSecondsLoaded() {
		return null;
	}

	export function getPlayer() {
		return player;
	}

	export function setPlayer(newPlayer: MixcloudWidget) {
		player = newPlayer;
	}

	$: id = url.match(MATCH_URL_MIXCLOUD)?.[1];
	$: query = queryString({
		...config.options,
		feed: `/${id}/`
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
