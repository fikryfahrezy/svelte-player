<script lang="ts" context="module">
	import type { GetSDKParams, PlayerType, PlayerMap } from './types';
	import { onMount } from 'svelte';
	import loadScript from 'load-script';

	declare global {
		interface Window {
			YT: YT;
		}
	}

	const players = {
		YouTube: {
			url: 'https://www.youtube.com/iframe_api',
			sdkGlobal: 'YT',
			sdkReady: 'onYouTubeIframeAPIReady',
			loadComponent: import('./players/YouTube.svelte'),
			isLoaded() {
				return false;
			}
		}
	} satisfies PlayerMap;

	function getSDK({
		fetchScript = loadScript,
		isLoaded,
		sdkGlobal,
		url,
		sdkReady = null
	}: GetSDKParams) {
		fetchScript(url, function (err, script) {
			if (err) {
				console.log("")
			} else {
				console.log(new window.YT.Player('test'));
			}
		});
	}
</script>

<script lang="ts">
	export let playerType: PlayerType;
	const player = players[playerType];

	onMount(() => {
		getSDK({
			url: player.url,
			sdkGlobal: player.sdkGlobal,
			sdkReady: player.sdkReady,
			isLoaded() {
				return player.isLoaded();
			}
		});
	});
</script>

{#await player.loadComponent then { default: Player }}
	<svelte:component this={Player} />
{/await}
