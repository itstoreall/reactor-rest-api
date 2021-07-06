const app = require('../app');
const db = require('../model/db');
const createFolderIsNotExist = require('../helpers/create-dir');
const {
  uploadConfig: { UPLOAD_DIR, AVATARS_OF_USERS, IMAGES_FOR_PROJECTS },
} = require('../config/configApp.json');

require('dotenv').config();

const PORT = process.env.PORT || 5288;

// Creates folder if it doesn't exist
db.then(() => {
  app.listen(PORT, async () => {
    createFolderIsNotExist(UPLOAD_DIR); // temp
    createFolderIsNotExist(AVATARS_OF_USERS); // public/avatars
    createFolderIsNotExist(IMAGES_FOR_PROJECTS); // public/images

    console.log(`Server is running. Port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server is not running! Error: ${err.message}`);
  process.exit(1);
});

/**
 * db - promise
 */
