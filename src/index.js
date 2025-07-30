import { connectMqtt } from './mqtt.js';
import { initZigbee } from './zigbee.js';
import config from './config.js';

(async () => {
  const zigbee = await initZigbee(config.zigbee_port);
  const mqtt = await connectMqtt(config);

  mqtt.subscribe('zigbee/cmd/#');

  mqtt.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (payload.action === 'permit_join') {
        await zigbee.permitJoin(true);
        console.log('[ZIGBEE] 允許設備加入模式已啟用');
      } else if (payload.action === 'remove') {
        await zigbee.removeDevice(payload.device);
        console.log(`[ZIGBEE] 已移除設備: ${payload.device}`);
      } else if (payload.action === 'control') {
        await zigbee.sendCommand(payload.device, payload.command, payload.params || {});
        console.log(`[ZIGBEE] 已發送控制指令: ${payload.device} - ${payload.command}`);
      }
    } catch (e) {
      console.error('[MQTT] 解析指令失敗', e);
    }
  });

  // 監聽所有 Zigbee 事件
  zigbee.on('deviceEvent', (deviceId, eventData) => {
    const topic = `zigbee/events/${eventData.type}/${deviceId}`;
    mqtt.publish(topic, JSON.stringify(eventData));
    console.log(`[MQTT] 發布事件到 ${topic}`);
  });
})();
