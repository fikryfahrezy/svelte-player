import type { HLSClass } from '../../lib/players/hls.types';
import { Events } from '../../lib/players/hls.types';

class HlsJSMock implements HLSClass {
	constructor() {}
	attachMedia() {}
	destroy() {}
	loadSource() {}
	on() {}
	static Events = Events;
}

export default HlsJSMock;
