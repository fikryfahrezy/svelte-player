<h1 align="center">
  SveltePlayer
</h1>

<p align="center">
  A Svelte component for playing a variety of URLs, including file paths, YouTube, Facebook, Twitch, SoundCloud, Streamable, Vimeo, Wistia, Mixcloud, DailyMotion and Kaltura. This package is port of <a href="https://github.com/CookPete/react-player">CookPete/react-player</a> in <a href="https://svelte.dev/">Svelte</a>
</p>

### Usage

```bash
pnpm install svelte-player
```

```ts
<script lang="ts">
	import SveltePlayer from "svelte-player";
</script>

// Render a YouTube video player
<SveltePlayer url="https://www.youtube.com/watch?v=LXb3EKWsInQ" />
```

By default, SveltePlayer supports [many different types](https://github.com/CookPete/react-player#supported-media) of `url`. Import only one type such as `svelte-player/youtube` or `svelte-player/lazy` to lazy load the appropriate player for the `url` you pass in like [react-player](https://github.com/CookPete/react-player#usage) not supported.

Demo page: [`https://fikryfahrezy.github.io/svelte-player`](https://fikryfahrezy.github.io/svelte-player)

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#https://github.com/CookPete/react-player#supported-media). [Props](#props) can be passed in to control playback and react to events such as buffering or media ending. See [the demo source](https://github.com/fikryfahrezy/svelte-player/blob/main/src/routes/%2Bpage.svelte) for a full example.

For platforms without direct use of `npm` modules, a minified version of `SveletePlayer` is not available.

### Polyfills

- Not available

#### Autoplay

See how [react-player](https://github.com/CookPete/react-player) handle it.

### Props

Read the description at [react-player](https://github.com/CookPete/react-player#props).

| Prop               | Supported | Note                                                                                  |
| ------------------ | --------- | ------------------------------------------------------------------------------------- |
| `url`              | ✅        | -                                                                                     |
| `playing`          | ✅        | -                                                                                     |
| `loop`             | ✅        | -                                                                                     |
| `controls`         | ✅        | -                                                                                     |
| `light`            | ✅        | Set `boolean` value through props or custom component through `<slot name="light" />` |
| `volume`           | ✅        | -                                                                                     |
| `muted`            | ✅        | -                                                                                     |
| `playbackRate`     | ✅        | -                                                                                     |
| `width`            | ✅        | -                                                                                     |
| `height`           | ✅        | -                                                                                     |
| `style`            | ❌        | -                                                                                     |
| `progressInterval` | ✅        | -                                                                                     |
| `playsinline`      | ✅        | -                                                                                     |
| `pip`              | ✅        | -                                                                                     |
| `stopOnUnmount`    | ✅        | -                                                                                     |
| `fallback`         | ❌        | -                                                                                     |
| `wrapper`          | ❌        | -                                                                                     |
| `playIcon`         | ✅        | Pass it through `<slot name="play-icon" >`                                            |
| `previewTabIndex`  | ✅        | -                                                                                     |
| `config`           | ✅        | -                                                                                     |

#### Callback props

Read the description at [react-player](https://github.com/CookPete/react-player#callback-props).

Callback props take a function that gets fired on various player events:

| Prop                      | Supported | Svelte Player Version    |
| ------------------------- | --------- | ------------------------ |
| `onReady`                 | ✅        | on:ready                 |
| `onStart`                 | ✅        | on:start                 |
| `onPlay`                  | ✅        | on:play                  |
| `onProgress`              | ✅        | on:progress              |
| `onDuration`              | ✅        | on:duration              |
| `onPause`                 | ✅        | on:pause                 |
| `onBuffer`                | ✅        | on:buffer                |
| `onBufferEnd`             | ✅        | on:bufferEnd             |
| `onSeek`                  | ✅        | on:seek                  |
| `onPlaybackRateChange`    | ✅        | on:playbackRateChange    |
| `onPlaybackQualityChange` | ✅        | on:playbackQualityChange |
| `onEnded`                 | ✅        | on:ended                 |
| `onError`                 | ✅        | on:error                 |
| `onClickPreview`          | ✅        | on:clickPreview          |
| `onEnablePIP`             | ✅        | on:enablePIP             |
| `onDisablePIP`            | ✅        | on:disablePIP            |

#### Config prop

There is a single `config` prop to override settings for each type of player:

```ts
<SveltePlayer
	url={url}
	config={{
		youtube: {
			playerVars: { showinfo: 1 }
		},
		facebook: {
			appId: '12345'
		}
	}}
/>
```

See [the settings here](https://github.com/cookpete/react-player#config-prop) for each player live under different keys.

### Methods

#### Static Methods

Read the description at [react-player](https://github.com/cookpete/react-player#static-methods).

```ts
import { canPlay, canEnablePiP, addCustomPlayer, removeCustomPlayers } from 'svelte-player';
```

| Method                          | Supported |
| ------------------------------- | --------- |
| `canPlay(url)`                  | ✅        |
| `canEnablePiP(url)`             | ✅        |
| `addCustomPlayer(CustomPlayer)` | ✅        |
| `removeCustomPlayers()`         | ✅        |

#### Instance Methods

Use [`bind:this`](https://svelte.dev/docs/element-directives#bind-this) to call instance methods on the player. See [the demo app](https://github.com/fikryfahrezy/svelte-player/blob/main/src/routes/%2Bpage.svelte) for an example of this.

| Method                 | Supported |
| ---------------------- | --------- |
| `seekTo(amount, type)` | ✅        |
| `getCurrentTime()`     | ✅        |
| `getSecondsLoaded()`   | ✅        |
| `getDuration()`        | ✅        |
| `getInternalPlayer()`  | ✅        |
| `showPreview()`        | ✅        |

### Advanced Usage

#### Light player

The `light` prop will render a video thumbnail with simple play icon, and only load the full player once a user has interacted with the image. [Noembed](https://noembed.com) is used to fetch thumbnails for a video URL. Note that automatic thumbnail fetching for Facebook, Wistia, Mixcloud and file URLs are not supported, and ongoing support for other URLs is not guaranteed.

If you want to pass in your own thumbnail to use, set `<slot name="light" />` rather than `true` through `light` prop:

```ts
<SveltePlayer>
	<img slot="ligth" src="https://example.com/thumbnail.png" alt="Thumbnail" />
</SveltePlayer>
```

The styles for the preview image and play icon can be overridden by targeting the CSS classes `svelte-player__preview`, `svelte-player__shadow` and `svelte-player__play-icon`.

#### Responsive player

Set `width` and `height` to `100%` and wrap the player in a [fixed aspect ratio box](https://css-tricks.com/aspect-ratio-boxes) to get a responsive player:

```ts
<script lang="ts">
  import SveltePlayer from "svelte-player";
</script>


<div class="player-wrapper">
  <div class="svelte-player">
    <SveltePlayer
      url="https://www.youtube.com/watch?v=oUFJJNQGwhk"
      playing={true}
      width="100%"
      height="100%"
    />
  </div>
</div>

<style>
.player-wrapper {
  position: relative;
  padding-top: 56.25%; /* 720 / 1280 = 0.5625 */
}

.svelte-player {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
```

See [StackBlitz example](https://stackblitz.com/edit/vitejs-vite-tkhmke?file=src%2FApp.svelte)

#### SDK Overrides

Not supported.

#### Standalone player

Not supported.

#### Adding custom players

If you have your own player that is compatible with SveltePlayer’s internal architecture, you can add it using `addCustomPlayer`:

```ts
<script lang="ts">
	import { addCustomPlayer } from "svelte-player";

	addCustomPlayer({
		key: "custom-player",
		name: "CustomPlayer",
		canPlay(url) {
			return /example\.com/.test(url);
		},
		loadComponent() {
			return import('../somewhere');
		},
	});
</script>
```

Use `removeCustomPlayers` to clear all custom players:

```ts
<script lang="ts">
	import { removeCustomPlayers } from "svelte-player";

	removeCustomPlayers();
</script>
```

It is your responsibility to ensure that custom players keep up with any internal changes to SveltePlayer in later versions.

#### Mobile considerations

Read at [react-player](https://github.com/cookpete/react-player#mobile-considerations).

#### Multiple Sources and Tracks

Passing an array of YouTube URLs to the `url` prop will load them as an untitled playlist.

```ts
<script lang="ts">
	import SveltePlayer from "svelte-player";
</script>

<SveltePlayer
	url={[
		"https://www.youtube.com/watch?v=oUFJJNQGwhk",
		"https://www.youtube.com/watch?v=jNgP6d9HraI",
	]}
/>
```

When playing file paths, an array of sources can be passed to the `url` prop to render multiple `<source>` tags.

```ts
<SveltePlayer playing={true} url={["foo.webm", "foo.ogg"]} />
```

You can also specify a `type` for each source by using objects with `src` and `type` properties.

```ts
<SveltePlayer
	playing={true}
	url={[
		{ src: "foo.webm", type: "video/webm" },
		{ src: "foo.ogg", type: "video/ogg" }
	]}
/>
```

[`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) elements for subtitles can be added using `config.file`:

```ts
<SveltePlayer
	playing={true}
	url="foo.webm"
	config={{
		file: {
			tracks: [
				{ kind: "subtitles", src: "subs/subtitles.en.vtt", srclang: "en", default: true },
				{ kind: "subtitles", src: "subs/subtitles.ja.vtt", srclang: "ja" },
				{ kind: "subtitles", src: "subs/subtitles.de.vtt", srclang: "de" }
			]
		}
	}}
/>
```

### Thanks

- Big thanks to [react-player](https://github.com/CookPete/react-player) and please support to [Cookpete's Patreon](https://patreon.com/cookpete)
