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
	let container: HTMLDivElement | undefined;
	let player: YTPlayer | undefined;

	function getID(url: string | string[]) {
		if (!url || url instanceof Array || MATCH_PLAYLIST.test(url)) {
			return null;
		}
		return url.match(MATCH_URL_YOUTUBE)?.[1] ?? null;
	}

	function parsePlaylist(url: string | string[]): ReturnType<ParsePlaylistFn> {
		if (url instanceof Array) {
			return {
				listType: 'playlist',
				list: url.map(getID).join(',')
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
			const isPlaylist = !!player?.getPlaylist();
			// Only loop manually if not playing a playlist
			if (player !== undefined && isPlayerReady && loop && !isPlaylist) {
				if (playerVars?.start) {
					player.seekTo(playerVars.start);
				} else {
					player.playVideo();
				}
			}
			dispatch('ended');
		}
		if (data === CUED) {
			dispatch('ready');
		}
	}

	const playerMedia: PlayerMedia = {
		load(url, isReady) {
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
					if (
						player !== undefined &&
						isPlayerReady &&
						list !== undefined &&
						listType !== undefined
					) {
						player.loadPlaylist({ list, listType });
						return;
					}
				}

				if (player !== undefined && isPlayerReady) {
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
				isLoaded(sdk) {
					return sdk.loaded === 1;
				}
			}).then((YT) => {
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
							isPlayerReady = true;
							if (player !== undefined && isPlayerReady && loop) {
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
				if (!!embedOptions?.events) {
					console.warn(
						"Using `embedOptions.events` will likely break things. Use SveltePlayer's callback props instead, eg onReady, onPlay, onPause"
					);
				}
			});
		},
		play() {
			if (player !== undefined && isPlayerReady) {
				player.playVideo();
			}
		},
		pause() {
			if (player !== undefined && isPlayerReady) {
				player.pauseVideo();
			}
		},
		stop() {
			if (player !== undefined && isPlayerReady) {
				const youtubeIframe = player.getIframe();
				if (youtubeIframe !== null && !document.body.contains(youtubeIframe)) {
					return;
				}
				player.stopVideo();
			}
		},
		seekTo(amount, keepPlaying) {
			if (player !== undefined && isPlayerReady) {
				player.seekTo(amount);
				if (!keepPlaying && !playing) {
					this.pause();
				}
			}
		},
		setVolume(fraction) {
			if (player !== undefined && isPlayerReady) {
				player.setVolume(fraction * 100);
			}
		},
		mute() {
			if (player !== undefined && isPlayerReady) {
				player.mute();
			}
		},
		unmute() {
			if (player !== undefined && isPlayerReady) {
				player.unMute();
			}
		},
		setPlaybackRate(rate) {
			if (player !== undefined && isPlayerReady) {
				player.setPlaybackRate(rate);
			}
		},
		setLoop(loop) {
			if (player !== undefined && isPlayerReady) {
				player.setLoop(loop);
			}
		},
		getDuration() {
			if (player !== undefined && isPlayerReady) {
				return player.getDuration();
			}
			return 0;
		},
		getCurrentTime() {
			if (player !== undefined && isPlayerReady) {
				return player.getCurrentTime();
			}
			return 0;
		},
		getSecondsLoaded() {
			let loadedFraction = 0;
			if (player !== undefined && isPlayerReady) {
				loadedFraction = player.getVideoLoadedFraction();
			}
			return loadedFraction * this.getDuration();
		}
	};

	onMount(() => {
		dispatch('mount', playerMedia);
	});
</script>

<div>
	<div bind:this={container} />
</div>
