import mqtt from 'mqtt';

export function connectMqtt(config) {
  const client = mqtt.connect(`mqtt://${config.mqtt_host}:${config.mqtt_port}`, {
    username: config.mqtt_user,
    password: config.mqtt_pass,
    reconnectPeriod: 5000
  });

  client.on('connect', () => console.log('[MQTT] 已連線'));
  client.on('error', (err) => console.error('[MQTT] 連線錯誤', err));
  return client;
}
