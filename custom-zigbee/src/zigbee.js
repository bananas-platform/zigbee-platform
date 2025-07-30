import { Controller } from "zigbee-herdsman";
import fs from "fs";

let controller;

// 嘗試找到可用的 Zigbee 設備
function findZigbeeDevice() {
  const possiblePaths = [
    "/dev/ttyUSB0",
    "/dev/ttyUSB1",
    "/dev/ttyACM0",
    "/dev/ttyACM1",
  ];

  // 檢查 /dev/serial/by-id/ 目錄
  try {
    const byIdPath = "/dev/serial/by-id";
    if (fs.existsSync(byIdPath)) {
      const devices = fs.readdirSync(byIdPath);
      for (const device of devices) {
        if (device.includes("Zigbee") || device.includes("Sonoff")) {
          const fullPath = `${byIdPath}/${device}`;
          console.log(`[ZIGBEE] 找到 Zigbee 設備: ${fullPath}`);
          return fullPath;
        }
      }
    }
  } catch (error) {
    console.log("[ZIGBEE] 無法檢查 /dev/serial/by-id/ 目錄");
  }

  // 檢查常見路徑
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      console.log(`[ZIGBEE] 找到設備: ${path}`);
      return path;
    }
  }

  console.log("[ZIGBEE] 找不到可用的 Zigbee 設備");
  return null;
}

export async function initZigbee(serialPort) {
  console.log(`[ZIGBEE] 初始化 Zigbee 控制器，使用自動偵測模式`);

  // 如果沒有指定設備，嘗試自動偵測
  let devicePath = serialPort;
  if (!devicePath) {
    devicePath = findZigbeeDevice();
  }

  if (!devicePath) {
    throw new Error("無法找到 Zigbee 設備，請檢查設備連接");
  }

  console.log(`[ZIGBEE] 使用設備: ${devicePath}`);

  controller = new Controller({
    serialPort: { path: devicePath },
    databasePath: "/data/zigbee.db",
    network: {
      panId: 0x1234, // 選擇一個 4 位數的十六進位值
      extendedPanId: [0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0], // 8 個位元組的唯一值
      channelList: [15, 20, 25], // 多個頻道備選，避免干擾
    },
  });

  await controller.start();
  console.log("[ZIGBEE] 控制器啟動成功");

  return {
    permitJoin: async (enable) => controller.permitJoin(enable),
    removeDevice: async (ieeeAddr) => controller.removeDevice(ieeeAddr),
    sendCommand: async (ieeeAddr, command, params) => {
      const device = controller.getDeviceByIeeeAddr(ieeeAddr);
      if (!device) return;
      await device.endpoints[0].command("genOnOff", command, params);
    },
    on: (event, handler) => {
      // 監聽新設備加入網路
      controller.on("deviceJoined", (device) => {
        console.log(`[ZIGBEE] 新設備加入: ${device.ieeeAddr}`);
        handler(device.ieeeAddr, {
          type: "deviceJoined",
          device: {
            ieeeAddr: device.ieeeAddr,
            networkAddress: device.networkAddress,
            manufacturerID: device.manufacturerID,
            manufacturerName: device.manufacturerName,
            powerSource: device.powerSource,
            modelID: device.modelID,
            interviewCompleted: device.interviewCompleted,
          },
        });
      });

      // 監聽設備面試完成
      controller.on("deviceInterview", (device) => {
        console.log(`[ZIGBEE] 設備面試完成: ${device.ieeeAddr}`);
        handler(device.ieeeAddr, {
          type: "deviceInterview",
          device: {
            ieeeAddr: device.ieeeAddr,
            networkAddress: device.networkAddress,
            manufacturerID: device.manufacturerID,
            manufacturerName: device.manufacturerName,
            powerSource: device.powerSource,
            modelID: device.modelID,
            interviewCompleted: device.interviewCompleted,
          },
        });
      });

      // 監聽設備狀態更新
      controller.on("deviceAnnounce", (device) => {
        console.log(`[ZIGBEE] 設備狀態更新: ${device.ieeeAddr}`);
        handler(device.ieeeAddr, {
          type: "deviceUpdate",
          device: {
            ieeeAddr: device.ieeeAddr,
            networkAddress: device.networkAddress,
            lastSeen: Date.now(),
          },
        });
      });

      // 監聽設備離開網路
      controller.on("deviceLeave", (device) => {
        console.log(`[ZIGBEE] 設備離開網路: ${device.ieeeAddr}`);
        handler(device.ieeeAddr, {
          type: "deviceLeave",
          device: {
            ieeeAddr: device.ieeeAddr,
          },
        });
      });
    },
  };
}
