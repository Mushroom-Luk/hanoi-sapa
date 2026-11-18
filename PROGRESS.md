# 進度追蹤 — F:\Travel

> 每次被中斷都睇呢個檔。開工前讀，做完更新。

更新：2026-11-19

## 2026-11-19：河內 2 日 + 沙壩／郵輪詳細時間表（已 push）

- [x] **河內 2 日最終次序**：Day 1 半日步行（火車街 15:20 → 木偶 18:30 → 夜市）、Day 7 全日（陵墓 08:00 → 文廟 → 皇城 → 監獄 → 鎮國寺日落 → Fabrik 18:00）。木偶放星期日，Fabrik 放星期六。東宣日間市場、民族博物館砍咗，原因寫咗喺頁面。
- [x] **價錢更正**：文廟 70,000、皇城 100,000、火爐監獄 50,000 VND；貓貓村 150,000 VND；玻璃橋 500,000 VND；Daiichi US$27.23／人（約 HK$212）。
- [x] **回程 9G530 更正為 09:15 → 11:55**（之前站內寫 08:55 係錯嘅；EaseMyTrip／KAYAK／Airpaz 都係 09:15）。Day 8 改 06:30 出門、07:15 到機場。去程 UO540 07:35 → 08:50 無變。
- [x] **沙壩 Day 2–6 填晒真實時間**：起身、早餐、每程車、瞓覺。Diana 郵輪 07:40 接、13:00 午餐、15:00 光洞、19:30 晚餐、翌日 10:30 落船；Daiichi 13:00 → 23:00（10 小時，唔係 8.5）；行山 GYG 08:30 出發、12:30 午餐、5 小時；番西邦逐程（單軌 08:00 → 纜車 08:15 → 山頂 09:30–10:30，全套約 1,320,000 VND），雲海最佳 10:00–13:00；玻璃橋＋夜車 23:00 Sleeper VIP 20。
- [x] **酒店揀 Azure Sapa**（4 星、早餐 06:30–09:00、全部房望山谷、early check-in＋外賣早餐）。Cat Cat 係後備。
- [x] **每個景點加 Google Maps 真實 pin**（嗰個地方本身，唔係 category）：巡洲碼頭、光洞、Tra Bau、Azure、Y Linh Ho、Lao Chai、Tả Van、貓貓村、Moana、Sun Plaza、番西邦纜車站／山頂、銀瀑布、玻璃橋、O Quy Ho、石教堂、沙壩市場、夜市。
- [x] **預算加機票**：來回約 HK$1,100–1,400（去程 UO540 約 HK$505–600，回程 9G530 約 HK$330–650；2026-11-19 查價）。全程連機票 HK$4,952–7,172／人。
- [x] **VietGo 河內導遊名單**放返預訂清單（Day 1，c1-3）：https://viet-go.com/en/guides?area=1&sort=reviews&per_page=12#guides-list
- [x] **全站一致性檢查**：夜火車／老街全部改返夜車（沙壩鎮 23:00 開）；Daiichi 8.5 小時／21:30、老街夜火車、23:20 VIP Cabin、08:55 全部清走。

### 未核實／要再確認（寫咗喺頁面，唔好當實）
- 玻璃橋可能閂咗（2026-10-01 起停開，多個 11 月更新話仍然關閉）——星期五朝早經酒店／官網確認；後備 Love Waterfall、Tả Phìn。
- Diana 接送包唔包（官網話基本價唔包）——問清楚 HK$2,550.29 嗰單。
- Daiichi 13:00 班次（11 月 24 日）未喺 12go 查到實；上車點 30A Anh Đào 待確認。
- 23:20 VIP Cabin 未確認；後備 HK Buslines 23:30。

### ⚠️ site.mjs ↔ HTML 已經同步返，但唔好跑 `node build.mjs`
- 今次係 HTML 同 site.mjs 兩邊一齊改，已經對齊。但舊嘅手改 HTML（Agoda 連結等）同 build 輸出仍有出入，未完全對賬。跑 build 之前要先 diff 一次，否則會洗走手改內容。

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
- [x] **河內 2 日頁**：`hanoi-2day.html`（導航 2D），10 個 tab（點揀 / A / B / C / 食 / 飲 / 住 / 法餐 / 景點池 / 來源），52 個 Google Maps 連結 + 6 個 embed 地圖；資料放 `content/site.mjs` 的 `hanoi2`
- [x] **49 張相**：`fetch-images.mjs` 由 Wikimedia Commons 抓 480px 縮圖 → `assets/img/hanoi/`，授權寫入 `content/images.mjs`，逐張列在「來源」tab
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
