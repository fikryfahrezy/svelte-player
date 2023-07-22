import { test } from 'vitest';
import { randomString } from '../../lib/players/utils';

test('returns a 5 character string', (t) => {
	t.expect(typeof randomString()).toStrictEqual('string');
	t.expect(randomString().length).toStrictEqual(5);
});

test('returns different strings', (t) => {
	const a = randomString();
	const b = randomString();
	const c = randomString();
	t.expect(a).not.toStrictEqual(b);
	t.expect(a).not.toStrictEqual(c);
	t.expect(b).not.toStrictEqual(c);
});
