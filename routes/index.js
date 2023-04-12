const router = require('express').Router();
const { NOT_FOUND_CODE } = require('../utils/codeStatus');
const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

module.exports = router;
