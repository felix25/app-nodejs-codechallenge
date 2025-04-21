const express = require('express');
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const schema = require('../graphql/schema');

const {
  createTransaction,
  getTransactionById,
  getAllTransactions,
} = require('../services/transactionService');

/**
 * @module routes/transaction
 * @description Routes for operations with transactions.
 */

/**
 * @route POST /transactions
 * @group Transactions - Transaction-related operations
 * @param {string} accountExternalIdDebit.body.required - External ID of the debiting account
 * @param {string} accountExternalIdCredit.body.required - External ID of the account being credited
 * @param {number} amount.body.required - Transaction amount
 * @returns {object} 201 - Transaction created
 * @returns {Error} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const { accountExternalIdDebit, accountExternalIdCredit, amount } = req.body;
    const transaction = await createTransaction({ accountExternalIdDebit, accountExternalIdCredit, amount });
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /transactions/:id
 * @group Transactions - Transaction-related operations
 * @param {string} id.path.required - Transaction ID
 * @returns {object} 200 - Transaction details
 * @returns {Error} 404 - Transaction not found
 * @returns {Error} 500 - Server Error
 */
router.get('/:id', async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /transactions
 * @group Transactions - Transaction-related operations
 * @returns {object[]} 200 - List of all transactions
 * @returns {Error} 500 - Server Error
 */
router.get('/', async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

module.exports = router;
