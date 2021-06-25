const fs = require('fs/promises');
const path = require('path');
const createFolderIsNotExist = require('../helpers/create-dir');

class UploadImages {
  constructor(IMAGES_FOR_PROJECTS) {
    this.IMAGES_FOR_PROJECTS = IMAGES_FOR_PROJECTS;
  }

  // Save Image
  async saveImageToStatic({ idUser, pathFile, fileName }) {
    // Prepares a folder where will the files be stored
    const folderImage = path.join(this.IMAGES_FOR_PROJECTS, idUser); // folder where the file should be located

    // Creates a folder if it doesn't exist
    await createFolderIsNotExist(folderImage);

    // Transfers a file from temp to new the folder
    await fs.rename(pathFile, path.join(folderImage, fileName));

    // Deletes an old avatar if it already exist
    // const oldFile = `${idUser}/${fileName}`;

    // await this.deleteOldImage(
    //   path.join(process.cwd(), this.IMAGES_FOR_PROJECTS, oldFile),
    // );

    // Creates url where the file will stored
    const imageUrl = path.normalize(path.join(idUser, fileName));

    // console.log('oldFile-->', oldFile);
    console.log('imageUrl-->', imageUrl);

    return imageUrl;
  }

  // Delete old Avatar
  // async deleteOldImage(pathFile) {
  //   try {
  //     await fs.unlink(pathFile);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // }
}

module.exports = UploadImages;
