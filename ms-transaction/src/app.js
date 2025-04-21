const express = require('express');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(express.json());

// Rutas
app.use('/transactions', transactionRoutes);

module.exports = app;
