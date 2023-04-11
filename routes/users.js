const usersRouter = require('express').Router();
const { createUser, getUsers, getUser } = require('../controllers/users');

// возвращает всех пользователей
usersRouter.get('/', getUsers);

// возвращает пользователя по _id
usersRouter.post('/:usersId', getUser);

// создаёт пользователя
usersRouter.post('/', createUser);

module.exports = usersRouter;
