const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const helmet = require('helmet');
// const limiter = require('./helpers/limiter'); // *
const { HttpCode } = require('./helpers/constants');
const userRouter = require('./routes/api/users');
const projectRouter = require('./routes/api/projects');
const {
  uploadConfig: { AVATARS_OF_USERS, IMAGES_FOR_PROJECTS },
} = require('./config/configApp.json');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet()); // Protection against hacking (hides headers)
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS))); // раздача статики
app.use(express.static(path.join(__dirname, IMAGES_FOR_PROJECTS))); // раздача статики
// app.use(limiter); // Protection against DDOS *
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 15000 }));
app.use(boolParser()); // converts query-string to boolean

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);

// If right url is not found
app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
});

// Приходит из Function Validation
app.use((err, req, res, next) => {
  const code = err.status || HttpCode.NOT_FOUND;
  const status = err.status ? 'error' : 'fail';
  res.status(code).json({ status, code, message: err.message });
});

module.exports = app;

/**
 * - app.use(express.json()) - подключает обработку json
 * - formatsLogger - выбирает режим работы логгера
 * - В app обрабатываются ошибки 404 и 500
 * - status: 'fail' (не контролируеммая ошибка)
 * - status: 'error' (контролируеммая ошибка)
 *
 * RateLimit (защита от DDOS)
 * - api кешируется в памяти
 * - при рестарте сервера все оновляется (обнуляется)
 *
 * limit: 15000 in JSON:
 * app.use(express.json({ limit: 15000 })) - ограничение json в kb
 *
 * express.static - все что попадает в папку avatars становится статикой
 */
