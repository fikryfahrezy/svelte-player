import type Hls from 'hls.js';
export type { default as Hls, HlsConfig } from 'hls.js';
import type dashjs from 'dashjs';
import type flvjs from 'flv.js';

type TypeOfDashJS = typeof dashjs;
type DashJSLogLevel = TypeOfDashJS['LogLevel'];

export type DashJSDebugLogLevel = {
	[k in keyof DashJSLogLevel]: DashJSLogLevel[k];
};

export type DashJS = TypeOfDashJS & {
	Debug: DashJSDebugLogLevel;
};
export type FlvJS = typeof flvjs;

type TypeOfHls = typeof Hls;

export type HlsJS = TypeOfHls;
