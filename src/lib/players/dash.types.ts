import type dashjs from 'dashjs';

export type { MediaPlayerClass as DashJSMediaPlayerClass } from 'dashjs';

type TypeOfDashJS = typeof dashjs;

type DashJSLogLevel = TypeOfDashJS['LogLevel'];

export type DashJSDebugLogLevel = {
	[k in keyof DashJSLogLevel]: DashJSLogLevel[k];
};

export type DashJS = TypeOfDashJS & {
	Debug: DashJSDebugLogLevel;
};
