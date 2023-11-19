<h1 align='center'>
  SveltePlayer
</h1>

<p align='center'>
  A Svelte component for playing a variety of URLs, including file paths, YouTube, Facebook, Twitch, SoundCloud, Streamable, Vimeo, Wistia, Mixcloud, DailyMotion and Kaltura. This package is port of <a href="https://github.com/CookPete/react-player">CookPete/react-player</a> in <a href="https://svelte.dev/">Svelte</a>
</p>

### Usage

```bash
pnpm install svelte-player
```

```ts
<script lang="ts">
	import SveltePlayer from 'svelte-player';
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
