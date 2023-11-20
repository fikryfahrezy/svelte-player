<script lang="ts">
	import type { SveltePlayerRef } from '../lib/types';
	import type { OnProgressProps, PlayerUrl } from '../lib/players/types';

	import SveltePlayer, { canPlay } from '../lib/SveltePlayer.svelte';
	import LoadButton from './LoadButton.svelte';
	import Duration from './Duration.svelte';
	import screenfull from 'screenfull';

	let url: PlayerUrl = '';
	let pip = false;
	let playing = true;
	let controls = false;
	let light = false;
	let volume = 0.8;
	let muted = false;
	let played = 0;
	let loaded = 0;
	let duration = 0;
	let playbackRate = 1.0;
	let loop = false;
	let urlInput = '';
	let seeking = false;

	let playerRef: SveltePlayerRef;
	let prevUrl: PlayerUrl = '';

	function load(requestUrl: PlayerUrl) {
		url = requestUrl;
		played = 0;
		loaded = 0;
		pip = false;
		prevUrl = '';
	}

	function handleStop() {
		url = '';
		playing = false;
	}

	function handleToggleControls() {
		prevUrl = url;
		url = '';
	}

	function onPrevURLStateChange(prevUrlState: typeof prevUrl) {
		setTimeout(function () {
			if (prevUrlState !== '') {
				load(prevUrlState);
			}
		});
	}

	$: onPrevURLStateChange(prevUrl);

	function handleOnPlaybackRateChange(event: CustomEvent<number>) {
		playbackRate = parseFloat(String(event.detail));
	}

	function handlePlay() {
		// console.log('onPlay');
		playing = true;
	}

	function handlePause() {
		// console.log('onPause');
		playing = false;
	}

	function handleSeekMouseDown() {
		seeking = true;
	}

	function handleSeekMouseUp() {
		seeking = false;
		playerRef.seekTo(parseFloat(String(played)));
	}

	function handleProgress(event: CustomEvent<OnProgressProps>) {
		const state = event.detail;
		// console.log('onProgress', state);
		// We only want to update time slider if we are not currently seeking
		if (!seeking && state.loaded !== undefined && state.played !== undefined) {
			loaded = state.loaded;
			played = state.played;
		}
	}

	function handleEnded() {
		// console.log('onEnded');
		playing = loop;
	}

	function handleDuration(event: CustomEvent<number | null>) {
		// console.log('onDuration', event.detail);
		duration = event.detail ?? 0;
	}

	function handleClickFullscreen() {
		screenfull.request(document.querySelector('.svelte-player') ?? undefined);
	}
</script>

<div class="app">
	<section class="section">
		<h1>SveltePlayer Demo</h1>
		<div class="player-wrapper svelte-player">
			<SveltePlayer
				{url}
				{muted}
				{playing}
				{playbackRate}
				{volume}
				{controls}
				{loop}
				{pip}
				{light}
				bind:this={playerRef}
				on:ready={function () {
					// console.log('onReady');
				}}
				on:start={function () {
					// console.log('onStart');
				}}
				on:play={handlePlay}
				on:pause={handlePause}
				on:buffer={function () {
					// console.log('onBuffer');
				}}
				on:playbackRateChange={handleOnPlaybackRateChange}
				on:seek={(_) => {
					// console.log('onSeek', e);
				}}
				on:ended={handleEnded}
				on:error={(_) => {
					// console.log('onError', e);
				}}
				on:progress={handleProgress}
				on:duration={handleDuration}
				on:playbackQualityChange={(_) => {
					// console.log('onPlaybackQualityChange', e);
				}}
			/>
		</div>

		<table>
			<tbody>
				<tr>
					<th>Controls</th>
					<td>
						<button on:click={handleStop}>Stop</button>
						<label>
							<input type="checkbox" bind:checked={playing} />
							{!playing ? 'Pause' : 'Play'}
						</label>
						<button on:click={handleClickFullscreen}>Fullscreen</button>
						{#if light}
							<button
								on:click={function () {
									playerRef.showPreview();
								}}
							>
								Show preview
							</button>
						{/if}
						{#if canPlay(url)}
							<label>
								<input type="checkbox" bind:checked={pip} />
								{!pip ? 'Disable PiP' : 'Enable PiP'}
							</label>
						{/if}
					</td>
				</tr>
				<tr>
					<th>Speed</th>
					<td>
						<label>
							<input type="radio" bind:group={playbackRate} value={1} />
							1x
						</label>
						<label>
							<input type="radio" bind:group={playbackRate} value={1.5} />
							1.5x
						</label>
						<label>
							<input type="radio" bind:group={playbackRate} value={2} />
							2x
						</label>
					</td>
				</tr>
				<tr>
					<th>Seek</th>
					<td>
						<input
							type="range"
							min={0}
							max={0.999999}
							step="any"
							bind:value={played}
							on:mousedown={handleSeekMouseDown}
							on:mouseup={handleSeekMouseUp}
						/>
					</td>
				</tr>
				<tr>
					<th>Volume</th>
					<td>
						<input type="range" min={0} max={1} step="any" bind:value={volume} />
					</td>
				</tr>
				<tr>
					<th>
						<label for="controls">Controls</label>
					</th>
					<td>
						<input
							id="controls"
							type="checkbox"
							bind:checked={controls}
							on:change={handleToggleControls}
						/>
						<em>&nbsp; Requires player reload</em>
					</td>
				</tr>
				<tr>
					<th>
						<label for="muted">Muted</label>
					</th>
					<td>
						<input id="muted" type="checkbox" bind:checked={muted} />
					</td>
				</tr>
				<tr>
					<th>
						<label for="loop">Loop</label>
					</th>
					<td>
						<input id="loop" type="checkbox" bind:checked={loop} />
					</td>
				</tr>
				<tr>
					<th>
						<label for="light">Light mode</label>
					</th>
					<td>
						<input id="light" type="checkbox" bind:checked={light} />
					</td>
				</tr>
				<tr>
					<th>Played</th>
					<td><progress max={1} value={played} /></td>
				</tr>
				<tr>
					<th>Loaded</th>
					<td><progress max={1} value={loaded} /></td>
				</tr>
			</tbody>
		</table>
	</section>
	<section class="section">
		<table>
			<tbody>
				<tr>
					<th>YouTube</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://www.youtube.com/watch?v=oUFJJNQGwhk');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://www.youtube.com/watch?v=jNgP6d9HraI');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://www.youtube.com/playlist?list=PLogRWNZ498ETeQNYrOlqikEML3bKJcdcx');
							}}
						>
							Playlist
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>SoundCloud</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://soundcloud.com/miami-nights-1984/accelerated');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://soundcloud.com/tycho/tycho-awake');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://soundcloud.com/yunghog/sets/doperaptraxxx');
							}}
						>
							Playlist
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Facebook</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://www.facebook.com/facebook/videos/10153231379946729/');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/');
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Vimeo</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://vimeo.com/90509568');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://vimeo.com/169599296');
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Twitch</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://www.twitch.tv/videos/106400740');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://www.twitch.tv/videos/12783852');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://www.twitch.tv/kronovi');
							}}
						>
							Test C
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Streamable</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://streamable.com/moo');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://streamable.com/ifjh');
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Wistia</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://home.wistia.com/medias/e4a27b971d');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://home.wistia.com/medias/29b0fbf547');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://home.wistia.com/medias/bq6epni33s');
							}}
						>
							Test C
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>DailyMotion</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://www.dailymotion.com/video/x5e9eog');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://www.dailymotion.com/video/x61xx3z');
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Mixcloud</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://www.mixcloud.com/mixcloud/meet-the-curators/');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load(
									'https://www.mixcloud.com/mixcloud/mixcloud-curates-4-mary-anne-hobbs-in-conversation-with-dan-deacon/'
								);
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Vidyard</th>
					<td>
						<LoadButton
							on:click={function () {
								load('https://video.vidyard.com/watch/YBvcF2BEfvKdowmfrRwk57');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://video.vidyard.com/watch/BLXgYCDGfwU62vdMWybNVJ');
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Kaltura</th>
					<td>
						<LoadButton
							on:click={function () {
								load(
									'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622074&entry_id=1_jz404fbl'
								);
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={function () {
								load(
									'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622336&entry_id=1_i1jmzcn3'
								);
							}}
						>
							Test B
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Files</th>
					<td>
						<LoadButton
							on:click={function () {
								load(
									'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
								);
							}}
						>
							mp4
						</LoadButton>
						<LoadButton
							on:click={function () {
								load(
									'https://test-videos.co.uk/vids/bigbuckbunny/webm/vp8/360/Big_Buck_Bunny_360_10s_1MB.webm'
								);
							}}
						>
							webm
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://filesamples.com/samples/video/ogv/sample_640x360.ogv');
							}}
						>
							ogv
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3');
							}}
						>
							mp3
						</LoadButton>
						<LoadButton
							on:click={function () {
								load(
									'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
								);
							}}
						>
							HLS (m3u8)
						</LoadButton>
						<LoadButton
							on:click={function () {
								load('https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps_640x360_800k.mpd');
							}}
						>
							DASH (mpd)
						</LoadButton>
					</td>
				</tr>
				<tr>
					<th>Custom URL</th>
					<td>
						<input type="text" placeholder="Enter URL" bind:value={urlInput} />
						<button
							on:click={function () {
								load(urlInput);
							}}
						>
							Load
						</button>
					</td>
				</tr>
			</tbody>
		</table>

		<h2>State</h2>

		<table>
			<tbody>
				<tr>
					<th>url</th>
					<td class:faded={!url}>
						{#if url instanceof Array}
							Multiple
						{:else}
							null
						{/if}
					</td>
				</tr>
				<tr>
					<th>playing</th>
					<td>{playing ? 'true' : 'false'}</td>
				</tr>
				<tr>
					<th>volume</th>
					<td>{volume.toFixed(3)}</td>
				</tr>
				<tr>
					<th>speed</th>
					<td>{playbackRate}</td>
				</tr>
				<tr>
					<th>played</th>
					<td>{played.toFixed(3)}</td>
				</tr>
				<tr>
					<th>loaded</th>
					<td>{loaded.toFixed(3)}</td>
				</tr>
				<tr>
					<th>duration</th>
					<td><Duration seconds={duration} /></td>
				</tr>
				<tr>
					<th>elapsed</th>
					<td><Duration seconds={duration * played} /></td>
				</tr>
				<tr>
					<th>remaining</th>
					<td><Duration seconds={duration * (1 - played)} /></td>
				</tr>
			</tbody>
		</table>
	</section>
	<footer class="footer">
		<a href="https://github.com/fikryfahrezy/svelte-player">GitHub</a>
		·
		<a href="https://www.npmjs.com/package/svelte-player">npm</a>
	</footer>
</div>

<style>
	:root {
		--column-width: 480px;
		--gutter-width: 20px;
		--light-grey: #eee;
	}

	/* 
	http://meyerweb.com/eric/tools/css/reset/
	v2.0 | 20110126
 	License: none (public domain)
	*/

	div,
	h1,
	h2,
	a,
	em,
	label,
	table,
	tbody,
	tr,
	th,
	td,
	footer,
	section {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	footer,
	section {
		display: block;
	}

	em {
		font-style: italic;
	}

	h1,
	h2 {
		font-weight: 300;
		margin-bottom: 1em;
	}

	h1 {
		font-size: 20px;
	}
	h2 {
		font-size: 16px;
		margin-top: 1em;
	}

	table,
	progress {
		width: 100%;
	}

	th,
	td,
	[type='text'] {
		margin-right: 5px;
		padding: 3px 6px;
	}

	th {
		width: 10%;
		font-weight: 500;
		text-align: right;
		white-space: nowrap;
		vertical-align: middle;
	}

	[type='text'] {
		width: 200px;
		padding: 5px;
		border: 1px solid darken(var(--light-grey), 20);
		border-radius: 3px;
		outline: 0;
	}

	[type='text']:focus {
		border-color: darken(var(--light-grey), 30);
		box-shadow: 0 0 5px var(--light-grey);
	}

	button {
		margin: 3px;
		padding: 6px 12px;
		border: 0;
		border-radius: 3px;
		outline: 0;
		background-color: var(--light-grey);
	}

	button:focus {
		background: darken(var(--light-grey), 5);
	}

	button:hover {
		background: darken(var(--light-grey), 10);
	}

	button:active {
		background: darken(var(--light-grey), 15);
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
	}

	.app {
		margin: auto;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 300;
		text-align: center;
	}

	.section {
		display: inline-block;
		max-width: var(--column-width);
		margin: var(--gutter-width);
		text-align: left;
		vertical-align: top;
	}

	.player-wrapper {
		width: 480px;
		height: 270px;
	}

	.svelte-player {
		margin-bottom: 10px;
		background: rgba(0, 0, 0, 0.1);
	}
	.faded {
		color: rgba(0, 0, 0, 0.5);
	}

	.footer {
		margin: var(--gutter-width);
	}
</style>
