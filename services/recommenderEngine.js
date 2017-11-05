var fs = require('fs');
var request = require('request');
var config = require('../config');
var Transactions = require('../model/transactionData');
var availableCategories = {
  1: {
    query: "video+games",
    categoryId: "2636"
  },
  2: {
    query: "Movies+and+Tv",
    categoryId: "4096"
  },
  3: {
    query: "jewelry",
    categoryId: "3891"
  },
  4: {
    query: "electronics",
    categoryId: "3944"
  },
  5: {
    query: "food",
    categoryId: "976759"
  }
};

exports.processDataAndCreateAlternative = function () {
  var jsonParsedDataSet;

  fs.readFile('data/transactions.json', function (err, data) {
    if (err) throw err;
    jsonParsedDataSet = JSON.parse(data);

    jsonParsedDataSet.transactions.forEach(
      function (jsonData) {
        if (jsonData.amount > 100) {

          var auth = {
            'auth': {
              'bearer': config.sabreApi.accessToken
            }
          }
          var sabreUrl = 'https://api.test.sabre.com/v2/shop/flights/fares?origin=JFK&lengthofstay=2&maxfare=' + jsonData.amount + '&pointofsalecountry=US&topdestinations=1';
          request.get(sabreUrl,
            auth,
            function (err, response, body) {
              if (err) throw err;
              var jsonResponseData = JSON.parse(response.body);

              for (var i = 0; i < generateRandomNumber(1, 5) && i < jsonResponseData.FareInfo.length; i++) {
                var alternativePurchase = {
                  alternative: "Destination: " + jsonResponseData.FareInfo[0].DestinationLocation,
                  category: "Travel",
                  amount: jsonResponseData.FareInfo[0].LowestFare.Fare
                }
                if (jsonData.alternativePurchases) {
                  jsonData.alternativePurchases.push(alternativePurchase);
                } else {
                  jsonData.alternativePurchases = [alternativePurchase];
                }
              }
              saveData(jsonData);
            }
          );
        } else {
          for (var i = 0; i < generateRandomNumber(1, 4); i++) {
            var selectedCategoriesForAlternatives = generateRandomNumber(1, 5);
            var walmartUrl = 'http://api.walmartlabs.com/v1/search?query=' + availableCategories[selectedCategoriesForAlternatives].query + '&format=json&categoryId=' + availableCategories[selectedCategoriesForAlternatives].categoryId + '&facet=on&facet.range=msrp%3A%5B0+TO+' + Math.ceil(jsonData.amount) + '%5D&apiKey=faxc73jy8yrewfpyfmg33f5b';
            request.get(walmartUrl, {},
              function (err, response, body) {
                if (err) throw err;

                var jsonResponseData = JSON.parse(response.body);

                if (jsonResponseData.items) {
                  var jsonResponseDataItemsLength = jsonResponseData.items.length;

                  for (var i = 0; i < generateRandomNumber(1, 5) && i < jsonResponseDataItemsLength; i++) {

                    var entropyForRecommendations = generateRandomNumber(1, jsonResponseDataItemsLength);
                    if (jsonResponseData.items[entropyForRecommendations]) {
                      var alternativePurchase = {
                        alternative: jsonResponseData.items[entropyForRecommendations].name,
                        category: "Entertainment",
                        amount: jsonResponseData.items[entropyForRecommendations].salePrice,
                        image: jsonResponseData.items[entropyForRecommendations].thumbnailImage
                      }

                      if (jsonData.alternativePurchases) {
                        jsonData.alternativePurchases.push(alternativePurchase);
                      } else {
                        jsonData.alternativePurchases = [alternativePurchase];
                      }
                    }
                  }
                saveData(jsonData);
                }
              }
            )
          }
        }
      }
    );


  });
};

function saveData(data) {
  var transaction = new Transactions(data);

  transaction.save(
    function (err, transactionSaved, numAffected) {
      if (err) throw err;
      console.log("Alternative data applied for: " + data.transaction_row_id);
      console.log("Created " + data.alternativePurchases.length + " alternatives!");
    }
  );

}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}