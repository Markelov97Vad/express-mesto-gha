// const card = require('../models/card');
const Card = require('../models/card');
const ValidationIdError = require('../utils/ValidationIdError');
const {
  OK_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/codeStatus');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch((err) => res.status(SERVER_ERROR_CODE).send(err));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};
// 381 str
// "id": "643713381833c922d23d00e9"
// "owner": "6437132212ee46a2548a8abd"
// delete id card : "643713381833c922d23d00e9"
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return Promise.reject(new ValidationIdError('Invalid id'));
      }
      return res.starus(OK_CODE).send(deletedCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationIdError') {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        res.status(SERVER_ERROR_CODE).send(err);
      }
    });
};

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
        res.status(SERVER_ERROR_CODE).send(err);
        // res.send(err);
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
