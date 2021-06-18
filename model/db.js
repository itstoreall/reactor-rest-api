const { MongoClient } = require('mongoDB');
require('dotenv').config();
const uriDb = process.env.URI_DB;

// Connect
const db = MongoClient.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5,
});

// Disconnect
process.on('SIGINT', async () => {
  const client = await db;
  client.close();
  console.log(' - MongoDB is Disconnected');
  process.exit();
});

module.exports = db;

/**
 * Database
 * - poolSize (кол-во запросов к базе за 1 сек)
 * - process.on('SIGINT') ((закрытие) - обработка команды прирывания Ctrl + C)
 */
