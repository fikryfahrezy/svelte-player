/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is fine*/
export type AnyFunction = (...args: any[]) => any;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is fine*/
export type VoidFunction = (...args: any[]) => void;

// Recursive Partial<T> in TypeScript
// https://stackoverflow.com/a/51365037/12976234
export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
		  ? RecursivePartial<T[P]>
		  : T[P];
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is fine*/
export type Constructor<T> = new (...args: any[]) => T;

export type ObjectMethodKeys<T> = {
	[K in keyof T]: T[K] extends AnyFunction ? K : never;
}[keyof T] &
	(string | symbol);

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is fine*/
export type Tail<T extends any[]> = T extends [infer _, ...infer Rest] ? Rest : never;
