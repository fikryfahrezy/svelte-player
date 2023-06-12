<script lang="ts">
	import type { PlayerMedia, Dispatcher, YouTubeConfig } from './types';
	import type { ParsePlaylistFn } from './youtube-types';
	import { onMount, createEventDispatcher } from 'svelte';
	import { MATCH_URL_YOUTUBE } from './patterns';
	import { getSDK, parseEndTime, parseStartTime, callPlayer } from './utils';

	export let url: string;
	export let playing: boolean | undefined = undefined;
	export let controls: boolean | undefined = undefined;
	export let playsinline: boolean | undefined = undefined;
	export let loop: boolean | undefined = undefined;
	export let config: YouTubeConfig | undefined = undefined;

	const playerVars = config?.playerVars;
	const embedOptions = config?.embedOptions;
	const onUnstarted = config?.onUnstarted;

	const SDK_URL = 'https://www.youtube.com/iframe_api';
	const SDK_GLOBAL = 'YT';
	const SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady';
	const MATCH_PLAYLIST = /[?&](?:list|channel)=([a-zA-Z0-9_-]+)/;
	const MATCH_USER_UPLOADS = /user\/([a-zA-Z0-9_-]+)\/?/;

	const dispatch = createEventDispatcher<Dispatcher>();

	let isPlayerReady = false;
	let container: HTMLDivElement;
	let tempPlayer: YTPlayer;
	$: player = callPlayer(tempPlayer, () => {
		return isPlayerReady;
	});

	const playerMedia: PlayerMedia = {
		play() {
			player('playVideo');
		},
		pause() {
			player('pauseVideo');
		},
		stop() {
			const youtubeIframe = player('getIframe');
			if (youtubeIframe !== null && !document.body.contains(youtubeIframe)) {
				return;
			}
			player('pauseVideo');
		},
		seekTo(amount, keepPlaying) {
			player('seekTo', amount);
			if (!keepPlaying && !playing) {
				this.pause();
			}
		},
		setVolume(fraction) {
			player('setVolume', fraction * 100);
		},
		mute() {
			player('mute');
		},
		unmute() {
			player('unMute');
		},
		setPlaybackRate(rate) {
			player('setPlaybackRate', rate);
		},
		setLoop(loop) {
			player('setLoop', loop);
		},
		getDuration() {
			return player('getDuration') ?? 0;
		},
		getCurrentTime() {
			return player('getCurrentTime') ?? 0;
		},
		getSecondsLoaded() {
			return (player('getVideoLoadedFraction') ?? 0) * this.getDuration();
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
			const isPlaylist = !!player('getPlaylist');
			// Only loop manually if not playing a playlist
			if (loop && !isPlaylist) {
				if (playerVars !== undefined && playerVars.start !== undefined) {
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

	function parsePlaylist(url: string | string[]): ReturnType<ParsePlaylistFn> {
		if (url instanceof Array) {
			return {
				listType: 'playlist',
				playlist: url.map(getID).join(',')
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
					playsinline: playsinline ? 1 : 0,
					...parsePlaylist(url),
					...playerVars
				},
				events: {
					onReady: () => {
						isPlayerReady = true;
						if (loop) {
							player('setLoop', true);
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
			if (!!embedOptions?.events) {
				console.warn(
					"Using `embedOptions.events` will likely break things. Use ReactPlayer's callback props instead, eg onReady, onPlay, onPause"
				);
			}
			dispatch('mount', playerMedia);
		});
	});
</script>

<div>
	<div bind:this={container} />
</div>
