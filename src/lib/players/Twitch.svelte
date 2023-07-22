<script lang="ts">
	import type { GlobalSDKTwitchKey } from './global.types';
	import type { TwitchPlayer, TwitchPlayerLinkOption } from './twitch.global.types';
	import type { FilePlayerUrl, Dispatcher } from './types';
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

	$: playerID = config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`;

	const dispatch = createEventDispatcher<Dispatcher>();

	let player: TwitchPlayer | undefined;

	onMount(() => {
		dispatch('mount');
	});

	export function load(url: string, isReady?: boolean) {
		const isChannel = MATCH_URL_TWITCH_CHANNEL.test(url);
		const channelUrl = url.match(MATCH_URL_TWITCH_CHANNEL)?.[1];
		const videoUrl = url.match(MATCH_URL_TWITCH_VIDEO)?.[1];
		const id = isChannel ? channelUrl : videoUrl;
		if (id === undefined) {
			return;
		}

		if (isReady && player !== undefined) {
			if (isChannel) {
				player.setChannel(id);
			} else {
				player.setVideo('v' + id, 0);
			}
			return;
		}
		getSDK({
			url: SDK_URL,
			sdkGlobal: SDK_GLOBAL
		}).then(
			(Twitch) => {
				let linkOption: TwitchPlayerLinkOption = isChannel
					? {
							collection: undefined,
							channel: id,
							video: undefined
					  }
					: {
							collection: undefined,
							channel: undefined,
							video: id
					  };

				player = new Twitch.Player(playerID, {
					...linkOption,
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
				player.addEventListener(READY, () => {
					dispatch('ready');
				});
				player.addEventListener(PLAYING, () => {
					dispatch('play');
				});
				player.addEventListener(PAUSE, () => {
					dispatch('pause');
				});
				player.addEventListener(ENDED, () => {
					dispatch('ended');
				});
				player.addEventListener(SEEK, ({ position }) => {
					dispatch('seek', position);
				});

				// Prevent weird isLoading behaviour when streams are offline
				player.addEventListener(ONLINE, () => {
					dispatch('loaded');
				});
				player.addEventListener(OFFLINE, () => {
					dispatch('loaded');
				});
			},
			(err) => {
				dispatch('error', {
					error: err
				});
			}
		);
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
		if (player !== undefined) {
			player.pause();
		}
	}

	export function seekTo(seconds: number, _?: boolean) {
		if (player !== undefined) {
			player.seek(seconds);
		}
	}

	export function setVolume(fraction: number) {
		if (player !== undefined) {
			player.setVolume(fraction);
		}
	}

	export function mute() {
		if (player !== undefined) {
			player.setMuted(true);
		}
	}

	export function unmute() {
		if (player !== undefined) {
			player.setMuted(false);
		}
	}

	export function setLoop(_: boolean) {
		// Nothing to do
	}

	export function getDuration() {
		if (player !== undefined) {
			return player.getDuration();
		}
		return 0;
	}

	export function getCurrentTime() {
		if (player !== undefined) {
			return player.getCurrentTime();
		}
		return 0;
	}

	export function getSecondsLoaded() {
		// Nothing to do
		return 0;
	}

	export function getPlayer(): TwitchPlayer | null {
		if (player !== undefined) {
			return player;
		}

		return null;
	}
</script>

<div class="twitch-player" id={playerID} />

<style>
	.twitch-player {
		width: 100%;
		height: 100%;
	}
</style>
