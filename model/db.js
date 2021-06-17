const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./model/projects.json');
const db = low(adapter);

db.defaults({ projects: [] }).write();

module.exports = db;

/**
 * Database
 * - adapter (паттерн проектирования, адаптирует json данные под базу данных)
 * - db.defaults (пока json файла нету, создаем по умолчанию)
 */
