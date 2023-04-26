const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');

//  возвращает все карточки
cardsRouter.get('/', getCards);
// создает карточку
cardsRouter.post('/', createCardValidation, createCard);
// удаляет карточку
cardsRouter.delete('/:cardId', cardIdValidation, deleteCard);
// ставит лайк карточке
cardsRouter.put('/:cardId/likes', cardIdValidation, likeCard);
// убирает лайк с карточки
cardsRouter.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardsRouter;
