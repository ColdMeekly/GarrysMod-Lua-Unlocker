Gmod Lua Unlocker
===========
Website: https://glu.cldmk.ly/

Garry's Mod strips powerful debugging functions from Lua to prevent abuse. This project undoes that, allowing previously removed functions to be used again.

## Restored functions
 1. [debug.setupvalue](https://wiki.facepunch.com/gmod/debug.setupvalue)
 2. [debug.setlocal](https://wiki.facepunch.com/gmod/debug.setlocal)
 3. [debug.upvalueid](https://wiki.facepunch.com/gmod/debug.upvalueid)
 4. [debug.upvaluejoin](https://wiki.facepunch.com/gmod/debug.upvaluejoin)


## Usage:
1. Go to the [unlocker's page](https://glu.cldmk.ly).
2. Drag and drop your `lua_shared.dll` file to 'unlock' it.
3. Backup your original `lua_shared.dll` file in `(Garry's Mod Install)\garrysmod\bin\` (or `\bin\win64` for 64 bit).
4.  Rename the unlocked file to `lua_shared.dll` and place in same location as original.
5. Enjoy forbidden functions!

## Note:
Some servers check for presence of these functions, make sure to hide them to avoid being banned.

```lua
local debug_setupvalue = debug.setupvalue
debug.setupvalue = nil


# Now use debug_setupvalue instead of debug.setupvalue.
```