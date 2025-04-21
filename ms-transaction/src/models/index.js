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
  accountExternalIdDebit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountExternalIdCredit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: DataTypes.FLOAT,
  status: DataTypes.STRING,
}, {
  indexes: [
    { fields: ['accountExternalIdDebit'] },
    { fields: ['accountExternalIdCredit'] },
    { fields: ['status'] }
  ]
});


module.exports = { sequelize, Transaction };
