# 「自己的家」資料結構

所有資料存在 Firestore，規則見 `firestore.rules`。

## `homes/{uid}` — 每人一份，只有本人能改

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `ownerUid` | string | 主人的 uid（和文件 id 相同） |
| `ownerName` | string | 顯示在門牌上的暱稱 |
| `template` | string | 家的模板，目前只有 `"cozy"` |
| `floorColor` | string | 地板顏色，例如 `"#b98a5e"` |
| `wallColor` | string | 壁紙顏色 |
| `door` | string | 開門模式：`"open"` 開放、`"knock"` 敲門、`"locked"` 上鎖 |
| `furniture` | array | 家具清單，每件 `{ id, type, x, y }`（`x`、`y` 是格子座標） |
| `createdAt` / `updatedAt` | timestamp | 建立 / 更新時間 |

## `homes/{uid}/guestbook/{entryId}` — 訪客留言

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `authorUid` | string | 留言者（必須是本人） |
| `authorName` | string | 留言者暱稱 |
| `text` | string | 內容，最多 200 字 |
| `createdAt` | timestamp | 留言時間 |

訪客只能以自己的身分留言；主人或留言者本人可以刪除。

## `homes/{uid}/knocks/{visitorUid}` — 敲門

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `visitorName` | string | 訪客暱稱 |
| `status` | string | `"pending"` 等待中、`"accepted"` 已同意、`"declined"` 已婉拒 |
| `createdAt` | timestamp | 敲門時間 |

訪客建立或重新敲門（`pending`）；只有主人能把狀態改成 `accepted` / `declined`。

## 家的地圖

每個家是一張獨立地圖，地圖名稱為 `home_<uid>`，所以玩家位置（`players.mapName`）、
私人聊天與視訊都會自然地只限屋內的人。
