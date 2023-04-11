const Card = require('../models/card');
// const createCard2 = require('../app');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.body);
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

// console.log(createCard2);

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
