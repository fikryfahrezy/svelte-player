<script lang="ts">
	import type { GlobalSDKYTKey } from './global.types';
	import type { YTPlayer, YTPlayerOnStateChangeEvent, YTSDKReady } from './youtube.global.types';
	import type { PlayerUrl, Dispatcher } from './types';
	import type { ParsePlaylistFn, YouTubeConfig } from './youtube.types';

	import { createEventDispatcher, onMount } from 'svelte';
	import { MATCH_URL_YOUTUBE } from './patterns';
	import { getSDK, parseEndTime, parseStartTime, callPlayer } from './utils';

	export let playing: boolean;
	export let loop: boolean;
	export let controls: boolean;
	export let playsinline: boolean;
	export let config: YouTubeConfig;

	const playerVars = config?.playerVars;
	const embedOptions = config?.embedOptions;
	const onUnstarted = config?.onUnstarted;

	const SDK_URL = 'https://www.youtube.com/iframe_api';
	const SDK_GLOBAL: GlobalSDKYTKey = 'YT';
	const SDK_GLOBAL_READY: YTSDKReady = 'onYouTubeIframeAPIReady';
	const MATCH_PLAYLIST = /[?&](?:list|channel)=([a-zA-Z0-9_-]+)/;
	const MATCH_USER_UPLOADS = /user\/([a-zA-Z0-9_-]+)\/?/;

	const dispatch = createEventDispatcher<Dispatcher>();

	let container: HTMLDivElement | undefined;
	let player: YTPlayer | undefined;

	onMount(() => {
		dispatch('mount');
	});

	function getID(url: PlayerUrl) {
		if (!url || url instanceof Array || MATCH_PLAYLIST.test(url)) {
			return null;
		}
		return url.match(MATCH_URL_YOUTUBE)?.[1] ?? null;
	}

	function parsePlaylist(url: PlayerUrl): ReturnType<ParsePlaylistFn> {
		if (url instanceof Array) {
			const urls = new Array(url.length);
			for (let i = 0; i < url.length; i++) {
				const urlItem = url[i];
				if (typeof urlItem === 'string') {
					urls[i] = getID(urlItem);
				}
			}

			return {
				listType: 'playlist',
				list: url.join(',')
			};
		}
		if (MATCH_PLAYLIST.test(url)) {
			const mathedUrl = url.match(MATCH_PLAYLIST);
			if (mathedUrl === null) {
				return {};
			}

			const [, playlistId] = mathedUrl;
			return {
				listType: 'playlist',
				list: playlistId.replace(/^UC/, 'UU')
			};
		}
		if (MATCH_USER_UPLOADS.test(url)) {
			const matchedUrl = url.match(MATCH_USER_UPLOADS);
			if (matchedUrl === null) {
				return {};
			}

			const [, username] = matchedUrl;
			return {
				listType: 'user_uploads',
				list: username
			};
		}
		return {};
	}

	export function onStateChange(event: YTPlayerOnStateChangeEvent) {
		const { data } = event;

		const { UNSTARTED, PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window[SDK_GLOBAL].PlayerState;
		if (data === UNSTARTED) {
			onUnstarted?.();
		}
		if (data === PLAYING) {
			dispatch('play');
			dispatch('bufferEnd');
		}
		if (data === PAUSED) {
			dispatch('pause');
		}
		if (data === BUFFERING) {
			dispatch('buffer');
		}
		if (data === ENDED) {
			const isPlaylist = !!player?.getPlaylist();
			// Only loop manually if not playing a playlist
			if (loop && !isPlaylist) {
				if (playerVars?.start) {
					seekTo(playerVars.start);
				} else {
					play();
				}
			}
			dispatch('ended');
		}
		if (data === CUED) {
			dispatch('ready');
		}
	}

	export function load(url: PlayerUrl, isReady?: boolean): void {
		const id = getID(url);
		if (id === null) {
			return;
		}
		if (isReady) {
			if (
				(typeof url === 'string' && (MATCH_PLAYLIST.test(url) || MATCH_USER_UPLOADS.test(url))) ||
				url instanceof Array
			) {
				const { list, listType } = parsePlaylist(url);
				if (player !== undefined && list !== undefined && listType !== undefined) {
					player.loadPlaylist({ list, listType });
					return;
				}
			}

			if (player !== undefined) {
				player.cueVideoById({
					videoId: id,
					startSeconds: parseStartTime(url) || playerVars?.start,
					endSeconds: parseEndTime(url) || playerVars?.end
				});
			}
			return;
		}
		getSDK({
			url: SDK_URL,
			sdkGlobal: SDK_GLOBAL,
			sdkReady: SDK_GLOBAL_READY,
			isLoaded(YT) {
				return YT.loaded === 1;
			}
		}).then(
			(YT) => {
				if (!container) {
					return;
				}
				player = new YT.Player(container, {
					width: '100%',
					height: '100%',
					videoId: id,
					playerVars: {
						autoplay: playing ? 1 : 0,
						controls: controls ? 1 : 0,
						start: parseStartTime(url),
						end: parseEndTime(url),
						origin: window.location.origin,
						playsinline: playsinline ? 1 : 0,
						...parsePlaylist(url),
						...playerVars
					},
					events: {
						onReady: () => {
							if (player !== undefined && loop) {
								player.setLoop(true);
							}
							dispatch('ready');
						},
						onPlaybackRateChange: (event) => {
							dispatch('playbackRateChange', event.data);
						},
						onPlaybackQualityChange: (event) => {
							dispatch('playbackQualityChange', event);
						},
						onStateChange,
						onError: (event) => {
							dispatch('error', {
								error: event.data
							});
						}
					},
					...embedOptions
				});
			},
			(err) => {
				dispatch('error', {
					error: err
				});
			}
		);

		if (embedOptions?.events) {
			console.warn(
				"Using `embedOptions.events` will likely break things. Use SveltePlayer's callback props instead, eg onReady, onPlay, onPause"
			);
		}
	}

	export function play(): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('playVideo');
		}
	}

	export function pause(): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('pauseVideo');
		}
	}

	export function stop(): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			const youtubeIframe = calledPlayer('getIframe');
			if (youtubeIframe !== null && !document.body.contains(youtubeIframe)) {
				return;
			}
			calledPlayer('stopVideo');
		}
	}

	export function seekTo(amount: number, keepPlaying?: boolean): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('seekTo', amount);
			if (!keepPlaying && !playing) {
				pause();
			}
		}
	}

	export function setVolume(fraction: number): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('setVolume', fraction * 100);
		}
	}

	export function mute(): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('mute');
		}
	}

	export function unmute(): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('unMute');
		}
	}

	export function setPlaybackRate(rate: number): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('setPlaybackRate', rate);
		}
	}

	export function setLoop(loop: boolean): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('setLoop', loop);
		}
	}

	export function getDuration(): number {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('getDuration');
		}
		return 0;
	}

	export function getCurrentTime(): number {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('getCurrentTime');
		}
		return 0;
	}
	export function getSecondsLoaded(): number {
		let loadedFraction = 0;
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			loadedFraction = calledPlayer('getVideoLoadedFraction');
		}
		return loadedFraction * getDuration();
	}

	export function getPlayer(): YTPlayer | null {
		if (player !== undefined) {
			return player;
		}

		return null;
	}
</script>

<div class="youtube-player">
	<div bind:this={container} />
</div>

<style>
	.youtube-player {
		width: 100%;
		height: 100%;
	}
</style>
