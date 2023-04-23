const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes');
const { PORT } = require('./utils/config');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHendler } = require('./middlewares/errorHendler');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64353ad1adf0d5240cb67f8b',
//   };
//   next();
// });
// регистрация и аутентификация
app.post('/signup', createUser);
app.post('/signin', login);
// авторизация
app.use(auth);
// роуты требующие авторизацию
app.use(router);

// централизированная обработка ошибок
app.use(errorHendler);

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
