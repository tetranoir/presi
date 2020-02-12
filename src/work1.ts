interface Object {
    entries: (obj: any) => ([string, any][]);
}

function tuplize<T extends any[]& {'0': any}>(array: T): T {
    return array;
}

// F describes a single arity function
type F<T> = (a: any) => T;

// O describes an object with 1 arity functions as values.
type O<T> = {
    [k: string]: F<T>;
}

// I describes the generic interface
class I {
    [k: string]: any;
}

// AR describes an array of functions' return type
type AR<T> = T extends F<infer U>[] ? U : never;

// R describes a the inferred return type of a function
type R<T> = T extends F<infer U> ? U : never;

// RR describes tupled return types (up to size 6)
// Non-recursive because TS does not support recursive very well and it gets messy real fast
type RR<T> = RR1<T>;
type RR1<T> = T extends [F<infer A1>] ? [A1] : RR2<T>;
type RR2<T> = T extends [F<infer A1>, F<infer A2>] ? [A1, A2] : RR3<T>;
type RR3<T> = T extends [F<infer A1>, F<infer A2>, F<infer A3>] ? [A1, A2, A3] : RR4<T>;
type RR4<T> = T extends [F<infer A1>, F<infer A2>, F<infer A3>, F<infer A4>] ? [A1, A2, A3, A4] : never;
type RR5<T> = T extends [F<infer A1>, F<infer A2>, F<infer A3>, F<infer A4>, F<infer A5>] ? [A1, A2, A3, A4, A5] : never;
type RR6<T> = T extends [F<infer A1>, F<infer A2>, F<infer A3>, F<infer A4>, F<infer A5>, F<infer A6>] ? [A1, A2, A3, A4, A5, A6] : never;

// EXPORT
// G describes the generic class that uses single arity functions as values
class G {
    [k: string]: F<any>;
}

// EXPORT
// RT describes an object whose values are the return types of values of T
type RT<T extends O<any>> = {
    [k in keyof T]: ReturnType<T[k]>;
}

// object keys
type OK<T> = T extends {} ? keyof T : never;

// LRT describes an object with specific keys whose values are the return types of values of T
// type LRT<T extends O<any>> = {
//     [k in Extract<T, keyof OK<T>>]: ReturnType<T[k]>;
// }

type LRT2<T extends O<any>> = LRT_<T, OK<T>>;

type LRT_<T extends O<any>, U extends OK<T>> = {
    [k in U]: ReturnType<T[k]>;
}

const opSymbol = Symbol('optional');
// EXPORT
// All the type defs used for declarations
class Z {
    // static opSymbol = Symbol('optional');
    // static undefined = undefined;
    // static null = null;
    static
        string: F<string> = String;
    static
        number: F<number> = Number;
    static
        bool: F<boolean> = Boolean;
    static
        array = <T extends F<any>>(typ: T) => ary => {
        if (!Array.isArray(ary)) {
            throw `${ary} is not an array`;
        }
        return ary.map(typ) as ReturnType<T>[]; // dumb that you have to explicitly type it
    };
    static
        object = <T extends O<any>>(typeobj: T) => <S extends RT<T>>(obj: S) => {
        Object.keys(typeobj).forEach(k => {
            if (k[opSymbol]) {
                return;
            }
            if (!(k in obj)) {
                throw `${obj} does not contain key ${k}`;
            }
        });
        return Object.entries(obj).reduce((a, [k, v]) => {
            if (!typeobj[k]) {
                throw `Object includes extra key ${k} not in type object ${typeobj}`;
            }
            return { ...a, [k]: obj[k](v) };
        }, {}) as RT<T>;  // dumb that you have to explicitly type it
    };
    static
        oneOf = <T extends F<any>[]>(...typs: T) => val => {
        const v = typs.reduce(<U extends F<any>>(a: AR<T>|undefined, typ: U) => {
            if (a) {
                return a;
            }
            return typ(val) as ReturnType<U>;
        }, undefined);
        if (!v) {
            throw `Value ${val} does not match any of ${typs}`;
        }
        return v as AR<T>; // dumb that you have to explicitly type it
    };
    static
        tuple = <T extends F<any>[] & { '0': F<any> }>(typ: T) => ary => {
        const array = tuplize(ary);
        if (typ.length !== array.length) {
            throw `Value ${array} is not a tuple of size ${typ.length}`;
        }
        return typ.map((t, i) => t(array[i])) as RR<T>; // dumb that you have to explicitly type it
    }
    static
        literal = <T extends string | number>(typ: T) => (val: T) => {
        if (typ !== val) {
            throw `Value ${val} is not the same as ${typ}`;
        }
        return val;
    };
    static
        optional = optional;
    static
        o = optional;
}

// type ZKeys = 'string' | 'number' |

// FPZ describes a function with properties from Z and T
// type FPZ<T> = {
//     [k in KZ]: opCombinator<F<DefReturnType<TZ[k]>>>;
// } & T;
// Generics cant be generics ie T<?> not possible

// TZ describes the type of class Z
type TZ = typeof Z;
// type TZ = Omit<typeof Z, 'Z'>; // dumb that this still includes 'Z'

// KZ describes the keys of Z
type KZ = keyof TZ;

// Finds return type of function, but not if its not a function
type DefReturnType<T> = T extends (...k: any[]) => any ?  ReturnType<T> : never;

type static_test = keyof typeof Z;
type static_test2 = keyof Z;


type opCombinator<T extends F<any>> = (val?: any) => R<T> | undefined;
type opWrapper = <T extends F<any>>(typ: T) => opCombinator<T>;
var optionalFn: opWrapper = <T extends F<any>>(typ: T) => {
    const id: (val?: any) => R<T>|undefined = val => val && typ(val); // dumb that you have write out the ret val
    id[opSymbol] = true;
    return id;
};
type opZ = {
    [k in KZ]: opCombinator<F<DefReturnType<TZ[k]>>>;
} & opWrapper;

// Assigns the dot operator to optional
var optional: opZ = Object.assign(
    optionalFn,
    Object.entries(Z).reduce(
        (a, [k, v]) => ({ ...a, [k]: optionalFn(v) }),
        {},
    ) as TZ,
);


// =======================

class $A extends G {
    a = Z.string;
    b = Z.number;
    c = Z.array(Z.string);
    d = Z.object({ a: Z.number });
    e = Z.oneOf(Z.string, Z.number, Z.array(Z.string));
    g = Z.tuple([Z.string, Z.number]);
    h = Z.literal('f');
    i = Z.object({
        a: Z.tuple([Z.oneOf(Z.number, Z.literal('i')), Z.string])
    });
    j = Z.optional(Z.string);
    k = Z.o.string;
    l = Z.array(Z.o.string);
    z = Z.number;
}

type A = RT<$A>; // make A a class too

type AR_test = AR<[typeof Z.string, typeof Z.number]>;

function Interface<T extends G>(def: T) {
    return class
}

var AI = Interface({ a: Z.string });

// make this work
/*
    class A extends Interface({
        a: Z.string,
    }) {}
    data = {a: 'a'};
    const a = new A({a: 'a'});
*/

const a: A = {
    a: 'f',
    b: 4,
    c: ['a'],
    d: { a: 5 },
    e: ['f'],
    g: ['f', 5],
    h: 'f',
    i: {
        a: ['i', 'z'],
    },
    j: undefined,
    k: undefined,
    l: [],
}

const tuplize_test = tuplize([Z.string, Z.number]);

interface IA {
    a: string;
    b: number;
    c: string[];
    d: { a: number };
    e: string | number;
}

/*
Requirements
    1. Define structure once
        (or have strong typechecking between mulitple declarations)
        (or have one generate the other, in code)
    2. Nearly free deserialization
    3. Can take output from JSON.parse
    4. Runtime type checking

Technical Notes
    * Classes give free structure and type.
    * Structure once means the means of deserialization needs
        incorporated in the declaration
*/
