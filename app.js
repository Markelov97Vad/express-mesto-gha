const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const bodyParser = require('body-parser');

// id: 64353ad1adf0d5240cb67f8b

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64353ad1adf0d5240cb67f8b',
  };
  // console.log(req.user);
  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});

// module.exports.createCard2 = ((req, res) => {
//   console.log(req.user._id);
// });
