<script lang="ts" context="module">
	const cache: Record<string, string> = {};
</script>

<script lang="ts">
	import type { PreviewDispatcher } from './types';
	import { createEventDispatcher, onMount } from 'svelte';

	export let previewTabIndex: number;
	export let url: string;
	export let light: boolean | string;
	export let oEmbedUrl: string;
	export let isElementLight: boolean;
	export let playIcon: boolean;

	const ICON_SIZE = '64px';

	const dispatch = createEventDispatcher<PreviewDispatcher>();

	let image: string | null = null;

	onMount(function () {
		fetchImage({ url, light, oEmbedUrl });
	});

	function handleUrlLightChange(newUrl: typeof url, newLight: typeof light) {
		fetchImage({ url: newUrl, light: newLight, oEmbedUrl });
	}

	$: handleUrlLightChange(url, light);

	type FetchImageParams = { url: typeof url; light: typeof light; oEmbedUrl: typeof oEmbedUrl };
	function fetchImage({ url, light, oEmbedUrl }: FetchImageParams) {
		if (isElementLight) {
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
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
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

	const flexCenter = `
		display: flex;
		align-items: center;
		justify-content: center;
	`;
	$: preview = `
		width: 100%;
		height: 100%;
		${image && !isElementLight ? `background-image: url(${image});` : ''} 
		background-size: cover;
		background-position: center; 
		cursor: pointer; 
		${flexCenter}
	`;
	$: shadow = `
		background: radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%);
		border-radius: ${ICON_SIZE};
		width: ${ICON_SIZE};
		height: ${ICON_SIZE};
		${isElementLight ? 'position: absolute;' : ''}
		${flexCenter}
	`;
	const playIconStyle = `
		border-style: solid;
		border-width: 16px 0 16px 26px;
		border-color: transparent transparent transparent white;
		margin-left: 7px;
	`;
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

	{#if !playIcon}
		<div style={shadow} class="svelte-player__shadow">
			<div style={playIconStyle} class="svelte-player__play-icon" />
		</div>
	{/if}
</div>
