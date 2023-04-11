const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
  // res.send('<h1>Hello, world!</h1>');
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Ошибка в поиске пользователя' }));
};

const createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Ошибка в создании пользователя' }));
};

const setUserInfo = (req, res) => {
  const { _id } = req.user;
  // console.log(_id);
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Данные не прошли валидацию' }));
};

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
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Данные не прошли валидацию' }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  setUserInfo,
  setAvatar,
};
