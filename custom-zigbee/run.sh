#!/bin/bash
echo "[INFO] 啟動 Zigbee Gateway Add-on..."

# 等待系統穩定
echo "[INFO] 等待系統穩定..."
sleep 3

# 列出所有可用的序列埠設備
echo "[INFO] 掃描可用的序列埠設備..."
echo "=== /dev/serial/by-id/ ==="
ls -la /dev/serial/by-id/ 2>/dev/null || echo "無法存取 /dev/serial/by-id/"

echo "=== /dev/ttyUSB* ==="
ls -la /dev/ttyUSB* 2>/dev/null || echo "找不到 /dev/ttyUSB* 設備"

echo "=== /dev/ttyACM* ==="
ls -la /dev/ttyACM* 2>/dev/null || echo "找不到 /dev/ttyACM* 設備"

# 設定所有找到的設備權限
echo "[INFO] 設定設備權限..."
for device in /dev/ttyUSB* /dev/ttyACM* /dev/serial/by-id/*; do
    if [ -e "$device" ]; then
        echo "設定權限: $device"
        chmod 666 "$device" 2>/dev/null || echo "無法設定權限: $device"
    fi
done

# 啟動應用程式
echo "[INFO] 啟動 Node.js 應用程式..."
exec node /app/src/index.js
