<script lang="ts">
	import type { SeekToType, PlayerDispatcher } from './types';
	import type { Player } from './players';
	import type {
		OnProgressProps,
		PlayerMediaRef,
		InternalPlayerKey,
		OnErrorProps,
		FilePlayerUrl
	} from './players/types';
	import { onMount, createEventDispatcher } from 'svelte';
	import { isMediaStream } from './players/utils';

	export let url: FilePlayerUrl;
	export let playing: boolean;
	export let loop: boolean;
	export let controls: boolean;
	export let volume: number | null;
	export let muted: boolean;
	export let playbackRate: number;
	export let width: string;
	export let height: string;
	export let progressInterval: number;
	export let playsinline: boolean;
	export let pip: boolean;
	export let stopOnUnmount: boolean;
	export let config: any; // Expect this type is `PlayerConfig` but, can't figure it out how

	export let progressFrequency: number | undefined = undefined;

	export let loopOnEnded: boolean | undefined = undefined;
	// export let forceLoad: boolean | undefined = undefined;
	export let activePlayer: Player['loadComponent'];

	let mounted = false;
	let isReady = false;
	let isPlaying = false; // Track playing state internally to prevent bugs
	let isLoading = true; // Use isLoading to prevent onPause when switching URL
	let loadOnReady: FilePlayerUrl | null = null;
	let seekOnPlay: number | null = null;
	let progressTimeout: number | undefined = undefined;
	let durationCheckTimeout: number | undefined = undefined;
	let prevPlayed: number | undefined = undefined;
	let prevLoaded: number | undefined = undefined;
	let onDurationCalled: boolean | undefined = undefined;
	let startOnPlay: boolean | undefined = undefined;
	let player: PlayerMediaRef | undefined;

	const SEEK_ON_PLAY_EXPIRY = 5000;
	const dispatch = createEventDispatcher<PlayerDispatcher>();

	onMount(() => {
		mounted = true;

		return () => {
			clearTimeout(progressTimeout);
			clearTimeout(durationCheckTimeout);
			if (player !== undefined && isReady && stopOnUnmount) {
				player.stop();

				if (player.disablePIP) {
					player.disablePIP();
				}
			}

			mounted = false;
		};
	});

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (player !== undefined && isReady) {
			if (isLoading && !isMediaStream(propsUrl)) {
				console.warn(
					`SveltePlayer: the attempt to load ${propsUrl} is being deferred until the player has loaded`
				);
				loadOnReady = propsUrl;
			} else {
				isLoading = true;
				startOnPlay = true;
				onDurationCalled = false;
				player.load(propsUrl, isReady);
			}
		}
	}

	$: handlePropsUrlChange(url);

	function handlePropsPlayingChange(propsPlaying: typeof playing) {
		if (player !== undefined && isReady) {
			if (propsPlaying && !isPlaying) {
				player.play();
			}
			if (!propsPlaying && isPlaying) {
				player.pause();
			}
		}
	}

	$: handlePropsPlayingChange(playing);

	function handlePropsPipChange(propsPip: typeof pip) {
		if (player !== undefined && isReady) {
			if (propsPip && player.enablePIP) {
				player.enablePIP();
			}

			if (!propsPip && player.disablePIP) {
				player.disablePIP();
			}
		}
	}

	$: handlePropsPipChange(pip);

	function handlePropsVolumeChange(propsVolume: typeof volume) {
		if (player !== undefined && isReady && propsVolume !== null) {
			player.setVolume(propsVolume);
		}
	}

	$: handlePropsVolumeChange(volume);

	function handlePropsMutedChange(propsMuted: typeof muted) {
		if (player !== undefined && isReady) {
			if (propsMuted) {
				player.mute();
			} else {
				player.unmute();
				if (volume !== null) {
					// Set volume next tick to fix a bug with DailyMotion
					setTimeout(() => {
						if (player !== undefined && volume !== null) {
							player.setVolume(volume);
						}
					});
				}
			}
		}
	}

	$: handlePropsMutedChange(muted);

	function handlePropsPlaybackRateChange(propsPlaybackRate: typeof playbackRate) {
		if (player !== undefined && isReady && player.setPlaybackRate) {
			player.setPlaybackRate(propsPlaybackRate);
		}
	}

	$: handlePropsPlaybackRateChange(playbackRate);

	function handlePropsLoopChange(propsLoop: typeof loop) {
		if (player !== undefined && isReady && player.setLoop) {
			player.setLoop(propsLoop);
		}
	}

	$: handlePropsLoopChange(loop);

	function handlePlayerMount() {
		if (player !== undefined) {
			player.load(url);
			progress();
		}
	}

	export function getDuration() {
		if (player === undefined || !isReady) {
			return null;
		}
		return player.getDuration();
	}

	export function getCurrentTime() {
		if (player === undefined || !isReady) {
			return null;
		}
		return player.getCurrentTime();
	}

	export function getSecondsLoaded() {
		if (player === undefined || !isReady) {
			return null;
		}
		return player.getSecondsLoaded();
	}

	export function getInternalPlayer(key: InternalPlayerKey) {
		if (!player) return null;
		switch (key) {
			case 'player':
				if (player.getPlayer !== undefined) {
					return player.getPlayer();
				}
				return null;
			case 'hls':
			case 'dash':
			default:
				return null;
		}
	}

	function progress() {
		if (url && player && isReady) {
			const playedSeconds = getCurrentTime() || 0;
			const loadedSeconds = getSecondsLoaded();
			const duration = getDuration();
			if (duration) {
				const progress: OnProgressProps = {
					playedSeconds,
					played: playedSeconds / duration
				};
				if (loadedSeconds !== null) {
					progress.loadedSeconds = loadedSeconds;
					progress.loaded = loadedSeconds / duration;
				}
				// Only call onProgress if values have changed
				if (progress.playedSeconds !== prevPlayed || progress.loadedSeconds !== prevLoaded) {
					dispatch('progress', progress);
				}
				prevPlayed = progress.playedSeconds;
				prevLoaded = progress.loadedSeconds;
			}
		}
		progressTimeout = window.setTimeout(progress, progressFrequency || progressInterval);
	}

	export function seekTo(amount: number, type?: SeekToType, keepPlaying = false) {
		// When seeking before player is ready, store value and seek later
		if (player === undefined || !isReady) {
			if (amount !== 0) {
				seekOnPlay = amount;
				setTimeout(() => {
					seekOnPlay = null;
				}, SEEK_ON_PLAY_EXPIRY);
			}
			return;
		}
		const isFraction = !type ? amount > 0 && amount < 1 : type === 'fraction';
		if (isFraction) {
			// Convert fraction to seconds based on duration
			const duration = player.getDuration();
			if (!duration) {
				console.warn('SveltePlayer: could not seek using fraction - duration not yet available');
				return;
			}
			player.seekTo(duration * amount, keepPlaying);
			return;
		}
		player.seekTo(amount, keepPlaying);
	}

	function handleReady() {
		if (!mounted) {
			return;
		}

		isReady = true;
		isLoading = false;
		dispatch('ready');

		if (player !== undefined && !muted && volume !== null) {
			player.setVolume(volume);
		}
		if (player !== undefined && loadOnReady) {
			player.load(loadOnReady, true);
			loadOnReady = null;
		} else if (player !== undefined && playing) {
			player.play();
		}
		handleDurationCheck();
	}

	function handlePlay() {
		isPlaying = true;
		isLoading = false;
		if (startOnPlay) {
			if (player !== undefined && player.setPlaybackRate && playbackRate !== 1) {
				player.setPlaybackRate(playbackRate);
			}
			dispatch('start');
			startOnPlay = false;
		}
		dispatch('play');
		if (seekOnPlay) {
			seekTo(seekOnPlay);
			seekOnPlay = null;
		}
		handleDurationCheck();
	}

	function handlePause() {
		isPlaying = false;
		if (!isLoading) {
			dispatch('pause');
		}
	}

	function handleEnded() {
		if (loopOnEnded && loop) {
			seekTo(0);
		}
		if (!loop) {
			isPlaying = false;
			dispatch('ended');
		}
	}

	function handleError(event: CustomEvent<OnErrorProps>) {
		isLoading = false;
		dispatch('error', event.detail);
	}

	function handleDurationCheck() {
		clearTimeout(durationCheckTimeout);
		const duration = getDuration();
		if (duration) {
			if (!onDurationCalled) {
				dispatch('duration', duration);
				onDurationCalled = true;
			}
		} else {
			durationCheckTimeout = window.setTimeout(handleDurationCheck, 100);
		}
	}

	function handleLoaded() {
		// Sometimes we know loading has stopped but onReady/onPlay are never called
		// so this provides a way for players to avoid getting stuck
		isLoading = false;
	}
</script>

{#await activePlayer() then { default: ActivePlayer }}
	<svelte:component
		this={ActivePlayer}
		{playing}
		{controls}
		{playsinline}
		{loop}
		{config}
		{url}
		{width}
		{height}
		{muted}
		bind:this={player}
		on:mount={handlePlayerMount}
		on:ready={handleReady}
		on:play={handlePlay}
		on:pause={handlePause}
		on:ended={handleEnded}
		on:loaded={handleLoaded}
		on:error={handleError}
		on:bufferEnd
		on:buffer
		on:startxxxxxxxxxxx
		on:playbackRateChange
		on:seek
		on:playbackQualityChange
	/>
{/await}
