const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const { PORT } = require('./utils/config');
const { errorHendler } = require('./middlewares/errorHendler');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// логер запросов
app.use(requestLogger);
// все роуты
app.use(router);
// логгер ошибок
app.use(errorLogger);
// обработка ошибок celebrate
app.use(errors());
// централизированная обработка ошибок
app.use(errorHendler);
/* eslint-disable no-alert, no-console */
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт ${PORT}`);
});
/* eslint-enable no-alert, no-console */
