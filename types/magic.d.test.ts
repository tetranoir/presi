import { narrow, tuplize } from '../src/magic';

// $ExpectType "c"
narrow('c');

// $ExpectType 5
narrow(5);

// $ExpectType string[]
const a = ['aa', 'bb'];

// $ExpectType [string, string]
tuplize(['aa', 'bb']);

// $ExpectType [string, number]
tuplize(['aa', 3]);
