// Downloads a few freely-licensed photos from Wikimedia Commons.
const UA = 'TravelSiteBuild/0.1 (https://example.org; user@example.org)';
const queries = [
  ['halong', 'Ha Long Bay Vietnam landscape'],
  ['sapa', 'Sa Pa terraces rice Vietnam'],
  ['hanoi', 'Hanoi Old Quarter street'],
];

const api = (q) =>
  'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search' +
  '&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + q) +
  '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1800';

const fs = require('fs');
const path = require('path');
const outDir = path.join(process.cwd(), 'assets', 'img');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const [slug, q] of queries) {
    try {
      const res = await fetch(api(q), { headers: { 'User-Agent': UA } });
      const json = await res.json();
      const pages = Object.values(json?.query?.pages || {});
      const best = pages
        .filter((p) => p.imageinfo && p.imageinfo[0].width >= 1600)
        .sort((a, b) => b.imageinfo[0].width - a.imageinfo[0].width)[0];
      if (!best) { console.log(slug, 'none'); continue; }
      const info = best.imageinfo[0];
      const img = await fetch(info.thumburl || info.url, { headers: { 'User-Agent': UA } });
      const buf = Buffer.from(await img.arrayBuffer());
      fs.writeFileSync(path.join(outDir, slug + '.jpg'), buf);
      console.log(slug, 'OK', info.width + 'x' + info.height, (buf.length / 1024).toFixed(0) + 'KB', best.title);
    } catch (e) {
      console.log(slug, 'ERR', e.message);
    }
  }
})();
