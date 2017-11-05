var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var json = require('./services/recommenderEngine');
var processData = process.env.process || false;
var port = process.env.port || 8080;

mongoose.connect(config.mongo);
var dbConnection = mongoose.connection;
dbConnection.on('open', function () {
    console.log("Connected to our mongo database.");
});

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(morgan('dev'));

if (processData === true) {
    json.processDataAndCreateAlternative();
}

var transactions = require('./route');
app.use('/api/transactions', transactions);

app.listen(port);
console.log("The authentication server has started at port: " + port);