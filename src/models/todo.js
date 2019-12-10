const nanoid = require('nanoid');

const db = require('../db');
const logger = require('../logger');

const TABLE_NAME = process.env.TODOS_TABLE;

const all = userId =>
  new Promise((resolve, reject) => {
    db.query(
      {
        ExpressionAttributeNames: { '#CreatedBy': 'createdBy' },
        ExpressionAttributeValues: { ':UserId': userId },
        IndexName: 'createdByIndex',
        KeyConditionExpression: '#CreatedBy = :UserId',
        TableName: TABLE_NAME,
      },
      (error, data) => {
        if (error) {
          logger.error(`[Todo#all]`, { error });

          reject(new Error('Unable to query TODOs'));
        }

        resolve(data.Items);
      },
    );
  });

const create = ({ createdBy, description, status, tag }) =>
  new Promise((resolve, reject) => {
    const createdAt = Date.now();
    const todo = {
      createdAt,
      createdBy,
      description,
      id: nanoid(),
      status,
      tag,
      updatedAt: createdAt,
    };

    db.put({ Item: todo, TableName: TABLE_NAME }, error => {
      if (error) {
        logger.error(`[Todo#create]`, { error });

        reject(new Error('Unable to create TODO'));
      }

      resolve(todo.id);
    });
  });

module.exports = { all, create };
