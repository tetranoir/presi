import {Constructor, Narrowable, narrow, Tuplize, tuplize} from './magic';

/** F describes a single arity function. */
export type F<T> = (a?: any) => T;

/** O describes an object with 1 arity functions as values. */
export type O<T> = {
  [k: string]: F<T>;
};

/** AR describes an array of functions' return type. */
export type AR<T> = T extends F<infer U>[] ? U : never;

/**
 * RR describes tupled return types (up to size 6).
 * Non-recursive because TS does not support recursive very well and it gets
 * messy real fast
 */
export type RR<T> = RR1<T>;
type RR1<T> = T extends [F<infer A1>] ? [A1] : RR2<T>;
type RR2<T> = T extends [F<infer A1>, F<infer A2>] ? [A1, A2] : RR3<T>;
type RR3<T> = T extends [F<infer A1>, F<infer A2>, F<infer A3>] ?
    [A1, A2, A3] : RR4<T>;
type RR4<T> = T extends [F<infer A1>, F<infer A2>, F<infer A3>, F<infer A4>] ?
    [A1, A2, A3, A4] : RR5<T>;
type RR5<T> = T extends [
    F<infer A1>,
    F<infer A2>,
    F<infer A3>,
    F<infer A4>,
    F<infer A5>
  ] ? [A1, A2, A3, A4, A5] : RR6<T>;
type RR6<T> = T extends [
    F<infer A1>,
    F<infer A2>,
    F<infer A3>,
    F<infer A4>,
    F<infer A5>,
    F<infer A6>
  ] ? [A1, A2, A3, A4, A5, A6] : never;

/** RT describes an object whose values are the return types of values of T */
export type RT<T extends O<any>> = {
  [k in keyof T]: ReturnType<T[k]>;
};

/** Symbol used to designate if a function is an optional function. */
export const opSymbol = Symbol('optional');

// Set as function so I can reflect the name.
/** Checks if value is a string type */
function string(val: string) {
  if (typeof val !== 'string') throw `Value ${val} is not a string`;
  return val;
}
/** Checks if value is a number type */
function number(val: number) {
  if (typeof val !== 'number') throw `Value ${val} is not a number`;
  return val;
}
/** Checks if value is a boolean type */
function boolean(val: boolean) {
  if (typeof val !== 'boolean') throw `Value ${val} is not a boolean`;
  return val;
}

/** Checks if value is string */
function optional<T extends F<any>>(typ: T) {
  // tslint:disable-next-line
  function optional(val: ReturnType<T>) {
    return typ(val) ?? undefined;
  }
  return optional as F<ReturnType<T>|undefined>; // dumb you have to explicitly type it
}

/** Checks if value is a specific value */
const valAsLiteral = <T extends Narrowable|undefined|null>(typ: T) => function literal(val: T) {
  if (typ !== val) {
    throw `Value ${val} is not ${typ}`;
  }
  return val;
};

/** All the type defs used for declarations */
export class Z {
  static undefined: F<undefined> = valAsLiteral(undefined);
  static null: F<null> = valAsLiteral(null);
  static string: F<string> = string;
  static number: F<number> = number;
  static boolean: F<boolean> = boolean;
  static literal = valAsLiteral;
  static optional = optional;
  static o = Z.optional;
  static array = <T extends F<any>>(typ: T) => function array(ary: any) {
    if (!Array.isArray(ary)) {
      throw `${ary} is not an array`;
    }
    return ary.map(typ) as ReturnType<T>[]; // dumb that you have to explicitly type it
  }
  static object = <T extends O<any>>(typeobj: T) => function object<S extends RT<T>>(obj: S) {
    Object.keys(typeobj).forEach(k => {
      if (typeobj[k].name === optional.name) {
        return;
      }
      if (!(k in obj)) {
        throw `${JSON.stringify(obj)} does not contain property '${k}'`;
      }
    });
    return Object.entries(obj).reduce((a, [k, v]) => {
      if (!typeobj[k]) {
        throw `${JSON.stringify(obj)} includes extra property '${k}' not in defined type ${JSON.stringify(typeobj)}`;
      }
      return { ...a, [k]: typeobj[k](v) };
    }, {}) as RT<T>;  // dumb that you have to explicitly type it
  }
  static oneOf = <T extends F<any>[]>(...typs: T) => function oneOf(val: any) {
    const v = typs.reduce(<U extends F<any>>(a: AR<T>|undefined, typ: U) => {
      if (a) {
        return a;
      }
      let ret;
      try {
        ret = typ(val);
      } catch { }
      return ret as ReturnType<U>;
    }, undefined);
    if (!v) {
      throw `Value ${val} does not match any of ${typs.map(t => t.name)}`;
    }
    return v as AR<T>; // dumb that you have to explicitly type it
  }
  static tuple = <T extends F<any>[] & Tuplize>(typ: T) => function tuple(ary: any) {
    const array = tuplize(ary);
    if (typ.length !== array.length) {
      throw `Value ${array} is not a tuple of size ${typ.length}`;
    }
    return typ.map((t, i) => t(array[i])) as RR<T>; // dumb that you have to explicitly type it
  }
}

// TODO turn https://github.com/microsoft/TypeScript/issues/38207 into a request
/**
 * All functions of Z can be accessed as Z.z
 */
export namespace Z {
  export type z =
    | typeof Z.undefined
    | typeof Z.null
    | typeof Z.string
    | typeof Z.number
    | typeof Z.boolean
    | typeof Z.literal
    | typeof Z.optional
    | typeof Z.array
    | typeof Z.object
    | typeof Z.oneOf
    | typeof Z.tuple
  ;
}

/** G describes the generic class that uses single arity functions as values */
export class G {
  [k: string]: F<any>;
}

/**
 * I is a mixin that takes a class and creates a class that can construct
 * the original class via its constructor, a class factorizer.
 *   @param Cls - a class of type T
 */
export function I<T extends G>(def: T) {
  const clsObj = Z.object(def);

  class C extends G {
    static _ = clsObj;
    static _type = def;
    constructor(val: RT<T>) {
      super();
      // Construct object with shape defined by 'Z types' in T.
      Object.assign(this, clsObj(val));
    }
  }

  // Type cast here because clsObj is added to class C.
  return C as Constructor<RT<T>> & {_: typeof clsObj, _type: T};
}
