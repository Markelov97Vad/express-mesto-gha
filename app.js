const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');
const { PORT } = require('./utils/config');
const { errorHendler } = require('./middlewares/errorHendler');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
// обработка ошибок celebrate
app.use(errors());
// централизированная обработка ошибок
app.use(errorHendler);

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
