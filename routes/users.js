const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  setUserInfo,
  setAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
usersRouter.get('/', getUsers);
// возвращает пользователя по _id
usersRouter.get('/:userId', getUserById);
// создаёт пользователя
usersRouter.post('/', createUser);
// обновляет профиль
usersRouter.patch('/me', setUserInfo);
// обновляет аватар
usersRouter.patch('/me/avatar', setAvatar);

module.exports = usersRouter;
