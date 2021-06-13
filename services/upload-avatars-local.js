const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const createFolderIsNotExist = require("../helpers/create-dir");

class Upload {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathFile);
  }

  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }

  async saveAvatarToStatic({ idUser, pathFile, name, oldFile }) {
    console.log(
      "req.file.path",
      pathFile,
      "req.file.filename",
      name,
      "req.user.avatarURL",
      oldFile
    );
    await this.transformAvatar(pathFile);
    const folderUserAvatar = path.join(this.AVATARS_OF_USERS, "avatars");
    await createFolderIsNotExist(folderUserAvatar);
    await fs.rename(pathFile, path.join(folderUserAvatar, name));

    await this.deleteOldAvatar(
      path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile)
    );
    const avatarUrl = path.normalize(path.join("avatars", name));
    return avatarUrl;
  }
}

module.exports = Upload;