const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  OK_CODE,
} = require('../utils/codeStatus');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentails(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

// запрос всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch(next);
};

// запрос пользователя по ID
const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному Id: ${userId} не найден.`);
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Передан некорретный Id: ${userId} пользователя`));
      }
      return next(err);
    });
};
// запрос текущего пользователя
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch(next);
};

// отправка данных о новом пользователе
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((data) => {
      if (data) {
        throw new ConflictError(`При регистрации указан ${email}, который уже существует на сервере`);
      } // Хеширование пароля
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => res.status(OK_CODE).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// обновление данных пользователя
const setUserInfo = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным id: ${_id} не найден.`);
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

// обновление аватара пользователя
const setAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным id: ${_id} не найден.`);
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  setUserInfo,
  setAvatar,
};
