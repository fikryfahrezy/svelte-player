import { test, beforeEach, vi } from 'vitest';
import { getSDK } from '../../lib/players/utils';

const delay = function (ms: number) {
	return new Promise(function (resolve) {
		return setTimeout(resolve, ms);
	});
};

beforeEach(function () {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

test('loads script', async function (t) {
	const loadScriptOverride = vi.fn().mockImplementation(async function (_, cb) {
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		cb();
	});

	const sdk = await getSDK(
		'http://example.com/abc.js',
		'YT',
		undefined,
		undefined,
		loadScriptOverride
	);
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('throws on error', async function (t) {
	const loadScriptOverride = vi.fn().mockImplementation(async function (_, cb) {
		await delay(100);
		cb(new Error('Load error'));
	});
	await t
		.expect(getSDK('http://example.com/throws.js', 'YT', undefined, undefined, loadScriptOverride))
		.rejects.toThrow();
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('does not fetch again when loaded', async function (t) {
	const loadScriptOverride = vi.fn();
	vi.stubGlobal('YT', 'sdk');
	const sdk = await getSDK(
		'http://example.com/def.js',
		'YT',
		undefined,
		undefined,
		loadScriptOverride
	);
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverride).not.toHaveBeenCalled();
});

test('does not fetch again when loading', async function (t) {
	const loadScriptOverride = vi.fn().mockImplementation(async function (_, cb) {
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		cb();
	});
	const result = await Promise.all([
		getSDK('http://example.com/ghi.js', 'YT', undefined, undefined, loadScriptOverride),
		getSDK('http://example.com/ghi.js', 'YT', undefined, undefined, loadScriptOverride)
	]);
	t.expect(result[0]).toStrictEqual('sdk');
	t.expect(result[1]).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('does fetch again after fetch error', async function (t) {
	const loadScriptOverrideError = vi.fn().mockImplementation(async function (_, cb) {
		await delay(100);
		cb(new Error('Load error'));
	});
	const loadScriptOverride = vi.fn().mockImplementation(async function (_, cb) {
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		cb();
	});
	await t
		.expect(
			getSDK('http://example.com/pqr.js', 'YT', undefined, undefined, loadScriptOverrideError)
		)
		.rejects.toThrow();
	const sdk = await getSDK(
		'http://example.com/pqr.js',
		'YT',
		undefined,
		undefined,
		loadScriptOverride
	);
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverrideError).toHaveBeenCalledOnce();
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('waits for sdkReady callback', async function (t) {
	const loadScriptOverride = vi.fn().mockImplementation(async function (_, cb) {
		cb();
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		window.onYouTubeIframeAPIReady(); // This doesn't work for some reason?
	});
	const sdk = await getSDK(
		'http://example.com/jkl.js',
		'YT',
		'onYouTubeIframeAPIReady',
		undefined,
		loadScriptOverride
	);
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('multiple sdkReady callbacks', async function (t) {
	const loadScriptOverride = vi.fn().mockImplementation(async function (_, cb) {
		cb();
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		window.onYouTubeIframeAPIReady();
	});
	const result = await Promise.all([
		getSDK(
			'http://example.com/mno.js',
			'YT',
			'onYouTubeIframeAPIReady',
			undefined,
			loadScriptOverride
		),
		getSDK(
			'http://example.com/mno.js',
			'YT',
			'onYouTubeIframeAPIReady',
			undefined,
			loadScriptOverride
		)
	]);
	t.expect(result[0]).toStrictEqual('sdk');
	t.expect(result[1]).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});
