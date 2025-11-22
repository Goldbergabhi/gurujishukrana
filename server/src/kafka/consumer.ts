import { Kafka } from 'kafkajs';
import { publishEvent } from '../sse';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID || 'leap-sse';
const groupId = process.env.KAFKA_GROUP_ID || 'leap-sse-group';

export async function startConsumer() {
  const kafka = new Kafka({ clientId, brokers });
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || 'responses', fromBeginning: false });
  console.log('Kafka consumer connected, subscribed to', process.env.KAFKA_TOPIC || 'responses');

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      try {
        const payload = JSON.parse(message.value.toString());
        // forward payload to SSE clients
        publishEvent(payload.event || 'response', payload);
      } catch (err) {
        console.error('Failed to parse kafka message', err);
      }
    },
  });
}
