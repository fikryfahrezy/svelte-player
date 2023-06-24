import { test, beforeEach, vi } from 'vitest';
import { getSDK } from '../../lib/players/utils';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

beforeEach(() => {
	vi.unstubAllGlobals();
});

test('loads script', async (t) => {
	const loadScriptOverride = vi.fn().mockImplementation(async (_, cb) => {
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		cb();
	});

	const sdk = await getSDK({
		url: 'http://example.com/abc.js',
		sdkGlobal: 'YT',
		sdkReady: undefined,
		isLoaded: undefined,
		fetchScript: loadScriptOverride
	});
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('throws on error', async (t) => {
	const loadScriptOverride = vi.fn().mockImplementation(async (_, cb) => {
		await delay(100);
		cb(new Error('Load error'));
	});
	await t
		.expect(
			getSDK({
				url: 'http://example.com/throws.js',
				sdkGlobal: 'YT',
				sdkReady: undefined,
				isLoaded: undefined,
				fetchScript: loadScriptOverride
			})
		)
		.rejects.toThrow();
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('does not fetch again when loaded', async (t) => {
	const loadScriptOverride = vi.fn();
	vi.stubGlobal('YT', 'sdk');
	const sdk = await getSDK({
		url: 'http://example.com/def.js',
		sdkGlobal: 'YT',
		sdkReady: undefined,
		isLoaded: undefined,
		fetchScript: loadScriptOverride
	});
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverride).not.toHaveBeenCalled();
});

test('does not fetch again when loading', async (t) => {
	const loadScriptOverride = vi.fn().mockImplementation(async (_, cb) => {
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		cb();
	});
	const result = await Promise.all([
		getSDK({
			url: 'http://example.com/ghi.js',
			sdkGlobal: 'YT',
			sdkReady: undefined,
			isLoaded: undefined,
			fetchScript: loadScriptOverride
		}),
		getSDK({
			url: 'http://example.com/ghi.js',
			sdkGlobal: 'YT',
			sdkReady: undefined,
			isLoaded: undefined,
			fetchScript: loadScriptOverride
		})
	]);
	t.expect(result[0]).toStrictEqual('sdk');
	t.expect(result[1]).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('does fetch again after fetch error', async (t) => {
	const loadScriptOverrideError = vi.fn().mockImplementation(async (_, cb) => {
		await delay(100);
		cb(new Error('Load error'));
	});
	const loadScriptOverride = vi.fn().mockImplementation(async (_, cb) => {
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		cb();
	});
	await t
		.expect(
			getSDK({
				url: 'http://example.com/pqr.js',
				sdkGlobal: 'YT',
				sdkReady: undefined,
				isLoaded: undefined,
				fetchScript: loadScriptOverrideError
			})
		)
		.rejects.toThrow();
	const sdk = await getSDK({
		url: 'http://example.com/pqr.js',
		sdkGlobal: 'YT',
		sdkReady: undefined,
		isLoaded: undefined,
		fetchScript: loadScriptOverride
	});
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverrideError).toHaveBeenCalledOnce();
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('waits for sdkReady callback', async (t) => {
	const loadScriptOverride = vi.fn().mockImplementation(async (_, cb) => {
		cb();
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		window.onYouTubeIframeAPIReady(); // This doesn't work for some reason?
	});
	const sdk = await getSDK({
		url: 'http://example.com/jkl.js',
		sdkGlobal: 'YT',
		sdkReady: 'onYouTubeIframeAPIReady',
		isLoaded: undefined,
		fetchScript: loadScriptOverride
	});
	t.expect(sdk).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});

test('multiple sdkReady callbacks', async (t) => {
	const loadScriptOverride = vi.fn().mockImplementation(async (_, cb) => {
		cb();
		await delay(100);
		vi.stubGlobal('YT', 'sdk');
		window.onYouTubeIframeAPIReady();
	});
	const result = await Promise.all([
		getSDK({
			url: 'http://example.com/mno.js',
			sdkGlobal: 'YT',
			sdkReady: 'onYouTubeIframeAPIReady',
			isLoaded: undefined,
			fetchScript: loadScriptOverride
		}),
		getSDK({
			url: 'http://example.com/mno.js',
			sdkGlobal: 'YT',
			sdkReady: 'onYouTubeIframeAPIReady',
			isLoaded: undefined,
			fetchScript: loadScriptOverride
		})
	]);
	t.expect(result[0]).toStrictEqual('sdk');
	t.expect(result[1]).toStrictEqual('sdk');
	t.expect(loadScriptOverride).toHaveBeenCalledOnce();
});
