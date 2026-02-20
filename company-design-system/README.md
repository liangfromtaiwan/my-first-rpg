# 公司設計系統（Company Design System）

本資料夾為公司設計系統的 **token 與規範來源**，供所有在 Cursor 內產出「代表公司」的產品時使用（POC、admin、platform、後台等）。

---

## 資料夾內容

| 檔案 | 說明 |
|------|------|
| **all-variables.css** | 公司唯一 design tokens 來源（顏色、間距、圓角、語意 token `--sem-*` 等）。實作時必須引入，且**禁止硬編碼**色碼或魔術數字。 |
| **Claude-design-system-updates-2026-02-20.md** | 元件規格更新與使用指南（Sidebar、Header、Drawer、網格、token 優先順序、驗收檢查表）。 |
| **README.md** | 本說明（設計師在 Cursor 內如何使用）。 |

---

## 在 Cursor 裡怎麼用

1. **確保規則已啟用**  
   Cursor 規則中請啟用 **「company-design-system」**（公司設計系統總則）。  
   當你製作 POC、admin、platform 或說「用公司設計系統」時，AI 會依該規則與本資料夾產出程式碼。

2. **引入 tokens**  
   在專案 HTML 或主 CSS 中引入：  
   `company-design-system/all-variables.css`  
   （路徑依專案結構調整，例如 `./company-design-system/all-variables.css`）

3. **一律用變數**  
   顏色、間距、圓角、字級等皆使用 `all-variables.css` 內變數，優先順序：  
   **`--sem-*` → `--tokens-*` → `--spacing-*` / `--radius-*` → `--colors-*`**，禁止硬編碼。

---

## 快速參考（Admin / Platform）

| 元件 | 規格 |
|------|------|
| **Sidebar 寬度** | 展開 256px、收合 64px |
| **Sidebar 背景** | `var(--colors-sand-1)` |
| **Sidebar 邊框** | `var(--colors-sand-3)` |
| **Header 高度** | 56px |
| **Header 背景** | `var(--colors-sand-1)` |
| **Drawer 寬度** | 720px |
| **Dialog** | Small 400px / Medium 600px / Large 800px |
| **版面** | 12 欄網格，僅允許 span 12 / 8 / 6 / 4 / 3 |

細節與檢查表見 **Claude-design-system-updates-2026-02-20.md**。

---

## 相關資源

- **Platform UI 範例**（layout、表格、表單、Dialog 參考）：  
  `/Users/liang/Desktop/Design files/company-design-system/examples/Platform`  
  內含登入、側邊選單、Drawer、平台主畫面、Dialog / Alert Dialog 等截圖與說明。

- **Cursor 規則**  
  - **company-design-system**：公司設計系統總則（tokens、元件、網格、Figma 流程、驗收）。製作 POC、admin、platform 時一律啟用此規則即可。

---

**維護**：設計隊長與設計系統團隊。規範若有更新，會同步於本資料夾與 `Claude-design-system-updates-*.md`。
