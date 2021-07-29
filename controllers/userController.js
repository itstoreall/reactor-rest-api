const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
require('dotenv').config();
const UserModel = require('../model/userModel');
const { HttpCode } = require('../helpers/constants');
// const UploadAvatar = require('../services/uploadAvatarLocal'); // for Local *
const UploadAvatar = require('../services/uploadAvatarCloud');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// REGISTER
const register = async (req, res, next) => {
  try {
    const user = await UserModel.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Such email already exists',
      });
    }
    const newUser = await UserModel.create(req.body);
    const { id, name, email, gender, avatar } = newUser;

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id,
        name,
        email,
        gender,
        avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1w' });

    // Writes the token into the database
    await UserModel.updateToken(user.id, token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          id: user.id,
          gender: user.gender,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

// LOGOUT
const logout = async (req, res, next) => {
  await UserModel.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

// AVATARS (Cloud)
const cloudAvatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploadCloud = promisify(cloudinary.uploader.upload);
    const uploads = new UploadAvatar(uploadCloud);

    const { userIdImg, avatarURL } = await uploads.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg,
    );
    await UserModel.updateAvatarCloud(id, avatarURL, userIdImg);

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarURL },
    });
  } catch (err) {
    next(err);
  }
};

// GET Current user
const current = async (req, res, next) => {
  try {
    const { email, name, avatar } = await UserModel.findByToken(req.user.token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { email, name, avatar },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  cloudAvatars,
  current,
  // avatars,
};

/**
 * Controller
 * -
 * - payload (полезная нагрузка - в него можно ложить все что угодно)
 * - expiresIn (token lifetime: 1m - 1 minute, 1d - 1 day, 1w - 1 week, 1h - 1 hour)
 *
 * - В Logout обязательно возвращать пустой объект
 *
 * - util - специальный пакет ноды
 *
 * - cloudAvatars:
 * - uploads.saveAvatarToCloud( publicId) - два параметра: где лежит файл и publicId
 * назад получаем publicId и avatarUrl от нашего сервиса
 */

// =========== Upload Avatar Local ===========

// const {
//   uploadConfig: { AVATARS_OF_USERS },
// } = require('../config/configApp.json');

// AVATARS (Local)
// const avatars = async (req, res, next) => {
//   try {
//     const id = req.user.id;
//     const uploads = new UploadAvatar(AVATARS_OF_USERS);

//     // Save avatar to static (creates a personal folder)
//     const avatarUrl = await uploads.saveAvatarToStatic({
//       idUser: id,
//       pathFile: req.file.path,
//       fileName: req.file.filename,
//       oldFile: req.user.avatar,
//     });

//     await UserModel.updateAvatar(id, avatarUrl);

//     console.log('req.hostname-->', req.hostname); // localhost

//     return res.json({
//       status: 'success',
//       code: HttpCode.OK,
//       data: { avatarUrl },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Delete later --------v

// // LOGIN
// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await UserModel.findByEmail(email);
//     const isValidPassword = await user?.validPassword(password);

//     if (!user || !isValidPassword) {
//       return res.status(HttpCode.UNAUTHORIZED).json({
//         status: 'error',
//         code: HttpCode.UNAUTHORIZED,
//         message: 'Invalid credentials',
//       });
//     }

//     const payload = { id: user.id };
//     const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });

//     // Writes the token into the database
//     await UserModel.updateToken(user.id, token);

//     return res.status(HttpCode.OK).json({
//       status: 'success',
//       code: HttpCode.OK,
//       data: {
//         token,
//       },
//     });
//   } catch (e) {
//     next(e);
//   }
// };
