const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const Card = require('../models/card');
// const ValidationIdError = require('../utils/ValidationIdError');

const {
  OK_CODE,
  // BAD_REQUEST_CODE,
  // NOT_FOUND_CODE,
  // SERVER_ERROR_CODE,
} = require('../utils/codeStatus');

// запрос всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch((next));
};

// отправка данных о новой карточке
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.body);
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

// запрос на удаление карточки
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id: ${cardId} не найдена.`);
      }
      if (card.owner.toString() !== _id) {
        console.log(card.owner.toString());
        console.log(_id);
        throw new ForbiddenError('попытка удалить чужую карточку');
      }
      Card.findByIdAndDelete(cardId)
        .then((deletedCard) => {
          console.log('deleteCard: ', deletedCard);
          return res.status(OK_CODE).send({ message: `Карточка с id: ${cardId} была удалена` });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Указан некорректный id: ${cardId}`));
      }
      return next(err);
    });
};

// запрос на добавление пользователя в объект likes выбранной карточки
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий id: ${cardId} карточки.`);
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

// запрос на удаление пользователя из объекта likes выбранной карточки
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий id: ${cardId} карточки.`);
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
