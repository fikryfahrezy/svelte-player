<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import type { PlayerMedia, Dispatcher } from './players/types';
	import { onMount, createEventDispatcher } from 'svelte';

	export let url: string;
	export let muted: boolean;
	export let playing: boolean;
	export let stopOnUnmount: boolean;
	export let volume: number | null = null;
	export let activePlayer: () => Promise<{ default: typeof SvelteComponent }>;

	let mounted = false;
	let isReady = false;
	let isPlaying = false; // Track playing state internally to prevent bugs
	let isLoading = true; // Use isLoading to prevent onPause when switching URL
	let progressTimeout: number | undefined = undefined;
	let durationCheckTimeout: number | undefined = undefined;
	let player: PlayerMedia | undefined;

	const dispatch = createEventDispatcher<Dispatcher>();

	function handlePlayerMount(event: CustomEvent<PlayerMedia>) {
		player = event.detail;
	}

	function handleReady() {
		if (!mounted) {
			return;
		}

		isReady = true;
		dispatch('ready');
	}

	function handlePlay() {
		isPlaying = true;
		isLoading = false;
		dispatch('play');
	}

	function handlePause() {
		isPlaying = false;
		if (!isLoading) {
			dispatch('pause');
		}
	}

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
		on:bufferEnd
		on:buffer
		on:ended
	/>
{/await}
