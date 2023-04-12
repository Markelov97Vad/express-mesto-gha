const User = require('../models/user');
const ValidationIdError = require('../utils/ValidationIdError');
const {
  OK_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/codeStatus');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch((err) => res.status(SERVER_ERROR_CODE).send(err));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // return Promise.reject(new ValidationIdError('Invalid id'));
        throw new ValidationIdError('Invalid id');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: `Передан некорретный Id: ${userId} карточки.` });
      } else if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь по указанному Id: ${userId} не найден.` });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
        // res.send(err);
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(OK_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};

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
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};

const setAvatar = (req, res) => {
  const _id = '64353ad1adf0d5240cb67f8a';
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
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  setUserInfo,
  setAvatar,
};
