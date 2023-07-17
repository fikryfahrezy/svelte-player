<script lang="ts">
	import type { GlobalSDKFacebookKey } from './global.types';
	import type { FacebookPlayer, FacebookSDKReady } from './facebook.global.types';
	import type { FilePlayerUrl, Dispatcher, GetPlayerReturn } from './types';
	import type { FacebookConfig } from './facebook.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK, randomString } from './utils';

	export let url: FilePlayerUrl;
	export let playing: boolean;
	export const loop: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export let controls: boolean;
	export const volume: number | null = null; // not used yet, but for suppress the warn from svelte check
	export let muted: boolean;
	export const width: string | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const height: string | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export const playsinline: boolean | undefined = undefined; // not used yet, but for suppress the warn from svelte check
	export let config: FacebookConfig;

	function handlePropsUrlChange(propsUrl: typeof url) {
		if (propsUrl instanceof Array) {
			return '';
		}
		return propsUrl;
	}

	$: propsUrl = handlePropsUrlChange(url);

	const SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';
	const SDK_GLOBAL: GlobalSDKFacebookKey = 'FB';
	const SDK_GLOBAL_READY: FacebookSDKReady = 'fbAsyncInit';
	const PLAYER_ID_PREFIX = 'facebook-player-';

	$: playerID = config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`;

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: FacebookPlayer | undefined;

	onMount(() => {
		dispatch('mount');
	});

	export function load(_: string, isReady?: boolean): void {
		if (isReady) {
			getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL, sdkReady: SDK_GLOBAL_READY }).then((FB) => {
				return FB.XFBML.parse();
			});
			return;
		}
		getSDK({ url: SDK_URL, sdkGlobal: SDK_GLOBAL, sdkReady: SDK_GLOBAL_READY }).then((FB) => {
			FB.init({
				appId: config.appId,
				xfbml: true,
				version: config.version
			});
			FB.Event.subscribe('xfbml.render', (msg) => {
				// Here we know the SDK has loaded, even if onReady/onPlay
				// is not called due to a video that cannot be embedded
				dispatch('loaded');
			});
			FB.Event.subscribe('xfbml.ready', (msg) => {
				if (msg.type === 'video' && msg.id === playerID) {
					player = msg.instance;
					player.subscribe('startedPlaying', () => {
						dispatch('play');
					});
					player.subscribe('paused', () => {
						dispatch('pause');
					});
					player.subscribe('finishedPlaying', () => {
						dispatch('ended');
					});
					player.subscribe('startedBuffering', () => {
						dispatch('buffer');
					});
					player.subscribe('finishedBuffering', () => {
						dispatch('bufferEnd');
					});
					player.subscribe('error', (error) => {
						dispatch('error', { error });
					});
					if (muted) {
						player.mute();
					} else {
						player.unmute();
					}
					dispatch('ready');

					// For some reason Facebook have added `visibility: hidden`
					// to the iframe when autoplay fails, so here we set it back
					const playerContainer = document.getElementById(playerID);
					if (playerContainer !== null) {
						const playerIframe = playerContainer.querySelector('iframe');
						if (playerIframe !== null) {
							playerIframe.style.visibility = 'visible';
						}
					}
				}
			});
		});
	}

	export function play() {
		if (player !== undefined) {
			player.play();
		}
	}

	export function pause() {
		if (player !== undefined) {
			player.pause();
		}
	}

	export function stop() {
		// Nothing to do
	}

	export function seekTo(seconds: number, _?: boolean): void {
		if (player !== undefined) {
			player.seek(seconds);
		}
	}

	export function setVolume(fraction: number): void {
		if (player !== undefined) {
			player.setVolume(fraction);
		}
	}

	export function mute() {
		if (player !== undefined) {
			player.mute();
		}
	}

	export function unmute() {
		if (player !== undefined) {
			player.unmute();
		}
	}

	export function getDuration(): number {
		if (player !== undefined) {
			return player.getDuration();
		}
		return 0;
	}

	export function getCurrentTime() {
		if (player !== undefined) {
			return player.getCurrentPosition();
		}
		return 0;
	}

	export function getSecondsLoaded(): number {
		return 0;
	}

	export function getPlayer(): GetPlayerReturn {
		if (player !== undefined) {
			return player;
		}
		return null;
	}
</script>

<div
	id={playerID}
	class="facebook-player fb-video"
	data-href={propsUrl}
	data-autoplay={playing ? 'true' : 'false'}
	data-allowfullscreen="true"
	data-controls={controls ? 'true' : 'false'}
	{...config.attributes}
/>

<style>
	.facebook-player {
		width: 100%;
		height: 100%;
	}
</style>
