const { Sequelize, DataTypes } = require('sequelize');

/**
 * Sequelize instance connected to the PostgreSQL database.
 * 
 * @type {Sequelize}
 */
const sequelize = new Sequelize('postgres://postgres:postgres@postgres:5432/postgres');

/**
 * Model that represents a transaction between two accounts.
 * 
 * @typedef {Object} Transaction
 * @property {string} accountExternalIdDebit - External ID of the debiting account.
 * @property {string} accountExternalIdCredit - External ID of the account being credited.
 * @property {number} amount - Transaction amount.
 * @property {string} status - Transaction status ('pending', 'completed','rejected').
 */
const Transaction = sequelize.define('Transaction', {
  accountExternalIdDebit: DataTypes.STRING,
  accountExternalIdCredit: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  status: DataTypes.STRING,
});

module.exports = { sequelize, Transaction };
