const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const router = require('./routes');
const { PORT } = require('./utils/config');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHendler } = require('./middlewares/errorHendler');
const { loginValidation, registrationValidation } = require('./middlewares/validation');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// регистрация и аутентификация
app.post('/signup', registrationValidation, createUser);
app.post('/signin', loginValidation, login);
// авторизация
app.use(auth);
// роуты требующие авторизацию
app.use(router);

app.use(errors());
// централизированная обработка ошибок
app.use(errorHendler);

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
