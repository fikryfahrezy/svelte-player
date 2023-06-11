export type ParsePlaylistFn = (url: string | string[]) =>
	| {
			listType: YTListPlaylistType;
			playlist: string;
	  }
	| {
			listType: YTListPlaylistType;
			list: string;
	  }
	| {
			listType: YTListUserUploadsType;
			list: string;
	  }
	| { listType?: undefined; playlist?: undefined; list?: string };
