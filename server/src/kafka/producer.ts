import { Kafka, type Producer } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID || 'leap-api';

let kafka: Kafka;
let producer: Producer | null = null;

export async function initProducer() {
  kafka = new Kafka({ clientId, brokers });
  producer = kafka.producer();
  await producer.connect();
  console.log('Kafka producer connected', brokers);
}

export async function produceResponseEvent(companyId: string, surveyId: string, response: any) {
  if (!producer) return;
  try {
    await producer.send({
      topic: process.env.KAFKA_TOPIC || 'responses',
      messages: [
        {
          key: String(companyId),
          value: JSON.stringify({ event: 'response.created', companyId, surveyId, response, createdAt: new Date().toISOString() }),
        },
      ],
    });
  } catch (err) {
    console.error('Failed to produce kafka message', err);
  }
}
