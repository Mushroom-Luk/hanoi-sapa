import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('_design', { recursive: true });
const base = readFileSync('day-3.html', 'utf8');

const variants = {
  'type-a.html': {
    label: 'A · Noto Sans HK 黑體',
    css: `:root{
  --serif:"Noto Sans HK","Noto Sans TC","Microsoft JhengHei",sans-serif;
  --sans:"Noto Sans HK","Noto Sans TC","Microsoft JhengHei",sans-serif;
}
h1,h2,h3{font-weight:600;letter-spacing:-.022em}
h1{font-weight:600}
.dayrow__n,.strip dd,.pager .v{font-weight:500}
p,.tl .what,.dayrow__body p{font-size:15.5px}`,
    head: '',
  },
  'type-b.html': {
    label: 'B · Latin 襯線 + 中文黑體',
    css: `:root{
  --serif:"Palatino Linotype","Iowan Old Style",Georgia,"Noto Sans HK","Noto Sans TC",serif;
  --sans:"Noto Sans HK","Noto Sans TC","Microsoft JhengHei",sans-serif;
}
h1,h2,h3{font-weight:400;letter-spacing:-.005em}
h1{font-size:clamp(34px,4.8vw,56px)}`,
    head: '',
  },
  'type-c.html': {
    label: 'C · 思源宋體 Noto Serif TC（webfont）',
    css: `:root{
  --serif:"Noto Serif TC","Songti TC",Georgia,serif;
  --sans:"Noto Sans TC","Noto Sans HK","Microsoft JhengHei",sans-serif;
}
h1,h2,h3{font-weight:600;letter-spacing:0}
h1{font-size:clamp(32px,4.6vw,54px)}`,
    head: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600&display=swap" rel="stylesheet">',
  },
};

for (const [file, v] of Object.entries(variants)) {
  const html = base
    .replace('</head>', v.head + '\n<style id="type-variant">\n' + v.css + '\n</style>\n</head>')
    .replace('href="assets/', 'href="../assets/')
    .replace('src="assets/', 'src="../assets/');
  writeFileSync('_design/' + file, html, 'utf8');
}
console.log('wrote', Object.keys(variants).join(', '));
