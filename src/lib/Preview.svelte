<script lang="ts" context="module">
	const cache: Record<string, string> = {};
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let previewTabIndex: number;
	export let url: string;
	export let light: boolean | string;
	export let oEmbedUrl: string;
	export let isCustomPlayIcon: boolean;

	let image: string | null = null;

	const dispatch = createEventDispatcher();

	const isElement = $$slots['light'];
	const ICON_SIZE = '64px';

	onMount(() => {
		fetchImage({ url, light, oEmbedUrl });
	});

	type FetchImageParams = { url: typeof url; light: typeof light; oEmbedUrl: typeof oEmbedUrl };
	function fetchImage({ url, light, oEmbedUrl }: FetchImageParams) {
		if (isElement) {
			return;
		}
		if (typeof light === 'string') {
			image = light;
			return;
		}
		if (cache[url]) {
			image = cache[url];
			return;
		}
		image = null;
		return window
			.fetch(oEmbedUrl.replace('{url}', url))
			.then((response) => response.json())
			.then((data) => {
				if (data.thumbnail_url) {
					const fetchedImage = data.thumbnail_url
						.replace('height=100', 'height=480')
						.replace('-d_295x166', '-d_640');
					image = fetchedImage;
					cache[url] = fetchedImage;
				}
			});
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			dispatch('click');
		}
	}

	const flexCenter = 'display: flex; align-items: center; justify-content: center;';
	$: preview = `width: 100%; height: 100%;${
		image && !isElement ? `background-image: url(${image});` : ''
	} background-size: cover; background-position: center; cursor: pointer; ${flexCenter}`;
	$: shadow = `background: radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%); border-radius: ${ICON_SIZE}; width: ${ICON_SIZE}; height: ${ICON_SIZE}; ${
		isElement ? 'position: absolute;' : ''
	} ${flexCenter}`;
	const playIcon =
		'border-style: solid; border-width: 16px 0 16px 26px; border-color: transparent transparent transparent white; margin-left: 7px;';
</script>

<div
	style={preview}
	tabindex={previewTabIndex}
	class="svelte-player__preview"
	role="button"
	on:click
	on:keypress={handleKeyPress}
>
	<slot name="light" />
	<slot name="play-icon" />

	{#if !isCustomPlayIcon}
		<div style={shadow} class="svelte-player__shadow">
			<div style={playIcon} class="svelte-player__play-icon" />
		</div>
	{/if}
</div>
