const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

//  возвращает все карточки
cardsRouter.get('/', getCards);
// создает карточку
cardsRouter.post('/', createCard);
// удаляет карточку
cardsRouter.delete('/:cardId', deleteCard);
// поставить лайк карточке
cardsRouter.put('/:cardId/likes', likeCard);
// убрать лайк с карточки
cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
