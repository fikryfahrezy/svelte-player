// TODO: remove this and make exact type instead
export type AnyFunction = (...args: any[]) => any;

// Recursive Partial<T> in TypeScript
// https://stackoverflow.com/a/51365037/12976234
export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
		? RecursivePartial<T[P]>
		: T[P];
};

export type Constructor<T> = new (...args: any[]) => T;

export type Prettify<T> = {
	[K in keyof T]: T[K];
	/* eslint-disable-next-line @typescript-eslint/ban-types -- TODO: Comment this*/
} & {};

// https://stackoverflow.com/a/70428144/12976234
export type PickMatching<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };
/* eslint-disable-next-line @typescript-eslint/ban-types -- TODO: Comment this*/
export type ObjectMethods<T> = PickMatching<T, Function>;

export type MethodParameters<T> = T extends (...args: infer P) => any ? P : never;

export type MethodReturnType<T> = T extends (...args: any) => infer R ? R : any;
