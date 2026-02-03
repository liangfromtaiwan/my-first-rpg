#!/bin/bash

# 監聽檔案變更，自動 add、commit、push
# 使用方式: ./watch-and-push.sh
# 需先安裝 fswatch: brew install fswatch

cd "$(dirname "$0")"

if ! command -v fswatch &> /dev/null; then
  echo "請先安裝 fswatch："
  echo "  brew install fswatch"
  exit 1
fi

echo "👀 開始監聽變更，存檔後會自動 push（按 Ctrl+C 結束）"
echo ""

fswatch -o --exclude '.git' . | while read; do
  sleep 2  # 等 2 秒，避免連續修改觸發多次
  ./push.sh
done
