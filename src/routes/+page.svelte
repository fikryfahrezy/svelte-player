<script>
	import YouTube from '~/lib/svelte-player/SveltePlayer.svelte';
	let muted = false;
</script>

<YouTube
	url="https://youtu.be/gpA4vP5-DF0"
	{muted}
	on:onBuffer={() => {
		console.log('onBuffer');
	}}
	on:onBufferEnd={() => {
		console.log('onBufferEnd');
	}}
	on:onEnded={() => {
		console.log('onEnded');
	}}
	on:onPause={() => {
		console.log('onPause');
	}}
	on:onPlay={() => {
		console.log('onPlay');
	}}
	on:onReady={() => {
		console.log('onReady');
	}}
/>
<input type="checkbox" bind:checked={muted} />
