const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const UserModel = require('../model/userModel');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Options (how to pull out and decrypt)
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer JWT_TOKEN
  secretOrKey: JWT_SECRET_KEY,
};

// Strategy
passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);

      // User not found
      if (!user) {
        return done(new Error('User not found'));
      }

      // Token not found
      if (!user.token) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }),
);

/**
 * - done (callback - первым парам. принимает ошибку)
 * - payload (токен после расшифровки в options)
 */
