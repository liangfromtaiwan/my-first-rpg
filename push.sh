#!/bin/bash

# 自動 add、commit、push 腳本
# 使用方式: ./push.sh 或 ./push.sh "你的提交說明"

cd "$(dirname "$0")"

# 提交訊息：有帶參數就用參數，否則用時間
MESSAGE="${1:-更新於 $(date '+%Y-%m-%d %H:%M')}"

echo "📦 加入所有變更..."
git add .

echo "📝 建立提交: $MESSAGE"
git commit -m "$MESSAGE"

echo "🚀 推送到遠端..."
git push

echo "✅ 完成！"
