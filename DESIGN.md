# DESIGN.md — 河內 · 下龍灣 · 沙壩

> 呢個檔係設計的「唯一真相」。頁面、tokens、組件全部由佢推導。
> 改設計先改呢度，再改 `assets/style.css`。加新頁見文末。

---

## 0. 參考（Reference）

| 來源 | 拎咗啲乜 |
|---|---|
| [DesignMD · Airbnb](https://www.designmd.co/d/airbnb)（Travel & Hospitality） | DESIGN.md 的結構：token 表、typography scale、layout、components、responsive、known gaps。以及「攝影 + 大量留白 > 字體肌肉」的取向 |
| [DesignMD · Cursor](https://www.designmd.co/d/cursor) | 暖米色編輯底（cream editorial canvas）而唔係純白 |
| [MadeByShape · Itinerary page](https://madebyshape.co.uk/web-design-blog/designing-an-itinerary-page-for-a-rhine-river-trip/) | 頁面骨架：摘要條 → 逐日時間軸 → 靜態路線 → 訂房卡 |
| [myDMC · Typography for itineraries](https://mydmc.app/articles/itinerary-typography) | 三字體制（display serif / body / mono）、tracked mono caps、每標題一個斜體重音 |

**冇抄任何品牌色或 logo。** 拎嘅係結構同判斷，唔係身分。

---

## 1. Overview

一個私人行程網站，唔係旅行社官網。讀者只有一兩個人，通常喺手機、火車上、或者出發前一晚睇。

所以：

- **資訊密度高過裝飾**。呢個係時間表，唔係 landing page。
- **印刷品氣質**。米色紙、細規線、襯線標題、等寬數字。似一本小冊子，唔似 SaaS。
- **真實相片，少量**。三張，全部 Wikimedia Commons，用嚟交代「呢度係邊」，唔係做背景裝飾。
- **冇卡片、冇陰影、冇圓角大塊**。分隔用 1px 規線同留白。

一句話：**編輯部門做的行程表**。

---

## 2. Colour tokens

| Token | Hex | 用途 |
|---|---|---|
| `--paper` | `#f7f3ea` | 底。暖米，唔係純白 |
| `--paper-2` | `#efe9dc` | hover / 次級底 |
| `--ink` | `#1a1d1b` | 主文字、重點規線 |
| `--ink-soft` | `#3c4440` | 段落文字 |
| `--muted` | `#77726a` | 標籤、註腳、時間 |
| `--rule` | `#dcd3c3` | 主要分隔線 |
| `--rule-soft` | `#e8e1d4` | 次級分隔線 |
| `--rust` | `#9c3a20` | 唯一強調色：日號、當前頁、警示 |
| `--green` | `#1f4740` | 極少用：checkbox 勾選 |
| `--gold` | `#b98a3e` | 備用，暫未用 |

**規則：** 一頁只可以有一個強調色出現，而且只出現喺「你而家喺邊」或者「呢度會出事」兩個位置。其他一律用 ink 深淺。

---

## 3. Typography

三種字體，三種工作。唔可以混用。

| 角色 | Stack | 用喺 |
|---|---|---|
| Display（黑體） | `Noto Sans HK, Noto Sans TC, Microsoft JhengHei` 600 | h1/h2/h3、日號、摘要數值 |
| Body（無襯線） | `Noto Sans HK, Noto Sans TC, -apple-system, PingFang HK` | 段落、列表、按鈕 |
| Mono | `ui-monospace, SF Mono, Cascadia Mono, Menlo` | 時間、日期、eyebrow、註腳、token 式標籤 |

**點解唔用襯線**：Windows 冇 `Songti TC`、冇 `Noto Serif TC`，襯線中文會 fallback 去 `PMingLiU`（新細明體），細字發虛、大字似標楷。改用 `Noto Sans HK` 600 做標題，筆畫實、邊緣清。要襯線就要 webfont（Google Fonts `Noto Serif TC`），見 `_design/type-c.html` 對照。

**Scale**

| 用途 | Size | 行高 | 備註 |
|---|---|---|---|
| h1 | clamp(32, 4.4vw, 52) | 1.12 | 襯線，`letter-spacing: -.01em` |
| h2 | clamp(22, 2.6vw, 30) | 1.2 | |
| h3 | 18 | 1.35 | |
| Body | 16.5 | 1.75 | |
| Small | 13.5–14.5 | 1.6 | |
| Mono label | 10–11.5 | 1.5 | `letter-spacing: .13em`, uppercase |

**兩個簽名細節**

1. **Tracked mono caps** 做所有 eyebrow（`VIETNAM · ITINERARY`、`DAY 03 · TUE`）。字距 0.12–0.16em。呢個係「雜誌 section header」同「terminal 輸出」之間唯一嘅分別。
2. **每頁一個斜體重音**，最多。用 `<em>`，唔用粗體。粗體只留俾 timeline 裡面的動作名。

中文唔用襯線做正文（Windows 上細字會糊），襯線只做標題。呢個係刻意偏離 myDMC 原文的地方。

---

## 4. Layout

```
┌──────────┬────────────────────────────┐
│ rail     │ topbar                     │
│ 224px    ├────────────────────────────┤
│ sticky   │ wrap: max 720 + 28 padding │
│          │                            │
└──────────┴────────────────────────────┘
```

- 內容寬度 **720px**。超過就難讀。
- 左欄 224px，`position: sticky`，只放導航。**永遠唔放 CTA 或者廣告。**
- 垂直節奏：區塊之間 56px，區塊內 24px，行內 8px。
- 分隔靠規線：`--ink` 用喺區塊頂（重），`--rule` 用喺行與行（輕）。
- 冇 `border-radius`，除咗手機選單按鈕（3px）。呢個係整站唯一的圓角。

---

## 5. Elevation

**冇。** 零陰影、零模糊、零背景濾鏡（backdrop-filter）。

呢個係硬規則。上一版就係死喺 `backdrop-filter` + `position: sticky` 的組合成個 Chrome 繪製出問題。深度用規線同留白表達，唔用陰影。

---

## 6. Components

| 組件 | 結構 | 規則 |
|---|---|---|
| **Day row**（首頁） | 編號 54px ｜ 標題＋meta ｜ → | 整行可撳，hover 底色變 `--paper-2` 並左移 8px |
| **Timeline**（內頁） | 時間 84px ｜ 內容（＋細字補充） | 第一行頂線用 `--ink`，其餘 `--rule-soft` |
| **Facts** | 2–3 格，1px 規線格 | 唔用背景色填格；空格就咁唔畫 |
| **Strip**（摘要） | 4 格，頂 `--ink` 線 | 數值用襯線，標籤用 mono |
| **Notes** | 左邊 2px 線 | `info` 用 `--rule`，`warn` 用 `--rust` |
| **Table** | 只有橫線 | 數字欄 tabular-nums，右對齊 |
| **Checklist** | 原生 checkbox | 勾選用 `localStorage`，逐部機自己記 |
| **Pager** | 左右兩格 | 最後一頁指向「預訂清單」 |
| **Tabs**（河內 2 日） | 頂線 + 底線，選中用 `--rust` 2px 底線 | 只用喺同一頁分組；keyboard 左右箭嘴 |
| **Thumb** | 64px 正方，跟文字左對齊 | 只喺表內；食物圖可以重複用同一道菜 |
| **Map** | iframe 高 340（手機 260） | 必須有「開完整路線」連結，因為 iframe 會食 scroll |

---

## 7. Responsive

| 斷點 | 行為 |
|---|---|
| ≥ 900px | 左欄 sticky，內容居中 |
| < 900px | 左欄變抽屜（`選單` 按鈕），內容全寬，padding 20px |
| 列印 | 隱藏導航／pager，白底，`break-inside: avoid` |

Facts 用 `auto-fit minmax(150px, 1fr)`，所以 390px 手機會自動變兩欄。

---

## 8. Content rules

- 全部廣東話口語、繁體。專業名詞同地名保留原文：`Vịnh Hạ Long`、`番西邦（Fansipan）`。
- 時間用 24 小時制，寫 `09:00` 唔寫 `9am`。
- 價錢寫 `HK$` 或 `VND`，範圍用 en dash：`950 – 1,600`。
- 每頁第一句要講得出「今日會發生咩事」，唔可以係背景介紹。
- 唔好寫「希望幫到你」類句子。

---

## 9. Known gaps

- 未有真實日期同航班時間，首頁寫「日期待定」。
- 地圖用 Google Maps embed iframe（每個 Plan 一條路線、每個景點組一張區圖），`loading="lazy"`。手機上 iframe 會食 scroll，所以下面永遠有「開完整路線」連結。
- 相片全部 Wikimedia Commons，480px 縮圖，授權逐張列在「來源」tab。正式出街前要再核一次授權字樣。
- 未有分享用的 OG image。

---

## 10. 點樣加一頁

1. 開 `content/site.mjs`，喺 `days` 陣列加一個 object（照抄隔離嗰個改）。
2. 跑 `node build.mjs`。
3. `index.html`、`day-N.html`、導航、上一頁／下一頁全部自動更新。

要加**唔屬於逐日**嘅頁（例如「簽證」、「行李清單」）：
1. 喺 `build.mjs` 底部加一段 `writeFileSync('visa.html', page({...}))`。
2. 喺 `navItems` 陣列加 `{ href: 'visa.html', n: '09', label: '簽證' }`。
3. 跑 `node build.mjs`。

---

*v2 · 2026-11-18*
