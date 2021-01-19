import 'jasmine';

import {I, Z} from '../src/zerial';

// Test 1
class A extends I({
  a: Z.string,
  b: Z.oneOf(Z.number, Z.boolean),
  c: Z.literal('ff'),
  d: Z.o(Z.literal('z')),
  e: Z.literal(true),
}) { }

describe('Zerial', () => {
  it('should throw when mismatched input data', () => {
    expect(() => new A({ a: 3, b: 3, c: 'ff', d: 'f', e: '' })).toThrow();
  });
});
