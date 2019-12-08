const AWS = require('aws-sdk');

const client = new AWS.DynamoDB.DocumentClient(
  process.env.IS_OFFLINE
    ? { endpoint: 'http://localhost:8000', region: 'localhost' }
    : {},
);

module.exports = client;
