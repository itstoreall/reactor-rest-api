const multer = require('multer');

require('dotenv').config();
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

// File checking
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000 }, // Размер в байтах (100кб)
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
 * - destination (функция которая определяет где будет храниться локально img)
 * - filename (определяет имя файла)
 *
 * - file (API - информация о файле)
 * - mimetype (Какой тип файла пришел)
 * - fileFilter (должен вызывать cb с булевым значением или ошибкой)
 */
