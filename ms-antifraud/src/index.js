const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'antifraud-service', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'antifraud-group' });
const producer = kafka.producer();

const evaluateTransaction = (transaction) => {
  return transaction.amount > 1000 ? 'rejected' : 'approved';
};

const run = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: 'transaction-created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const transaction = JSON.parse(message.value.toString());
      const status = evaluateTransaction(transaction);

      await producer.send({
        topic: 'transaction-evaluated',
        messages: [{ key: String(transaction.id), value: JSON.stringify({ id: transaction.id, status }) }],
      });
    },
  });
};

run();
