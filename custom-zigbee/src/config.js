import fs from "fs";

const raw = fs.readFileSync("/data/options.json", "utf8");
const options = JSON.parse(raw);

export default {
  mqtt_host: options.mqtt_host,
  mqtt_port: options.mqtt_port,
  mqtt_user: options.mqtt_user,
  mqtt_pass: options.mqtt_pass,
  zigbee_port: null, // 讓 zigbee-herdsman 自動偵測
};
