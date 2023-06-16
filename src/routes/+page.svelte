<script lang="ts">
	import YouTube from '~/lib/svelte-player/SveltePlayer.svelte';
	import LoadButton from './LoadButton.svelte';
	import Duration from './Duration.svelte';

	let url: string | string[] = 'https://youtu.be/gpA4vP5-DF0';
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
	let urlInput: string = '';

	function handlePlayPause() {
		playing = !playing;
	}
</script>

<div class="app">
	<section class="section">
		<h1>SveltePlayer Demo</h1>
		<div class="player-wrapper">
			<YouTube
				{url}
				{muted}
				{playing}
				on:buffer={() => {
					console.log('onBuffer');
				}}
				on:bufferEnd={() => {
					console.log('onBufferEnd');
				}}
				on:ended={() => {
					console.log('onEnded');
				}}
				on:pause={() => {
					console.log('onPause');
					playing = false;
				}}
				on:play={() => {
					console.log('onPlay');
					playing = true;
				}}
				on:ready={() => {
					console.log('onReady');
				}}
			/>
		</div>

		<table>
			<tbody>
				<tr>
					<th>Controls</th>
					<td>
						<button>Stop</button>
						<button on:click={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
						<button>Fullscreen</button>
						{#if light}
							<button>Show preview</button>
						{/if}
					</td>
				</tr>
				<tr>
					<th>Speed</th>
					<td>
						<button value={1}>1x</button>
						<button value={1.5}>1.5x</button>
						<button value={2}>2x</button>
					</td>
				</tr>
				<tr>
					<th>Seek</th>
					<td>
						<input type="range" min={0} max={0.999999} step="any" value={played} />
					</td>
				</tr>
				<tr>
					<th>Volume</th>
					<td>
						<input type="range" min={0} max={1} step="any" value={volume} />
					</td>
				</tr>
				<tr>
					<th>
						<label for="controls">Controls</label>
					</th>
					<td>
						<input id="controls" type="checkbox" checked={controls} />
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
						<input id="loop" type="checkbox" checked={loop} />
					</td>
				</tr>
				<tr>
					<th>
						<label for="light">Light mode</label>
					</th>
					<td>
						<input id="light" type="checkbox" checked={light} />
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
							on:click={() => {
								console.log('https://www.youtube.com/watch?v=oUFJJNQGwhk');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://www.youtube.com/watch?v=jNgP6d9HraI');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
									'https://www.youtube.com/playlist?list=PLogRWNZ498ETeQNYrOlqikEML3bKJcdcx'
								);
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
							on:click={() => {
								console.log('https://soundcloud.com/miami-nights-1984/accelerated');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://soundcloud.com/tycho/tycho-awake');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://soundcloud.com/yunghog/sets/doperaptraxxx');
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
							on:click={() => {
								console.log('https://www.facebook.com/facebook/videos/10153231379946729/');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
									'https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/'
								);
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
							on:click={() => {
								console.log('https://vimeo.com/90509568');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://vimeo.com/169599296');
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
							on:click={() => {
								console.log('https://www.twitch.tv/videos/106400740');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://www.twitch.tv/videos/12783852');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://www.twitch.tv/kronovi');
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
							on:click={() => {
								console.log('https://streamable.com/moo');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://streamable.com/ifjh');
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
							on:click={() => {
								console.log('https://home.wistia.com/medias/e4a27b971d');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://home.wistia.com/medias/29b0fbf547');
							}}
						>
							Test B
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://home.wistia.com/medias/bq6epni33s');
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
							on:click={() => {
								console.log('https://www.dailymotion.com/video/x5e9eog');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://www.dailymotion.com/video/x61xx3z');
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
							on:click={() => {
								console.log('https://www.mixcloud.com/mixcloud/meet-the-curators/');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
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
							on:click={() => {
								console.log('https://video.vidyard.com/watch/YBvcF2BEfvKdowmfrRwk57');
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://video.vidyard.com/watch/BLXgYCDGfwU62vdMWybNVJ');
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
							on:click={() => {
								console.log(
									'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622074&entry_id=1_jz404fbl'
								);
							}}
						>
							Test A
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
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
							on:click={() => {
								console.log(
									'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
								);
							}}
						>
							mp4
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
									'https://test-videos.co.uk/vids/bigbuckbunny/webm/vp8/360/Big_Buck_Bunny_360_10s_1MB.webm'
								);
							}}
						>
							webm
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log('https://filesamples.com/samples/video/ogv/sample_640x360.ogv');
							}}
						>
							ogv
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
									'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3'
								);
							}}
						>
							mp3
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
									'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
								);
							}}
						>
							HLS (m3u8)
						</LoadButton>
						<LoadButton
							on:click={() => {
								console.log(
									'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps_640x360_800k.mpd'
								);
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
							on:click={() => {
								url = urlInput;
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
					<td class={!url ? 'faded' : ''}>
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
		Version <strong>x</strong>
		.
		<a href="https://github.com/fikryfahrezy/svelte-player">GitHub</a>
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

	html,
	body,
	div,
	span,
	applet,
	object,
	iframe,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	blockquote,
	pre,
	a,
	abbr,
	acronym,
	address,
	big,
	cite,
	code,
	del,
	dfn,
	em,
	img,
	ins,
	kbd,
	q,
	s,
	samp,
	small,
	strike,
	strong,
	sub,
	sup,
	tt,
	var,
	b,
	u,
	i,
	center,
	dl,
	dt,
	dd,
	ol,
	ul,
	li,
	fieldset,
	form,
	label,
	legend,
	table,
	caption,
	tbody,
	tfoot,
	thead,
	tr,
	th,
	td,
	article,
	aside,
	canvas,
	details,
	embed,
	figure,
	figcaption,
	footer,
	header,
	hgroup,
	menu,
	nav,
	output,
	ruby,
	section,
	summary,
	time,
	mark,
	audio,
	video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article,
	aside,
	details,
	figcaption,
	figure,
	footer,
	header,
	hgroup,
	menu,
	nav,
	section {
		display: block;
	}
	body {
		line-height: 1;
	}
	ol,
	ul {
		list-style: none;
	}
	blockquote,
	q {
		quotes: none;
	}
	blockquote:before,
	blockquote:after,
	q:before,
	q:after {
		content: '';
		content: none;
	}

	body {
		margin-right: 10px;
		margin-left: 10px;
		font-size: 14px;
		line-height: 1.4;
	}

	em {
		font-style: italic;
	}

	body,
	h1,
	h2,
	h3 {
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
	[type='text'],
	textarea {
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

	[type='text'],
	textarea {
		width: 200px;
		padding: 5px;
		border: 1px solid darken(var(--light-grey), 20);
		border-radius: 3px;
		outline: 0;
	}

	[type='text']:focus,
	textarea:focus {
		border-color: darken(var(--light-grey), 30);
		box-shadow: 0 0 5px var(--light-grey);
	}

	textarea {
		height: 100px;
		font-family: monospace;
		vertical-align: bottom;
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

	.faded {
		color: rgba(0, 0, 0, 0.5);
	}

	.footer {
		margin: var(--gutter-width);
	}
</style>
