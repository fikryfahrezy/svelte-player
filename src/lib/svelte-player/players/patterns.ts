export const MATCH_URL_YOUTUBE =
	/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

export const youtube = (url: string | string[]) => {
	if (url instanceof Array) {
		return url.every((item) => MATCH_URL_YOUTUBE.test(item));
	}
	return MATCH_URL_YOUTUBE.test(url);
};
