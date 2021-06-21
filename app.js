const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const { HttpCode } = require('./helpers/constants');
const userRouter = require('./routes/api/users');
const projectRouter = require('./routes/api/projects');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
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
 */
