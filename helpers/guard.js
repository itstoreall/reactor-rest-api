const passport = require('passport');
require('../config/passport');
const { HttpCode } = require('./constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    // Перехват ошибки со строкой: Unauthorized
    let token = null;

    if (req.get('Authorization')) {
      token = req.get('Authorization').split(' ')[1];
    }
    if (!user || err || token !== user.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Access is denied',
      });
    }
    req.user = user; // сохраняем юзера чтобы не запрашивать повторно

    return next();
  })(req, res, next);
};

module.exports = guard;

/**
 * Guard - Authorized
 *
 *  - passport.authenticate() (Middleware)
 */
