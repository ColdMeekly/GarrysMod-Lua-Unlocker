Lua Unlocker
===========

## Description
Unblocks restricted lua functions such as:
```
debug.setupvalue
debug.setlocal
debug.upvalueid
debug.upvaluejoin
```

## Installation:
1.  Download the required dll from this repo, Make sure to download 32bit if you use 32bit gmod, not windows!
2.  Backup your original `lua_shared.dll` file in `(Garry's Mod Install)\garrysmod\bin\`
3.  Replace it with the one from this repo.

## Usage:
Your client should now have unrestricted access to these functions. To check if it succeeded or not, you can run the following lua:
```lua
PrintTable(debug)
```

## Method:
To get the dll's I manually patched my own `lua_shared.dll` files on Windows.
It was a simple `jmp` over their patch, setting correct lua stack as well as correcting our own stack.

It is possble to make a patcher for these dll's but I don't see a point in it when we all have the same dlls in the first place.