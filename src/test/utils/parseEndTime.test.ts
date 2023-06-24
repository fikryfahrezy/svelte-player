import { test } from 'vitest';
import { parseEndTime } from '../../lib/players/utils';

const YOUTUBE_URL = 'http://youtu.be/12345678901';

test('parses seconds', (t) => {
	t.expect(parseEndTime(YOUTUBE_URL + '?end=162')).toStrictEqual(162);
});

test('parses stamps', (t) => {
	t.expect(parseEndTime(YOUTUBE_URL + '?end=48s')).toStrictEqual(48);
	t.expect(parseEndTime(YOUTUBE_URL + '?end=3m15s')).toStrictEqual(195);
	t.expect(parseEndTime(YOUTUBE_URL + '?end=1h36m17s')).toStrictEqual(5777);
});

test('parses with other params', (t) => {
	t.expect(parseEndTime(YOUTUBE_URL + '?param=1&end=32')).toStrictEqual(32);
});

test('parses using a hash', (t) => {
	t.expect(parseEndTime(YOUTUBE_URL + '#end=32')).toStrictEqual(32);
});

test('returns undefined for invalid stamps', (t) => {
	t.expect(parseEndTime(YOUTUBE_URL)).toStrictEqual(undefined);
	t.expect(parseEndTime(YOUTUBE_URL + '?end=')).toStrictEqual(undefined);
	t.expect(parseEndTime(YOUTUBE_URL + '?end=hms')).toStrictEqual(undefined);
	t.expect(parseEndTime(YOUTUBE_URL + '?end=invalid')).toStrictEqual(undefined);
	t.expect(parseEndTime(YOUTUBE_URL + '?strat=32')).toStrictEqual(undefined);
	t.expect(parseEndTime(YOUTUBE_URL + '#s=32')).toStrictEqual(undefined);
});
