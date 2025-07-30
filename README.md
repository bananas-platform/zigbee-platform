# Bananas Platform Add-ons

這是一個 Home Assistant 附加元件儲存庫，包含自訂的 Zigbee 閘道器插件。

## 包含的附加元件

### Custom Zigbee Gateway
- 🔌 Zigbee 設備管理
- 📡 MQTT 通訊橋接
- 🏠 Home Assistant 整合
- 🔧 多架構支援 (amd64, armv7, aarch64)

## 安裝方式

1. 在 Home Assistant 中前往 **設定** > **附加元件** > **附加元件商店**
2. 點擊右上角的三個點，選擇 **儲存庫**
3. 輸入：`https://github.com/bananas-platform/zigbee-platform`
4. 點擊 **新增**
5. 找到 "Custom Zigbee Gateway" 並點擊安裝

## 配置說明

### 必要設定

- **MQTT 主機**: 您的 MQTT 伺服器地址
- **MQTT 埠號**: MQTT 伺服器埠號 (預設: 1883)
- **MQTT 使用者名稱**: MQTT 認證使用者名稱
- **MQTT 密碼**: MQTT 認證密碼
- **Zigbee 埠**: Zigbee 硬體設備路徑

### 硬體需求

- Sonoff Zigbee 3.0 USB Dongle Plus V2 或相容設備
- 支援的架構：amd64, armv7, aarch64

## 使用方式

### MQTT 主題

#### 接收指令
- `zigbee/cmd/permit_join` - 啟用設備配對模式
- `zigbee/cmd/remove` - 移除設備
- `zigbee/cmd/control` - 控制設備

#### 發布事件
- `zigbee/events/deviceJoined/{deviceId}` - 新設備加入
- `zigbee/events/deviceInterview/{deviceId}` - 設備面試完成
- `zigbee/events/deviceUpdate/{deviceId}` - 設備狀態更新
- `zigbee/events/deviceLeave/{deviceId}` - 設備離開

### 範例指令

```bash
# 啟用配對模式
mosquitto_pub -h your_mqtt_server -t "zigbee/cmd/permit_join" -m '{"action":"permit_join"}'

# 控制設備
mosquitto_pub -h your_mqtt_server -t "zigbee/cmd/control" -m '{"action":"control","device":"0x00158d0009123456","command":"toggle"}'

# 監聽事件
mosquitto_sub -h your_mqtt_server -t "zigbee/events/#"
```

## 授權

MIT License

## 支援

如有問題，請在 GitHub Issues 中提出。 