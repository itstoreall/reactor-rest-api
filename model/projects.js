const db = require('./db');
const { ObjectId } = require('mongodb');

// Middleware to get collection
const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);

  return collection;
};

// Get all
const getAll = async () => {
  const collection = await getCollection(db, 'projects');
  const results = collection.find({}).toArray();

  return results;
};

// Get by ID
const getById = async id => {
  const collection = await getCollection(db, 'projects');
  const [result] = await collection.find({ _id: new ObjectId(id) }).toArray();

  // Creation time
  console.log('Creation time:', result._id.getTimestamp());

  return result;
};

// Create
const create = async body => {
  const collection = await getCollection(db, 'projects');
  const record = {
    ...body,
    ...(body.source
      ? {}
      : { source: `https://github.com/itstoreall/${body.name}` }),
  };

  const {
    ops: [result],
  } = await collection.insertOne(record);

  return result;
};

// Remove
const remove = async id => {
  const collection = await getCollection(db, 'projects');
  const { value: result } = await collection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  return result;
};

// Update
const update = async (id, body) => {
  const collection = await getCollection(db, 'projects');
  const { value: result } = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    { $set: body },
    { returnOriginal: false },
  );

  return result;
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
 * - collection.find({}).toArray() (достаем всё из коллекции и приобр. в массив)
 * find всегда возвращает 'курсор', его нужно приобр. в массив
 * - $set (модификатор - указывает, что именно нужно заменить)
 * - returnOriginal: false (возвращать новые данные (по умолчанию возвр. предидущие))
 */
