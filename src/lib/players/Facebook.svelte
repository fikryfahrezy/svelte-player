<script lang="ts">
	import type { GlobalSDKFacebookKey } from './global.types';
	import type { FacebookPlayer, FacebookSDKReady } from './facebook.global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
	import type { FacebookConfig } from './facebook.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK, randomString, callPlayer } from './utils';

	export let url: FilePlayerUrl;
	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
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
					const calledPlayer = callPlayer(player);
					if (calledPlayer !== null) {
						if (muted) {
							calledPlayer('mute');
						} else {
							calledPlayer('unmute');
						}
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
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('play');
		}
	}

	export function pause() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('pause');
		}
	}

	export function stop() {
		// Nothing to do
	}

	export function seekTo(seconds: number, _?: boolean): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('seek', seconds);
		}
	}

	export function setVolume(fraction: number): void {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('setVolume', fraction);
		}
	}

	export function mute() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('mute');
		}
	}

	export function unmute() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			calledPlayer('unmute');
		}
	}

	export function getDuration(): number {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('getDuration');
		}
		return 0;
	}

	export function getCurrentTime() {
		const calledPlayer = callPlayer(player);
		if (calledPlayer !== null) {
			return calledPlayer('getCurrentPosition');
		}
		return 0;
	}

	export function getSecondsLoaded(): number {
		return 0;
	}

	export function getPlayer(): FacebookPlayer | null {
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
