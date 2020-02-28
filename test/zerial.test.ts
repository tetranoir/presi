import {AR, G, I, Z} from '../src/zerial';

// Test 1
class AI extends I(class _ extends G {
  a = Z.string;
  b = Z.oneOf(Z.number, Z.boolean);
  c = Z.literal('ff');
  d = Z.o(Z.literal('z'));
  e = Z.literal(true);
}) { }

const ai1 = assert(new AI({ a: 3, b: 3, c: 'ff', d: 'f', e: '' }));
