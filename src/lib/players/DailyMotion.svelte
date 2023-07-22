<script lang="ts">
	import type { GlobalSDKDailyMotionKey } from './global.types';
	import type { DailyMotionPlayer, DailyMotionSDKReady } from './dailymotion.global.types';
	import type { Dispatcher } from './types';
	import type { DailyMotionConfig } from './dailymotion.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { MATCH_URL_DAILYMOTION } from './patterns';
	import { getSDK, parseStartTime, callPlayer } from './utils';

	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let config: DailyMotionConfig;

	const SDK_URL = 'https://api.dmcdn.net/all.js';
	const SDK_GLOBAL: GlobalSDKDailyMotionKey = 'DM';
	const SDK_GLOBAL_READY: DailyMotionSDKReady = 'dmAsyncInit';

	const dispatch = createEventDispatcher<Dispatcher>();

	let container: HTMLDivElement | undefined;
	let player: DailyMotionPlayer | undefined;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string, _?: boolean): void {
		const [, id] = url.match(MATCH_URL_DAILYMOTION) ?? [];
		if (id === undefined) {
			return;
		}
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
							if (player !== undefined) {
								dispatch('seek', player.currentTime);
							}
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
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('play');
		}
	}

	export function pause() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('pause');
		}
	}

	export function stop() {
		// Nothing to do
	}

	export function seekTo(seconds: number, _?: boolean): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('seek', seconds);
		}
	}

	export function setVolume(fraction: number): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('setVolume', fraction);
		}
	}

	export function mute() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('setMuted', true);
		}
	}

	export function unmute() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('setMuted', false);
		}
	}

	export function getDuration(): number {
		if (player !== undefined) {
			return player.duration || 0;
		}
		return 0;
	}

	export function getCurrentTime() {
		if (player !== undefined) {
			return player.currentTime;
		}
		return 0;
	}

	export function getSecondsLoaded(): number {
		if (player !== undefined) {
			return player.bufferedTime;
		}
		return 0;
	}

	export function getPlayer(): DailyMotionPlayer | null {
		if (player !== undefined) {
			return player;
		}
		return null;
	}
</script>

<div class="dailymotion-player">
	<div bind:this={container} />
</div>

<style>
	.dailymotion-player {
		width: 100%;
		height: 100%;
	}
</style>
