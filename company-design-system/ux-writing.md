# UX Writing 規則（公司設計系統）

本文件為公司產品介面文案（UX writing / microcopy）的統一規範，凡按鈕、標籤、錯誤訊息、通知、引導流程、說明文字等**使用者可見文案**皆須遵守。

**語系與必讀文件：**

- **撰寫日文時**：必讀 **Platform UX ライティングガイドライン** 與 **用語索引**（路徑見下）。
- **撰寫英文時**：必讀 **Platform UX Writing Guideline**（路徑見下）。

---

## 一、何時套用本規則

- 撰寫 UI 微文案（按鈕、標籤、tooltip、placeholder）
- 撰寫錯誤訊息、通知、成功/警告提示
- 撰寫 onboarding、引導流程、使用說明
- 撰寫產品描述、說明文字、幫助內容
- 任何**使用者會看到的產品文案**

---

## 二、英文 UX Writing（English）— 使用英文時必讀

**必參照**：以下檔案與資料夾。

| 類型 | 路徑 |
|------|------|
| 資料夾 | `/Users/liang/Downloads/Private & Shared 2/Platform UX Writing Guideline` |
| 主文件 | `/Users/liang/Downloads/Private & Shared 2/Platform UX Writing Guideline 22673b65c91481778eaaec2abead2c1c.md` |

**摘要**（主文件內規範）：

| 項目 | 規範 |
|------|------|
| **Voice（個性）** | helpful, professional, concise（有幫助、專業、簡潔） |
| **Tone（語氣）** | supportive, clear, neutral（支持性、清楚、中性） |
| **目標使用者** | 成人專業者（教師、開發者、業務等），可接受適度專業或進階用語，但**避免過於艱澀的術語**，以清晰與可及性為優先。 |
| **用語查證** | 不確定某詞是否通用時，可用 [Google Trends](https://trends.google.com/trends/) 確認該領域是否常用。 |

撰寫英文介面文案時，須先讀上述 Guideline 與同資料夾內相關檔案（含術語表等），並符合上述 voice/tone。

---

## 三、日文 UX Writing（Japanese）— 使用日文時必讀

**必參照**：以下兩組檔案與資料夾。

### 3.1 Platform UX ライティングガイドライン

| 類型 | 路徑 |
|------|------|
| 資料夾 | `/Users/liang/Downloads/Private & Shared 3/Platform UXライティングガイドライン` |
| 主文件 | `/Users/liang/Downloads/Private & Shared 3/Platform UXライティングガイドライン 22673b65c9148038a403e9c5e352b42f.md` |

- 日文介面文案的完整書寫準則；主文件內含清單／CSV 連結，實務時須一併參照同資料夾內容。

### 3.2 用語索引

| 類型 | 路徑 |
|------|------|
| 資料夾 | `/Users/liang/Downloads/Private & Shared 4/用語索引` |
| 主文件 | `/Users/liang/Downloads/Private & Shared 4/用語索引 22673b65c91480418e22ed5dc6381255.md` |

- 已核准的日文用語與用詞選擇；撰寫日文時須**優先採用索引內用語**，以維持全產品一致。

撰寫日文介面文案前，須先閱讀上述兩份主文件與其資料夾內相關檔案（含 CSV／清單），確保用詞與既有標準一致。

---

## 四、與 Cursor 的搭配

- 在 Cursor 中啟用 **ux-writing** 規則（`.cursor/rules/ux-writing.mdc`）後，AI 在產出或修改介面文案時會依本文件與上述**依語系對應的** Guideline／用語索引執行。
- 本文件位於 **`company-design-system/ux-writing.md`**，與公司設計系統其他規範（tokens、元件、版面）同屬一體，可一併提供給設計師與開發者使用。
