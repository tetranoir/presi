import { expectAssignable, expectNotAssignable } from 'tsd';
import { AR, G, I, Z } from '../src/zerial';

// $ExpectType string | number
type AR_test = AR<[typeof Z.string, typeof Z.number]>;

type staticZ = keyof typeof Z;
// Checks key types
const keysZ: staticZ[] = [
  'undefined',
  'null',
  'string',
  'number',
  'boolean',
  'array',
  'object',
  'oneOf',
  'tuple',
  'literal',
  'optional',
  'o',
];

class A extends I(class _ extends G {
  a = Z.string;
  b = Z.oneOf(Z.number, Z.boolean);
  c = Z.literal('ff');
  d = Z.o(Z.literal('z'));
  e = Z.literal(true);
  f = Z.o(Z.string);
  g = Z.array(Z.number);
  h = Z.object({
    a: Z.string,
    b: Z.object({
      a: Z.oneOf(Z.number, Z.array(Z.number)),
    }),
  });
}) { }

const a1: A = {
  a: '3',
  b: 4,
  // $ExpectError
  c: 'f',
  // $ExpectError
  d: 4,
  // $ExpectError
  f: 4,
  // $ExpectError
  e: 3,
  h: {
    a: 'f',
    b: {
      // $ExpectError
      a: 'f',
      // Does not error because extra keys are not checked
      b: 'c',
    },
  },
};

const a2: A = {
  a: '3',
  b: 4,
  c: 'ff',
  d: 'z',
  e: true,
  f: undefined,
  g: [1],
  h: {
    a: 'f',
    b: {
      a: [3],
    },
  },
  z: 4,
};

// $ExpectType A
const a3: A = a2;

const a4: Z.z = Z.string;

// $ExpectError
const a5: Z.z = 5;

// $ExpectError
const a6: Z.z = (f: string) => console.log(f);

const a7: typeof Z.string = Z.string;
