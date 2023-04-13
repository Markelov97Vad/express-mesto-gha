const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const { PORT, DATABASE_URL } = require('./utils/config');

const app = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64353ad1adf0d5240cb67f8b',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
