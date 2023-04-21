const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationIdError = require('../utils/ValidationIdError');
const {
  OK_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/codeStatus');

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentails(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};

// запрос всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

// запрос пользователя по ID
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: `Передан некорретный Id: ${userId} карточки.` });
      } else if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь по указанному Id: ${userId} не найден.` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      res.status(404).send({ message: err.message });
    });
};

// отправка данных о новом пользователе
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  // Хеширование пароля
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(OK_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// обновление данных пользователя
const setUserInfo = (req, res) => {
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
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь с указанным id: ${_id} не найден.` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// обновление аватара пользователя
const setAvatar = (req, res) => {
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
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь с указанным id: ${_id} не найден.` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
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
