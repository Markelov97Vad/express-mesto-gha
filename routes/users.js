const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  setUserInfo,
  setAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { getUserByIdValidation, setUserInfoValidation, setAvatarValidation } = require('../middlewares/validation');

// возвращает всех пользователей
usersRouter.get('/', getUsers);
// свозвращает информацию о текущем пользователе
// usersRouter.post('/', createUser);
usersRouter.get('/me', getCurrentUser);
// возвращает пользователя по _id
usersRouter.get('/:userId', getUserByIdValidation, getUserById);
// обновляет профиль
usersRouter.patch('/me', setUserInfoValidation, setUserInfo);
// обновляет аватар
usersRouter.patch('/me/avatar', setAvatarValidation, setAvatar);

module.exports = usersRouter;
