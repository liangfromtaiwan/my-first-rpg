# Cursor 規則（.cursor/rules）

本資料夾為 **Cursor 規則** 的存放位置，內含 `.mdc` 規則檔。AI 會依啟用的規則與 glob 條件套用對應規範。

---

## 規則一覽

| 檔案 | 說明 | 預設套用 |
|------|------|----------|
| **company-design-system.mdc** | 公司設計系統總則：tokens（`company-design-system/all-variables.css`）、Admin/Platform 元件與網格、從 Figma 實作公司產品時的流程與驗收。代表公司的產品（POC、admin、platform）一律啟用。 | 否 |
| **ux-writing.mdc** | 介面文案（UX writing）：日文時必讀 Platform UX ライティングガイドライン與用語索引；英文時必讀 Platform UX Writing Guideline。詳見 `company-design-system/ux-writing.md`。 | 否 |
| **auto-push.mdc** | 所有程式碼變更完成後自動執行 `./push.sh` 推送到遠端。 | 是 |

---

## 其他資源（非規則檔）

- **公司設計系統**（tokens、規格、UX writing 說明）位於專案根目錄 **`company-design-system/`**，不在本資料夾。  
- 設計系統內容說明見 **`company-design-system/README.md`**。
