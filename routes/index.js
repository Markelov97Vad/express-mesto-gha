const router = require('express').Router();

const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const { registrationValidation, loginValidation } = require('../middlewares/validation');
const cardsRouter = require('./cards');
const usersRouter = require('./users');

// регистрация и аутентификация
router.post('/signup', registrationValidation, createUser);
router.post('/signin', loginValidation, login);

// авторизация
router.use(auth);

// роуты требующие авторизацию
router.use('/users', usersRouter);
// router.use('/users', auth, usersRouter);
router.use('/cards', cardsRouter);
// router.use('/cards', auth, cardsRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса'));
});

module.exports = router;
