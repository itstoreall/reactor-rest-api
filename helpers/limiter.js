const rateLimit = require('express-rate-limit');

const { HttpCode } = require('./constants');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (min * sec * milдisec)
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(HttpCode.BAD_REQUEST).json({
      status: 'errer',
      code: HttpCode.BAD_REQUEST,
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = limiter;

/**
 * rateLimit (Protection from DDOS)
 *
 * - to run limiter put it inside the router or to app, between helmet and logger:
 * --> router.get('/filter', guard, limiter, ctrl.getFiltered);
 * or
 * app.use(helmet());
 * --> app.use(limiter); <--
 * app.use(logger(formatsLogger));
 */
