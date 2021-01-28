# Presi
Presi (short for praesidium, Latin meaning protection or guard) is a libary
that lets you build interfaces and get out of the box runtime type checking
and JSON deserialization. Presi was inspired by DRY, prop-types, and Scala
class objects to let you only define an interface once but still allow you to:

1. Use the defined interface to statically type check
objects in your code,
2. Check the type of arbitrary objects that come from
unsafe IO sources (e.g. user input).

## How to Install

```
npm install --save presi
```

## How to Use

```typescript
import {I, Z} from 'presi';
```

When you need to define an interface, i.e.

```typescript
interface User {
  name: string;
  age: number;
}
```

instead do

```typescript
class User extends I({
  name: Z.string,
  age: Z.number,
}) {}
```
* `User` is the interface with a string, `name`, and a number, `age`.

* `I` is a mixin which creates type for `User` and attaches the deserialization
function.

From there you can use `User` like a regular interface. But additionally, you
can use `new User(your unknown object)` which creates a `User` object if given
valid data or throws if not.

```typescript
const user1: User = { name: 'A', age: 1 }; // succeeds
const user2: User = { name: 1, age: 1 }; // fails typecheck
const user3: User = { name: 'A' }; // fails typecheck
const data = {
  name: 100,
  age: 1,
}
const user4 = new User(data); // throws
```

In essence,

```typescript
class _ extends I({
```

becomes a substitute for

```javascript
interface _ {
```

## Z
Z, which stands for deserializer, is a set of 1 and 2 arity functions that
either check that it's argument is a primative or, when given a type spec,
checks that it's argument follows that spec.

```typescript
import {G, I, Z} from 'presi';
class ObjectDef extends I({
  // stringValue: string
  stringValue: Z.string,

  // numberValue: number
  numberValue: Z.number,

  // booleanValue: boolean
  booleanValue: Z.boolean,

  // literalKeyValue: 'Key'
  literalKeyValue: Z.literal('Key'),

  // literal100Value: 100
  literal100Value: Z.literal(100),

  // optionalStringValue: string | undefined
  optionalStringValue: Z.optional(Z.string),

  // optionalLiteralPValue: 'P' | undefined (Z.o is shorthand for Z.optional)
  optionalLiteralPValue: Z.o(Z.literal('P')),

  // arrayOfNumbers: number[]
  arrayOfNumbers: Z.array(Z.number),

  // tupleNumNum: [number, number]
  tupleNumNum: Z.tuple([Z.number, Z.number]),

  // nestedObject: { z: { z?: string } }
  nestedObject: Z.object({ z: Z.Object({z: Z.optional(Z.string) }) }),

  // stringOrNumber: string | number
  stringOrNumber: Z.oneOf(Z.string, Z.number),

  // numberOrNull: number | null
  numberOrNull: Z.oneOf(Z.number, Z.null),

  // tripleTuple: [string, number, string[]]
  tripleTuple: Z.tuple([Z.string, Z.number, Z.array(Z.string)]),
}) {}

class objectComposition extends I{
  // objectDef: ObjectDef
  objectDef: ObjectDef._,
}
```

## Project Goals
1. Structure once philosophy.
2. Nearly free deserialization.
3. Can take output from JSON.parse.
4. Run time type checking.
5. Usable types in TypeScript for compile time type checking.

### Technical Notes
* Classes give free structure, type, and function.
* "Structure once" means the means of deserialization needs incorporated in the
    declaration.

### Limitations
* Due to converting a user created interface to generic then back again,
    extraneous keys will not be type checked.
* Currently does not support reflection.
