const Card = require('../models/card');
// const createCard2 = require('../app');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // console.log(req.body);
  const owner = req.user._id;
  console.log(`получил айди ${owner}`);
  console.log({ name, link, owner });

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибка в создании карточки' }));
};

const deleteCard = (req, res) => {
  console.log(req.params);
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при удалении' }));
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при добавлении лайка' }));
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  )
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при добавлении лайка' }));
};
// console.log(createCard2);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
