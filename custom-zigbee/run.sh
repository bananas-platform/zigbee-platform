#!/bin/bash
echo "[INFO] 啟動 Zigbee Gateway Add-on.333333.........."

# 等待系統穩定 (給 HAOS Supervisor 足夠時間掛載 devices)
echo "[INFO] 等待系統穩定..."
sleep 3

# 掃描可用的序列埠設備
echo "[INFO] 掃描可用的序列埠設備..."
echo "=== /dev/serial/by-id/ ==="
ls -la /dev/serial/by-id/ 2>/dev/null || echo "無法存取 /dev/serial/by-id/"
echo "=== /dev/ttyUSB* ==="
ls -la /dev/ttyUSB* 2>/dev/null || echo "找不到 /dev/ttyUSB* 設備"
echo "=== /dev/ttyACM* ==="
ls -la /dev/ttyACM* 2>/dev/null || echo "找不到 /dev/ttyACM* 設備"

# 啟動 Node.js 應用程式
echo "[INFO] 啟動 Node.js 應用程式..."
exec node /app/src/index.js
