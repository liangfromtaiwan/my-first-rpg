# Firebase 登入檢查清單

專案使用 **Firebase Authentication（Google 登入）**。若無法登入，請依下列步驟在 Firebase Console 檢查設定。

專案 ID：`social-village-game`

---

## 1. 啟用 Google 登入

1. 開啟：**[Sign-in method](https://console.firebase.google.com/project/social-village-game/authentication/providers)**
2. 找到 **Google** 這一列。
3. 點 **Google** 右側的筆／編輯。
4. 將 **Enable** 開關打開。
5. 選一個 **Project support email**（專案支援用信箱）。
6. 點 **Save**。

若 Google 已是啟用狀態，仍無法登入，請檢查下一步「授權網域」。

---

## 2. 授權網域（Authorized domains）

登入時使用的「網址」必須在授權網域清單裡，否則會出現 `auth/unauthorized-domain`。

1. 開啟：**[Authentication → Settings（授權網域）](https://console.firebase.google.com/project/social-village-game/authentication/settings)**
2. 捲到 **Authorized domains**。
3. 確認以下網域**都有**在清單中（沒有就按 **Add domain** 新增）：

   | 網域 | 用途 |
   |------|------|
   | `localhost` | 本地開發，例如 `http://localhost:3456` |
   | `127.0.0.1` | 若你是用 `http://127.0.0.1:3456` 開，必須加這個 |
   | `liangfromtaiwan.github.io` | GitHub Pages 線上版 |

4. 儲存後**重新整理遊戲頁**再試一次登入。

注意：`localhost` 和 `127.0.0.1` 在 Firebase 是不同網域，兩個都要加。

---

## 3. 專案總覽（可選）

- **[專案總覽](https://console.firebase.google.com/project/social-village-game)**  
  可確認專案名稱、方案、以及 Authentication 是否已啟用。

---

## 4. 常見錯誤對照

| 畫面上／Console 錯誤碼 | 可能原因 | 對應動作 |
|------------------------|----------|----------|
| `auth/unauthorized-domain` | 目前網址不在授權網域 | 在 Authorized domains 加上 `localhost`、`127.0.0.1` 或 `liangfromtaiwan.github.io` |
| `auth/operation-not-allowed` | Google 登入未啟用 | 在 Sign-in method 啟用 Google |
| `auth/popup-blocked` | 瀏覽器擋彈窗 | 程式會自動改為整頁導向登入；或改用 Chrome/Safari 直接開網址 |
| `auth/network-request-failed` | 網路或防火牆問題 | 檢查網路、VPN、公司防火牆 |

---

## 快速連結

- [Sign-in method（啟用 Google）](https://console.firebase.google.com/project/social-village-game/authentication/providers)
- [Authorized domains（授權網域）](https://console.firebase.google.com/project/social-village-game/authentication/settings)
- [專案總覽](https://console.firebase.google.com/project/social-village-game)

完成上述設定後，請**重新整理遊戲頁**再試登入。
