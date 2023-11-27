import type { DashJS } from '../../lib/players/dash.types';

const dashjs: DashJS = {
	MediaPlayer() {
		return {
			create() {
				return {
					on() {
						return null;
					},
					initialize() {
						return null;
					},
					getDebug() {
						return {
							getLogger() {
								return {
									debug() {},
									error() {},
									fatal() {},
									info() {},
									warn() {}
								};
							},
							setCalleeNameVisible() {},
							setLogTimestampVisible() {},
							setLogToBrowserConsole() {
								return null;
							}
						};
					},
					updateSettings() {
						return null;
					},
					reset() {
						return;
					}
				};
			}
		};
	},
	Debug: {
		LOG_LEVEL_NONE: 0,
		LOG_LEVEL_FATAL: 1,
		LOG_LEVEL_ERROR: 2,
		LOG_LEVEL_WARNING: 3,
		LOG_LEVEL_INFO: 4,
		LOG_LEVEL_DEBUG: 5
	}
};

export default dashjs;
