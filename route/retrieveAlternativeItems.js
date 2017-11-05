var Transactions = require('../model/transactionData');

module.exports = function(req, res) {
  Transactions.find({}, function(err, results){
    if (err) throw err;
    console.log("Sending data.");
    res.send(results);
  })
};