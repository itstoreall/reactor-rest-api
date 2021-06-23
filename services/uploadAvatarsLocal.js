class UploadAvatars {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {}
  async saveAvatarToStatic() {}
  async deleteOldAvatar(pathFile) {}
}

module.exports = UploadAvatars;
