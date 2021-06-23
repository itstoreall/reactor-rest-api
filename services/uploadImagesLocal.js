class UploadImages {
  constructor(IMAGES_FOR_PROJECTS) {
    this.IMAGES_FOR_PROJECTS = IMAGES_FOR_PROJECTS;
  }

  async transformImage(pathFile) {}
  async saveImageToStatic() {}
  async deleteOldImage(pathFile) {}
}

module.exports = UploadImages;
