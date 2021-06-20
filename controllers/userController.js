const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserModel = require('../model/userModel');
const { HttpCode } = require('../helpers/constants');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
    const { id, name, email, gender } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id,
        name,
        email,
        gender,
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
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });

    // Writes the token into the database
    await UserModel.updateToken(user.id, token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  //
};

module.exports = {
  register,
  login,
  logout,
};

/**
 * Controller
 * - payload (полезная нагрузка - в него можно ложить все что угодно)
 * - expiresIn (token lifetime: 1m - 1 minute, 1d - 1 day, 1w - 1 week, 1h - 1 hour)
 */
