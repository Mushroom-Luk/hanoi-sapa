// 由 Wikimedia Commons 抓相：node fetch-images.mjs
// 只抓自由授權圖，寫入 assets/img/hanoi/ 同 content/images.mjs（含作者／授權）。
// 全部重新抓 480px 縮圖，夠 64px 縮略圖用，又唔會拖慢手機。

import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { extname } from 'node:path';

const OUT = 'assets/img/hanoi';
const WIDTH = 480;
mkdirSync(OUT, { recursive: true });

// 指定檔案（搜尋結果唔準的，用 exact title）
const EXACT = {
  pho: 'File:Beef noodle soup (Phở bò) - Pho Hanoi Authentic 2024-12-01.jpg',
  'banh-mi': 'File:Bánh mì thịt nguội.jpg',
  'banh-tom': 'File:Lễ hội ẩm thực Cửa Việt th4n2023 đặc sản bánh tôm Hồ Tây (2).jpg',
  'viet-food': 'File:Món ăn Tết 2023 (bữa cơm gia đình, mâm cơm) (2).jpg',
  'quang-ba': 'File:Flower market - Hanoi, Vietnam - DSC03681.JPG',
  b52: 'File:B52 wreckage, Hữu Tiệp Lake, Hanoi (landscape).jpg',
  'salt-coffee': 'File:Ly cà phê muối ở Tân Phú ng2th3n2023 (6).jpg',
  cafe: 'File:Cà phê bờ hồ Hoàn Kiếm, Hà Nội 001.JPG',
  xoi: 'File:Xôi xéo.jpg',
  'banana-island': 'File:Bai giua song Hong.jpg',
  'note-coffee': 'File:Wall of sticky note are seen in cafe.png',
};

const TERMS = {
  'hoan-kien': ['Hoan Kiem Lake', 'Hoan Kiem'],
  'ngoc-son': ['Ngoc Son Temple', 'Den Ngoc Son'],
  'nha-tho-lon': ["St. Joseph's Cathedral Hanoi", 'Nha tho Lon Hanoi'],
  'train-street': ['Hanoi train street', 'Duong tau Hanoi'],
  'bach-ma': ['Bach Ma Temple Hanoi', 'Den Bach Ma'],
  'dong-xuan': ['Dong Xuan Market', 'Cho Dong Xuan'],
  'ta-hien': ['Ta Hien Street Hanoi', 'Pho Ta Hien'],
  'book-street': ['Hanoi book street', 'Pho Sach Hanoi'],
  mausoleum: ['Ho Chi Minh Mausoleum', 'Lang Chu tich Ho Chi Minh'],
  'one-pillar': ['One Pillar Pagoda Hanoi', 'Chua Mot Cot'],
  'stilt-house': ['Ho Chi Minh stilt house', 'Nha san Bac Ho'],
  'van-mieu': ['Temple of Literature Hanoi', 'Van Mieu Quoc Tu Giam'],
  'hoang-thanh': ['Imperial Citadel of Thang Long', 'Hoang thanh Thang Long'],
  'tran-quoc': ['Tran Quoc Pagoda', 'Chua Tran Quoc'],
  'quan-thanh': ['Quan Thanh Temple', 'Den Quan Thanh'],
  'hoa-lo': ['Hoa Lo Prison', 'Hoa Lo Hanoi'],
  'dan-toc-hoc': ['Vietnam Museum of Ethnology', 'Bao tang Dan toc hoc'],
  'tay-ho': ['West Lake Hanoi', 'Ho Tay Hanoi'],
  'long-bien': ['Long Bien Bridge', 'Cau Long Bien'],
  'gom-su': ['Hanoi ceramic mosaic', 'Con duong gom su'],
  'phung-hung': ['Phung Hung mural Hanoi', 'Pho bich hoa Phung Hung'],
  'phu-nu': ["Vietnamese Women's Museum", 'Bao tang Phu nu'],
  'my-thuat': ['Vietnam Fine Arts Museum', 'Bao tang My thuat'],
  'bun-cha': ['Bun cha Hanoi', 'Bun cha'],
  'banh-cuon': ['Banh cuon', 'Banh cuon Hanoi'],
  'cha-ca': ['Cha ca Hanoi', 'Cha ca La Vong', 'Cha ca'],
  'bun-bo': ['Bun bo nam bo', 'Bun bo'],
  kem: ['Kem Trang Tien', 'Ice cream Hanoi', 'Ice cream'],
  'bia-hoi': ['Bia hoi Hanoi', 'Bia hoi'],
  'egg-coffee': ['Egg coffee Hanoi', 'Egg coffee', 'Ca phe trung'],
  'coconut-coffee': ['Coconut coffee Vietnam', 'Ca phe dua'],
  'hidden-gem': ['Hanoi cafe rooftop', 'Hanoi coffee shop', 'Cafe Hanoi'],
};

const UA = 'TravelItineraryBot/1.0 (personal trip planning)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.json();
    if (res.status !== 429) throw new Error('api ' + res.status);
    const wait = 5000 * (i + 1);
    console.error(`  429 wait ${wait / 1000}s`);
    await sleep(wait);
  }
  throw new Error('api 429');
}

const base =
  'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2' +
  `&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=${WIDTH}`;

async function byTitle(title) {
  const j = await getJson(base + '&titles=' + encodeURIComponent(title));
  const p = j.query?.pages?.[0];
  return p?.imageinfo?.[0] ? [p] : [];
}

async function bySearch(term) {
  const j = await getJson(
    base + '&generator=search&gsrnamespace=6&gsrlimit=6&gsrsearch=' +
      encodeURIComponent(`filetype:bitmap ${term}`)
  );
  return j.query?.pages || [];
}

const BAD = /(map|logo|diagram|seal|coat[_ ]of[_ ]arms|banknote|stamp|poster|plan\b|graph|chart|drawing|bản vẽ)/i;
const strip = (s) => (s ? String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');

const manifest = {};
const credits = [];
const all = Object.keys(TERMS).concat(Object.keys(EXACT));

for (const slug of all) {
  let pages = [];
  if (EXACT[slug]) {
    pages = await byTitle(EXACT[slug]);
    if (!pages.length) console.error('exact miss', slug);
  }
  if (!pages.length) {
    for (const term of TERMS[slug] || []) {
      pages = await bySearch(term);
      await sleep(1200);
      if (pages.length) break;
    }
  }
  await sleep(1000);

  let saved = false;
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info?.thumburl) continue;
    if (!/^image\/(jpeg|png|webp)$/.test(info.mime || '')) continue;
    if (!EXACT[slug] && BAD.test(p.title)) continue;
    if (!EXACT[slug] && (info.width || 0) < 500) continue;

    const ext0 = (extname(new URL(info.thumburl).pathname) || '.jpg').toLowerCase();
    const file = `${slug}${ext0 === '.jpeg' ? '.jpg' : ext0}`;
    try {
      const r = await fetch(info.thumburl, { headers: { 'User-Agent': UA } });
      if (!r.ok) throw new Error('img ' + r.status);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 5000) throw new Error('too small ' + buf.length);
      for (const f of readdirSync(OUT)) if (f.startsWith(slug + '.')) unlinkSync(`${OUT}/${f}`);
      writeFileSync(`${OUT}/${file}`, buf);

      manifest[slug] = file;
      credits.push({
        file,
        title: p.title.replace(/^File:/, ''),
        artist: strip(info.extmetadata?.Artist?.value) || 'Wikimedia Commons contributor',
        license: strip(info.extmetadata?.LicenseShortName?.value) || 'see Commons',
      });
      console.log('ok  ', slug, '←', p.title);
      saved = true;
      break;
    } catch (e) {
      console.error('dl fail', slug, e.message);
    }
  }
  if (!saved) console.error('MISS', slug);
  await sleep(800);
}

writeFileSync(
  'content/images.mjs',
  '// 由 fetch-images.mjs 生成。圖片來自 Wikimedia Commons，授權見 credits。\n' +
    `export const images = ${JSON.stringify(manifest, null, 2)};\n\n` +
    `export const credits = ${JSON.stringify(credits, null, 2)};\n`,
  'utf8'
);
console.log(`\n${Object.keys(manifest).length}/${all.length} images`);
