// 靜態網站生成器：node build.mjs
// 改 content/site.mjs 之後跑一次，就會重新出 index.html / day-N.html / book.html。

import { writeFileSync } from 'node:fs';
import { trip, days, booking, hanoi2 } from './content/site.mjs';
import { images, credits } from './content/images.mjs';

const SITE = '河內 · 下龍灣 · 沙壩';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const navItems = [
  { href: 'index.html', n: '00', label: '總覽' },
  ...days.map((d) => ({ href: `day-${d.n}.html`, n: String(d.n).padStart(2, '0'), label: d.title })),
  { href: 'hanoi-2day.html', n: '08', label: '河內 2 日' },
  { href: 'book.html', n: '09', label: '預訂清單' },
];

function rail(active) {
  const links = navItems
    .map(
      (i) =>
        `<li><a href="${i.href}"${i.href === active ? ' aria-current="page"' : ''}>` +
        `<span class="n">${i.n}</span><span>${esc(i.label)}</span></a></li>`
    )
    .join('\n        ');
  return `<aside class="rail" id="rail">
      <a class="rail__mark" href="index.html">
        <b>河內 · 沙壩</b>
        <span>${esc(trip.dates)}</span>
      </a>
      <ul class="navlist">
        ${links}
      </ul>
      <div class="rail__foot">
        ${days.length} 日行程<br>
        v2 · 2026-11-18
      </div>
    </aside>`;
}

function page({ active, title, body }) {
  return `<!DOCTYPE html>
<html lang="zh-Hant-HK">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — ${esc(SITE)}</title>
<meta name="description" content="${esc(trip.lede)}">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div class="shell">
  ${rail(active)}
  <main class="main">
    <div class="wrap">
      <div class="topbar">
        <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="rail">選單</button>
        <span>${esc(trip.lat)}</span>
        <span>${esc(trip.dates)}</span>
      </div>
${body}
    </div>
  </main>
</div>
<script src="assets/site.js"></script>
</body>
</html>`;
}

/* ---------------- index ---------------- */

const dayRows = days
  .map(
    (d) => `      <a class="dayrow" href="day-${d.n}.html">
        <span class="dayrow__n">${String(d.n).padStart(2, '0')}</span>
        <span class="dayrow__body">
          <span class="meta">${d.wd} · ${esc(d.place.split(' · ').pop())}</span>
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.lead.split('。')[0])}。</p>
        </span>
        <span class="dayrow__go">→</span>
      </a>`
  )
  .join('\n');

const strip = trip.summary
  .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
  .join('\n      ');

const route = trip.route
  .map(([place, leg], i) => {
    const arrow = i === 0 ? '' : `<span class="arrow">— ${esc(leg)} →</span>`;
    return `${arrow}<span class="stop">${esc(place)}</span>`;
  })
  .join('');

const risks = trip.risks
  .map(
    (r) => `      <div class="note note--warn">
        <strong>${r.n} · 風險</strong>
        <b>${esc(r.h)}</b><br>${esc(r.p)}
      </div>`
  )
  .join('\n');

const budgetRows = trip.budget
  .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`)
  .join('\n          ');

const indexBody = `      <header class="hero">
        <p class="eyebrow">Vietnam · Itinerary</p>
        <h1>${esc(trip.title)}</h1>
        <p class="lede">${esc(trip.lede)}</p>
        <figure class="hero-figure">
          <img src="assets/img/halong.jpg" alt="下龍灣石灰岩島與海灣" loading="eager">
          <figcaption>Vịnh Hạ Long · 相片：Wikimedia Commons</figcaption>
        </figure>
      </header>

      <dl class="strip">
        ${strip}
      </dl>

      <p class="route">${route}</p>

      <section class="sect">
        <div class="sect__head"><span class="n">01</span><h2>逐日</h2></div>
        <div class="days">
${dayRows}
        </div>
      </section>

      <section class="sect">
        <div class="sect__head"><span class="n">02</span><h2>三個會出事嘅位</h2></div>
        <div class="notes">
${risks}
        </div>
      </section>

      <section class="sect">
        <div class="sect__head"><span class="n">03</span><h2>預算</h2></div>
        <table class="table">
          <thead><tr><th>項目</th><th>HK$</th></tr></thead>
          <tbody>
          ${budgetRows}
          </tbody>
          <tfoot><tr><td>合計（未計機票）</td><td>3,100 – 5,000</td></tr></tfoot>
        </table>
        <p class="eyebrow" style="margin-top:14px">${esc(trip.budgetNote)}</p>
      </section>

      <footer class="foot">
        <span>${esc(SITE)}</span>
        <span>v2 · 2026-11-18</span>
      </footer>`;

/* ---------------- day pages ---------------- */

function dayPage(d) {
  const facts = d.facts
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join('\n      ');

  const rows = d.rows
    .map(
      ([t, what, small]) =>
        `<li><span class="t">${esc(t)}</span><span class="what">${esc(what)}` +
        (small ? `<small>${esc(small)}</small>` : '') +
        '</span></li>'
    )
    .join('\n        ');

  const notes = (d.notes || [])
    .map(
      (nt) =>
        `<div class="note${nt.kind === 'warn' ? ' note--warn' : ''}"><strong>${esc(nt.k)}</strong>${esc(nt.v)}</div>`
    )
    .join('\n      ');

  const idx = days.findIndex((x) => x.n === d.n);
  const prev = idx > 0 ? days[idx - 1] : null;
  const next = idx < days.length - 1 ? days[idx + 1] : null;
  const prevHref = prev ? `day-${prev.n}.html` : 'index.html';
  const prevLabel = prev ? prev.title : '總覽';
  const nextHref = next ? `day-${next.n}.html` : 'book.html';
  const nextLabel = next ? next.title : '預訂清單';

  return `      <header class="phead">
        <p class="eyebrow eyebrow--rust">Day ${String(d.n).padStart(2, '0')} · ${d.wd}</p>
        <h1>${esc(d.title)}</h1>
        <p class="place">${esc(d.place)}</p>
      </header>

      <figure class="hero-figure">
        <img src="assets/img/${d.img}.jpg" alt="${esc(d.place)}" loading="lazy">
      </figure>

      <p class="lede" style="margin:26px 0 0;max-width:52ch;color:var(--ink-soft)">${esc(d.lead)}</p>

      <dl class="facts" style="margin-top:30px">
      ${facts}
      </dl>

      <ul class="tl">
        ${rows}
      </ul>

      ${notes ? `<div class="notes">\n      ${notes}\n      </div>` : ''}

      <nav class="pager">
        <a href="${prevHref}"><span class="k">上一頁</span><span class="v">${esc(prevLabel)}</span></a>
        <a href="${nextHref}"><span class="k">下一頁</span><span class="v">${esc(nextLabel)}</span></a>
      </nav>

      <footer class="foot">
        <span>Day ${String(d.n).padStart(2, '0')} / ${String(days.length).padStart(2, '0')}</span>
        <span>${esc(SITE)}</span>
      </footer>`;
}

/* ---------------- book ---------------- */

const checkItems = booking
  .map(
    ([label, when, note], i) =>
      `        <li><input type="checkbox" id="c${i}" data-k="${i}">` +
      `<span class="label"><b style="font-weight:600">${esc(label)}</b><br>` +
      `<span style="font-size:13.5px;color:var(--muted)">${esc(note)}</span></span>` +
      `<span class="when">${esc(when)}</span></li>`
  )
  .join('\n');

const bookBody = `      <header class="phead">
        <p class="eyebrow eyebrow--rust">Checklist</p>
        <h1>預訂清單</h1>
        <p class="place">按落單先後排</p>
      </header>

      <p class="lede" style="margin:26px 0 34px;max-width:52ch;color:var(--ink-soft)">
        郵輪最搶手，先訂。之後係兩程沙壩車——去程 13:30 嗰班好易滿。酒店可以最後。
      </p>

      <ul class="check" id="checklist">
${checkItems}
      </ul>

      <p class="eyebrow" style="margin-top:18px">勾選狀態存喺呢部機，唔會同步。</p>

      <nav class="pager">
        <a href="day-${days.length}.html"><span class="k">上一頁</span><span class="v">${esc(days[days.length - 1].title)}</span></a>
        <a href="index.html"><span class="k">返去</span><span class="v">總覽</span></a>
      </nav>

      <footer class="foot">
        <span>Checklist</span>
        <span>${esc(SITE)}</span>
      </footer>`;

/* ---------------- hanoi 2 days ---------------- */

const mapLink = (u) => `<a class="mlink" href="${u}" target="_blank" rel="noopener">地圖 ↗</a>`;

const IMG = {
  還劍湖: 'hoan-kien',
  '玉山祠 + 旭橋': 'ngoc-son',
  聖若瑟主教座堂: 'nha-tho-lon',
  火車街: 'train-street',
  '火車街（Le Duan 段）': 'train-street',
  白馬廟: 'bach-ma',
  東宣市場: 'dong-xuan',
  啤酒街: 'ta-hien',
  書街: 'book-street',
  胡志明陵: 'mausoleum',
  一柱廟: 'one-pillar',
  胡志明高腳屋: 'stilt-house',
  文廟: 'van-mieu',
  昇龍皇城: 'hoang-thanh',
  鎮國寺: 'tran-quoc',
  真武觀: 'quan-thanh',
  火爐監獄: 'hoa-lo',
  民族學博物館: 'dan-toc-hoc',
  西湖: 'tay-ho',
  龍邊橋: 'long-bien',
  香蕉島: 'banana-island',
  廣壩花市: 'quang-ba',
  陶瓷馬賽克壁畫: 'gom-su',
  馮興壁畫街: 'phung-hung',
  'B-52 湖': 'b52',
  越南婦女博物館: 'phu-nu',
  河內美術館: 'my-thuat',
  'Phở Gia Truyền Bát Đàn': 'pho',
  'Phở 10 Lý Quốc Sư': 'pho',
  'Phở Thìn': 'pho',
  'Bánh Cuốn Thanh Vân': 'banh-cuon',
  'Bánh Mì 25': 'banh-mi',
  'Bún Chả 74 Hàng Quạt': 'bun-cha',
  'Bún Chả Đắc Kim': 'bun-cha',
  'Bún Chả 34 (Tuyết)': 'bun-cha',
  'Bún Chả Hương Liên': 'bun-cha',
  'Chả Cá Thăng Long': 'cha-ca',
  'Bún Bò Nam Bộ': 'bun-bo',
  'Xôi Yên': 'xoi',
  'Kem Tràng Tiền': 'kem',
  'Bánh tôm Hồ Tây': 'banh-tom',
  'Tầm Vị ⭐': 'viet-food',
  'Gia ⭐': 'viet-food',
  'Luk Lak': 'viet-food',
  'Bia hơi Tạ Hiện': 'bia-hoi',
  'Cafe Giang': 'egg-coffee',
  'Ca Bop': 'salt-coffee',
  'Cộng Càphê': 'coconut-coffee',
  'Cafe Đinh': 'cafe',
  'The Note Coffee': 'note-coffee',
  'Hidden Gem Cafe': 'hidden-gem',
  'Tranquil Books & Coffee': 'cafe',
};

const photo = (name) => {
  const f = images[IMG[name]];
  if (!f) return '';
  return `<img class="thumb" src="assets/img/hanoi/${f}" alt="${esc(name)}" width="64" height="64" loading="lazy" decoding="async">`;
};

const gmap = (stops, mode, title) => {
  if (!stops || stops.length < 2) return '';
  const enc = (s) => encodeURIComponent(s);
  const saddr = enc(stops[0]);
  const daddr = stops.slice(1).map(enc).join('+to:');
  const src = `https://maps.google.com/maps?saddr=${saddr}&daddr=${daddr}&dirflg=${mode === 'walking' ? 'w' : 'd'}&output=embed`;
  const wp = stops.slice(1, -1).map(enc).join('|');
  const link =
    `https://www.google.com/maps/dir/?api=1&origin=${enc(stops[0])}` +
    `&destination=${enc(stops[stops.length - 1])}` +
    (wp ? `&waypoints=${wp}` : '') +
    `&travelmode=${mode || 'driving'}`;
  return `        <figure class="gmap">
          <iframe title="${esc(title)}" src="${src}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <figcaption><a href="${link}" target="_blank" rel="noopener">喺 Google Maps 開完整路線 ↗</a></figcaption>
        </figure>`;
};

const areaMap = (q, z, title) =>
  `        <figure class="gmap">
          <iframe title="${esc(title)}" src="https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <figcaption><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}" target="_blank" rel="noopener">喺 Google Maps 打開呢一區 ↗</a></figcaption>
        </figure>`;

const hFacts = hanoi2.facts
  .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
  .join('\n      ');

const hRules = hanoi2.rules
  .map(
    (r) => `        <div class="note">
          <strong>${r.n} · 硬限制</strong>
          <b>${esc(r.h)}</b><br>${esc(r.p)}
        </div>`
  )
  .join('\n');

const hMusts = hanoi2.musts
  .map(([name, why]) => `        <li><b>${esc(name)}</b><span>${esc(why)}</span></li>`)
  .join('\n');

const hPlaceGroups = hanoi2.places
  .map(
    (g) => `        <h3>${esc(g.title)}</h3>
        <p class="eyebrow" style="margin:6px 0 16px">${esc(g.sub)}</p>
${areaMap(g.mapq, g.mapz, g.title + ' 地圖')}
        <div class="tablewrap">
        <table class="table">
          <thead><tr><th>景點</th><th>時間</th><th>開放</th><th>門票</th><th></th></tr></thead>
          <tbody>
${g.items
  .map(
    (it) =>
      `            <tr><td><div class="cellmedia">${photo(it[0])}<div><b>${esc(it[0])}</b><span class="vi">${esc(it[1])}</span><span class="sub">${esc(it[2])}</span></div></div></td>` +
      `<td>${esc(it[3])}</td><td>${esc(it[4])}</td><td>${esc(it[5])}</td><td>${mapLink(it[6])}</td></tr>`
  )
  .join('\n')}
          </tbody>
        </table>
        </div>`
  )
  .join('\n');

const hFood = hanoi2.food
  .map(
    (g) => `        <h3>${esc(g.slot)}</h3>
        <div class="tablewrap">
        <table class="table">
          <thead><tr><th>店 / 食乜</th><th>價</th><th>開放</th><th></th></tr></thead>
          <tbody>
${g.items
  .map(
    (it) =>
      `            <tr><td><div class="cellmedia">${photo(it[0])}<div><b>${esc(it[0])}</b><span class="sub">${esc(it[1])}</span></div></div></td>` +
      `<td>${esc(it[2])}</td><td>${esc(it[3])}</td><td>${mapLink(it[4])}</td></tr>`
  )
  .join('\n')}
          </tbody>
        </table>
        </div>`
  )
  .join('\n');

const hDrinks = hanoi2.drinks
  .map(
    (d) =>
      `            <tr><td><div class="cellmedia">${photo(d[0])}<div><b>${esc(d[0])}</b><span class="sub">${esc(d[1])}</span></div></div></td><td>${esc(d[2])}</td><td>${mapLink(d[3])}</td></tr>`
  )
  .join('\n');

const hSources = hanoi2.sources
  .map(
    (s) =>
      `          <li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a><span>${esc(s[2])}</span></li>`
  )
  .join('\n');

const hStays = hanoi2.stays
  .map(
    (s) => `          <li>
            <b>${esc(s.name)}</b>
            <span>${esc(s.area)} · ${esc(s.tier)} · ${esc(s.price)}</span>
            <span>${esc(s.why)}</span>
            <span class="staymeta">${esc(s.score)} · <a class="mlink" href="${s.map}" target="_blank" rel="noopener">地圖 ↗</a></span>
          </li>`
  )
  .join('\n');

const hPanels = hanoi2.plans
  .map(
    (p) => `      <section class="panel" id="p-${p.id}" role="tabpanel" aria-labelledby="t-${p.id}" hidden>
        <p class="eyebrow eyebrow--rust">Plan ${p.code}</p>
        <h2>${esc(p.name)}</h2>
        <p class="eyebrow" style="margin-top:8px">${esc(p.sub)}</p>
        <p class="lede" style="margin:20px 0 0">${esc(p.lede)}</p>
${gmap(p.route, p.mode, 'Plan ' + p.code + ' 路線地圖')}
        <ul class="tl" style="margin-top:26px">
${p.rows
  .map(
    ([t, what, small]) =>
      `          <li><span class="t">${esc(t)}</span><span class="what"><b>${esc(what)}</b>` +
      (small ? `<small>${esc(small)}</small>` : '') +
      '</span></li>'
  )
  .join('\n')}
        </ul>
        <div class="notes"><div class="note"><strong>Remarks</strong>${esc(p.foot)}</div></div>
      </section>`
  )
  .join('\n');

const hanoiBody = `      <header class="phead">
        <p class="eyebrow eyebrow--rust">Field notes · Hà Nội</p>
        <h1>河內 2 日</h1>
        <p class="place">星期日 + 星期六 · 老城 · 巴亭 · 西湖</p>
      </header>

      <p class="lede" style="margin:24px 0 0;max-width:52ch;color:var(--ink-soft)">${esc(hanoi2.lede)}</p>

      <dl class="facts" style="margin-top:28px">
      ${hFacts}
      </dl>

      <div class="tabs" role="tablist" aria-label="河內 2 日">
        <button role="tab" id="t-pick" aria-controls="p-pick" aria-selected="true">點揀</button>
        <button role="tab" id="t-a" aria-controls="p-a" aria-selected="false">A 老城</button>
        <button role="tab" id="t-b" aria-controls="p-b" aria-selected="false">B 巴亭</button>
        <button role="tab" id="t-c" aria-controls="p-c" aria-selected="false">C 冷門</button>
        <button role="tab" id="t-food" aria-controls="p-food" aria-selected="false">食</button>
        <button role="tab" id="t-drink" aria-controls="p-drink" aria-selected="false">飲</button>
        <button role="tab" id="t-stay" aria-controls="p-stay" aria-selected="false">住</button>
        <button role="tab" id="t-places" aria-controls="p-places" aria-selected="false">景點池</button>
        <button role="tab" id="t-src" aria-controls="p-src" aria-selected="false">來源</button>
      </div>

      <section class="panel" id="p-pick" role="tabpanel" aria-labelledby="t-pick">
        <p class="eyebrow eyebrow--rust">Recommendation</p>
        <h2>${esc(hanoi2.callout.h)}</h2>
        <p class="lede" style="margin:14px 0 0">${esc(hanoi2.callout.p)}</p>

        <div class="notes" style="margin-top:32px">
${hRules}
        </div>

        <h3 style="margin-top:44px">唔去會後悔</h3>
        <ul class="plainlist">
${hMusts}
        </ul>

        <p class="eyebrow" style="margin-top:22px">時間、門票以 Google 地圖同現場為準。出發前一晚再查一次。</p>
      </section>

${hPanels}

      <section class="panel" id="p-food" role="tabpanel" aria-labelledby="t-food" hidden>
        <h2>食乜</h2>
        <p class="lede" style="margin:14px 0 28px">河內規矩：河粉係早餐，bún chả 係午餐。下午三點想食 bún chả 係搵唔到嘅。</p>
${hFood}
      </section>

      <section class="panel" id="p-drink" role="tabpanel" aria-labelledby="t-drink" hidden>
        <h2>飲乜</h2>
        <p class="lede" style="margin:14px 0 28px">早上 phin 黑咖啡，下午蛋咖啡，黃昏 bia hơi，夜晚熱檸茶。</p>
        <div class="tablewrap">
        <table class="table">
          <thead><tr><th>店 / 飲乜</th><th>價</th><th></th></tr></thead>
          <tbody>
${hDrinks}
          </tbody>
        </table>
        </div>
      </section>

      <section class="panel" id="p-stay" role="tabpanel" aria-labelledby="t-stay" hidden>
        <h2>住邊</h2>
        <p class="lede" style="margin:14px 0 28px">老城區落腳，行去還劍湖 5 分鐘就夠。以下三間我逐間對過 Booking 評分（2026-11），房價隨日期變，撳入去用你嘅日期再核。</p>
        <ul class="plainlist staylist">
${hStays}
        </ul>
        <p class="eyebrow" style="margin-top:22px">
          <a class="mlink" href="https://www.booking.com/searchresults.html?ss=Hanoi%20Old%20Quarter&amp;nflt=review_score%3D90" target="_blank" rel="noopener">Booking.com：老城區 9 分以上 ↗</a>
        </p>
      </section>

      <section class="panel" id="p-places" role="tabpanel" aria-labelledby="t-places" hidden>
        <h2>景點池</h2>
        <p class="lede" style="margin:14px 0 28px">三組，自己揀。A 步行、B 搭車、C 避人。</p>
${hPlaceGroups}
      </section>

      <section class="panel" id="p-src" role="tabpanel" aria-labelledby="t-src" hidden>
        <h2>資料來源</h2>
        <p class="lede" style="margin:14px 0 28px">全部真實存在，可以自己覆核。價錢同營業時間會變，落單前再確認。</p>
        <ul class="srclist">
${hSources}
        </ul>

        <h3 style="margin-top:44px">相片授權</h3>
        <p class="eyebrow" style="margin:6px 0 14px">全部 Wikimedia Commons，自由授權</p>
        <ul class="srclist">
${credits
  .map(
    (c) =>
      `          <li><a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.title).replace(/%20/g, '_')}" target="_blank" rel="noopener">${esc(c.title)}</a><span>${esc(c.artist)} · ${esc(c.license)}</span></li>`
  )
  .join('\n')}
        </ul>
      </section>

      <nav class="pager">
        <a href="book.html"><span class="k">上一頁</span><span class="v">預訂清單</span></a>
        <a href="index.html"><span class="k">返去</span><span class="v">總覽</span></a>
      </nav>

      <footer class="foot">
        <span>Hanoi · 2 days</span>
        <span>${esc(SITE)}</span>
      </footer>`;

/* ---------------- write ---------------- */

writeFileSync('index.html', page({ active: 'index.html', title: '總覽', body: indexBody }), 'utf8');
for (const d of days) {
  writeFileSync(`day-${d.n}.html`, page({ active: `day-${d.n}.html`, title: d.title, body: dayPage(d) }), 'utf8');
}
writeFileSync('book.html', page({ active: 'book.html', title: '預訂清單', body: bookBody }), 'utf8');
writeFileSync('hanoi-2day.html', page({ active: 'hanoi-2day.html', title: '河內 2 日', body: hanoiBody }), 'utf8');

console.log(`built ${days.length + 3} pages`);
