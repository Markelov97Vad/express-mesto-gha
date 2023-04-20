const Card = require('../models/card');
const ValidationIdError = require('../utils/ValidationIdError');
const {
  OK_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/codeStatus');

// запрос всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

// отправка данных о новой карточке
const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.body);
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// запрос на удаление карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return Promise.reject(new ValidationIdError('Invalid id'));
      } return res.status(OK_CODE).send({ message: `Карточка с id: ${cardId} была удалена` });
    })
    .catch((err) => {
      if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: `Указан некорректный id: ${cardId}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// запрос на добавление пользователя в объект likes выбранной карточки
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий id: ${cardId} карточки.` });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// запрос на удаление пользователя из объекта likes выбранной карточки
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для снятии лайка' });
      } else if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий id: ${cardId} карточки.` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
