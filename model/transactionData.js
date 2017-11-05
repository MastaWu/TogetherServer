
var mongoose = require('mongoose');

var transactionData = new mongoose.Schema({
  transaction_row_id: Number,
  zipcode: Number,
  month: String,
  rewards_earned: Number,
  amount: Number,
  year: Number,
  country: String,
  day: Number,
  transaction_id: Number,
  merchant_name: String,
  alternativePurchases: [{
    alternative: String,
    category: {
      type: String,
      enum: ['Food', 'Travel', 'Entertainment']
    },
    amount: Number,
    image: String
  }]
});

module.exports = mongoose.model('Transaction', transactionData);