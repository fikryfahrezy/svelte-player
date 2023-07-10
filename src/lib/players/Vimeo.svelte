<script lang="ts">
	import type { GlobalSDKVimeoKey, VimeoPlayer } from './global-types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';
	import type { ViemoConfig } from './vimeo-types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export const url: FilePlayerUrl | undefined = undefined;
	export let playing: boolean;
	export let loop: boolean;
	export let controls: boolean;
	export const volume: number | null = null;
	export let muted: boolean;
	export const width: string | undefined = undefined;
	export const height: string | undefined = undefined;
	export let playsinline: boolean;
	export let config: ViemoConfig;

	const SDK_URL = 'https://player.vimeo.com/api/player.js';
	const SDK_GLOBAL: GlobalSDKVimeoKey = 'Vimeo';

	function cleanUrl(url: string) {
		return url.replace('/manage/videos', '');
	}

	const dispatch = createEventDispatcher<Dispatcher>();

	let container: HTMLDivElement | undefined;
	let player: VimeoPlayer | undefined;
	let duration = 0;
	let currentTime = 0;
	let secondsLoaded = 0;
	let playervolume = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string, _?: boolean): void {
		duration = 0;
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL }).then(
			(Vimeo) => {
				if (!container) {
					return;
				}
				const { playerOptions, title } = config;
				player = new Vimeo.Player(container, {
					url: cleanUrl(url),
					autoplay: playing,
					muted: muted,
					loop: loop,
					playsinline: playsinline,
					controls: controls,
					...playerOptions
				});
				player
					.ready()
					.then(() => {
						if (container === undefined) {
							return;
						}
						const iframe = container.querySelector('iframe');
						if (iframe !== null) {
							iframe.style.width = '100%';
							iframe.style.height = '100%';
							if (title) {
								iframe.title = title;
							}
						}
					})
					.catch((error) => {
						dispatch('error', { error });
					});
				player.on('loaded', () => {
					dispatch('ready');
					refreshDuration();
				});
				player.on('play', () => {
					dispatch('play');
					refreshDuration();
				});
				player.on('pause', () => {
					dispatch('pause');
				});
				player.on('seeked', (e) => {
					dispatch('seek', e.seconds);
				});
				player.on('ended', () => {
					dispatch('pause');
				});
				player.on('error', (error) => {
					dispatch('error', { error });
				});
				player.on('timeupdate', ({ seconds }) => {
					currentTime = seconds;
				});
				player.on('progress', ({ seconds }) => {
					secondsLoaded = seconds;
				});
				player.on('bufferstart', () => {
					dispatch('buffer');
				});
				player.on('bufferend', () => {
					dispatch('bufferEnd');
				});
				player.on('playbackratechange', (e) => {
					dispatch('playbackRateChange', e.playbackRate);
				});
				player.on('volumechange', (e) => {
					playervolume = e.volume;
				});
			},
			(error) => {
				dispatch('error', { error });
			}
		);
	}

	function refreshDuration() {
		if (player !== undefined) {
			player.getDuration().then((durationParam) => {
				duration = durationParam;
			});
		}
	}

	export function play() {
		if (player !== undefined) {
			const promise = player.play();
			if (promise) {
				promise.catch((error) => {
					dispatch('error', { error });
				});
			}
		}
	}

	export function pause() {
		if (player !== undefined) {
			player.pause();
		}
	}

	export function stop() {
		if (player !== undefined) {
			player.unload();
		}
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.setCurrentTime(seconds);
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
		setVolume(playervolume);
	}

	export function setPlaybackRate(rate: number): void {
		if (player !== undefined) {
			player.setPlaybackRate(rate);
		}
	}

	export function setLoop(loop: boolean): void {
		if (player !== undefined) {
			player.setLoop(loop);
		}
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
</script>

<div bind:this={container} class="vimeo-player" />

<style>
	.vimeo-player {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
