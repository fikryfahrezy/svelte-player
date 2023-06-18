import type { PlayerUrl } from './players/types';

export function isMediaStream(url: PlayerUrl) {
	return (
		typeof window !== 'undefined' &&
		typeof window.MediaStream !== 'undefined' &&
		url instanceof window.MediaStream
	);
}
