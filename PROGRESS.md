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
