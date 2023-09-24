<script lang="ts">
	import type { GlobalSDKVimeoKey } from './global.types';
	import type { VimeoPlayer } from './vimeo.global.types';
	import type { Dispatcher } from './types';
	import type { ViemoConfig } from './vimeo.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK } from './utils';

	export let playing: boolean;
	export let loop: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let playsinline: boolean;
	export let config: ViemoConfig;
	export let display: string | undefined = undefined;

	const SDK_URL = 'https://player.vimeo.com/api/player.js';
	const SDK_GLOBAL: GlobalSDKVimeoKey = 'Vimeo';

	function cleanUrl(url: string) {
		return url.replace('/manage/videos', '');
	}

	const dispatch = createEventDispatcher<Dispatcher>();

	let container: HTMLDivElement;
	let player: VimeoPlayer;
	let duration = 0;
	let currentTime = 0;
	let secondsLoaded = 0;
	let playervolume = 0;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string) {
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
		player.getDuration().then((durationParam) => {
			duration = durationParam;
		});
	}

	export function play() {
		const promise = player.play();
		if (promise) {
			promise.catch((error) => {
				dispatch('error', { error });
			});
		}
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		player.unload();
	}

	export function seekTo(seconds: number) {
		player.setCurrentTime(seconds);
	}

	export function setVolume(fraction: number) {
		player.setVolume(fraction);
	}

	export function mute() {
		setVolume(0);
	}

	export function unmute() {
		setVolume(playervolume);
	}

	export function setPlaybackRate(rate: number) {
		player.setPlaybackRate(rate);
	}

	export function setLoop(loop: boolean) {
		player.setLoop(loop);
	}

	export function getDuration() {
		return duration;
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getSecondsLoaded() {
		return secondsLoaded;
	}

	export function getPlayer() {
		return player;
	}

	export function setPlayer(newPlayer: VimeoPlayer) {
		player = newPlayer;
	}
</script>

<div bind:this={container} class="vimeo-player" style:display />

<style>
	.vimeo-player {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
