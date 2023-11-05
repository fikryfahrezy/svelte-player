import { test } from 'vitest';
import { queryString } from '../../lib/players/utils';

test('generates query string', function (t) {
	const object = {
		a: 1,
		b: 'abc',
		c: false
	};
	t.expect(queryString(object)).toStrictEqual('a=1&b=abc&c=false');
});
