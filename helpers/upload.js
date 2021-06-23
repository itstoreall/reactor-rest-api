const multer = require('multer');
const {
  uploadConfig: { UPLOAD_DIR },
} = require('../config/configApp.json');

require('dotenv').config();

// Creates Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  }, // Folder--> temp

  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  }, // Example: 1624460702781-default_avatar-256.png
});

// File checking (pattern (the func which creates objects, and hides realisation))
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000 }, // Размер в байтах (100кб)

  // File filter
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
      cb(null, false); // Reject
      return;
    }
    cb(null, true); // Accept
  },
});

module.exports = upload;

/**
 * Multer (Middleware)
 *
 * - multer.diskStorage({}) (подготавливает хранилище)
 * - destination (функция которая определяет где будет храниться локально img)
 * - filename (определяет имя файла)
 *
 * - file (API - информация о файле)
 * - mimetype (Какой тип файла пришел)
 * - fileFilter (должен вызывать cb с булевым значением или ошибкой)
 */
