const app = require('./app');
const { sequelize } = require('./models');
const { producer } = require('./kafka/producer');
const { initConsumer } = require('./kafka/consumer');

/**
 * Please wait for the database to become available by attempting to connect several times.
 *
 * @param {number} [retries=10] - Number of reconnection attempts
 * @throws {Error} If the connection cannot be established after several attempts
 * @returns {Promise<void>}
 */
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

/**
 * Start the transaction service:
 * - Wait for connection to the database
 * - Synchronize the models
 * - Connect Kafka producer
 * - Initialize the Kafka consumer
 * - Levanta el servidor Express en el puerto 3000
 *
 * @returns {Promise<void>}
 */
const start = async () => {
  await waitForDB();
  await sequelize.sync();
  await producer.connect();
  await initConsumer();

  app.listen(3000, () => {
    console.log('🚀 Transaction service running on port 3000');
  });
};

start();
