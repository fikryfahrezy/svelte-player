import type Hls from 'hls.js';
export type { default as Hls } from 'hls.js';
import type dashjs from 'dashjs';
import type flvjs from 'flv.js';

type TypeOfDashJS = typeof dashjs;
type DashJSLogLevel = TypeOfDashJS['LogLevel'];

export type DashJSDebugLogLevel = {
	LOG_LEVEL_NONE: DashJSLogLevel['LOG_LEVEL_NONE'];
	LOG_LEVEL_FATAL: DashJSLogLevel['LOG_LEVEL_FATAL'];
	LOG_LEVEL_ERROR: DashJSLogLevel['LOG_LEVEL_ERROR'];
	LOG_LEVEL_WARNING: DashJSLogLevel['LOG_LEVEL_WARNING'];
	LOG_LEVEL_INFO: DashJSLogLevel['LOG_LEVEL_INFO'];
	LOG_LEVEL_DEBUG: DashJSLogLevel['LOG_LEVEL_DEBUG'];
};

export type DashJS = TypeOfDashJS & {
	Debug: DashJSDebugLogLevel;
};
export type FlvJS = typeof flvjs;
export type HlsJS = typeof Hls;
