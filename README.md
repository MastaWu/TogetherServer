# TogetherServer

## Requirements
* Make sure you have mongoDb installed and available at port 27017 (default port)

## Run it
1. npm install
2. node server
3. (Alternative) process=true node server
4. **Endpoint:** http://localhost:8080/api/transactions/getAllTransactions

**NOTE:** You have the option to process the transaction data, or prevent the processing. Processing is turned off by default. It's recommended to process once to populate data in the mongodb.
