<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import type { PlayerMedia, Dispatcher, OnProgressProps } from './players/types';
	import type { SeekToType } from './types';
	import { onMount, createEventDispatcher } from 'svelte';

	export let url: string;
	export let muted: boolean;
	export let playing: boolean;
	export let stopOnUnmount: boolean;
	export let loop: boolean;
	export let progressInterval: number;
	export let playbackRate: number;
	export let volume: number | null = null;
	export let progressFrequency: number | undefined = undefined;
	export let loopOnEnded: boolean | undefined = undefined;
	// export let forceLoad: boolean | undefined = undefined;
	export let activePlayer: () => Promise<{ default: typeof SvelteComponent }>;

	let mounted = false;
	let isReady = false;
	let isPlaying = false; // Track playing state internally to prevent bugs
	let isLoading = true; // Use isLoading to prevent onPause when switching URL
	let loadOnReady: string | null = null;
	let seekOnPlay: number | null = null;
	let progressTimeout: number | undefined = undefined;
	let durationCheckTimeout: number | undefined = undefined;
	let prevPlayed: number | undefined = undefined;
	let prevLoaded: number | undefined = undefined;
	let onDurationCalled: boolean | undefined = undefined;
	let startOnPlay: boolean | undefined = undefined;
	let player: PlayerMedia | undefined;

	const SEEK_ON_PLAY_EXPIRY = 5000;
	const dispatch = createEventDispatcher<Dispatcher>();

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

	function handlePlayerMount(event: CustomEvent<PlayerMedia>) {
		if (player) {
			progress(); // Ensure onProgress is still called in strict mode
			return; // Return here to prevent loading twice in strict mode
		}
		player = event.detail;
		player.load(url);
		progress();
	}

	function getDuration() {
		if (player === undefined || !isReady) {
			return null;
		}
		return player.getDuration();
	}

	function getCurrentTime() {
		if (player === undefined || !isReady) {
			return null;
		}
		return player.getCurrentTime();
	}

	function getSecondsLoaded() {
		if (player === undefined || !isReady) {
			return null;
		}
		return player.getSecondsLoaded();
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
		progressTimeout = setTimeout(progress, progressFrequency || progressInterval);
	}

	function seekTo(amount: number, type?: SeekToType, keepPlaying: boolean = false) {
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
				console.warn('ReactPlayer: could not seek using fraction - duration not yet available');
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
		isLoading = true;
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

	function handleDurationCheck() {
		clearTimeout(durationCheckTimeout);
		const duration = getDuration();
		if (duration) {
			if (!onDurationCalled) {
				dispatch('duration', duration);
				onDurationCalled = true;
			}
		} else {
			durationCheckTimeout = setTimeout(handleDurationCheck, 100);
		}
	}

	function handleLoaded() {
		// Sometimes we know loading has stopped but onReady/onPlay are never called
		// so this provides a way for players to avoid getting stuck
		isLoading = false;
	}

	$: {
		if (player !== undefined && isReady) {
			if (playing && !isPlaying) {
				player.play();
			}
			if (!playing && isPlaying) {
				player.pause();
			}
		}
	}

	$: {
		if (player !== undefined && isReady) {
			if (muted) {
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
</script>

{#await activePlayer() then { default: ActivePlayer }}
	<svelte:component
		this={ActivePlayer}
		{url}
		on:mount={handlePlayerMount}
		on:ready={handleReady}
		on:play={handlePlay}
		on:pause={handlePause}
		on:ended={handleEnded}
		on:ended={handleEnded}
		on:loaded={handleLoaded}
		on:bufferEnd
		on:buffer
	/>
{/await}
