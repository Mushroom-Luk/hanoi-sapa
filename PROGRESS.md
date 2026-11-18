# 進度追蹤 — F:\Travel

> 每次被中斷都睇呢個檔。開工前讀，做完更新。

更新：2026-11-18

## 已完成

- [x] browse 安裝 + 連接 Chrome
- [x] AGENTS.md：廣東話 + ADHD 風格規則
- [x] i-have-adhd skill（`.opencode/skills/`）
- [x] **v2 網站重建**：多頁靜態站，編輯風時間表
  - `index.html`、`day-1..7.html`、`book.html`（共 9 頁）
  - `assets/style.css`（design system）、`assets/site.js`
  - `content/site.mjs`（內容單一來源）+ `build.mjs`（生成器）
  - `DESIGN.md`（設計規格，含參考來源）
  - `assets/img/`：3 張 Wikimedia 相片
- [x] 舊單頁版已刪（git 有紀錄，可還原）
- [x] `serve.mjs`：本機預覽，正確 MIME（port 8766）
- [x] **河內 2 日頁**：`hanoi-2day.html`（導航 08），9 個 tab（點揀 / A / B / C / 食 / 飲 / 住 / 景點池 / 來源），52 個 Google Maps 連結 + 6 個 embed 地圖；資料放 `content/site.mjs` 的 `hanoi2`
- [x] **43 張相**：`fetch-images.mjs` 由 Wikimedia Commons 抓 480px 縮圖 → `assets/img/hanoi/`，授權寫入 `content/images.mjs`，逐張列在「來源」tab
- [x] **住**：Booking 評分核對 3 間（La Siesta 9.7 / Emerald Waters 9.5 / Buffalo 8.8）

- [x] **沙壩段改成 Plan A（3 個獨立日，唔用 2日1夜）**
  - Day 3 改直達：下龍灣 11:00 落船 → 13:00 Daiichi → 21:30 沙壩（0 轉車）
  - Day 4 行山（Y Linh Hồ–Lao Chải–Tả Van）→ 貓貓村 → Moana → 夜市
  - Day 5 番西邦（當朝望窗決定，可同 Day 6 對調）
  - Day 6 包車 8h：銀瀑布 → 玻璃橋 → O Quy Ho → 19:15 去老街 → 夜火車
  - `trip` 的 risks / budget / route 同步更新；`booking` 改成 6 項

## 進行中

- [ ] GitHub repo + push（未裝 `gh`，要用戶登入）
- [ ] Cloudflare Pages 部署
- [ ] 用戶未確認 v2 設計方向

## 待用戶決定

- [ ] 設計方向：v2 編輯風 收貨？定要試另一個方向？
- [ ] 行程 A（郵輪先）定 B（沙壩先）
- [ ] 出發日期、人數、航班、預算級別
- [ ] repo public / private

## 已知狀態

- 預覽：`http://127.0.0.1:8766/index.html`（`node serve.mjs 8766`）
- 舊 server 8765 仲跑住（可殺）
- git：main，用戶 Musroom / mushroomluk@gmail.com
- 改內容 → `node build.mjs` → 重新生成
