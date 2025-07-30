#!/bin/bash
echo "[INFO] 啟動 Zigbee Gateway Add-on..."

# 啟動 udev
echo "[INFO] 啟動 udev..."
udevd --daemon
udevadm trigger
udevadm settle

# 設定設備權限
echo "[INFO] 設定設備權限..."
chmod 666 /dev/serial/by-id/usb-Itead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_V2_48fcb022c649ef118ac8d18cff00cc63-if00-port0 2>/dev/null || true

# 啟動應用程式
echo "[INFO] 啟動 Node.js 應用程式..."
exec node /app/src/index.js
