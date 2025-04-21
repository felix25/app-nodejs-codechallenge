const { Kafka } = require('kafkajs');
const { updateTransactionStatus } = require('../services/transactionService');
const { TRANSACTION_EVALUATED_TOPIC } = require('./topics');

const kafka = new Kafka({ clientId: 'transaction-service', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'transaction-group' });

/**
 * Initializes the Kafka consumer, subscribes to the `TRANSACTION_EVALUATED_TOPIC`,
 * and processes incoming messages to update the transaction status.
 * 
 * @async
 * @function initConsumer
 * @returns {Promise<void>} Resolves when the consumer is connected and ready to process messages.
 */
const initConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: TRANSACTION_EVALUATED_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await updateTransactionStatus(data.id, data.status);
    },
  });
};

module.exports = { initConsumer };
