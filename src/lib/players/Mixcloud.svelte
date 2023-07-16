<script lang="ts">
	import type { GlobalSDKMixcloudKey } from './global-types';
	import type { MixcloudWidget } from './mixcloud.global.types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';
	import type { MixcloudConfig } from './mixcloud.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { queryString, getSDK } from './utils';
	import { MATCH_URL_MIXCLOUD } from './patterns';

	export let url: FilePlayerUrl;
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

	const SDK_URL = 'https://widget.mixcloud.com/media/js/widgetApi.js';
	const SDK_GLOBAL: GlobalSDKMixcloudKey = 'Mixcloud';

	const dispatch = createEventDispatcher<Dispatcher>();

	let iframeContainer: HTMLIFrameElement | undefined;
	let player: MixcloudWidget | undefined;
	let duration = 0;
	let currentTime = 0;
	let secondsLoaded = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(_: string, __?: boolean): void {
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL }).then(
			(Mixcloud) => {
				if (iframeContainer === undefined) {
					return;
				}

				player = Mixcloud.PlayerWidget(iframeContainer);
				player.ready.then(() => {
					if (player !== undefined) {
						player.events.play.on(() => {
							dispatch('play');
						});
						player.events.pause.on(() => {
							dispatch('pause');
						});
						player.events.ended.on(() => {
							dispatch('ended');
						});
						player.events.error.on((error) => {
							dispatch('error', {
								error
							});
						});
						player.events.progress.on((secondsParam, durationParam) => {
							currentTime = secondsParam;
							duration = durationParam;
						});
					}
					dispatch('ready');
				});
			},
			(error) => {
				dispatch('error', {
					error
				});
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
		// Nothing to do
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.seek(seconds);
		}
	}

	export function setVolume(_: number): void {
		// No volume support
	}

	export function mute() {
		// No volume support
	}

	export function unmute() {
		// No volume support
	}

	export function getDuration(): number {
		return duration;
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getSecondsLoaded(): number {
		return secondsLoaded;
	}

	export function getPlayer(): GetPlayerReturn {
		if (player !== undefined) {
			return player;
		}
		return null;
	}

	$: id = (propsUrl ?? '').match(MATCH_URL_MIXCLOUD)?.[1];
	$: query = queryString({
		...config.options,
		feed: id !== undefined ? `/${id}/` : ''
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
