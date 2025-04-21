const { Transaction } = require('../models');
const { producer } = require('../kafka/producer');
const { TRANSACTION_CREATED_TOPIC } = require('../kafka/topics');

/**
 * Create a new transaction with the 'pending' status and publish the event to Kafka.
 * 
 * @param {Object} payload - Transaction data
 * @param {string} payload.accountExternalIdDebit - External ID of the debiting account
 * @param {string} payload.accountExternalIdCredit - External ID of the account being credited
 * @param {number} payload.amount - Transaction amount
 * @returns {Promise<Object>} Transaction created
 */
const createTransaction = async (payload) => {
  const transaction = await Transaction.create({
    ...payload,
    status: 'pending',
  });

  await producer.send({
    topic: TRANSACTION_CREATED_TOPIC,
    messages: [{
      key: String(transaction.id),
      value: JSON.stringify(transaction),
    }],
  });

  return transaction;
};

/**
 * Get a transaction by its ID.
 * 
 * @param {string|number} id - Transaction ID
 * @returns {Promise<Object|null>} Transaction found or null if it does not exist
 */
const getTransactionById = async (id) => {
  return Transaction.findByPk(id);
};

/**
 * Updates the status of a transaction.
 * 
 * @param {string|number} id - Transaction ID
 * @param {string} status - New status ('approved', 'rejected')
 * @returns {Promise<void>}
 */
const updateTransactionStatus = async (id, status) => {
  await Transaction.update({ status }, { where: { id } });
};

/**
 * Gets all existing transactions.
 * 
 * @returns {Promise<Object[]>} List of transactions
 */
const getAllTransactions = async () => {
  return Transaction.findAll();
};

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransactionStatus,
  getAllTransactions,
};
