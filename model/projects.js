const db = require('./db');
const { v4: uuid } = require('uuid');

// Get all
const getAll = async () => {
  return db.get('projects').value();
};

// Get by ID
const getById = async id => {
  return db.get('projects').find({ id }).value();
};

// Remove
const remove = async id => {
  const [record] = db.remove('projects').find({ id }).write();

  return record;
};

// Create
const create = async body => {
  const id = uuid();

  const record = {
    id,
    ...body,
    ...(body.source
      ? {}
      : { source: `https://github.com/itstoreall/${body.name}` }),
  };

  db.get('prejects').push(record).write();

  return record;
};

// Update
const update = async (id, body) => {
  const record = db.get('projects').find({ id }).assign(body).value();
  db.write();

  return record.id ? record : null;
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
};

/**
 * Сущность проекта
 */
