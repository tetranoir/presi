# Presi
Presi is a libary that lets you build interfaces and get out of the box
runtime type checking and JSON deserialization. Presi was inspired by DRY and
Scala class objects to let you only define an interface once but still allow
you to: 1. Use the defined interface to statically type check
objects in your code, 2. Check the type of arbitrary objects that come from
unsafe IO sources (e.g. user input).

## How to use

## Requirements of the project
    1. Structure once philosophy.
    2. Nearly free deserialization.
    3. Can take output from JSON.parse.
    4. Runtime type checking.
    5. Usable defined types in TypeScript.

### Technical Notes
    * Classes give free structure, type, and function.
    * "Structure once" means the means of deserialization needs
        incorporated in the declaration.
### Limitations
    * Due to converting a user created interface to generic then
        back again, extraneous keys will not be type checked.