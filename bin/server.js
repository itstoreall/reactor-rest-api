const app = require('../app');
const db = require('../model/db');
const createFolderIsNotExist = require('../helpers/create-dir');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    createFolderIsNotExist(UPLOAD_DIR);
    createFolderIsNotExist(AVATARS_OF_USERS);

    console.log(`Server is running. Port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server is not running! Error: ${err.message}`);
  process.exit(1);
});

/**
 * db - promise
 */
