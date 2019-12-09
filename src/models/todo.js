const nanoid = require('nanoid');

const db = require('../db');

const TABLE_NAME = process.env.TODOS_TABLE;

const all = userId =>
  new Promise((resolve, reject) => {
    db.query(
      {
        ExpressionAttributeValues: { ':createdBy': userId },
        IndexName: 'createdByIndex',
        KeyConditionExpression: 'createdBy = :createdBy',
        TableName: TABLE_NAME,
      },
      (error, data) => {
        if (error) {
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
        reject(new Error('Unable to create TODO'));
      }

      resolve(todo.id);
    });
  });

module.exports = { all, create };
