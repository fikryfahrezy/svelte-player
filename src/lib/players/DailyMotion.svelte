<script lang="ts">
	import type { GlobalSDKDailyMotionKey } from './global.types';
	import type { DailyMotionPlayer, DailyMotionSDKReady } from './dailymotion.global.types';
	import type { Dispatcher } from './types';
	import type { DailyMotionConfig } from './dailymotion.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { MATCH_URL_DAILYMOTION } from './patterns';
	import { getSDK, parseStartTime } from './utils';

	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let config: DailyMotionConfig;
	export let display: string | undefined = undefined;

	const SDK_URL = 'https://api.dmcdn.net/all.js';
	const SDK_GLOBAL: GlobalSDKDailyMotionKey = 'DM';
	const SDK_GLOBAL_READY: DailyMotionSDKReady = 'dmAsyncInit';

	const dispatch = createEventDispatcher<Dispatcher>();

	let container: HTMLDivElement;
	let player: DailyMotionPlayer;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string) {
		const id = String(url.match(MATCH_URL_DAILYMOTION)?.[1]);
		if (player) {
			player.load(id, {
				start: parseStartTime(url),
				autoplay: playing
			});
			return;
		}
		getSDK({
			url: SDK_URL,
			sdkGlobal: SDK_GLOBAL,
			sdkReady: SDK_GLOBAL_READY,
			isLoaded(DM) {
				return DM.player !== undefined;
			}
		}).then(
			(DM) => {
				if (!container) {
					return;
				}
				const Player = DM.player;
				player = new Player(container, {
					width: '100%',
					height: '100%',
					video: id,
					params: {
						controls: controls,
						autoplay: playing,
						mute: muted,
						start: parseStartTime(url),
						origin: window.location.origin,
						...config.params
					},
					events: {
						apiready() {
							dispatch('ready');
						},
						seeked() {
							dispatch('seek', player.currentTime);
						},
						video_end() {
							dispatch('ended');
						},
						durationchange: onDurationChange,
						pause() {
							dispatch('pause');
						},
						playing() {
							dispatch('play');
						},
						waiting() {
							dispatch('buffer');
						},
						error(error) {
							dispatch('error', { error });
						}
					}
				});
			},
			(error) => {
				dispatch('error', { error });
			}
		);
	}

	function onDurationChange() {
		const duration = getDuration();
		dispatch('duration', duration);
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

	export function setVolume(fraction: number) {
		player.setVolume(fraction);
	}

	export function mute() {
		player.setMuted(true);
	}

	export function unmute() {
		player.setMuted(false);
	}

	export function getDuration() {
		return player.duration || null;
	}

	export function getCurrentTime() {
		return player.currentTime;
	}

	export function getSecondsLoaded() {
		return player.bufferedTime;
	}

	export function getPlayer() {
		return player;
	}

	export function setPlayer(newPlayer: DailyMotionPlayer) {
		player = newPlayer;
	}
</script>

<div class="dailymotion-player" style:display>
	<div bind:this={container} />
</div>

<style>
	.dailymotion-player {
		width: 100%;
		height: 100%;
	}
</style>
