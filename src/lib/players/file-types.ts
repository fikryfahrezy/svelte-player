export type FileConfig = {
	attributes?: Record<string, never>;
	tracks?: never[];
	forceVideo?: boolean;
	forceAudio?: boolean;
	forceHLS?: boolean;
	forceDASH?: boolean;
	forceFLV?: boolean;
	hlsOptions?: Record<string, never>;
	hlsVersion?: string;
	dashVersion?: string;
	flvVersion?: string;
	forceDisableHls?: boolean;
};
