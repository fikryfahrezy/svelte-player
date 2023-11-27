import type { Player, FlvJS } from '../../lib/players/flv.types';

class FlvPlayerMock implements Player {
	attachMediaElement() {
		// do nothing
	}

	on(event: string, cb: (...args: unknown[]) => void) {
		if (event === 'error') {
			setTimeout(function () {
				cb({ error: event });
			}, 100);
		}
	}

	load() {
		// do nothing
	}
}

const flvjs: FlvJS = {
	Events: {
		ERROR: 'error',
		LOADING_COMPLETE: 'loading_complete',
		RECOVERED_EARLY_EOF: 'recovered_early_eof',
		MEDIA_INFO: 'media_info',
		METADATA_ARRIVED: 'metadata_arrived',
		SCRIPTDATA_ARRIVED: 'scripdate_arrived',
		STATISTICS_INFO: 'statistics_info'
	},

	createPlayer() {
		return new FlvPlayerMock();
	}
};

export default flvjs;
