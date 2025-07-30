import fs from "fs";
import { execSync } from "child_process";

const raw = fs.readFileSync("/data/options.json", "utf8");
const options = JSON.parse(raw);

// 自動偵測 Zigbee 設備
function findZigbeeDevice() {
  const zigbeePort = options.zigbee_port;

  // 如果使用者指定了特定設備，直接使用
  if (zigbeePort && zigbeePort !== "auto") {
    return zigbeePort;
  }

  // 自動偵測可用的 Zigbee 設備
  const possibleDevices = [
    "/dev/serial/by-id/usb-Itead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_V2_*",
    "/dev/ttyUSB*",
    "/dev/ttyACM*",
  ];

  for (const pattern of possibleDevices) {
    try {
      const devices = execSync(`ls ${pattern}`, { encoding: "utf8" })
        .trim()
        .split("\n");
      for (const device of devices) {
        if (device && device.length > 0) {
          // 如果是符號連結，獲取實際設備路徑
          let actualDevice = device;
          try {
            if (fs.lstatSync(device).isSymbolicLink()) {
              actualDevice = execSync(`readlink -f "${device}"`, { encoding: 'utf8' }).trim();
              console.log(`[CONFIG] 找到 Zigbee 設備: ${device} -> ${actualDevice}`);
            } else {
              console.log(`[CONFIG] 找到 Zigbee 設備: ${device}`);
            }
          } catch (error) {
            console.log(`[CONFIG] 找到 Zigbee 設備: ${device}`);
          }

          return actualDevice;
        }
      }
    } catch (error) {
      // 忽略找不到設備的錯誤
    }
  }

  // 如果找不到設備，使用預設值
  console.log("[CONFIG] 找不到 Zigbee 設備，使用預設路徑");
  return "/dev/ttyUSB0";
}

export default {
  mqtt_host: options.mqtt_host,
  mqtt_port: options.mqtt_port,
  mqtt_user: options.mqtt_user,
  mqtt_pass: options.mqtt_pass,
  zigbee_port: findZigbeeDevice(),
};
