const fs = require('fs/promises');
// const path = require('path');

class UploadAvatarCloud {
  constructor(uploadCloud) {
    this.uploadCloud = uploadCloud;
  }

  // Save Avatar to Cloud
  async saveAvatarToCloud(pathFile, userIdImg) {
    console.log(userIdImg);
    const { public_id: publicId, secure_url: secureURL } =
      await this.uploadCloud(pathFile, {
        public_id: userIdImg?.replace('Reactor/Avatar/', ''),
        folder: 'Reactor/Avatar',
        transformation: { width: 250, crop: 'pad' },
      });
    await this.deleteTemporaryFile(pathFile);
    return { userIdImg: publicId, avatarURL: secureURL };
  }

  async deleteTemporaryFile(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = UploadAvatarCloud;

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
