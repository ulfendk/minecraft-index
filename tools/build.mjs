// Builds the GitHub Pages site into _site/ from mods.json: an English page and a Danish one in da/.
// Latest versions are looked up at build time (GitHub API) and again in the browser,
// so the page stays current between deploys. No dependencies; needs Node 18+.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const OUT = '_site';
const ROOT_URL = 'https://ulfendk.github.io/minecraft-index/';
const mods = JSON.parse(await readFile('mods.json', 'utf8'));

const STRINGS = {
  en: {
    title: 'Minecraft mods by ulfendk',
    description: 'Free Minecraft add-ons and mods for Bedrock and Java Edition: dinosaurs, safari animals, werewolves and security gear.',
    lede: 'Free add-ons for <b>Bedrock</b> and mods for <b>Java Edition</b> (Fabric). Every model, texture and animation is generated from code, and the source is on GitHub.',
    count: (n) => `${n} mods`,
    website: 'Website and download',
    releases: 'Releases',
    source: 'Source',
    latest: 'Latest',
    soon: 'In development',
    editions: 'Bedrock + Java',
    other: 'Dansk',
    otherHref: 'da/',
    footer: 'Made with code. Not affiliated with Mojang or Microsoft.',
  },
  da: {
    title: 'Minecraft-mods af ulfendk',
    description: 'Gratis Minecraft add-ons og mods til Bedrock og Java Edition: dinosaurer, safaridyr, varulve og sikkerhedsudstyr.',
    lede: 'Gratis add-ons til <b>Bedrock</b> og mods til <b>Java Edition</b> (Fabric). Alle modeller, teksturer og animationer er lavet med kode, og kildekoden ligger på GitHub.',
    count: (n) => `${n} mods`,
    website: 'Hjemmeside og download',
    releases: 'Udgivelser',
    source: 'Kildekode',
    latest: 'Nyeste',
    soon: 'Under udvikling',
    editions: 'Bedrock + Java',
    other: 'English',
    otherHref: '../',
    footer: 'Lavet med kode. Ikke tilknyttet Mojang eller Microsoft.',
  },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function latestTag(repo) {
  if (process.env.OFFLINE) return null;
  try {
    const headers = { accept: 'application/vnd.github+json' };
    if (process.env.GH_TOKEN) headers.authorization = `Bearer ${process.env.GH_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers });
    return res.ok ? (await res.json()).tag_name : null;
  } catch {
    return null;
  }
}

const tags = await Promise.all(mods.map((m) => latestTag(m.repo)));

function card(m, tag, lang) {
  const t = STRINGS[lang];
  const [owner, name] = m.repo.split('/');
  const gh = `https://github.com/${m.repo}`;
  const site = `https://${owner}.github.io/${name}/${lang === 'da' && m.danish ? 'da/' : ''}`;
  const up = lang === 'en' ? '' : '../';
  const main = m.site ? site : gh;
  const version = tag
    ? `<span class="badge" data-version>${esc(t.latest)} <b>${esc(tag)}</b></span>`
    : `<span class="badge soon" data-version>${esc(t.soon)}</span>`;
  return `
    <article class="card" data-repo="${esc(m.repo)}">
      <a class="banner" href="${esc(main)}" style="--from:${esc(m.theme[0])};--to:${esc(m.theme[1])}">
        <img src="${up}${esc(m.icon)}" alt="" width="128" height="128" loading="lazy">
      </a>
      <div class="body">
        <div class="meta">${version}<span class="badge plain">${esc(t.editions)}</span></div>
        <h2><a href="${esc(main)}">${esc(m.name[lang])}</a></h2>
        <p>${esc(m.summary[lang])}</p>
        <ul class="tags">${m.highlights[lang].map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        <div class="links">
          ${m.site ? `<a class="btn" href="${esc(site)}">${esc(t.website)}</a>` : ''}
          <a class="btn ${m.site ? 'ghost' : ''}" href="${esc(gh)}/releases">${esc(t.releases)}</a>
          <a class="btn ghost" href="${esc(gh)}">${esc(t.source)}</a>
        </div>
      </div>
    </article>`;
}

function page(lang) {
  const t = STRINGS[lang];
  const up = lang === 'en' ? '' : '../';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="alternate" hreflang="en" href="${ROOT_URL}">
<link rel="alternate" hreflang="da" href="${ROOT_URL}da/">
<link rel="icon" href="${up}favicon.png">${lang === 'en' ? `
<script>
// Danish browsers get the Danish page, unless the visitor picked a language with the switch.
try {
  const chosen = localStorage.getItem('lang');
  const preferred = (navigator.languages || [navigator.language]).map((l) => String(l).toLowerCase().slice(0, 2)).find((l) => l === 'da' || l === 'en');
  if (chosen === 'da' || (!chosen && preferred === 'da')) location.replace('da/' + location.search + location.hash);
} catch {}
</script>` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #eef1ec; --surface: #ffffff; --ink: #1c2219; --muted: #59614f; --line: #d6dccf;
  --accent: #3f7a2a; --chip: #e2e8db; --hero-from: #18240f; --hero-to: #3f6a2a;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #10140e; --surface: #181e15; --ink: #e7ecdf; --muted: #a5ae99; --line: #2b3426;
    --accent: #9fd27f; --chip: #252e20; --hero-from: #070b05; --hero-to: #26401a;
  }
}
:root[data-theme="dark"] {
  --bg: #10140e; --surface: #181e15; --ink: #e7ecdf; --muted: #a5ae99; --line: #2b3426;
  --accent: #9fd27f; --chip: #252e20; --hero-from: #070b05; --hero-to: #26401a;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
img { image-rendering: pixelated; max-width: 100%; }
a { color: var(--accent); }
h1, h2 { font-family: "Pixelify Sans", system-ui, sans-serif; font-weight: 500; line-height: 1.15; letter-spacing: .01em; }
.wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
header.hero { color: #f4f8ee; background: linear-gradient(180deg, var(--hero-from), var(--hero-to)); padding: 20px 0 48px; }
.langs { display: flex; justify-content: flex-end; margin-bottom: 16px; }
.langs a { color: #f4f8ee; font-weight: 600; text-decoration: none; padding: 4px 12px; border-radius: 999px; box-shadow: inset 0 0 0 1.5px rgb(244 248 238 / .55); font-size: .9rem; }
.langs a:hover { background: rgb(255 255 255 / .12); }
.hero h1 { font-size: clamp(2.2rem, 6vw, 3.4rem); margin: 0 0 8px; }
.hero p { margin: 0; font-size: 1.15rem; max-width: 60ch; color: #dbe5d0; }
.hero p b { color: #fff; }
main { padding: 40px 0 24px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
.banner { display: grid; place-items: center; padding: 28px; background: linear-gradient(160deg, var(--from), var(--to)); }
.banner img { width: 128px; height: 128px; border-radius: 12px; box-shadow: 0 8px 24px rgb(0 0 0 / .35); transition: transform .15s; }
.banner:hover img { transform: translateY(-3px) rotate(-2deg); }
.body { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1; }
.body h2 { font-size: 1.6rem; margin: 10px 0 6px; }
.body h2 a { color: inherit; text-decoration: none; }
.body h2 a:hover { color: var(--accent); }
.body p { margin: 0 0 12px; color: var(--muted); }
.meta { display: flex; flex-wrap: wrap; gap: 6px; }
.badge { font-size: .8rem; padding: 2px 10px; border-radius: 999px; background: var(--accent); color: var(--surface); font-weight: 600; }
.badge.soon { background: #c98a2e; color: #1f1405; }
.badge.plain { background: var(--chip); color: var(--muted); }
.tags { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-wrap: wrap; gap: 6px; }
.tags li { font-size: .85rem; background: var(--chip); padding: 2px 10px; border-radius: 6px; }
.links { margin-top: auto; display: flex; flex-wrap: wrap; gap: 8px; }
.btn { display: inline-flex; align-items: center; padding: 8px 14px; border-radius: 9px; font-weight: 700; font-size: .92rem; text-decoration: none; background: #ffd36b; color: #2b1d0e; box-shadow: 0 3px 0 #b8862c; }
.btn:hover { transform: translateY(-1px); }
.btn.ghost { background: transparent; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--line); }
.btn.ghost:hover { box-shadow: inset 0 0 0 1.5px var(--accent); }
footer { color: var(--muted); font-size: .9rem; padding: 24px 0 40px; }
</style>
</head>
<body>
<header class="hero">
  <div class="wrap">
    <nav class="langs"><a href="${t.otherHref}" hreflang="${lang === 'en' ? 'da' : 'en'}" data-lang="${lang === 'en' ? 'da' : 'en'}">${esc(t.other)}</a></nav>
    <h1>${esc(t.title)}</h1>
    <p>${t.lede}</p>
  </div>
</header>
<main class="wrap">
  <div class="grid">${mods.map((m, i) => card(m, tags[i], lang)).join('')}
  </div>
</main>
<footer class="wrap">${esc(t.footer)}</footer>
<script>
// Remember an explicit language choice, so detection doesn't override it.
document.querySelector('[data-lang]').addEventListener('click', (e) => {
  try { localStorage.setItem('lang', e.currentTarget.dataset.lang); } catch {}
});
// Refresh the version badges from the GitHub API, so a new release shows up without a redeploy.
const L = ${JSON.stringify({ latest: t.latest })};
for (const card of document.querySelectorAll('[data-repo]')) {
  fetch('https://api.github.com/repos/' + card.dataset.repo + '/releases/latest')
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel || !rel.tag_name) return;
      const badge = card.querySelector('[data-version]');
      badge.className = 'badge';
      badge.textContent = L.latest + ' ';
      const b = document.createElement('b');
      b.textContent = rel.tag_name;
      badge.append(b);
    })
    .catch(() => {});
}
</script>
</body>
</html>
`;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/da`, { recursive: true });
await cp('img', `${OUT}/img`, { recursive: true });
await cp('img/dinosaurs.png', `${OUT}/favicon.png`);
await writeFile(`${OUT}/index.html`, page('en'));
await writeFile(`${OUT}/da/index.html`, page('da'));
await writeFile(`${OUT}/.nojekyll`, '');
console.log(`Built ${OUT}/ with ${mods.length} mods (${tags.map((t, i) => `${mods[i].repo.split('/')[1]} ${t ?? '-'}`).join(', ')})`);
