import { test } from 'vitest';
import { parseStartTime } from '../../lib/players/utils';

const YOUTUBE_URL = 'http://youtu.be/12345678901';

test('parses seconds', function (t) {
	t.expect(parseStartTime(YOUTUBE_URL + '?start=162')).toStrictEqual(162);
});

test('parses stamps', function (t) {
	t.expect(parseStartTime(YOUTUBE_URL + '?start=48s')).toStrictEqual(48);
	t.expect(parseStartTime(YOUTUBE_URL + '?start=3m15s')).toStrictEqual(195);
	t.expect(parseStartTime(YOUTUBE_URL + '?start=1h36m17s')).toStrictEqual(5777);
});

test('parses with other params', function (t) {
	t.expect(parseStartTime(YOUTUBE_URL + '?param=1&start=32')).toStrictEqual(32);
});

test('parses using t', function (t) {
	t.expect(parseStartTime(YOUTUBE_URL + '?t=32')).toStrictEqual(32);
});

test('parses using a hash', function (t) {
	t.expect(parseStartTime(YOUTUBE_URL + '#t=32')).toStrictEqual(32);
	t.expect(parseStartTime(YOUTUBE_URL + '#start=32')).toStrictEqual(32);
});

test('returns undefined for invalid stamps', function (t) {
	t.expect(parseStartTime(YOUTUBE_URL)).toStrictEqual(undefined);
	t.expect(parseStartTime(YOUTUBE_URL + '?start=')).toStrictEqual(undefined);
	t.expect(parseStartTime(YOUTUBE_URL + '?start=hms')).toStrictEqual(undefined);
	t.expect(parseStartTime(YOUTUBE_URL + '?start=invalid')).toStrictEqual(undefined);
	t.expect(parseStartTime(YOUTUBE_URL + '?strat=32')).toStrictEqual(undefined);
	t.expect(parseStartTime(YOUTUBE_URL + '#s=32')).toStrictEqual(undefined);
});
