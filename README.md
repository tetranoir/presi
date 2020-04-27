# Presi ![](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)
Presi is a libary that lets you build interfaces and get out of the box
runtime type checking and JSON deserialization. Presi was inspired by DRY,
prop-types, and Scala class objects to let you only define an interface once
but still allow you to:

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
import {G, I, Z} from 'presi';
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
class User extends I(class IUser extends G {
  name = Z.string;
  age = Z.number;
}) {}
```
* `User` is the interface with `name` and `age`.

* `I` is a mixin which creates the deserialization and type for `User`.

* `IUser` is the class which contains the type converter functions. This class can
be named anything.

* `G` is the base class that I accepts.

From there you can use `User` like a regular interface. But additionally, you
can use `new User(your unknown object)` which creates a `User` object if given
valid data or throws if not.

```typescript
const user1: User = { name: 'A', age: 1 }; // succeeds
const user2: User = { name: 1, age: 1 }; // fails typecheck
const user3: User = { name: 'A' }; // fails typecheck
const ioData = {
  name: 100,
  age: 1,
}
const user4 = new User(ioData); // throws
```

In essence,

```typescript
class _ extends I(class _ extends G {
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
class objectDef extends I(class IobjectDef extends G {
  // string
  stringValue = Z.string;

  // number
  numberValue = Z.number;

  // boolean
  booleanValue = Z.boolean;

  // 'Key'
  literalKeyValue = Z.literal('Key');

  // 100
  literal100Value = Z.literal(100);

  // string | undefined
  optionalStringValue = Z.optional(Z.string);

  // 'P' | undefined (Z.o is shorthand for Z.optional)
  optionalLiteralPValue = Z.o(Z.literal('P'));

  // number[]
  arrayOfNumbers = Z.array(Z.number);

  // [number, number]
  tupleNumNum = Z.tuple([Z.number, Z.number]);

  // { z: { z?: string } }
  nestedObject = Z.object({ z: Z.Object({z: Z.optional(Z.string) }) });

  // string | number
  stringOrNumber = Z.oneOf(Z.string, Z.number);

  // number | null
  numberOrNull = Z.oneOf(Z.number, Z.null);

  // [string, number, string[]]
  tripleTuple = Z.tuple([Z.string, Z.number, Z.array(Z.string)]);
}) {}
```

## Requirements of the project
1. Structure once philosophy.
2. Nearly free deserialization.
3. Can take output from JSON.parse.
4. Runtime type checking.
5. Usable defined types in TypeScript.

### Technical Notes
* Classes give free structure, type, and function.
* "Structure once" means the means of deserialization needs incorporated in the
    declaration.
### Limitations
* Due to converting a user created interface to generic then back again,
    extraneous keys will not be type checked.