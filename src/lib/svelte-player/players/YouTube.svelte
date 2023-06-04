<script lang="ts">
	import { getSDK } from './utils';
	import { onMount } from 'svelte';

	export let url: string;
	const sdkUrl = 'https://www.youtube.com/iframe_api';
	const sdkGlobal = 'YT';
	const sdkReady = 'onYouTubeIframeAPIReady';

	onMount(() => {
		getSDK({
			url: sdkUrl,
			sdkGlobal: sdkGlobal,
			sdkReady: sdkReady,
			isLoaded(sdk) {
				return sdk.loaded === 1;
			}
		}).then((YT) => {
			console.log(YT);
		});
	});
</script>

<h1>Hi From YouTube!</h1>
