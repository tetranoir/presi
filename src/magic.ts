/** Javascript primatives */
export type Primative =
  string | number | boolean | symbol | void | null | undefined;

/** Empty container types */
export type Container = object | {} | [];

/** Types that can be narrowed into. */
export type Narrowable = Primative & Container;

/** Narrows the type inference to the most narrow type. */
export const narrow = <T extends Narrowable>(a: T) => a;

/** Narrows an array to its exact nonliteral structure. */
export type Tuplize = {'0': any};

/** Retypes an array into a tuple type of that specific array. */
export function tuplize<T extends any[] & Tuplize>(array: T): T {
  return array;
}

/** Constructor describes a generic constructor interface. */
export type Constructor<T> = new (...args: any[]) => T;
