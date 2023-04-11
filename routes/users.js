const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  setUserInfo,
  setAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
usersRouter.get('/', getUsers);
// возвращает пользователя по _id
usersRouter.post('/:usersId', getUser);
// создаёт пользователя
usersRouter.post('/', createUser);
// обновляет профиль
usersRouter.patch('/me', setUserInfo);
// обновляет аватар
usersRouter.patch('/me/avatar', setAvatar);

module.exports = usersRouter;
