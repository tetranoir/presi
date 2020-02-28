import {expectAssignable, expectNotAssignable} from 'tsd';
import {AR, G, I, Z} from '../src/zerial';

// Test 1
type static_test = keyof typeof Z;
let zKeys: static_test[] = [
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

// Test 2
type AR_test = AR<[typeof Z.string, typeof Z.number]>;
expectNotAssignable<AR_test>(['a string', 6]);

// Test 3
class AI extends I(class _ extends G {
  a = Z.string;
  b = Z.oneOf(Z.number, Z.boolean);
  c = Z.literal('ff');
  d = Z.o(Z.literal('z'));
  e = Z.literal(true);
}) { }

expectNotAssignable<AI>({
  a: '3',
  b: 4,
  c: 'f',
  d: 4,
  e: 3,
});

expectAssignable<AI>({
  a: '3',
  b: 4,
  c: 'ff',
  d: 4,
  e: true,
});
