const nanoid = require('nanoid');

const db = require('./db');

const STATUS = { DONE: 'done', IN_PROGRESS: 'in-progress', TODO: 'todo' };

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

    db.put({ Item: todo, TableName: process.env.TODOS_TABLE }, error => {
      if (error) {
        reject('Unable to create TODO');
      }

      resolve(todo.id);
    });
  });

module.exports = { create, STATUS };
