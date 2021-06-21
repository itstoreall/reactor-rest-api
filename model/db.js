const mongoose = require('mongoose');
require('dotenv').config();
const uriDb = process.env.URI_DB;

// Connect
const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

// Connection event
mongoose.connection.on('connected', () => {
  console.log('Mongoose is Connected');
});

// Error event during connection
mongoose.connection.on('error', err => {
  console.log(`Error connecting the Mongoose: ${err.message}`);
});

// Disconnect event
mongoose.connection.on('disconnected', () => {
  console.log(' --> Mongoose is Disconnected!');
});

// Connection closure handler (Ctrl + C)
process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('The connection is successfully closed.');
    process.exit();
  });
});

module.exports = db;

/**
 * Database
 * - poolSize (кол-во запросов к базе за 1 сек)
 * - process.on('SIGINT') ((закрытие) - обработка команды прирывания Ctrl + C)
 * - useCreateIndex (для ускоренного поиска для полей по которым часто идет поиск)
 */
