import type { FilePlayerUrl } from './players/types';

export function isMediaStream(url: FilePlayerUrl) {
	return (
		typeof window !== 'undefined' &&
		typeof window.MediaStream !== 'undefined' &&
		url instanceof window.MediaStream
	);
}
