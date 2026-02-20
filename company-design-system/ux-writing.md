# UX Writing 規則（公司設計系統）

本文件為公司產品介面文案（UX writing / microcopy）的統一規範，凡按鈕、標籤、錯誤訊息、通知、引導流程、說明文字等**使用者可見文案**皆須遵守。內容整合自 **skill-ux-writing**（`/Users/liang/Downloads/skill-ux-writing.skill`）。

---

## 一、何時套用本規則

- 撰寫 UI 微文案（按鈕、標籤、tooltip、placeholder）
- 撰寫錯誤訊息、通知、成功/警告提示
- 撰寫 onboarding、引導流程、使用說明
- 撰寫產品描述、說明文字、幫助內容
- 任何**使用者會看到的產品文案**

---

## 二、英文 UX Writing（English）

**必參照**：skill 內 `assets/Platform_UX_Writing_Guideline_*.md`（Platform UX Writing Guideline）。

| 項目 | 規範 |
|------|------|
| **Voice（個性）** | helpful, professional, concise（有幫助、專業、簡潔） |
| **Tone（語氣）** | supportive, clear, neutral（支持性、清楚、中性） |
| **目標使用者** | 成人專業者（教師、開發者、業務等），可接受適度專業或進階用語，但**避免過於艱澀的術語**，以清晰與可及性為優先。 |
| **用語查證** | 不確定某詞是否通用時，可用 [Google Trends](https://trends.google.com/trends/) 確認該領域是否常用。 |

撰寫英文介面文案時，須符合上述 voice/tone，並與既有 Platform 術語與風格一致（詳見 skill 內 Guideline 與術語表）。

---

## 三、日文 UX Writing（Japanese）

**必參照**：skill 內下列兩份文件。

1. **Platform UX ライティングガイドライン**  
   `assets/Platform_UXライティングガイドライン_*.md`  
   - 日文介面文案的完整書寫準則。

2. **用語索引**  
   `assets/用語索引_*.md`  
   - 已核准的日文用語與用詞選擇，撰寫時須優先採用索引內用語，以維持一致性。

撰寫日文介面文案前，須先閱讀上述兩份文件，確保用詞與既有標準一致。

---

## 四、Skill 來源說明

- **檔案**：`/Users/liang/Downloads/skill-ux-writing.skill`（Zip 格式，內含 SKILL.md 與 assets）。
- **用途**：定義 Platform 英文／日文 UX writing 的 voice、tone、目標對象與術語；本規則已將其中要點整合於上，實務撰寫時仍可回查 skill 內原始 assets 以對照細部術語與範例。

---

## 五、與 Cursor 的搭配

- 在 Cursor 中啟用 **ux-writing** 規則（`.cursor/rules/ux-writing.mdc`）後，AI 在產出或修改介面文案時會依本文件與上述英文／日文規範執行。
- 本文件位於 **`company-design-system/ux-writing.md`**，與公司設計系統其他規範（tokens、元件、版面）同屬一體，可一併提供給設計師與開發者使用。
