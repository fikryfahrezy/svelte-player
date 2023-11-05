<script lang="ts">
	import type { GlobalSDKFacebookKey } from './global.types';
	import type { FacebookPlayer, FacebookSDKReady } from './facebook.global.types';
	import type { PlayerDispatcher } from './types';
	import type { FacebookConfig } from './facebook.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK, randomString } from './utils';

	export let url: string;
	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let config: FacebookConfig;

	const SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';
	const SDK_GLOBAL: GlobalSDKFacebookKey = 'FB';
	const SDK_GLOBAL_READY: FacebookSDKReady = 'fbAsyncInit';
	const PLAYER_ID_PREFIX = 'facebook-player-';

	const dispatch = createEventDispatcher<PlayerDispatcher>();

	let player: FacebookPlayer;

	$: ({ playerId } = config);
	$: playerID = playerId || `${PLAYER_ID_PREFIX}${randomString()}`;

	onMount(function () {
		dispatch('mount');
	});

	export function load(_: string, isReady?: boolean) {
		if (isReady) {
			getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(function (FB) {
				return FB.XFBML.parse();
			});
			return;
		}
		getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(function (FB) {
			FB.init({
				appId: config.appId,
				xfbml: true,
				version: config.version
			});
			FB.Event.subscribe('xfbml.render', function (msg) {
				// Here we know the SDK has loaded, even if onReady/onPlay
				// is not called due to a video that cannot be embedded
				dispatch('loaded');
			});
			FB.Event.subscribe('xfbml.ready', function (msg) {
				if (msg.type === 'video' && msg.id === playerID) {
					player = msg.instance;
					player.subscribe('startedPlaying', function () {
						dispatch('play');
					});
					player.subscribe('paused', function () {
						dispatch('pause');
					});
					player.subscribe('finishedPlaying', function () {
						dispatch('ended');
					});
					player.subscribe('startedBuffering', function () {
						dispatch('buffer');
					});
					player.subscribe('finishedBuffering', function () {
						dispatch('bufferEnd');
					});
					player.subscribe('error', function (error) {
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
		player.play();
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		// Nothing to do
	}

	export function seekTo(seconds: number) {
		player.seek(seconds);
	}

	export function setVolume(fraction: number) {
		player.setVolume(fraction);
	}

	export function mute() {
		player.mute();
	}

	export function unmute() {
		player.unmute();
	}

	export function getDuration() {
		return player.getDuration();
	}

	export function getCurrentTime() {
		return player.getCurrentPosition();
	}

	export function getSecondsLoaded() {
		return null;
	}

	export function getPlayer() {
		return player;
	}

	export function _setPlayer(newPlayer: FacebookPlayer) {
		player = newPlayer;
	}
</script>

<div
	id={playerID}
	class="facebook-player fb-video"
	data-href={url}
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
