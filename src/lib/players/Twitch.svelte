<script lang="ts">
	import type { GlobalSDKTwitchKey } from './global.types';
	import type { TwitchPlayer, TwitchPlayerLinkOption } from './twitch.global.types';
	import type { Dispatcher } from './types';
	import type { TwitchConfig } from './twitch.types';

	import { onMount, createEventDispatcher } from 'svelte';
	import { getSDK, parseStartTime, randomString } from './utils';
	import { MATCH_URL_TWITCH_CHANNEL, MATCH_URL_TWITCH_VIDEO } from './patterns';

	export let playing: boolean;
	export let controls: boolean;
	export let muted: boolean;
	export let playsinline: boolean;
	export let config: TwitchConfig;

	const SDK_URL = 'https://player.twitch.tv/js/embed/v1.js';
	const SDK_GLOBAL: GlobalSDKTwitchKey = 'Twitch';
	const PLAYER_ID_PREFIX = 'twitch-player-';

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: TwitchPlayer;

	$: playerID = config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`;

	onMount(function () {
		dispatch('mount');
	});

	export function load(url: string, isReady?: boolean) {
		const isChannel = MATCH_URL_TWITCH_CHANNEL.test(url);
		const id = String(
			isChannel ? url.match(MATCH_URL_TWITCH_CHANNEL)?.[1] : url.match(MATCH_URL_TWITCH_VIDEO)?.[1]
		);

		if (isReady) {
			if (isChannel) {
				player.setChannel(id);
			} else {
				player.setVideo('v' + id, 0);
			}
			return;
		}
		getSDK(SDK_URL, SDK_GLOBAL).then(
			function (Twitch) {
				player = new Twitch.Player(playerID, {
					...(isChannel
						? {
								collection: undefined,
								channel: id,
								video: undefined
						  }
						: {
								collection: undefined,
								channel: undefined,
								video: id
						  }),
					height: '100%',
					width: '100%',
					playsinline: playsinline,
					autoplay: playing,
					muted: muted,
					// https://github.com/CookPete/react-player/issues/733#issuecomment-549085859
					controls: isChannel ? true : controls,
					time: String(parseStartTime(url)),
					...config.options
				});

				const { READY, PLAYING, PAUSE, ENDED, ONLINE, OFFLINE, SEEK } = Twitch.Player;
				player.addEventListener(READY, function () {
					dispatch('ready');
				});
				player.addEventListener(PLAYING, function () {
					dispatch('play');
				});
				player.addEventListener(PAUSE, function () {
					dispatch('pause');
				});
				player.addEventListener(ENDED, function () {
					dispatch('ended');
				});
				player.addEventListener(SEEK, function ({ position }) {
					dispatch('seek', position);
				});

				// Prevent weird isLoading behaviour when streams are offline
				player.addEventListener(ONLINE, function () {
					dispatch('loaded');
				});
				player.addEventListener(OFFLINE, function () {
					dispatch('loaded');
				});
			},
			function (err) {
				dispatch('error', {
					error: err
				});
			}
		);
	}

	export function play() {
		player.play();
	}

	export function pause() {
		player.pause();
	}

	export function stop() {
		player.pause();
	}

	export function seekTo(seconds: number) {
		player.seek(seconds);
	}

	export function setVolume(fraction: number) {
		player.setVolume(fraction);
	}

	export function mute() {
		player.setMuted(true);
	}

	export function unmute() {
		player.setMuted(false);
	}

	export function getDuration() {
		return player.getDuration();
	}

	export function getCurrentTime() {
		return player.getCurrentTime();
	}

	export function getSecondsLoaded() {
		return null;
	}

	export function getPlayer() {
		return player;
	}

	export function setPlayer(newPlayer: TwitchPlayer) {
		player = newPlayer;
	}
</script>

<div class="twitch-player" id={playerID} />

<style>
	.twitch-player {
		width: 100%;
		height: 100%;
	}
</style>
