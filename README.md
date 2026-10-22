# Minecraft mods

The index of our Minecraft add-ons and mods: **https://ulfendk.github.io/minecraft-index/** ([dansk](https://ulfendk.github.io/minecraft-index/da/)).

| Mod | Repository |
| --- | --- |
| Prehistoric Dinosaurs | [minecraft-dinosaurs](https://github.com/ulfendk/minecraft-dinosaurs) |
| Safari Animals | [minecraft-safari-animals](https://github.com/ulfendk/minecraft-safari-animals) |
| Werewolves | [minecraft-werewolfs](https://github.com/ulfendk/minecraft-werewolfs) |
| Security Gear | [minecraft-security-gear](https://github.com/ulfendk/minecraft-security-gear) |
| Realistic Hunting | [minecraft-hunting](https://github.com/ulfendk/minecraft-hunting) |
| Construction Machines | [minecraft-machines](https://github.com/ulfendk/minecraft-machines) |
| Rockets | [minecraft-rockets](https://github.com/ulfendk/minecraft-rockets) |
| Scouts | [minecraft-scouts](https://github.com/ulfendk/minecraft-scouts) |

## Adding a mod
1. Add an entry to `mods.json` (name, summary and highlights in English and Danish, the repo, a banner gradient, and whether the mod has its own Pages site yet).
2. Put its 256×256 pack icon in `img/`.
3. Give the mod's own site the shared template (see below).
4. Push to `main`. The Pages workflow builds the site with `node tools/build.mjs` (output in `_site/`) and deploys it.

The latest release of each mod is looked up when the site is built, daily, and again in the browser.

## Mod sites
Every mod has its own Pages site, built in its own repo, and all of them share one template, so together with this index they read as one site:

- **Top bar:** "← All our mods" back to this index (the Danish page links to `/minecraft-index/da/`) and the language switch.
- **Hero:** pack icon, name, tagline, download buttons for Bedrock and Java, the "Which one do I need?" box and the latest version.
- **Install:** numbered steps for Bedrock and for Java, a server note, and how to upgrade to a new version.
- **Content:** the mod's own sections (creatures, gear, items, features).
- **Footer:** source code and issues, the not-affiliated-with-Mojang line, and the link back to this index.

The page looks up the latest release in the browser, and reloads itself when the site is redeployed with a new `version.json`. Each mod keeps its own colours as CSS variables on `:root`, with a dark variant.

The generator is `tools/site.mjs`, with the website texts in English and Danish in `src/i18n.mjs`. Prehistoric Dinosaurs is the exception: its generator is TypeScript, `tools/site/build-site.ts`, with the texts in the same file. To start a new mod's site, copy `tools/site.mjs` and the website part of `src/i18n.mjs` from [minecraft-werewolfs](https://github.com/ulfendk/minecraft-werewolfs) (the smallest one) and replace the content sections.
