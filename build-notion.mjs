// 由 content/site.mjs 生成 Notion 可直接匯入的 Markdown。
// 用法：node build-notion.mjs　→　notion/ 資料夾
// 匯入：Notion → Settings → Import → Markdown & CSV → 揀 notion/ 個 zip

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { trip, days, booking, hanoi2 } from './content/site.mjs';

const ROOT = 'notion';
const TRIP = '河內沙壩 2026';
const DIR = `${ROOT}/${TRIP}`;

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const dayDate = (n) => {
  const start = new Date((trip.start || '2026-11-22') + 'T00:00:00');
  const d = new Date(start.getTime() + (n - 1) * 86400000);
  return `${d.getDate()} ${MON[d.getMonth()]}`;
};
const pad = (n) => String(n).padStart(2, '0');

const LEAD = (d) => {
  if (d >= 30) return `${Math.round(d / 30)} 個月前`;
  if (d >= 14 && d % 7 === 0) return `${d / 7} 星期前`;
  if (d === 1) return '抵達當晚';
  if (d === 0) return '現場';
  return `${d} 日前`;
};

rmSync(ROOT, { recursive: true, force: true });
mkdirSync(DIR, { recursive: true });

/* ---------- 主頁 ---------- */

const overview = `# ${trip.title}

> ${trip.lede}
>
> **${trip.dates}** · 7 夜 8 日 · 3 個地方

## 一覽

| 項目 | 內容 |
| --- | --- |
${trip.summary.map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

## 路線

${trip.route
  .map(([p, leg], i) => (i === 0 ? `- **${p}**` : `- ↓ ${leg} → **${p}**`))
  .join('\n')}

## 逐日

${days
  .map(
    (d) =>
      `### Day ${pad(d.n)} · ${d.wd} ${dayDate(d.n)} — ${d.title}\n${d.place}\n\n${d.lead.split('。')[0]}。`
  )
  .join('\n\n')}

## 三個會出事嘅位

${trip.risks.map((r) => `> **${r.n} · ${r.h}**\n> ${r.p}`).join('\n\n')}

## 預算

| 項目 | HK$ |
| --- | --- |
${trip.budget.map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

*${trip.budgetNote}*

## 子頁

- 逐日行程見下面每一頁
- 預訂清單：\`Checklist\`
- 河內 2 日研究：\`Hanoi 2 days\`
`;

writeFileSync(`${DIR}/${TRIP}.md`, overview, 'utf8');

/* ---------- 逐日 ---------- */

for (const d of days) {
  const rows = d.rows
    .map(([t, what, small]) => `| ${t} | ${what} | ${small || ''} |`)
    .join('\n');

  const notes = (d.notes || [])
    .map((n) => `> ${n.kind === 'warn' ? '⚠️ ' : 'ℹ️ '}**${n.k}** ${n.v}`)
    .join('\n\n');

  const md = `# Day ${pad(d.n)} · ${d.wd} ${dayDate(d.n)} — ${d.title}

*${d.place}*

> ${d.lead}

## 重點

| | |
| --- | --- |
${d.facts.map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

## 時間表

| 時間 | 做乜 | 備註 |
| --- | --- | --- |
${rows}

${notes ? `## 注意\n\n${notes}` : ''}
`;

  writeFileSync(`${DIR}/Day ${pad(d.n)} · ${dayDate(d.n)} ${d.title}.md`, md, 'utf8');
}

/* ---------- checklist ---------- */

const checklist = `# Checklist

勾選狀態跟 Notion 帳號，手機同電腦都同步。

${booking
  .map((g) => {
    const items = g.items
      .map(
        (i) =>
          `- [ ] **${i.label}** — ${i.kind === 'book' ? LEAD(i.lead) : '唔使訂'}` +
          (i.note ? `\n\t- ${i.note}` : '')
      )
      .join('\n');
    return `## ${g.day === 0 ? '出發前' : `Day ${pad(g.day)} · ${g.wd} — ${g.title}`}\n\n${items}`;
  })
  .join('\n\n')}
`;

writeFileSync(`${DIR}/Checklist.md`, checklist, 'utf8');

/* ---------- hanoi2 ---------- */

if (hanoi2) {
  const parts = [`# 河內 2 日\n\n${hanoi2.lede || ''}\n`];

  const section = (title, list, cols) => {
    if (!list || !list.length) return;
    parts.push(`## ${title}\n`);
    parts.push(`| ${cols.join(' | ')} |`);
    parts.push(`| ${cols.map(() => '---').join(' | ')} |`);
    for (const row of list) {
      const cells = Array.isArray(row) ? row : Object.values(row);
      parts.push(`| ${cells.slice(0, cols.length).map((c) => String(c ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
    }
    parts.push('');
  };

  if (hanoi2.plans) {
    for (const p of hanoi2.plans) {
      parts.push(`## Plan ${p.code} — ${p.title}`);
      parts.push(`> ${p.lead || ''}`);
      if (p.stops) {
        for (const s of p.stops) {
          parts.push(`- **${s[0]}** — ${s[1] || ''} ${s[2] ? `(${s[2]})` : ''}`);
        }
      }
      parts.push('');
    }
  }

  section('食', hanoi2.food, ['店', '食乜', '價錢', '地圖']);
  section('飲', hanoi2.drinks, ['店', '飲乜', '價錢', '地圖']);
  section('法餐', hanoi2.french, ['餐廳', '特色', '價錢']);

  if (hanoi2.stays) {
    parts.push('## 住\n');
    for (const s of hanoi2.stays) {
      parts.push(`- **${s.name}** · ${s.area} · ${s.tier} · ${s.price}\n\t- ${s.why}`);
    }
  }

  if (hanoi2.sources) {
    parts.push('\n## 來源\n');
    for (const s of hanoi2.sources) {
      parts.push(`- [${s[0]}](${s[1]}) — ${s[2] || ''}`);
    }
  }

  writeFileSync(`${DIR}/Hanoi 2 days.md`, parts.join('\n'), 'utf8');
}

console.log(`notion: ${days.length + 3} files in ${DIR}`);
