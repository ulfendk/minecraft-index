# Minecraft mods

The index of our Minecraft add-ons and mods: **https://ulfendk.github.io/minecraft-index/** ([dansk](https://ulfendk.github.io/minecraft-index/da/)).

| Mod | Repository |
| --- | --- |
| Prehistoric Dinosaurs | [minecraft-dinosaurs](https://github.com/ulfendk/minecraft-dinosaurs) |
| Safari Animals | [minecraft-safari-animals](https://github.com/ulfendk/minecraft-safari-animals) |
| Werewolves | [minecraft-werewolfs](https://github.com/ulfendk/minecraft-werewolfs) |
| Security Gear | [minecraft-security-gear](https://github.com/ulfendk/minecraft-security-gear) |

## Adding a mod
1. Add an entry to `mods.json` (name, summary and highlights in English and Danish, the repo, a banner gradient, and whether the mod has its own Pages site yet).
2. Put its 256×256 pack icon in `img/`.
3. Push to `main`. The Pages workflow builds the site with `node tools/build.mjs` (output in `_site/`) and deploys it.

The latest release of each mod is looked up when the site is built, daily, and again in the browser.
