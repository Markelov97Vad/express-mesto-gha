const Card = require('../models/card');
const ValidationIdError = require('../utils/ValidationIdError');
const {
  OK_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/codeStatus');
//!
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch((err) => res.status(SERVER_ERROR_CODE).send(err));
};
// !
const createCard = (req, res) => {
  const { name, link } = req.body;
  // console.log(req.body);
  const owner = req.user._id;
  console.log(`получил айди ${owner}`);
  console.log({ name, link, owner });

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};
// !
const deleteCard = (req, res) => {
  console.log(req.params);
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.starus(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params; // 64353ad1adf0d5240cb67f8b
  const { _id } = req.user; //       64353ad1adf0d5240cb67f8b
  // const _id = '64353ad1adf0d5240cb67f8a';
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => res.status(OK_CODE).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий id: ${cardId} карточки.` });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      res.starus(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий id: ${cardId} карточки.` });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
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
