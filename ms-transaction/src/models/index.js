const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:postgres@postgres:5432/postgres');

const Transaction = sequelize.define('Transaction', {
  accountExternalIdDebit: DataTypes.STRING,
  accountExternalIdCredit: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  status: DataTypes.STRING,
});

module.exports = { sequelize, Transaction };
