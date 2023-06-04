<script lang="ts">
	import type { PlayerMedia, Dispatcher } from './types';
	import { onMount, createEventDispatcher } from 'svelte';
	import { MATCH_URL_YOUTUBE } from './patterns';
	import { getSDK, parseEndTime, parseStartTime, callPlayer } from './utils';

	export let url: string;
	export let playing: boolean | undefined = undefined;
	export let controls: boolean | undefined = undefined;
	export let playsinline: boolean | undefined = undefined;
	export let loop: boolean | undefined = undefined;
	export let playerVars: Partial<YTPlayerPlayerVars> | undefined = undefined;

	const SDK_URL = 'https://www.youtube.com/iframe_api';
	const SDK_GLOBAL = 'YT';
	const SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady';
	const MATCH_PLAYLIST = /[?&](?:list|channel)=([a-zA-Z0-9_-]+)/;

	const dispatch = createEventDispatcher<Dispatcher>();

	let isPlayerReady = false;
	let container: HTMLDivElement;
	let tempPlayer: YTPlayer;
	$: player = callPlayer(tempPlayer, () => {
		return isPlayerReady;
	});

	const playerMedia: PlayerMedia = {
		mute() {
			player('mute');
		},
		unmute() {
			player('unMute');
		}
	};

	function getID(url: string | string[]) {
		if (!url || url instanceof Array || MATCH_PLAYLIST.test(url)) {
			return null;
		}
		return url.match(MATCH_URL_YOUTUBE)?.[1] ?? null;
	}

	function play() {
		player('playVideo');
	}

	function pause() {
		player('pauseVideo');
	}

	function seekTo(amount: number, keepPlaying?: boolean) {
		player('seekTo', amount);
		if (!keepPlaying && !playing) {
			pause();
		}
	}

	function onStateChange(event: YTPlayerOnStateChangeEvent) {
		const { data } = event;

		const { UNSTARTED, PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window[SDK_GLOBAL].PlayerState;
		if (data === UNSTARTED) {
			// onUnstarted();
		}
		if (data === PLAYING) {
			dispatch('onPlay');
			dispatch('onBufferEnd');
		}
		if (data === PAUSED) {
			dispatch('onPause');
		}
		if (data === BUFFERING) {
			dispatch('onBuffer');
		}
		if (data === ENDED) {
			const isPlaylist = !!player('getPlaylist');
			// Only loop manually if not playing a playlist
			if (loop && !isPlaylist) {
				if (playerVars !== undefined && playerVars.start !== undefined) {
					seekTo(playerVars.start);
				} else {
					play();
				}
			}
			dispatch('onEnded');
		}
		if (data === CUED) {
			dispatch('onReady');
		}
	}

	onMount(() => {
		getSDK({
			url: SDK_URL,
			sdkGlobal: SDK_GLOBAL,
			sdkReady: SDK_GLOBAL_READY,
			isLoaded(sdk) {
				return sdk.loaded === 1;
			}
		}).then((YT) => {
			const id = getID(url);
			if (id === null) {
				return;
			}
			tempPlayer = new YT.Player(container, {
				width: '100%',
				height: '100%',
				videoId: id,
				playerVars: {
					autoplay: playing ? 1 : 0,
					controls: controls ? 1 : 0,
					start: parseStartTime(url),
					end: parseEndTime(url),
					origin: window.location.origin,
					playsinline: playsinline ? 1 : 0
				},
				events: {
					onStateChange,
					onReady: () => {
						isPlayerReady = true;
						dispatch('onReady');
					}
				}
			});
			dispatch('mount', playerMedia);
		});
	});
</script>

<div>
	<div bind:this={container} />
</div>
