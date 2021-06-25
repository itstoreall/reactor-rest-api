const fs = require('fs/promises');
const path = require('path');
const createFolderIsNotExist = require('../helpers/create-dir');
const Jimp = require('jimp');

class UploadAvatars {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  // Transform Avatar
  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile); // reads file
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(pathFile);
  }

  // Save Avatar
  async saveAvatarToStatic({ idUser, pathFile, fileName, oldFile }) {
    // Transforms the image
    await this.transformAvatar(pathFile);

    // Prepares a folder where will the files be stored
    const folderUserAvatar = path.join(this.AVATARS_OF_USERS, idUser); // folder where the file should be located

    // Creates a folder if it doesn't exist
    await createFolderIsNotExist(folderUserAvatar);

    // Transfers a file from temp to new the folder
    await fs.rename(pathFile, path.join(folderUserAvatar, fileName));

    // Deletes an old avatar if it already exist
    await this.deleteOldAvatar(
      path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile),
    );

    // Creates url where the file will stored
    const avatarUrl = path.normalize(path.join(idUser, fileName));

    return avatarUrl;
  }

  // Delete old Avatar
  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = UploadAvatars;

/**
 * UploadAvatars
 *
 * - Все ошибки которые возникают, перехватываются в контроллере и попадают в next
 *
 * - path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile):
 * process.cwd() - указывает где запускался скрипт от корня;
 * this.AVATARS_OF_USERS - от корня мы заходим в this.AVATARS_OF_USERS;
 * oldFile - уже будет лежать в папке (имя файла)
 * 
fs.unlink(<путь до интересующего файла>, function (err) {
  if (err) throw err;
  console.log("file deleted");
});

 * - transformAvatar:
 * .writeAsync(newPathFile) - можно изменить путь куда записывать - newPathFile
 */
