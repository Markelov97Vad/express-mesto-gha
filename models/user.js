const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(url) {
        const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
        return urlRegex.test(url);
      },
      message: 'Некорректный url',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        console.log('fff');
        return validator.isEmail(value);
      },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // хеш пароля пользователя не будет возвращаться из базы.
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentails = function (email, password) {
  return this.findOne({ email }).select('+password') // добавить хэш
    .then((user) => {
      if (!user) {
        console.log(user);
        throw new UnauthorizedError('Неправильные почта или пароль');
        // throw new Error('ffgfg');
        // return Promise.reject(new Error('Новая ошибка'));
      }
      // если нашли - сравниваем хеш
      console.log(user.password);
      console.log(password);
      console.log(bcrypt.compare(password, user.password));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          console.log('matched: ', matched);
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          console.log('User: ', user);
          // если все успешно возвращаем токен
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
