<script>
	import YouTube from '~/lib/svelte-player/SveltePlayer.svelte';
	let muted = false;
	let playing = true;
</script>

<YouTube
	url="https://youtu.be/gpA4vP5-DF0"
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
<input type="checkbox" bind:checked={muted} />
<input type="checkbox" bind:checked={playing} />
