import type dashjs from 'dashjs';
import type { MediaPlayerClass } from 'dashjs';

type TypeOfDashJS = typeof dashjs;

type DashJSLogLevel = TypeOfDashJS['LogLevel'];

export type DashJSDebugLogLevel = {
	[k in keyof DashJSLogLevel]: DashJSLogLevel[k];
};

export type DashJS = TypeOfDashJS & {
	Debug: DashJSDebugLogLevel;
};

type DashJSDebug = ReturnType<MediaPlayerClass['getDebug']> & {
	setLogToBrowserConsole?: (setLog: boolean) => void;
};

export type DashJSMediaPlayerClass = Omit<MediaPlayerClass, 'getDebug'> & {
	getDebug(): DashJSDebug;
};
