var transactions = require('express').Router();
var alternativeItems = require('./retrieveAlternativeItems');

transactions.get('/getAllTransactions', alternativeItems);

module.exports = transactions;