const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  setUserInfo,
  setAvatar,
  getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
usersRouter.get('/', getUsers);
// свозвращает информацию о текущем пользователе
// usersRouter.post('/', createUser);
usersRouter.get('/me', getCurrentUser);
// возвращает пользователя по _id
usersRouter.get('/:userId', getUserById);
// обновляет профиль
usersRouter.patch('/me', setUserInfo);
// обновляет аватар
usersRouter.patch('/me/avatar', setAvatar);

module.exports = usersRouter;
