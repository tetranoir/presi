import {expectType} from 'tsd';
import {narrow, tuplize} from '../src/magic';

// Test 1
let narrow_test = narrow('c');
expectType<'c'>(narrow_test);

// Test 2
let tuplize_test = tuplize(['aa', 4]);
expectType<['aa', 4]>(tuplize);
