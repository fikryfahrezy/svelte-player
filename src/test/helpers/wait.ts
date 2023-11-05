export async function wait(callback: () => void, timeout: number) {
	await new Promise(function (resolve) {
		setTimeout(function () {
			callback();
			resolve(undefined);
		}, timeout);
	});
}
