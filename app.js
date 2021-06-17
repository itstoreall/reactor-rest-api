const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const projectsRouter = require('./routes/api/projects');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', code: 404, message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ status: 'fail', code: 500, message: err.message });
});

module.exports = app;

/**
 * - app.use(express.json()) - подключает обработку json
 * - formatsLogger - выбирает режим работы логгера
 * - В app обрабатываются ошибки 404 и 500
 * - status: 'fail' (не контролируеммая ошибка)
 * - status: 'error' (контролируеммая ошибка)
 */
