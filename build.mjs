// 靜態網站生成器：node build.mjs
// 改 content/site.mjs 之後跑一次，就會重新出 index.html / day-N.html / book.html。

import { writeFileSync } from 'node:fs';
import { trip, days, booking } from './content/site.mjs';

const SITE = '河內 · 下龍灣 · 沙壩';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const navItems = [
  { href: 'index.html', n: '00', label: '總覽' },
  ...days.map((d) => ({ href: `day-${d.n}.html`, n: String(d.n).padStart(2, '0'), label: d.title })),
  { href: 'book.html', n: '08', label: '預訂清單' },
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

/* ---------------- write ---------------- */

writeFileSync('index.html', page({ active: 'index.html', title: '總覽', body: indexBody }), 'utf8');
for (const d of days) {
  writeFileSync(`day-${d.n}.html`, page({ active: `day-${d.n}.html`, title: d.title, body: dayPage(d) }), 'utf8');
}
writeFileSync('book.html', page({ active: 'book.html', title: '預訂清單', body: bookBody }), 'utf8');

console.log(`built ${days.length + 2} pages`);
