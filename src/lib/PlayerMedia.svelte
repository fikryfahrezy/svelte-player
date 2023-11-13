<script lang="ts">
	import type { SeekToType } from './types';
	import type {
		OnProgressProps,
		OnErrorProps,
		PlayerUrl,
		Player,
		PlayerRef,
		PlayerDispatcher,
		PlayerConfigObject,
		PlayerGetPlayerKey,
		PlayerInternalPlayer
	} from './players/types';
	import { onMount, createEventDispatcher } from 'svelte';
	import { isMediaStream } from './players/utils';

	export let url: PlayerUrl;
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
	export let config: PlayerConfigObject;

	export let progressFrequency: number | undefined = undefined;
	export let disableDeferredLoading: boolean | undefined = undefined;
	export let loopOnEnded: boolean | undefined = undefined;
	export let forceLoad: boolean | undefined = undefined;
	export let display: string | undefined = undefined;
	export let activePlayer: Player['loadComponent'] | undefined = undefined;

	const SEEK_ON_PLAY_EXPIRY = 5000;
	const dispatch = createEventDispatcher<PlayerDispatcher>();

	let mounted = false;
	let isReady = false;
	let isPlaying = false; // Track playing state internally to prevent bugs
	let isLoading = true; // Use isLoading to prevent onPause when switching URL
	let loadOnReady: PlayerUrl | null = null;
	let seekOnPlay: number | null = null;
	let progressTimeout: number | undefined = undefined;
	let durationCheckTimeout: number | null | undefined = undefined;
	let prevPlayed: number | undefined = undefined;
	let prevLoaded: number | undefined = undefined;
	let onDurationCalled: boolean | undefined = undefined;
	let startOnPlay: boolean | undefined = undefined;
	let player: PlayerRef;

	onMount(function () {
		mounted = true;

		return function () {
			clearTimeout(progressTimeout);
			clearTimeout(durationCheckTimeout ?? undefined);
			if (isReady && stopOnUnmount) {
				player.stop();

				if (player.disablePIP) {
					player.disablePIP();
				}
			}

			mounted = false;
		};
	});

	function handlePropsUrlChange(propsUrl: typeof url) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (isLoading && !forceLoad && !disableDeferredLoading && !isMediaStream(propsUrl)) {
			console.warn(
				`SveltePlayer: the attempt to load ${propsUrl} is being deferred until the player has loaded`
			);
			loadOnReady = propsUrl;
			return;
		}
		isLoading = true;
		startOnPlay = true;
		onDurationCalled = false;
		player.load(propsUrl, isReady);
	}

	$: handlePropsUrlChange(url);

	function handlePropsPlayingChange(propsPlaying: typeof playing) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (propsPlaying && !isPlaying) {
			player.play();
		}
		if (!propsPlaying && isPlaying) {
			player.pause();
		}
	}

	$: handlePropsPlayingChange(playing);

	function handlePropsPipChange(propsPip: typeof pip) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (propsPip && player.enablePIP) {
			player.enablePIP();
		}

		if (!propsPip && player.disablePIP) {
			player.disablePIP();
		}
	}

	$: handlePropsPipChange(pip);

	function handlePropsVolumeChange(propsVolume: typeof volume) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (propsVolume !== null) {
			player.setVolume(propsVolume);
		}
	}

	$: handlePropsVolumeChange(volume);

	function handlePropsMutedChange(propsMuted: typeof muted) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (propsMuted) {
			player.mute();
		} else {
			player.unmute();
			if (volume !== null) {
				// Set volume next tick to fix a bug with DailyMotion
				setTimeout(function () {
					player.setVolume(Number(volume));
				});
			}
		}
	}

	$: handlePropsMutedChange(muted);

	function handlePropsPlaybackRateChange(propsPlaybackRate: typeof playbackRate) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (player.setPlaybackRate) {
			player.setPlaybackRate(propsPlaybackRate);
		}
	}

	$: handlePropsPlaybackRateChange(playbackRate);

	function handlePropsLoopChange(propsLoop: typeof loop) {
		// If there isn’t a player available, don’t do anything
		if (!player) {
			return;
		}

		if (player.setLoop) {
			player.setLoop(propsLoop);
		}
	}

	$: handlePropsLoopChange(loop);

	export function handlePlayerMount() {
		player.load(url);
		progress();
	}

	export function getDuration() {
		if (!isReady) {
			return null;
		}
		return player.getDuration();
	}

	export function getCurrentTime() {
		if (!isReady) {
			return null;
		}
		return player.getCurrentTime();
	}

	export function getSecondsLoaded() {
		if (!isReady) {
			return null;
		}
		return player.getSecondsLoaded();
	}

	export function getInternalPlayer<TKey extends PlayerGetPlayerKey>(
		key?: TKey
	): PlayerInternalPlayer[TKey] | null {
		if (!player) {
			return null;
		}
		return player.getPlayer(key);
	}

	export function progress() {
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

	export function seekTo(amount: number, type?: SeekToType, keepPlaying?: boolean) {
		// When seeking before player is ready, store value and seek later
		if (!isReady) {
			if (amount !== 0) {
				seekOnPlay = amount;
				setTimeout(function () {
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

	export function handleReady() {
		if (!mounted) {
			return;
		}

		isReady = true;
		isLoading = false;
		dispatch('ready');

		if (!muted && volume !== null) {
			player.setVolume(volume);
		}
		if (loadOnReady) {
			player.load(loadOnReady, true);
			loadOnReady = null;
		} else if (playing) {
			player.play();
		}
		handleDurationCheck();
	}

	export function handlePlay() {
		isPlaying = true;
		isLoading = false;
		if (startOnPlay) {
			if (player.setPlaybackRate && playbackRate !== 1) {
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

	export function handlePause() {
		isPlaying = false;
		if (!isLoading) {
			dispatch('pause');
		}
	}

	export function handleEnded() {
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

	export function handleDurationCheck() {
		clearTimeout(durationCheckTimeout ?? undefined);
		const duration = getDuration();
		console.log(duration, onDurationCalled);
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

	export function _setIsReady(ready: boolean) {
		isReady = ready;
	}

	export function _setIsLoading(loading: boolean) {
		isLoading = loading;
	}

	export function _getIsLoading() {
		return isLoading;
	}

	export function _setStartOnPlay(onPlay: boolean) {
		startOnPlay = onPlay;
	}

	export function _getStartOnPlay() {
		return startOnPlay;
	}

	export function _setOnDurationCalled(durationCalled: boolean) {
		onDurationCalled = durationCalled;
	}

	export function _getOnDurationCalled() {
		return onDurationCalled;
	}

	export function _getIsPlaying() {
		return isPlaying;
	}

	export function _setIsPlaying(playing: boolean) {
		isPlaying = playing;
	}

	export function _setLoadOnReady(onReady: PlayerUrl) {
		loadOnReady = onReady;
	}

	export function _getLoadOnReady() {
		return loadOnReady;
	}

	export function _setSeekOnPlay(onPlay: number) {
		seekOnPlay = onPlay;
	}

	export function _setDurationCheckTimeout(checkTimeout: number | null) {
		durationCheckTimeout = checkTimeout;
	}

	export function _getDurationCheckTimeout() {
		return durationCheckTimeout;
	}

	export function _getSeekOnPlay() {
		return seekOnPlay;
	}

	export function _setPlayer(newPlayer: PlayerRef) {
		player = newPlayer;
	}
</script>

{#if activePlayer !== undefined}
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
			{volume}
			{display}
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
			on:playbackRateChange
			on:seek
			on:playbackQualityChange
		/>
	{/await}
{/if}
