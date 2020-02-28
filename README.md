# Zerial
Zerial is a libary that lets you build your interfaces and get out of the box
runtime type checking and deserialization.

## Requirements of the project
    1. Define structure once
        (or have strong typechecking between mulitple declarations)
        (or have one generate the other, in code)
    2. Nearly free deserialization.
    3. Can take output from JSON.parse.
    4. Runtime type checking.
    5. Usable defined types in TypeScript.

## Technical Notes
    * Classes give free structure and type.
    * Structure once means the means of deserialization needs
        incorporated in the declaration.

### Limitations
    * Due to converting a user created interface to generic then
        back again, extra keys will not be type checked.