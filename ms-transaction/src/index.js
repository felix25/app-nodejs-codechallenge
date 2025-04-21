const express = require('express');
const { Kafka } = require('kafkajs');
const { sequelize, Transaction } = require('./models');

const app = express();
app.use(express.json());

const kafka = new Kafka({ clientId: 'transaction-service', brokers: ['kafka:9092'] });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'transaction-group' });

app.post('/transactions', async (req, res) => {
  const { accountExternalIdDebit, accountExternalIdCredit, amount } = req.body;

  const transaction = await Transaction.create({
    accountExternalIdDebit,
    accountExternalIdCredit,
    amount,
    status: 'pending',
  });

  await producer.send({
    topic: 'transaction-created',
    messages: [{ key: String(transaction.id), value: JSON.stringify(transaction) }],
  });

  res.status(201).json(transaction);
});

const listenEvaluatedTransactions = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-evaluated', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await Transaction.update({ status: data.status }, { where: { id: data.id } });
    },
  });
};
app.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const waitForDB = async (retries = 10) => {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ DB connection established');
      return;
    } catch (err) {
      console.log('⏳ Waiting for DB...');
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  throw new Error('❌ Could not connect to DB after several attempts');
};

app.listen(3000, async () => {
  await waitForDB(); 
  await sequelize.sync();
  await producer.connect();
  listenEvaluatedTransactions();
  console.log('Transaction service running on port 3000');
});
